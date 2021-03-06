const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  telegramId: {
    type: Number,
    required: true,
    index: { unique: true },
  },
  list: [
    {
      type: String,
      default: [],
    },
  ],
  userTag: [
    {
      type: String,
      default: [],
    },
  ],
  userDate: [
    {
      type: String,
      default: [],
    },
  ],
  startDate: [
    {
      type: String,
      default: [],
    },
  ],
  endDate: [
    {
      type: String,
      default: [],
    },
  ],
});

module.exports = mongoose.model("users", UserSchema);
