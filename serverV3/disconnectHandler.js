const { Server, Socket } = require("socket.io");
const { getGame, storeGameRequest } = require("../api/gameApis");
const eventNames = require("./eventNames");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket) => {
  socket.on("disconnect", async () => {
    console.log("a user disconnect >>>", socket.id);
  });
};
