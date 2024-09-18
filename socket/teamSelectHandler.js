const { Socket } = require("socket.io");
const { getGame, storeGameRequest } = require("../api/gameApis");
const eventNames = require("./eventNames");
const errorHandler = require("./errorHandler");

module.exports = (io, socket) => {
  socket.on(
    eventNames.on.teamSelectRequest,
    async (teamId, gameId = "game1") => {
      let game = await getGame(gameId);
      const { socketToPlayers, players, teams } = game;
      let playerId = socketToPlayers[socket.id];

      if (!playerId) {
        errorHandler(
          io,
          socket,
          "no_player",
          "No player associated with this socket id"
        );
        return;
      } else if (!teams[teamId]) {
        errorHandler(
          io,
          socket,
          "no_team",
          `No team with id: ${teamId} exists!`
        );
        return;
      }

      // assign team id to the player info
      players[playerId] = { ...players[playerId], teamId };

      // if there is no player in team, assign player as leader of the team
      let selectedTeam = teams[teamId];
      if (selectedTeam.players && selectedTeam.players.length === 0) {
        selectedTeam.leader = playerId;
      }
      if (!selectedTeam.players.includes(playerId)) {
        selectedTeam.players.push(playerId);
      }

      teams[teamId] = { ...selectedTeam };
      await storeGameRequest({ ...game, players, teams });

      // response event emit
      socket.emit(eventNames.emit.teamSelectResponse, teamId);

      // broadcast to all in the room about joining
      socket.join(`${game.id}/${teamId}`);
      socket
        .to(`${game.id}/${teamId}`)
        .emit(eventNames.emit.playerJoinTeam, players[playerId]);

      io.to(`${game.id}/${teamId}`).emit(
        eventNames.emit.gameStatusChange,
        game.id
      );
    }
  );
};
