const eventNames = require("../eventNames");
const {
  getGame,
  storeGameRequest,
  storeCompletedGameRequest,
} = require("../../api/gameApis");
const roundStages = require("../helpers/roundStages");
const actionHandler = require("../actionHandler/actionHandler");

const handleActionBeforeResult = async (io, socket, gameId) => {
  console.log("calling handle action");
  let game = await getGame(gameId);
  const { currentRound, teams, cards } = game;
  let updatedGame = { ...game };
  updatedCurrentRound = {
    ...currentRound,
  };

  // TODO: process the result before sending
  let result = actionHandler(updatedCurrentRound, teams, cards);
  console.log("result >>>", result);

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

  await storeHistory(gameId);
  io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

  if (game?.config.gameEndsWithRounds) {
    await checkFinalWinnerByRound(io, socket, gameId, result);
  } else {
    await checkFinalWinner(io, socket, gameId, result);
  }
};

const checkFinalWinnerByRound = async (io, socket, gameId, result) => {
  console.log("attempting to check final winner by round");
  let game = await getGame(gameId);
  const { currentRound, config } = game;
  console.log(
    "current round index ",
    currentRound.index,
    "and config max round",
    config.maxRound
  );
  let updatedGame = { ...game };

  if (currentRound.index >= config.maxRound) {
    let highestPointTeam = Object.keys(result.teams)?.sort(
      // team with more health point shows up first
      (a, b) => result.teams?.[b]?.healthPoint - result.teams?.[a]?.healthPoint
    )[0];
    updatedGame = { ...updatedGame, finalWinner: highestPointTeam };

    await storeCompletedGameRequest(updatedGame);
    await storeGameRequest(updatedGame);
    io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);
  }
};

const checkFinalWinner = async (io, socket, gameId, result) => {
  console.log("Attempting to check winner by health point");
  let game = await getGame(gameId);
  let updatedGame = { ...game };

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
};

const storeHistory = async (gameId) => {
  let game = await getGame(gameId);
  const { currentRound, history } = game;
  let updatedHistory = [...history, { ...currentRound }];

  await storeGameRequest({ ...game, history: updatedHistory });
};

module.exports = { handleActionBeforeResult };
