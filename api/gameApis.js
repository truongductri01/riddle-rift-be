const { db } = require("../firebase");
const { collection, doc, setDoc, getDoc } = require("firebase/firestore");
const gameStates = require("../socketV2/helpers/gameStates");

/**
 *
 * @typedef {Object} GameData
 * @property {Object} config - Configuration settings for the game.
 * @property {Object} cards - An object representing the cards used in the game.
 * @property {Object} currentRound - An object containing information about the current round of the game.
 * @property {Object} teams - An object storing information about the teams participating in the game.
 * @property {Object} players - An object storing information about the players in the game.
 * @property {Object} socketToPlayers - A mapping of socket IDs to player objects.
 * @property {Array} history - An array storing the history of actions or events in the game.
 * @property {string} finalWinner - A string represent the final winner
 * @property {string} id - A string represent game id
 */

/**
 * @returns {Promise<GameData>}
 */
const getGame = async (gameId = "game1") => {
  try {
    let gameDoc = doc(db, "games", gameId);
    let gameSnapshot = await getDoc(gameDoc);

    if (gameSnapshot.exists()) {
      return gameSnapshot.data();
    }
  } catch (e) {
    console.log("error with get game>>>", e);
    return {};
  }
};

const storeGameRequest = async (game, gameId = null) => {
  try {
    let gameDoc = doc(db, "games", "game1");
    if (gameId) {
      gameDoc = doc(db, "games", gameId);
    } else if (game.id) {
      gameDoc = doc(db, "games", game.id);
    } else {
      gameDoc = doc(collection(db, "games"));
    }

    await setDoc(gameDoc, {
      ...game,
      id: gameDoc.id,
      state: gameStates.RUNNING,
    });

    return gameDoc.id;
  } catch (e) {
    console.log("Error with store game request >>>", e);
  }
};

const storeCompletedGameRequest = async (game, gameId = null) => {
  try {
    let gameDoc = doc(db, "completedGames", "game1");
    if (gameId) {
      gameDoc = doc(db, "completedGames", gameId);
    } else if (game.id) {
      gameDoc = doc(db, "completedGames", game.id);
    } else {
      gameDoc = doc(collection(db, "completedGames"));
    }

    await setDoc(gameDoc, {
      ...game,
      id: gameDoc.id,
      state: gameStates.RUNNING,
    });

    return gameDoc.id;
  } catch (e) {
    console.log("Error with store game request >>>", e);
  }
};

module.exports = { getGame, storeGameRequest, storeCompletedGameRequest };
