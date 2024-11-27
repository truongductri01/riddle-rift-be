const { storeGameRequest } = require("../api/gameApis");
const errorHandler = require("./errorHandler");
const eventNames = require("./eventNames");

module.exports = (io, socket) => {
  socket.on(eventNames.on.createGameRequest, async ({ config }) => {
    try {
      console.log("received create game request >>>", config);
      try {
        let game = {
          config,
          cards: {},
          currentRound: {},
          teams: {},
          players: {},
          socketToPlayers: {},
          history: [],
          createdAt: new Date().getTime(),
        };
        console.log("game to be created >>>", game);

        // DONE: create team
        if (!config.teams) {
          throw new Error("Missing teams in game config");
        }
        config.teams.forEach((team) => {
          let teamId = team.id;
          game.teams[teamId] = {
            id: teamId,
            name: team.name,
            healthPoint: config.maxHealth,
            leader: "",
            players: [],
          };
        });

        console.log("calling from create");
        let gameId = await storeGameRequest(game);

        socket.emit(eventNames.emit.createGameResponse, {
          config: game.config,
          teams: game.teams,
          currentRound: game.currentRound,
          gameId,
        });

        // io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, gameId);
      } catch (e) {
        console.log(e);
        errorHandler(io, socket, "fail_to_create", `${e}`);
      }
    } catch (e) {
      errorHandler(io, socket, "create-game-error", `${e}`);
    }
  });
};
