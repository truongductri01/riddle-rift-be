const { Server, Socket } = require("socket.io");
const EventEmitter = require("events");
const eventNames = require("../eventNames");
const { handleActionBeforeResult } = require("./calculateResultHelper");
const { getGame, storeGameRequest } = require("../../api/gameApis");
const errorHandler = require("../errorHandler");
const roundStages = require("../helpers/roundStages");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 * @param {EventEmitter} eventEmitter
 */
module.exports = (io, socket, eventEmitter) => {
  eventEmitter.on(eventNames.internal.calculateResult, async (gameId) => {
    try {
      console.log("calling internal event handler");
      let game = await getGame(gameId);
      const { currentRound } = game;
      let updatedGame = { ...game };
      let updatedCurrentRound = {
        ...currentRound,
        stage: roundStages.CALCULATE_RESULT,
      };

      updatedGame = { ...updatedGame, currentRound: updatedCurrentRound };
      console.log("trying");
      await storeGameRequest(updatedGame);
      io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

      await handleActionBeforeResult(io, socket, gameId);
    } catch (e) {
      console.log("error with internal result calculate handler >>>", e);
      errorHandler(io, socket, "internal_error", `${e}`);
    }
  });
};
