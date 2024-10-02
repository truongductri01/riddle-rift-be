const { Server, Socket } = require("socket.io");
const eventNames = require("../eventNames");
const { getGame, storeGameRequest } = require("../../api/gameApis");
const roundStages = require("../helpers/roundStages");
const errorHandler = require("../errorHandler");
const { handleActionBeforeResult } = require("./winnerAttackHandlerHelper");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket) => {
  socket.on(eventNames.on.winnerAttack, async (teamId, gameId = "game1") => {
    try {
      // the id of the team to be attacked

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
      await handleActionBeforeResult(io, socket, gameId);
    } catch (e) {
      errorHandler(io, socket, "winner-attack-error", `${e}`);
    }
  });
};
