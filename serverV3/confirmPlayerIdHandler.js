const { getGame, storeGameRequest } = require("../api/gameApis");
const errorHandler = require("./errorHandler");
const eventNames = require("./eventNames");

module.exports = (io, socket) => {
  socket.on(
    eventNames.on.confirmPlayerRequest,
    async (playerId, gameId = "game1") => {
      console.log("confirming player", playerId, "for game", gameId);
      try {
        let game = await getGame(gameId);
        const { socketToPlayers, players, teams } = game;

        let newPlayerId = playerId === null ? socket.id : playerId;

        socketToPlayers[socket.id] = newPlayerId;

        let updatedTeams = { ...teams };
        if (players[newPlayerId]) {
          let { teamId } = players[newPlayerId];
          let team = teams[teamId];
          if (team) {
            if (team.players && team.players.length === 0) {
              team = { ...team, leader: playerId };
            }
            if (!team.players.includes(newPlayerId)) {
              team = { ...team, players: [...team.players, newPlayerId] };
            }
            updatedTeams = {
              ...teams,
              [teamId]: { ...team },
            };
          }
        }

        await storeGameRequest(
          { ...game, socketToPlayers, teams: updatedTeams },
          game.id
        );

        socket.emit(
          eventNames.emit.confirmPlayerResponse,
          newPlayerId,
          game.id
        );
      } catch (e) {
        errorHandler(io, socket, "confirm-player-id-error", `${e}`);
      }
    }
  );
};
