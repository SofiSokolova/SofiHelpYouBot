const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  telegramId: {
    type: Number,
    required: true,
    index: { unique: true },
  },
  list: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("users", UserSchema);
