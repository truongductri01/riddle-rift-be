const { getGame, storeGameRequest } = require("../api/gameApis");
const eventNames = require("./eventNames");

module.exports = (io, socket) => {
  socket.on(
    eventNames.on.confirmPlayerRequest,
    async (playerId, gameId = "game1") => {
      console.log("received player id >>>", playerId, gameId);
      let game = await getGame(gameId);
      console.log("game name");
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

      socket.emit(eventNames.emit.confirmPlayerResponse, newPlayerId, game.id);
    }
  );
};