const Stage = require("telegraf").Stage;
const WizardScene = require("telegraf/scenes/wizard");
const { SCENES } = require("../../../../constants");
const { findRecordByTag, countRecords } = require("./helpers");
const { displaySearchResult } = require("../helpers");
const { recAction } = require("../actions");
const { leave } = Stage;
const kb = require("../../../../keyboards");

let userTag;

const findByTag = new WizardScene(
  SCENES.FIND_BY_TAG,
  async (ctx) => {
    await ctx.reply(`Send me a tag in the format #tag`);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (/#\S+/g.exec(ctx.message.text)) {
      userTag = ctx.message.text;
      let record = await findRecordByTag(ctx.chat.id, userTag, 0);
      let recLength = await countRecords(ctx.chat.id, userTag);
      if (recLength !== 0) {
        displaySearchResult(ctx, record, recLength);
        return ctx.wizard.next();
      } else {
        ctx.reply("You have no records with this tag 😰");
        ctx.scene.leave();
      }
    } else {
      ctx.reply("Invalid tag");
      ctx.scene.leave();
    }
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
  try {
    let skipRec = JSON.parse(ctx.update.callback_query.data);
    let record = await findRecordByTag(
      ctx.chat.id,
      userTag,
      parseInt(skipRec.action)
    );
    let recLength = await countRecords(ctx.chat.id, userTag);
    await recAction(ctx, record, recLength);
  } catch (err) {
    console.log(err);
    await ctx.scene.leave();
  }
});

findByTag.command("cancel", leave());

module.exports = {
  findByTag,
};
