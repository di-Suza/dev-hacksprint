const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const app = require("./src/app");
const http = require("http");
const connectToDb = require("./src/config/connectToDb");
const { initSocket } = require("./src/socket/socketMain");
require("./src/config/connectToRedis");

const server = http.createServer(app);

connectToDb().then(() => {
  let io = initSocket(server);
  app.set("io", io);
  server.listen(8080, () => {
    console.log("Socket + Express Server running on 8080");
  });
});
