const { getGame } = require("../api/gameApis");
const errorHandler = require("./errorHandler");
const eventNames = require("./eventNames");

module.exports = (io, socket) => {
  socket.on(eventNames.on.getGameStatusEvent, async (gameId = "game1") => {
    try {
      let game = await getGame(gameId);
      const {
        socketToPlayers,
        config,
        teams,
        players,
        cards,
        currentRound,
        finalWinner,
        history,
      } = game;
      let playerId = socketToPlayers[socket.id];

      if (!playerId) {
        errorHandler(
          io,
          socket,
          "no_player",
          "No player associated with this socket id"
        );
        return;
      } else {
        let playerInfo = players[playerId];
        let returnedGame = {
          config,
          teams,
          playerInfo,
          playerId,
          currentRound: {
            ...currentRound,
            riddle: { ...currentRound.riddle, answer: null },
          },
          finalWinner,
          history,
          id: game.id,
        };
        if (playerInfo) {
          let teamId = playerInfo.teamId;
          if (teamId && cards.teamCardInfo) {
            returnedGame = {
              ...returnedGame,
              cards: {
                cards: cards.teamCardInfo[teamId],
                remainingCardsCount: cards.remainingCards
                  ? cards.remainingCards.length
                  : 0,
              },
            };
          }

          // join here
          socket.join(`${game.id}/${teamId}`);
        }

        socket.join(`${game.id}`);
        socket.emit(eventNames.emit.gameStatus, returnedGame);
      }
    } catch (e) {
      errorHandler(io, socket, "get-game-status-error", `${e}`);
    }
  });
};
