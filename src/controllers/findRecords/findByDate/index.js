const Stage = require("telegraf").Stage;
const WizardScene = require("telegraf/scenes/wizard");
const Diary = require("../../../models/diary.model");
const { SCENES } = require("../../../../constants");
const { findRecordByDate } = require("./helpers");
const { recAction } = require("../actions");
const { leave } = Stage;
const moment = require("moment");
const kb = require("../../../../keyboards");

let userDate;

const findByDate = new WizardScene(
  SCENES.FIND_BY_DATE,
  async (ctx) => {
    await ctx.reply(`Send me a date in the format YYYY-MM-DD`);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (moment(ctx.message.text).isValid()) {
      userDate = ctx.message.text;
      await findRecordByDate(ctx);
      return ctx.wizard.next();
    } else {
      await ctx.reply(`Invalid date`);
      await ctx.scene.leave();
    }
  },
  async (ctx) => {
    return ctx.scene.leave();
  }
);

findByDate.leave(async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.chat.id,
    "You are welcome ❤",
    kb.menuKeyboard.open({ resize_keyboard: true })
  );
});

findByDate.on("callback_query", async function (ctx) {
  let startDate = moment(userDate).format("YYYY-MM-DD HH:mm");
  let endDate = moment(userDate)
    .add(23, "hours")
    .add(59, "minutes")
    .format("YYYY-MM-DD HH:mm");

  const record = await Diary.find({
    userId: ctx.chat.id,
    created: { $gte: startDate, $lte: endDate },
  }).select({ text: 1, created: 1, _id: 1 });
  await recAction(ctx, record);
});

findByDate.command("cancel", leave());

module.exports = {
  findByDate,
};
