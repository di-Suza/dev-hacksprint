const { Server } = require("socket.io");
const chatHandler = require("./chatHandler");
const { socketAuth } = require("../middlewares/socketAuth.middleware");
let io;
const initSocket = (server) => {
  const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.SERVER_URL,
    "https://dev-hacksprint.onrender.com",
    "https://devhacksprint.netlify.app",
    "http://localhost:8080",
    "http://localhost:5173",
  ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by Socket CORS"));
      },
      methods: ["POST", "GET"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
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
