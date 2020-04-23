const { displaySearchResult } = require("../helpers");
const Diary = require("../../../models/diary.model");
const moment = require("moment");

async function findRecordByDate(ctx) {
  let startDate = moment(ctx.message.text).format("YYYY-MM-DD HH:mm");
  let endDate = moment(ctx.message.text)
    .add(23, "hours")
    .add(59, "minutes")
    .format("YYYY-MM-DD HH:mm");

  const record = await Diary.find({
    userId: ctx.chat.id,
    created: { $gte: startDate, $lte: endDate },
  }).select({ text: 1, created: 1, _id: 1 });
  if (record.length !== 0) {
    displaySearchResult(ctx, record);
  } else {
    ctx.reply("You have no records on this day");
    ctx.scene.leave();
  }
}

module.exports = {
  findRecordByDate,
};
