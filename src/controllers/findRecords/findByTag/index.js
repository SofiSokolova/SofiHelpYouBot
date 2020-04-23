const Stage = require("telegraf").Stage;
const WizardScene = require("telegraf/scenes/wizard");
const Diary = require("../../../models/diary.model");
const { SCENES } = require("../../../../constants");
const { findRecordByTag } = require("./helpers");
const { recAction } = require("../actions");
const { leave } = Stage;
const kb = require("../../../../keyboards");
const findByTag = new WizardScene(
  SCENES.FIND_BY_TAG,
  async (ctx) => {
    await ctx.reply(`Send me a tag in the format #tag`);
    return ctx.wizard.next();
  },
  async (ctx) => {
    await findRecordByTag(ctx);
    return ctx.wizard.next();
  },
  async (ctx) => {
    return ctx.scene.leave();
  }
);

findByTag.leave((ctx) => {
  ctx.telegram.sendMessage(
    ctx.chat.id,
    `You are welcome ❤`,
    kb.menuKeyboard.open({ resize_keyboard: true })
  );
});

findByTag.on("callback_query", async function (ctx) {
  let recordTag = /#\S+/g.exec(ctx.update.callback_query.message.text);
  const record = await Diary.find({
    userId: ctx.chat.id,
    tag: recordTag,
  });
  await recAction(ctx, record);
});

findByTag.command("cancel", leave());

module.exports = {
  findByTag,
};
