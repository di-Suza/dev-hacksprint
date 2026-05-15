const redis = require("../config/connectToRedis");
const jwt = require("jsonwebtoken");

module.exports.blacklistToken = async (token) => {
  try {
    const decoded = jwt.decode(token);

    if (decoded && decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      const ttl = decoded.exp - currentTime;

      if (ttl > 0) {
        await redis.setex(`bl_${token}`, ttl, "blacklisted");
      }
    }
  } catch (err){
    console.error(err,"Redis Blacklisting Error");
  }
};