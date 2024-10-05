const { Server, Socket } = require("socket.io");
const EventEmitter = require("events");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 * @param {EventEmitter} eventEmitter
 */
module.exports = (io, socket, eventEmitter) => {
  socket.on("disconnect", async () => {
    console.log("a user disconnect >>>", socket.id);
  });
};
