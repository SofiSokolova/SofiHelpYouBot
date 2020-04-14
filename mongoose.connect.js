const config = require("dotenv").config();
const mongoose = require("mongoose");
mongoose
  .connect(config.parsed.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
