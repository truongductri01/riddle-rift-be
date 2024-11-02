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
const internalCalculateResultHandler = require("./round/internalCalculateResultHandler");
const joinAsAdminHandler = require("./joinAsAdminHandler");
const adminActionOnRiddleHandler = require("./round/adminActionOnRiddleHandler");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket, eventEmitter) => {
  // create game
  createGameHandler(io, socket, eventEmitter);
  // get the game status
  getGameStatusHandler(io, socket, eventEmitter);
  // confirm player and store player id
  confirmPlayerIdHandler(io, socket, eventEmitter);
  // player joined with name
  playerJoinHandler(io, socket, eventEmitter);
  // team select
  teamSelectHandler(io, socket, eventEmitter);
  // join as admin
  joinAsAdminHandler(io, socket, eventEmitter);

  // -- for round -- //
  // team ready
  teamReadyHandler(io, socket, eventEmitter);
  // select cards
  selectCardsForRoundHandler(io, socket, eventEmitter);
  // answer riddle
  answerRiddleHandler(io, socket, eventEmitter);
  // admin action
  adminActionOnRiddleHandler(io, socket, eventEmitter);
  // winner attack
  winnerAttackHandler(io, socket, eventEmitter);
  // calculate result
  internalCalculateResultHandler(io, socket, eventEmitter);

  // before-disconnect
  beforeDisconnectHandler(io, socket, eventEmitter);

  //   disconnect
  disconnectHandler(io, socket, eventEmitter);
};
