const { getIO } = require("../socket/socketMain");

module.exports.emitToUser = (receiverId, event, data) => {
  const io = getIO();
  if (io) {
    io.to(receiverId.toString()).emit(event, data);
  }
};
