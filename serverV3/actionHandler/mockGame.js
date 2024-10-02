const roundStages = require("../helpers/roundStages");
const cardTypes = require("./types/cardTypes");

let attackedTeamId = "attackedTeam";
let winnerTeamId = "winnerTeam";

let cardsToUsed1 = {
  [attackedTeamId]: [{ type: cardTypes.HEALING, id: "1" }],
  [winnerTeamId]: [{ type: cardTypes.ATTACK, id: "2" }],
};
let cardsToUsed2 = {
  [attackedTeamId]: [{ type: cardTypes.DEFENSE, id: "1" }],
  [winnerTeamId]: [{ type: cardTypes.HEALING, id: "2" }],
};
let cardsToUsed3 = {
  [attackedTeamId]: [
    { type: cardTypes.SWAP_HEALTH, id: "1", targets: [winnerTeamId] },
  ],
  [winnerTeamId]: [{ type: cardTypes.BLOCK_SWAP_HEALTH, id: "2", targets: [] }],
};

let cardsToUsed = cardsToUsed1;

let mockGameResultStage = {
  cards: {},
  currendRound: {
    riddleSessionLength: 30,
    instantSessionStarttime: 1726970870378,
    roundActions: [],
    riddle: {
      answer: "17",
      type: "short_answer",
      question: "5 * 2 + 7",
      preQuestion: "What is the value of:",
    },
    winnerTeamId: winnerTeamId,
    stage: "result",
    index: 4,
    roundResult: {},
    hasWinner: true,
    cardsToUsed: cardsToUsed,
    answeredTeams: [winnerTeamId, attackedTeamId],
    attackedTeamId: attackedTeamId,
    riddleSessionStarttime: 1726970879542,
    instantSessionLength: 3,
    readyTeams: [],
  },
  teams: {
    attackedTeam: {
      players: ["RwZ3VFmYKlbOz8UmAACX"],
      name: "Team 1",
      leader: "RwZ3VFmYKlbOz8UmAACX",
      id: attackedTeamId,
      healthPoint: 3,
    },
    winnerTeam: {
      id: winnerTeamId,
      healthPoint: 3,
      players: ["2TQ_K-bgdgDZFNiJAACV"],
      leader: "2TQ_K-bgdgDZFNiJAACV",
      name: "Team 2",
    },
  },
};

let mockGameResultStage2 = {
  cards: {},
  currendRound: {
    riddleSessionLength: 30,
    instantSessionStarttime: 1726970870378,
    roundActions: [],
    riddle: {
      answer: "17",
      type: "short_answer",
      question: "5 * 2 + 7",
      preQuestion: "What is the value of:",
    },
    winnerTeamId: winnerTeamId,
    stage: roundStages.RESULT,
    index: 4,
    roundResult: {},
    hasWinner: true,
    cardsToUsed: cardsToUsed1,
    answeredTeams: [winnerTeamId, attackedTeamId],
    attackedTeamId: attackedTeamId,
    riddleSessionStarttime: 1726970879542,
    instantSessionLength: 3,
    readyTeams: [],
  },
  teams: {
    attackedTeam: {
      players: ["RwZ3VFmYKlbOz8UmAACX"],
      name: "Team 1",
      leader: "RwZ3VFmYKlbOz8UmAACX",
      id: attackedTeamId,
      healthPoint: 3,
    },
    winnerTeam: {
      id: winnerTeamId,
      healthPoint: 3,
      players: ["2TQ_K-bgdgDZFNiJAACV"],
      leader: "2TQ_K-bgdgDZFNiJAACV",
      name: "Team 2",
    },
  },
};

module.exports = { ...mockGameResultStage2 };
