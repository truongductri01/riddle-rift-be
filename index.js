const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const http = require("http");
const socketV2 = require("./socketV2/socketV2");
const actionHandler = require("./socketV2/actionHandler/actionHandler");
const mockGame = require("./socketV2/actionHandler/mockGame");
const {
  createCards,
  dealCardsForTeam,
} = require("./socketV2/helpers/createCards2");
const cardTypes = require("./socketV2/actionHandler/types/cardTypes");
const { getGame } = require("./api/gameApis");
const mockGame1 = require("./socketV2/mockGames/mockGame1");
const errorHandler = require("./socketV2/errorHandler");
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

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);
  io.emit("testing", { data: "Welcome to RiddleRift" });

  try {
    socketV2(io, socket);
  } catch (e) {
    errorHandler(io, socket, "Error", `${e}`);
  }
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
