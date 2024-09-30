const { Server, Socket } = require("socket.io");
const eventNames = require("../eventNames");
const { getGame, storeGameRequest } = require("../../api/gameApis");
const roundStages = require("../helpers/roundStages");
const { generateMathEquationRiddle } = require("../helpers/riddles");
const cardGenerateFactory = require("../actionHandler/cardGenerateFactory");
const errorHandler = require("../errorHandler");
const { handleActionBeforeResult } = require("./winnerAttackHandlerHelper");
/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket) => {
  socket.on(
    eventNames.on.selectCardsForRound,
    async ({ teamId, selectedCards }, gameId = "game1") => {
      try {
        await handleCardsSelect(gameId, teamId, selectedCards);
        await handleAllTeamsReadyAndStartRound(gameId);
      } catch (e) {
        errorHandler(io, socket, "select-cards-error", `${e}`);
      }
    }
  );

  const handleCardsSelect = async (gameId, teamId, selectedCards) => {
    let game = await getGame(gameId);
    const { currentRound, cards } = game;
    let updatedCurrentRound = { ...currentRound };
    let updatedCards = { ...cards };

    // mark the cards as being used for the current round
    // remove those cards from team cards
    let teamCards = updatedCards.teamCardInfo[teamId];
    let newActiveCards = [];
    let cardsToBeUsed = [];
    teamCards.activeCards.forEach((card) => {
      let selectedCard = selectedCards.find((c) => c.id === card.id);
      if (selectedCard) {
        cardsToBeUsed.push(
          cardGenerateFactory(
            selectedCard.type,
            teamId,
            selectedCard.id,
            selectedCard.targets
          ).getCardDetails()
        );
      } else {
        newActiveCards.push(
          cardGenerateFactory(card.type, teamId, card.id, []).getCardDetails()
        );
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
  };

  const handleAllTeamsReadyAndStartRound = async (gameId) => {
    let game = await getGame(gameId);
    const { currentRound, config } = game;
    let updatedCurrentRound = { ...currentRound };

    // when all team are ready
    if (updatedCurrentRound.readyTeams.length === config.teams.length) {
      // generate riddle
      let riddle = generateMathEquationRiddle();
      console.log("riddle >>>", riddle);

      // change to riddle stage, and clean up the ready teams
      await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for 3 seconds

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
      });

      io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

      // let the riddle happens only within 30 seconds, how?
      await new Promise((resolve) =>
        setTimeout(resolve, updatedCurrentRound.riddleSessionLength * 1000)
      ); // wait for 30 seconds

      let currentRoundIndex = updatedCurrentRound.index;

      // after 30 seconds, get games again, if the game is still in riddle stage, ends it and move to the next one?
      game = await getGame(gameId);
      let { currentRound } = game;
      updatedCurrentRound = { ...currentRound };
      if (updatedCurrentRound.index === currentRoundIndex) {
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

        game = await getGame(gameId);
        let { currentRound } = game;
        if (
          !currentRound.hasWinner &&
          currentRound.stage !== roundStages.RESULT &&
          currentRound.stage !== roundStages.WINNER_DECISION
        ) {
          console.log("handle action from selectes card for round");
          await handleActionBeforeResult(io, socket, gameId);
        }
      }
    }
  };
};
