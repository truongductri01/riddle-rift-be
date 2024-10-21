const { Server, Socket } = require("socket.io");
const EventEmitter = require("events");
const errorHandler = require("./errorHandler");
const eventNames = require("./eventNames");
const { getGame, storeGameRequest } = require("../api/gameApis");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 * @param {EventEmitter} eventEmitter
 */
module.exports = (io, socket, eventEmitter) => {
  socket.on(eventNames.on.joinAsAdmin, async (gameId = "game1") => {
    console.log("join as admin >>>", gameId);
    try {
      let game = await getGame(gameId);
      const { socketToPlayers, players, teams } = game;
      let playerId = socketToPlayers[socket.id];

      if (!playerId) {
        errorHandler(
          io,
          socket,
          "no_player",
          "No player associated with this socket id"
        );
        return;
      }

      // assign team id to the player info
      players[playerId] = { ...players[playerId], isAdmin: true };

      await storeGameRequest({ ...game, players, teams });
      socket.emit(eventNames.emit.joinAsAdminResponse);

      // broadcast to all in the room about joining
      socket.join(`${game.id}`);
      io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);
    } catch (e) {
      errorHandler(io, socket, "team-select-handler-error", `${e}`);
    }
  });
};
