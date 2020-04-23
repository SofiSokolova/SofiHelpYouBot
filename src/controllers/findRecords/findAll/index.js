const Stage = require("telegraf").Stage;
const WizardScene = require("telegraf/scenes/wizard");
const Diary = require("../../../models/diary.model");
const { SCENES } = require("../../../../constants");
const { findAllRec } = require("./helpers");
const { recAction } = require("../actions");
const { leave } = Stage;
const kb = require("../../../../keyboards");

const findAll = new WizardScene(
  SCENES.FIND_All,
  async (ctx) => {
    await findAllRec(ctx);
    return ctx.wizard.next();
  },
  async (ctx) => {
    return ctx.scene.leave();
  }
);

findAll.leave((ctx) => {
  ctx.telegram.sendMessage(
    ctx.chat.id,
    "You are welcome ❤",
    kb.menuKeyboard.open({ resize_keyboard: true })
  );
});

findAll.on("callback_query", async function (ctx) {
  const record = await Diary.find({
    userId: ctx.chat.id,
  })
    .sort({ $natural: -1 })
    .select({ text: 1, created: 1, _id: 1 });
  await recAction(ctx, record);
});

findAll.command("cancel", leave());

module.exports = {
  findAll,
};
