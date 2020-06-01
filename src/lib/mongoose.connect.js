const config = require("dotenv").config();
const mongoose = require("mongoose");

async function initializeDB() {
  return mongoose
    .connect(process.env.DB_URL, {
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
