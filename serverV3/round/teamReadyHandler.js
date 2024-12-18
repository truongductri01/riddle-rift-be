const { Socket, Server } = require("socket.io");
const eventNames = require("../eventNames");
const { getGame, storeGameRequest } = require("../../api/gameApis");
// const { createCards, dealCardsForTeam } = require("../helpers/createCards");
const roundStages = require("../helpers/roundStages");
const { createCards, dealCardsForTeam } = require("../helpers/createCards2");
const errorHandler = require("../errorHandler");

/**
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket) => {
  // handle team ready, this will also involve creating the round information
  socket.on(
    eventNames.on.teamReadyRequest,
    async (teamId, gameId = "game1") => {
      try {
        let game = await getGame(gameId);
        let { currentRound, config } = game;
        let updatedGame = { ...game };

        let updatedCurrentRound = { ...currentRound };

        if (!("index" in currentRound)) {
          // TODO: set up current round
          updatedCurrentRound = {
            index: 0,
            stage: roundStages.READY,
            readyTeams: [],
            cardsToUsed: {},
            instantSessionLength: 0, // in seconds
            riddleSessionLength: 30, // in seconds
            hasWinner: false,
            winnerTeamId: "",
            roundActions: [],
            roundResult: {},
          };
        }

        // curent Round is ready
        if (!updatedCurrentRound.readyTeams.includes(teamId)) {
          updatedCurrentRound = {
            ...updatedCurrentRound,
            readyTeams: [...updatedCurrentRound.readyTeams, teamId],
          };
        }

        updatedGame = { ...updatedGame, currentRound: updatedCurrentRound };
        await storeGameRequest(updatedGame);

        socket.emit(eventNames.emit.teamReadyResponse, {
          readyTeamsCount: updatedCurrentRound.readyTeams.length,
          totalTeams: config.teams.length,
        });
        io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

        // see if the game can be started for the very first round
        if (updatedCurrentRound.readyTeams.length === config.teams.length) {
          // clean up the current Round?
          updatedCurrentRound = {
            ...updatedCurrentRound,
            stage: roundStages.READY,
            readyTeams: [],
            cardsToUsed: {},
            hasWinner: false,
            winnerTeamId: "",
            attackedTeamId: "",
            roundActions: [],
            roundResult: {},
            result: null,
            answeredTeams: [],
            teamAnswers: {},
            riddle: {},
          };

          if (updatedCurrentRound.index === 0) {
            updatedCurrentRound = {
              ...updatedCurrentRound,
              stage: roundStages.GENERATE_CARDS,
            };
            updatedGame = { ...updatedGame, currentRound: updatedCurrentRound };
            await storeGameRequest(updatedGame);

            io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

            // run logic to generate cards. send the result out after 2 seconds delayed
            let updatedCards = {};
            let createdCards = await createCards(config);
            let cardsData = dealCardsForTeam(config, createdCards);

            console.log("cards data >>>", cardsData);

            updatedCards = { ...cardsData };
            updatedGame = {
              ...updatedGame,
              cards: updatedCards,
              currentRound: updatedCurrentRound,
            };
            await storeGameRequest(updatedGame);
            io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);
          }

          updatedCurrentRound = {
            ...updatedCurrentRound,
            stage: roundStages.INSTANT_CARD_SESSION,
            instantSessionStarttime: Date.now(),
            index: updatedCurrentRound.index + 1,
          };
          updatedGame = { ...updatedGame, currentRound: updatedCurrentRound };
          await storeGameRequest(updatedGame);
          io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

          updatedCurrentRound = {
            ...updatedCurrentRound,
            readyTeams: [],
            stage: roundStages.SELECT_USE_CARDS,
          };
          updatedGame = {
            ...updatedGame,
            currentRound: updatedCurrentRound,
          };
          await storeGameRequest(updatedGame);
          io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);
        }
      } catch (e) {
        console.log("team-ready-error >>>", e);
        errorHandler(io, socket, "team-ready-error", `${e}`);
      }
    }
  );
};
