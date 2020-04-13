const Stage = require("telegraf").Stage;
const WizardScene = require("telegraf/scenes/wizard");
const Diary = require("../../models/diary.model");
const { SCENES } = require("../../../constants");
const { INLINE_BUTTONS } = require("../../../constants");
const { findRecordByDate, getPagination } = require("./helpers");
const { leave } = Stage;
const moment = require("../../../node_modules/moment");
const kb = require("../../../keyboards");

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
      ctx.reply(`Invalid date`);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    return ctx.scene.leave();
  }
);

findByDate.leave((ctx) => {
  ctx.telegram.sendMessage(
    ctx.chat.id,
    'You are welcome ❤',
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

  let options = await JSON.parse(ctx.update.callback_query.data);
  let editOptions = Object.assign(
    {},
    await getPagination(parseInt(options.action), record.length),
    {
      chat_id: ctx.chat.id,
      message_id: ctx.update.callback_query.message.message_id,
    }
  );
  if (ctx.update.callback_query.data.match(INLINE_BUTTONS.DELETE_RECORD)) {
    let recordId = ctx.update.callback_query.message.text
      .split("id: ")
      .slice(1, 2);

    await Diary.findOneAndDelete({ _id: recordId })
    record.pop();

    editOptions = Object.assign(
      {},
      await getPagination(parseInt(options.action), record.length),
      {
        chat_id: ctx.chat.id,
        message_id: ctx.update.callback_query.message.message_id,
      }
    );
    await ctx.editMessageText(
     ` ${record[parseInt(options.action)].text} `+
       `\n` +
        `${record[parseInt(options.action)].created
          .toString()
          .split("G")
          .slice(0, 1)}` +
        `\n` +
        `id:` +
       ` ${record[parseInt(options.action)]._id}`,
      editOptions
    );
  } else if (
    ctx.update.callback_query.data.match(INLINE_BUTTONS.DELETE_LAST_REC)
  ) {
    let recordId = ctx.update.callback_query.message.text
      .split("id: ")
      .slice(1, 2);

    await Diary.findOneAndDelete({ _id: recordId }).then(() => {
      record.pop();
    });
    await ctx.telegram.deleteMessage(
      ctx.chat.id,
      ctx.update.callback_query.message.message_id
    );
    return ctx.scene.leave();
  } else if (ctx.update.callback_query.data.match(INLINE_BUTTONS.HIDE_REC)) {
    await ctx.telegram.deleteMessage(
      ctx.chat.id,
      ctx.update.callback_query.message.message_id
    );
    return ctx.scene.leave();
  } else {
    await ctx.editMessageText(
        ` ${record[parseInt(options.action)].text} `+
          `\n` +
           `${record[parseInt(options.action)].created
             .toString()
             .split("G")
             .slice(0, 1)}` +
           `\n` +
           `id:` +
          ` ${record[parseInt(options.action)]._id}`,
         editOptions
       );
  }
});

findByDate.command("cancel", leave());

module.exports = {
  findByDate,
};