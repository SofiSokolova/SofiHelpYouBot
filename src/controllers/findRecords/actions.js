const { getPagination } = require("./helpers");
const { INLINE_BUTTONS } = require("../../../constants");
const Diary = require("./../../models/diary.model");

async function recAction(ctx, record) {
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

    await Diary.findOneAndDelete({ _id: recordId }).then(() => {
      record.pop();
    });
    editOptions = Object.assign(
      {},
      await getPagination(parseInt(options.action), record.length),
      {
        chat_id: ctx.chat.id,
        message_id: ctx.update.callback_query.message.message_id,
      }
    );
    await ctx.editMessageText(
      `${record[parseInt(options.action)].text}` +
        `\n` +
        `${record[parseInt(options.action)].created
          .toString()
          .split("G")
          .slice(0, 1)}` +
        `\n` +
        `id: ` +
        `${record[parseInt(options.action)]._id}`,
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
      `${record[parseInt(options.action)].text}` +
        `\n` +
        `${record[parseInt(options.action)].created
          .toString()
          .split("G")
          .slice(0, 1)}` +
        `\n` +
        `id: ` +
        `${record[parseInt(options.action)]._id}`,
      editOptions
    );
  }
}

module.exports = {
  recAction,
};
