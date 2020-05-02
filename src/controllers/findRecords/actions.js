const { editMessageWithUserRec } = require("./helpers");
const { INLINE_BUTTONS } = require("../../../constants");
const Diary = require("./../../models/diary.model");

const recAction = async (ctx, record, recLength) => {
  let callback = ctx.update.callback_query.data;
  if (callback.match(INLINE_BUTTONS.DELETE_RECORD)) {
    let options = await JSON.parse(callback);
    await Diary.findOneAndDelete({ _id: record[0]._id });
    recLength--;

    await editMessageWithUserRec(
      ctx,
      parseInt(options.action),
      record,
      recLength
    );
  } else if (callback.match(INLINE_BUTTONS.DELETE_FIRST_RECORD)) {
    let options = await JSON.parse(callback);
    await Diary.findOneAndDelete({ _id: record[0]._id });
    recLength--;

    await editMessageWithUserRec(
      ctx,
      parseInt(options.action) - 1,
      record,
      recLength
    );
  } else if (callback.match(INLINE_BUTTONS.DELETE_LAST_REC)) {
    await Diary.findOneAndDelete({ _id: record[0]._id });
    recLength--;

    await ctx.telegram.deleteMessage(
      ctx.chat.id,
      ctx.update.callback_query.message.message_id
    );
    return ctx.scene.leave();
  } else if (callback.match(INLINE_BUTTONS.HIDE_REC)) {
    await ctx.telegram.deleteMessage(
      ctx.chat.id,
      ctx.update.callback_query.message.message_id
    );
    return ctx.scene.leave();
  } else {
    let options = await JSON.parse(callback);
    await editMessageWithUserRec(
      ctx,
      parseInt(options.action),
      record,
      recLength
    );
  }
};

module.exports = {
  recAction,
};
