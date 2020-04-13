const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiarySchema = new Schema({
  userId: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  photo: Buffer,
  created: {
    type: Date,
    default: Date.now
  },
  tag: {
    type: Array
    /*  match: /(#\w+)/ */
  }
});
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
module.exports = mongoose.model("diary", DiarySchema);
