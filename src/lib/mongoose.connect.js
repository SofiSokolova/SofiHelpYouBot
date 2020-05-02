const config = require("dotenv").config();
const mongoose = require("mongoose");

async function initializeDB() {
  return mongoose
    .connect(config.parsed.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log("MongoDB connected"))
}

module.exports = {
  initializeDB,
};
