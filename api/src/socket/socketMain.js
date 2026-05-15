const { Server } = require("socket.io");
const chatHandler = require("./chatHandler");
const { socketAuth } = require("../middlewares/socketAuth.middleware");
let io;
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["POST", "GET"],
      pingTimeout: 60000,
      pingInterval: 25000,
      credentials: true,
    },
  });

  // Socket Middleware
  io.use(socketAuth);

  io.on("connection", (socket) => {
    chatHandler(socket);

    socket.on("disconnect", () => {
      console.log(socket.user.userName.toString(), "User disconnected");
    });
  });

  return io;
};
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
module.exports = { initSocket, getIO };
