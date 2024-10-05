const { Socket, Server } = require("socket.io");
const { getGame, storeGameRequest } = require("../api/gameApis");
const errorHandler = require("./errorHandler");
const eventNames = require("./eventNames");

/**
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket) => {
  socket.on(
    eventNames.on.playerJoinRequest,
    async (playerName, gameId = "game1") => {
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

        // assign the name to the player id
        players[playerId] = {
          ...players[playerId],
          name: playerName,
          id: playerId,
        };
        await storeGameRequest({ ...game, players });

        // return the payload
        socket.emit(eventNames.emit.playerJoinResponse, {
          isSuccess: true,
          playerName,
        });
      } catch (e) {
        errorHandler(io, socket, "player-join-error", `${e}`);
      }
    }
  );
};
