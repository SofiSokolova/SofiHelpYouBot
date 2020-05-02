const Stage = require("telegraf").Stage;
const WizardScene = require("telegraf/scenes/wizard");
const { SCENES } = require("../../../../constants");
const { findRecordByDate, countRecords } = require("./helpers");
const { displaySearchResult } = require("../helpers");
const { recAction } = require("../actions");
const { leave } = Stage;
const moment = require("moment");
const kb = require("../../../../keyboards");

let userDate;
let startUserDate;
let endUserDate;

const findByDate = new WizardScene(
  SCENES.FIND_BY_DATE,
  async (ctx) => {
    await ctx.reply(`Send me a date in the format YYYY-MM-DD`);
    await ctx.wizard.next();
  },
  async (ctx) => {
    if (moment(ctx.message.text).isValid()) {
      userDate = ctx.message.text;
      startUserDate = moment(userDate).format("YYYY-MM-DD HH:mm");
      endUserDate = moment(userDate)
        .add(23, "hours")
        .add(59, "minutes")
        .format("YYYY-MM-DD HH:mm");
      let record = await findRecordByDate(ctx.chat.id, startUserDate, endUserDate,  0);
      let recLength = await countRecords(ctx.chat.id, startUserDate, endUserDate );
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
  await ctx.telegram.sendMessage(
    ctx.chat.id,
    "You are welcome ❤",
    kb.menuKeyboard.open({ resize_keyboard: true })
  );
});

findByDate.on("callback_query", async function (ctx) {
  try {
    let skipRec = JSON.parse(ctx.update.callback_query.data);
    let record = await findRecordByDate(ctx.chat.id, startUserDate, endUserDate, parseInt(skipRec.action));
    let recLength = await countRecords(ctx.chat.id, startUserDate, endUserDate );
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
