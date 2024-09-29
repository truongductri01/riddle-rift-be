module.exports = {
  id: "yIduHidyN1XvknQONVMP",
  config: {
    maxCard: 3,
    gameName: "Testing Game",
    cardsAmountConfig: {
      BLOCK_SWAP_HEALTH: 1,
      HEALING: 3,
      SWAP_HEALTH: 1,
      ATTACK: 3,
      DEFENSE: 3,
    },
    maxHealth: 5,
    teams: [
      {
        id: "1727542812647",
        name: "Team 2647",
      },
      {
        id: "1727542812462",
        name: "Team 2462",
      },
    ],
  },
  teams: {
    1727542812462: {
      name: "Team 2462",
      leader: "2V-OGhnW22l76HlBAAAy",
      healthPoint: 5,
      id: "1727542812462",
      players: ["2V-OGhnW22l76HlBAAAy"],
    },
    1727542812647: {
      id: "1727542812647",
      players: ["eLAwOjzelqbcmFqjAAAw", "MWeS66yPxJwZQacAAAAG"],
      healthPoint: 5,
      name: "Team 2647",
      leader: "eLAwOjzelqbcmFqjAAAw",
    },
  },
  history: [
    {
      roundActions: [],
      stage: "ready",
      index: 0,
      riddleSessionLength: 30,
      roundResult: {},
      hasWinner: false,
      cardsToUsed: {},
      winnerTeamId: "",
      instantSessionLength: 3,
      readyTeams: ["1727542812647", "1727542812462"],
    },
  ],
  cards: {},
  players: {
    MWeS66yPxJwZQacAAAAG: {
      name: "Troy",
      id: "MWeS66yPxJwZQacAAAAG",
      teamId: "1727542812647",
    },
    "2V-OGhnW22l76HlBAAAy": {
      name: "Troy 2",
      teamId: "1727542812462",
      id: "2V-OGhnW22l76HlBAAAy",
    },
    eLAwOjzelqbcmFqjAAAw: {
      id: "eLAwOjzelqbcmFqjAAAw",
      name: "Troy 1",
      teamId: "1727542812647",
    },
  },
  state: "running",
  currentRound: {
    riddleSessionLength: 30,
    cardsToUsed: {
      1727542812462: [
        {
          id: "1727542857434",
          type: "SWAP_HEALTH",
        },
      ],
      1727542812647: [
        {
          id: "1727542857453",
          type: "HEALING",
        },
        {
          id: "1727542857473",
          type: "HEALING",
        },
        {
          id: "1727542857463",
          type: "HEALING",
        },
      ],
    },
    attackedTeamId: "1727542812462",
    instantSessionLength: 3,
    instantSessionStarttime: 1727542857632,
    index: 1,
    riddleSessionStarttime: 1727543736002,
    winnerTeamId: "1727542812647",
    roundActions: [],
    roundResult: {},
    answeredTeams: ["1727542812647"],
    readyTeams: [],
    riddle: {
      answer: "80",
      question: "7 * 10 + 10",
      type: "short_answer",
      preQuestion: "What is the value of:",
    },
    hasWinner: true,
    stage: "calculate_result",
    result: null,
  },
};
