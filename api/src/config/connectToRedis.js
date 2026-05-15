const Redis = require("ioredis");

// Redis configuration logic
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
  maxRetriesPerRequest: null,
});

redis.on("connect", () => console.log("Redis Connected Successfully!"));
redis.on("error", (err) => console.log("Redis Connection Error:", err));

module.exports = redis;