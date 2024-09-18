const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { getGame, storeGameRequest } = require("./api/gameApis");

const app = express();
const http = require("http");
const getGameStatusHandler = require("./socket/getGameStatusHandler");
const confirmPlayerIdHandler = require("./socket/confirmPlayerIdHandler");
const playerJoinHandler = require("./socket/playerJoinHandler");
const teamSelectHandler = require("./socket/teamSelectHandler");
const createGameHandler = require("./socket/createGameHandler");
const disconnectHandler = require("./socket/disconnectHandler");
const teamReadyHandler = require("./socket/round/teamReadyHandler");
const selectCardsForRoundHandler = require("./socket/round/selectCardsForRoundHandler");
const answerRiddleHandler = require("./socket/round/answerRiddleHandler");
const winnerAttackHandler = require("./socket/round/winnerAttackHandler");
const beforeDisconnectHandler = require("./socket/beforeDisconnectHandler");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  let game = await getGame();
  await storeGameRequest({ testing: true });

  res.json(game);
});

// socket for games
const eventNames = {
  on: {
    // confirm player
    confirmPlayerRequest: "confirm-player-request",

    createGameRequest: "create-game-request",
    getGameStatusEvent: "get-game-status",
    playerJoinRequest: "player-join-request",
    teamSelectRequest: "team-select-request",
  },
  emit: {
    confirmPlayerResponse: "confirm-player-response",

    createGameResponse: "create-game-response",
    gameStatus: "game-status",
    playerJoinResponse: "player-join-response",
    teamSelectResponse: "team-select-response",

    playerJoinTeam: "player-join-team",

    gameStatusChange: "game-status-change",

    error: "error",
  },
};
let game = null;

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);
  io.emit("testing", { data: "Welcome to RiddleRift" });

  // create game
  createGameHandler(io, socket);
  // get the game status
  getGameStatusHandler(io, socket);
  // confirm player and store player id
  confirmPlayerIdHandler(io, socket);
  // player joined with name
  playerJoinHandler(io, socket);
  // team select
  teamSelectHandler(io, socket);

  // -- for round -- //
  // team ready
  teamReadyHandler(io, socket);
  // select cards
  selectCardsForRoundHandler(io, socket);
  // answer riddle
  answerRiddleHandler(io, socket);
  // winner attack
  winnerAttackHandler(io, socket);

  // before-disconnect
  beforeDisconnectHandler(io, socket);

  //   disconnect
  disconnectHandler(io, socket);
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
