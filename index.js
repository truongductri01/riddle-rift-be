const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const http = require("http");
const socketV3 = require("./serverV3/socketV3");
const { getGame, getCompletedGame } = require("./api/gameApis");
const httpRequestsV3 = require("./serverV3/httpRequestsV3");
const EventEmitter = require("events");
const {
  createCards,
  dealCardsForTeam,
} = require("./serverV3/helpers/createCards2");
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
  try {
    let { gameId } = req.query;

    if (gameId) {
      let completedGame = await getCompletedGame(gameId);
      if (completedGame) {
        return res.json(completedGame);
      }
      return res.json(await getGame(gameId));
    } else {
      return res.json({});
    }
  } catch (e) {
    return res.json({ error: `${e}` });
  }
});

app.get("/test-create-card", async (req, res) => {
  try {
    let config = {
      cardsAmountConfig: {
        [cardTypes.ATTACK]: 3,
        [cardTypes.BLOCK_SWAP_HEALTH]: 1,
        [cardTypes.DEFENSE]: 3,
      },
      teams: [
        { id: "team1", name: "" },
        { id: "team2", name: "" },
      ],
      maxCard: 3,
    };
    let cards = await createCards(config);

    let cardsAfterDealt = dealCardsForTeam(config, cards);

    return res.json(cardsAfterDealt);
  } catch (e) {
    return res.json({ error: `${e}` });
  }
});

app.get("/test-card", async (req, res) => {
  try {
    let game = mockGame1;
    return res.json({
      // game,
      before: { ...game },
      newState: actionHandler(game.currentRound, game.teams, game.cards),
    });
  } catch (e) {
    return res.json({ error: `${e}` });
  }
});

httpRequestsV3(app);

io.on("connection", async (socket) => {
  let eventEmitter = new EventEmitter();
  console.log("a user connected", socket.id);
  io.emit("testing", { data: "Welcome to RiddleRift" });

  try {
    // socketV2(io, socket);
    socketV3(io, socket, eventEmitter);
  } catch (e) {
    errorHandler(io, socket, "Error", `${e}`);
  }
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
