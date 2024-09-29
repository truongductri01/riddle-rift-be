const { Socket, Server } = require("socket.io");
const createGameHandler = require("./createGameHandler");
const getGameStatusHandler = require("./getGameStatusHandler");
const confirmPlayerIdHandler = require("./confirmPlayerIdHandler");
const playerJoinHandler = require("./playerJoinHandler");
const teamSelectHandler = require("./teamSelectHandler");
const teamReadyHandler = require("./round/teamReadyHandler");
const selectCardsForRoundHandler = require("./round/selectCardsForRoundHandler");
const answerRiddleHandler = require("./round/answerRiddleHandler");
const winnerAttackHandler = require("./round/winnerAttackHandler");
const beforeDisconnectHandler = require("./beforeDisconnectHandler");
const disconnectHandler = require("./disconnectHandler");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket) => {
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
};
