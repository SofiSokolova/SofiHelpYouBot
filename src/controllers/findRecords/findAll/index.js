const Stage = require("telegraf").Stage;
const WizardScene = require("telegraf/scenes/wizard");
const { SCENES } = require("../../../../constants");
const { findRecById, countRecords } = require("./helpers");
const { displaySearchResult } = require("../helpers");
const { recAction } = require("../actions");
const { leave } = Stage;
const kb = require("../../../../keyboards");

const findAll = new WizardScene(
  SCENES.FIND_All,
  async (ctx) => {
    let record = await findRecById(ctx.chat.id, 0);
    let recLength = await countRecords(ctx);
    if (recLength !== 0) {
      await displaySearchResult(ctx, record, recLength);
      await ctx.wizard.next();
    } else {
      await ctx.reply("You have no records");
      await ctx.scene.leave();
    }
  },
  async (ctx) => {
    return ctx.scene.leave();
  }
);

findAll.leave(async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.chat.id,
    "You are welcome ❤",
    kb.menuKeyboard.open({ resize_keyboard: true })
  );
});

findAll.on("callback_query", async function (ctx) {
  try {
    let skipRec = JSON.parse(ctx.update.callback_query.data);
    let record = await findRecById(ctx.chat.id, parseInt(skipRec.action));
    let recLength = await countRecords(ctx);
    await recAction(ctx, record, recLength);
  } catch (err) {
    console.log(err);
    await ctx.scene.leave();
  }
});

findAll.command("cancel", leave());

module.exports = {
  findAll,
};
