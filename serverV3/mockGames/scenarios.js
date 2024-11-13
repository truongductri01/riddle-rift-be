let team1 = "Jon";
let team2 = "Alice";
let yourTeam = "You";

const scenario1 = {
  teams: {
    [team1]: {
      name: team1,
      healthPoint: 5,
      id: team1,
    },
    [team2]: {
      id: team2,
      healthPoint: 5,
      name: team2,
    },
    [yourTeam]: {
      id: yourTeam,
      healthPoint: 9,
      name: yourTeam,
    },
  },
  currentRound: {
    cardsToUsed: {
      [team1]: [
        {
          id: "swap1",
          type: "SWAP_HEALTH",
          targets: [yourTeam],
        },
      ],
      [team2]: [
        {
          id: "healing1",
          type: "HEALING",
        },
        {
          id: "healing2",
          type: "HEALING",
        },
        {
          id: "healing3",
          type: "HEALING",
        },
      ],
    },
    attackedTeamId: team1,
    index: 1,
    winnerTeamId: yourTeam,
    hasWinner: true,
  },
  cards: {
    teamCardInfo: {
      [yourTeam]: {
        usedCards: {},
        activeCards: [
          {
            id: "block1",
            description: "Block Swap Health Card from other team",
            type: "BLOCK_SWAP_HEALTH",
          },
          {
            id: "defense1",
            description: "Block one attack against your team",
            type: "DEFENSE",
          },
          {
            id: "heal1",
            description: "Increase your team's health point by 1",
            type: "HEALING",
          },
        ],
      },
    },
  },
};

const config1 = {
  cardsAmountConfig: {
    ATTACK: 3,
    BLOCK_SWAP_HEALTH: 1,
    DEFENSE: 3,
    HEALING: 3,
    SWAP_HEALTH: 1,
  },
  maxCard: 5,
  teams: [
    {
      id: "team1",
      name: "Team 1",
    },
    { id: "team2", name: "Team 2" },
  ],
};

module.exports = { scenario1, yourTeam, config1 };
