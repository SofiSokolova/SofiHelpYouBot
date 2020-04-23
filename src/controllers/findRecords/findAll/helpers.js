const { displaySearchResult } = require("../helpers");
const Diary = require("../../../models/diary.model");

async function findAllRec(ctx) {
  const record = await Diary.find({
    userId: ctx.chat.id,
  })
    .sort({ $natural: -1 })
    .select({ text: 1, created: 1, _id: 1 });
  if (record.length !== 0) {
    displaySearchResult(ctx, record);
  } else {
    ctx.reply("You have no records");
    ctx.scene.leave();
  }
}

module.exports = {
  findAllRec,
};
