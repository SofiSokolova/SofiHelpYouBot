const Stage = require("telegraf").Stage;
const WizardScene = require("telegraf/scenes/wizard");
const { SCENES } = require("../../../../constants");
const { findRecordByDate, countRecords } = require("./helpers");
const { displaySearchResult } = require("../helpers");
const { recAction } = require("../actions");
const { leave } = Stage;
const moment = require("moment");
const kb = require("../../../../keyboards");
const User = require("../../../models/user.model");



const findByDate = new WizardScene(
  SCENES.FIND_BY_DATE,
  async (ctx) => {
    await ctx.reply(`Send me a date in the format YYYY-MM-DD`);
    await ctx.wizard.next();
  },
  async (ctx) => {
    if (moment(ctx.message.text).isValid()) {
     const startUserDate = moment(ctx.message.text).format("YYYY-MM-DD HH:mm");
     const endUserDate = moment(ctx.message.text)
        .add(23, "hours")
        .add(59, "minutes")
        .format("YYYY-MM-DD HH:mm");
      const user = await User.findOneAndUpdate(
        { telegramId: ctx.chat.id },
        {
          $addToSet: {
            userDate: ctx.message.text,
            startDate: startUserDate,
            endDate: endUserDate,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );
      await user.save();

      let record = await findRecordByDate(
        ctx.chat.id,
        startUserDate,
        endUserDate,
        0
      );
      let recLength = await countRecords(
        ctx.chat.id,
        startUserDate,
        endUserDate
      );
      if (recLength !== 0) {
        await displaySearchResult(ctx, record, recLength);
        await ctx.wizard.next();
      } else {
        ctx.reply("You have no records on this day");
        ctx.scene.leave();
      }
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
  const user = await User.findOne(
    { telegramId: ctx.chat.id },
  );
  user.userDate = [];
  user.startDate = [];
  user.endDate = [];
  await user.save();
  await ctx.telegram.sendMessage(
    ctx.chat.id,
    "You are welcome ❤",
    kb.menuKeyboard.open({ resize_keyboard: true })
  );
});

findByDate.on("callback_query", async function (ctx) {
  try {
    let skipRec = JSON.parse(ctx.update.callback_query.data);
    const user = await User.findOne(
      { telegramId: ctx.chat.id });
    let record = await findRecordByDate(
      ctx.chat.id,
      user.startDate,
      user.endDate,
      parseInt(skipRec.action)
    );
    let recLength = await countRecords(ctx.chat.id, user.startDate, user.endDate);
    await recAction(ctx, record, recLength);
  } catch (err) {
    console.log(err);
    await ctx.scene.leave();
  }
});

findByDate.command("cancel", leave());

module.exports = {
  findByDate,
};
