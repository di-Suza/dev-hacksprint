module.exports = (socket) => {
  const userId = socket.user._id.toString();
  socket.join(userId);

  console.log(`User ${socket.user.userName} is now ready to receive messages.`);
};