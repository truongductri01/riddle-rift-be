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
  socket.on(
    eventNames.on.adminActionOnRiddle,
    async ({ teamId, hasWinner }, gameId = "game1") => {
      try {
        // TODO: make sure no answer will be processed when game stage is no longer riddle
        console.log(
          "received admin signal with hasWinner",
          hasWinner,
          " and winner teamId:",
          teamId
        );

        let game = await getGame(gameId);
        const { currentRound } = game;
        let updatedCurrentRound = { ...currentRound };

        if (hasWinner) {
          updatedCurrentRound = {
            ...updatedCurrentRound,
            hasWinner: true,
            winnerTeamId: teamId,
            stage: roundStages.WINNER_DECISION,
          };

          await storeGameRequest({
            ...game,
            currentRound: updatedCurrentRound,
          });
        } else {
          updatedCurrentRound = {
            ...updatedCurrentRound,
            hasWinner: false,
            winnerTeamId: "",
            stage: roundStages.WINNER_DECISION,
          };
          await storeGameRequest({
            ...game,
            currentRound: updatedCurrentRound,
          });

          eventEmitter.emit(eventNames.internal.calculateResult, gameId);
        }

        io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, gameId);
      } catch (e) {
        console.log("Error with admin action on riddle", e);
        errorHandler(io, socket, "answer-riddle-error", `${e}`);
      }
    }
  );
};
