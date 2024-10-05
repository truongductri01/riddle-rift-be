const { Server, Socket } = require("socket.io");
const eventNames = require("../eventNames");
const { getGame, storeGameRequest } = require("../../api/gameApis");
const roundStages = require("../helpers/roundStages");
const errorHandler = require("../errorHandler");
const EventEmitter = require("events");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 * @param {EventEmitter} eventEmitter
 */
module.exports = (io, socket, eventEmitter) => {
  socket.on(eventNames.on.winnerAttack, async (teamId, gameId = "game1") => {
    try {
      // the id of the team to be attacked
      console.log("trying to attack");

      let game = await getGame(gameId);
      const { currentRound } = game;
      let updatedGame = { ...game };
      let updatedCurrentRound = {
        ...currentRound,
        attackedTeamId: teamId,
        stage: roundStages.CALCULATE_RESULT,
      };

      updatedGame = { ...updatedGame, currentRound: updatedCurrentRound };
      await storeGameRequest(updatedGame);
      io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

      // TODO: process the result before sending
      eventEmitter.emit(eventNames.internal.calculateResult, gameId);
    } catch (e) {
      console.log("failed to attack");
      errorHandler(io, socket, "winner-attack-error", `${e}`);
    }
  });
};
