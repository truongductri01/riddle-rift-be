const { Server, Socket } = require("socket.io");
const { getGame, storeGameRequest } = require("../api/gameApis");
const eventNames = require("./eventNames");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket) => {
  socket.on("disconnect", async () => {
    console.log("a user disconnect >>>", socket.id);
    // let game = await getGame(gameId);
    // let { socketToPlayers, players, teams } = game;
    // let teamId;
    // let updatedTeams = { ...teams };

    // // remove it from team, re-assign new leader.
    // let playerId = socketToPlayers[socket.id];
    // if (playerId) {
    //   if (players[playerId] && players[playerId].teamId) {
    //     teamId = players[playerId].teamId;
    //     let selectedTeam = teams[teamId];

    //     let newPlayers = [];
    //     selectedTeam.players.forEach((id) => {
    //       if (id !== playerId) newPlayers.push(id);
    //     });
    //     selectedTeam = { ...selectedTeam, players: newPlayers };

    //     if (selectedTeam.leader === playerId) {
    //       // assign a different one
    //       if (selectedTeam.players.length === 0) {
    //         selectedTeam.leader = "";
    //       } else {
    //         let randomPlayerId =
    //           selectedTeam.players[
    //             Math.floor(Math.random() * selectedTeam.players.length)
    //           ];
    //         selectedTeam.leader = randomPlayerId;
    //         selectedTeam = { ...selectedTeam, leader: randomPlayerId };
    //       }
    //     }

    //     updatedTeams = {
    //       ...teams,
    //       [teamId]: { ...selectedTeam },
    //     };
    //     socket.leave(`${game.id}/${teamId}`);
    //     socket.leave(`${game.id}`);
    //   }
    // }

    // // TODO: remove socket to players link
    // delete socketToPlayers[socket.id];
    // await storeGameRequest({
    //   ...game,
    //   socketToPlayers,
    //   players,
    //   teams: updatedTeams,
    // });
    // console.log("user disconnected", socket.id);

    // io.to(`${game.id}/${teamId}`).emit(eventNames.emit.gameStatusChange);
  });
};
