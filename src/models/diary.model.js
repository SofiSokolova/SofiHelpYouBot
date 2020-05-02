const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/* const mongoosePaginate = require('mongoose-paginate-v2'); */
const DiarySchema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  tag: [
    {
      type: String,
      default: [],
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});
/* DiarySchema.plugin(mongoosePaginate); */
module.exports = mongoose.model("diary", DiarySchema);
