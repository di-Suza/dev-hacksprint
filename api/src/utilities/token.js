const jwt = require("jsonwebtoken");

require("dotenv").config();

const generateToken = (payload,time="15m") => {
  return new Promise((resolve, reject) => {
    const b64Key = process.env.PRIVATE_JWT_KEY_BS64;
    if (!b64Key) return reject(new Error("Key not found in env"));

    // Buffer use to original pem string
    const privateKey = Buffer.from(b64Key, "base64").toString("utf-8");

    const options = {
      algorithm: "RS256",
      expiresIn: time,
      issuer: "DevloopFeed",
    };

    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        return reject(new Error("Failed to generate secure token"));
      } 
      resolve(token);
    });
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    const b64PublicKey = process.env.PUBLIC_JWT_KEY_BS64;
    if (!b64PublicKey)
      return reject({ type: "CONFIG_ERROR", message: "Public key missing" });

    const publicKey = Buffer.from(b64PublicKey, "base64").toString("utf-8");

    const options = {
      algorithms: ["RS256"],
      issuer: "DevloopFeed",
    };

    jwt.verify(token, publicKey, options, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve({ type: "SUCCESS", data: decoded });
    });
  });
};

module.exports = { generateToken, verifyToken };