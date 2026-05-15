const mongoose = require("mongoose");

module.exports = connectToDb = async () => {
  await mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("DB is Connected!");
  });
};
