const { verifyToken } = require("../utilities/token");
const cookie = require("cookie");
const Users = require("../models/user.model");

module.exports.socketAuth = async (socket, next) => {
  try {
    // cookie extract
    const rawCookies = socket.handshake.headers.cookie;
    if (!rawCookies) {
      return next(new Error("Authentication error: No cookies found"));
    }

    const parsedCookies = cookie.parse(rawCookies);
    const token = parsedCookies.accessToken;
    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    // token verification
    let { data } = await verifyToken(token);
    let user = await Users.findById(data.userId).select(
      "profilePicture userName",
    );
    if (!user) {
      return next(new Error("User not found!"));
    }

    socket.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new Error("Session expired"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new Error("Invalid session"));
    }

    return next(new Error("Internal Server Error"));
  }
};
