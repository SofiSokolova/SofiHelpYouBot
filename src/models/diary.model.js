const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiarySchema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  tag: {
    type: Array,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("diary", DiarySchema);
