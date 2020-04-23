const { displaySearchResult } = require("../helpers");
const Diary = require("../../../models/diary.model");

async function findRecordByTag(ctx) {
  if (/#\S+/g.exec(ctx.message.text)) {
    const record = await Diary.find({
      userId: ctx.chat.id,
      tag: ctx.message.text,
    }).select({ text: 1, created: 1, _id: 1 });
    if (record.length !== 0) {
      displaySearchResult(ctx, record);
    } else {
      ctx.reply("You have no records with this tag 😰");
      ctx.scene.leave();
    }
  } else {
    ctx.reply("Invalid tag");
    ctx.scene.leave();
  }
}

module.exports = {
  findRecordByTag,
};
