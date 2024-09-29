const eventNames = {
  on: {
    joinGame: "join-game",
    // confirm player
    confirmPlayerRequest: "confirm-player-request",

    createGameRequest: "create-game-request",
    getGameStatusEvent: "get-game-status",
    playerJoinRequest: "player-join-request",
    teamSelectRequest: "team-select-request",

    // round
    teamReadyRequest: "team-ready-request",
    selectCardsForRound: "select-cards-for-round",
    answerRiddle: "answer-riddle",
    winnerAttack: "winner-attack",

    // restart
    startNewGame: "start-new-game",
  },
  emit: {
    gameStatusChange: "game-status-change",
    confirmPlayerResponse: "confirm-player-response",

    createGameResponse: "create-game-response",
    gameStatus: "game-status",
    playerJoinResponse: "player-join-response",
    teamSelectResponse: "team-select-response",

    playerJoinTeam: "player-join-team",
    teamReadyResponse: "team-ready-response",
    roundStageChange: "round_stage_change",

    error: "error",
  },
};
module.exports = eventNames;
