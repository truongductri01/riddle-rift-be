const { Server, Socket } = require("socket.io");
const eventNames = require("../eventNames");
const { getGame, storeGameRequest } = require("../../api/gameApis");
const roundStages = require("../helpers/roundStages");
const actionHandler = require("../actionHandler/actionHandler");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket) => {
  socket.on(eventNames.on.winnerAttack, async (teamId, gameId = "game1") => {
    // the id of the team to be attacked

    let game = await getGame(gameId);
    const { currentRound, teams, cards } = game;
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
    let result = actionHandler(updatedCurrentRound, teams, cards);

    updatedCurrentRound = {
      ...updatedCurrentRound,
      stage: roundStages.RESULT,
      result,
    };
    updatedGame = {
      ...updatedGame,
      currentRound: updatedCurrentRound,
      teams: result.teams,
    };
    await storeGameRequest(updatedGame);
    io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

    // if there is one single team left with health point more than 0
    let teamsMoreThanOneHealthCount = 0;
    let finalWinner = "";
    for (let teamId in result.teams) {
      let team = result.teams[teamId];
      if (team.healthPoint > 0) {
        teamsMoreThanOneHealthCount += 1;
        finalWinner = team.id;
      }
    }

    if (teamsMoreThanOneHealthCount === 1) {
      updatedGame = { ...updatedGame, finalWinner };
      await storeGameRequest(updatedGame);
      io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);
    }
  });
};
