const { Server, Socket } = require("socket.io");
const eventNames = require("../eventNames");
const { getGame, storeGameRequest } = require("../../api/gameApis");
const roundStages = require("../helpers/roundStages");
const { generateMathEquationRiddle } = require("../helpers/riddles");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket) => {
  socket.on(
    eventNames.on.selectCardsForRound,
    async ({ teamId, selectedCards }, gameId = "game1") => {
      let game = await getGame(gameId);
      const { currentRound, config, cards } = game;
      let updatedCurrentRound = { ...currentRound };
      let updatedCards = { ...cards };

      console.log("received teamId, cards >>>", teamId, selectedCards);

      // mark the cards as being used for the current round
      // remove those cards from team cards
      let teamCards = updatedCards.teamCardInfo[teamId];
      let newActiveCards = [];
      let cardsToBeUsed = [];
      teamCards.activeCards.forEach((card) => {
        if (selectedCards.includes(card.id)) {
          cardsToBeUsed.push(card);
        } else {
          newActiveCards.push(card);
        }
      });
      updatedCards = {
        ...updatedCards,
        teamCardInfo: {
          ...updatedCards.teamCardInfo,
          [teamId]: {
            activeCards: newActiveCards,
            usedCards: [...teamCards.usedCards, ...cardsToBeUsed],
          },
        },
      };
      updatedCurrentRound = {
        ...updatedCurrentRound,
        cardsToUsed: {
          ...updatedCurrentRound.cardsToUsed,
          [teamId]: cardsToBeUsed,
        },
      };

      // set ready for the riddle
      if (!updatedCurrentRound.readyTeams.includes(teamId)) {
        updatedCurrentRound = {
          ...updatedCurrentRound,
          stage: roundStages.READY_FOR_RIDDLE,
          readyTeams: [...updatedCurrentRound.readyTeams, teamId],
        };
      }

      await storeGameRequest({
        ...game,
        currentRound: updatedCurrentRound,
        cards: updatedCards,
      });
      io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

      // when all team are ready
      if (updatedCurrentRound.readyTeams.length === config.teams.length) {
        console.log("ready for Riddle");
        // generate riddle
        let riddle = generateMathEquationRiddle();
        console.log("riddle >>>", riddle);

        // change to riddle stage, and clean up the ready teams
        updatedCurrentRound = {
          ...updatedCurrentRound,
          stage: roundStages.RIDDLE,
          readyTeams: [],
          riddle,
          answeredTeams: [],
          riddleSessionStarttime: Date.now(),
        };

        await storeGameRequest({
          ...game,
          currentRound: updatedCurrentRound,
          cards: updatedCards,
        });

        await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for 30 seconds

        io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

        // let the riddle happens only within 30 seconds, how?
        await new Promise((resolve) =>
          setTimeout(resolve, updatedCurrentRound.riddleSessionLength * 1000)
        ); // wait for 30 seconds

        let currentRoundIndex = updatedCurrentRound.index;
        // TODO: stop if there is a new round

        // after 30 seconds, get games again, if the game is still in riddle stage, ends it and move to the next one?
        game = await getGame(gameId);
        let { currentRound } = game;
        updatedCurrentRound = { ...currentRound };
        if (updatedCurrentRound.index === currentRoundIndex) {
          console.log("calculating the result");
          if (updatedCurrentRound.stage === roundStages.RIDDLE) {
            updatedCurrentRound = {
              ...updatedCurrentRound,
              stage: roundStages.WINNER_DECISION,
            };
          }
          await storeGameRequest({
            ...game,
            currentRound: updatedCurrentRound,
          });
          io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

          if (
            !updatedCurrentRound.hasWinner &&
            updatedCurrentRound.stage !== roundStages.RIDDLE
          ) {
            updatedCurrentRound = {
              ...updatedCurrentRound,
              stage: roundStages.RESULT,
            };
            await storeGameRequest({
              ...game,
              currentRound: updatedCurrentRound,
            });
            io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);
          } else {
            console.log("has winner >>>", updatedCurrentRound?.hasWinner);
            console.log("stage >>>", updatedCurrentRound?.stage);
          }
        }
      }
    }
  );
};
