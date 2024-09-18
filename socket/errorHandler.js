const eventNames = require("./eventNames");

module.exports = (io, socket, type, message) => {
  socket.emit(eventNames.emit.error, { type, message });
};
