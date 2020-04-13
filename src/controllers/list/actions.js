const {
  strikeThrough,
  getListInlineKeyboard,
  deleteListItem
} = require("./helpers");
const { Extra } = require("telegraf");
require("../../models/user.model");

const strikeAction = async ctx => {
  await ctx.editMessageText(
    strikeThrough(ctx.update.callback_query.message.text),
    Extra.markup(getListInlineKeyboard)
  );
};

const deleteAction = async ctx => {
  await deleteListItem(
    ctx.chat.id,
    ctx.update.callback_query.message.message_id
  );
  await ctx.telegram.deleteMessage(
    ctx.chat.id,
    ctx.update.callback_query.message.message_id
  );
};

module.exports = {
  strikeAction,
  deleteAction
};
