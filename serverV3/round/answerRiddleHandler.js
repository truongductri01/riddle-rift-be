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
    eventNames.on.answerRiddle,
    async ({ teamId, answer }, gameId = "game1") => {
      try {
        // TODO: make sure no answer will be processed when game stage is no longer riddle

        console.log("received answer from >>>", teamId, answer);

        let game = await getGame(gameId);
        const { currentRound, teams } = game;
        let updatedCurrentRound = { ...currentRound };

        if (!updatedCurrentRound.answeredTeams.includes(teamId)) {
          updatedCurrentRound = {
            ...updatedCurrentRound,
            answeredTeams: [...updatedCurrentRound.answeredTeams, teamId],
            teamAnswers: {
              ...updatedCurrentRound.teamAnswers,
              [teamId]: answer,
            },
          };

          let expectedAnswer = updatedCurrentRound.riddle.answer.correctAnswer;
          if (
            `${expectedAnswer}` === `${answer}` &&
            !updatedCurrentRound.hasWinner
          ) {
            console.log("You have answered correctly");

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

            io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, gameId);
          }

          await storeGameRequest({
            ...game,
            currentRound: updatedCurrentRound,
          });
        }

        if (
          updatedCurrentRound.answeredTeams.length ===
            Object.keys(teams).length &&
          !updatedCurrentRound.hasWinner
        ) {
          console.log("No one answered correctly, move on");
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

        io.to(socket.id).emit(eventNames.emit.gameStatusChange, gameId);
      } catch (e) {
        errorHandler(io, socket, "answer-riddle-error", `${e}`);
      }
    }
  );
};
