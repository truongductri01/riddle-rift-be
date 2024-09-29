const { Socket, Server } = require("socket.io");
const eventNames = require("./eventNames");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket) => {
    socket.on(eventNames.on.joinGame, (gameId) => {
        
    })
};
