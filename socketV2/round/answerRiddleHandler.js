const { Server, Socket } = require("socket.io");
const eventNames = require("../eventNames");
const { getGame, storeGameRequest } = require("../../api/gameApis");
const roundStages = require("../helpers/roundStages");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket) => {
  socket.on(
    eventNames.on.answerRiddle,
    async ({ teamId, answer }, gameId = "game1") => {
      // TODO: make sure no answer will be processed when game stage is no longer riddle

      console.log("received answer from >>>", teamId, answer);

      let game = await getGame(gameId);
      const { currentRound, teams } = game;

      if (!currentRound.answeredTeams.includes(teamId)) {
        let updatedCurrentRound = {
          ...currentRound,
          answeredTeams: [...currentRound.answeredTeams, teamId],
        };

        let expectedAnswer = currentRound.riddle.answer;
        if (expectedAnswer === answer && !updatedCurrentRound.hasWinner) {
          console.log("You have answered correctly");

          updatedCurrentRound = {
            ...updatedCurrentRound,
            hasWinner: true,
            winnerTeamId: teamId,
            stage: roundStages.WINNER_DECISION,
          };
        }

        await storeGameRequest({ ...game, currentRound: updatedCurrentRound });
      } else if (
        currentRound.answeredTeams.length === Object.keys(teams).length
      ) {
        updatedCurrentRound = {
          ...updatedCurrentRound,
          hasWinner: false,
          winnerTeamId: teamId,
          stage: roundStages.WINNER_DECISION,
        };
        await storeGameRequest({ ...game, currentRound: updatedCurrentRound });
      }

      io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, gameId);
    }
  );
};
