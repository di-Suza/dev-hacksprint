const redis = require("../config/connectToRedis");

module.exports.deleteUserFromRedis = async (userId) => {
  await redis.del(`user_:${userId}`);
};

