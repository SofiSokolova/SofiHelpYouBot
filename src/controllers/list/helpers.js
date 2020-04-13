const { Extra, Markup } = require("telegraf");
const { ReplyKeyboard } = require("telegram-keyboard-wrapper");
const { BUTTONS } = require("../../../constants");

const User = require("../../models/user.model");

const deleteListKeyboard = new ReplyKeyboard().addRow("Delete list");

function getListInlineKeyboard() {
  return Markup.inlineKeyboard([
    Markup.callbackButton("✅", "edit"),
    Markup.callbackButton("❌", "delete")
  ]);
}

function strikeThrough(text) {
  return text
    .split("")
    .map(char => char + "\u0336")
    .join("");
}

async function addUserList(chatId, msgId) {
  const user = await User.findOneAndUpdate(
    { telegramId: chatId },
    { $addToSet: { list: msgId } },
    {
      new: true,
      upsert: true
    }
  );
  await user.save();
}

async function cleanListMessages(ctx) {
  const user = await User.findOne({ telegramId: ctx.chat.id });
  if (ctx.message.text === BUTTONS.DELETE_LIST) {
    await Promise.all(
      user.list.map(async item => {
        await ctx.telegram.deleteMessage(ctx.chat.id, item);
      })
    );
    user.list = [];
    await user.save();
  }
}

async function deleteListItem(chatId, msgId) {
  const user = await User.findOneAndUpdate(
    { telegramId: chatId },
    { $pull: { list: msgId } },
    { new: true }
  );
  return user;
}

async function getListMessages(ctx) {
  let splitMessage = ctx.message.text.split("\n");
  if (ctx.message.text !== BUTTONS.DELETE_LIST) {
    await Promise.all(
      splitMessage.map(async msg => {
        let botMsg = await ctx.telegram.sendMessage(
          ctx.chat.id,
          msg,
          Extra.markup(getListInlineKeyboard)
        );
        await addUserList(ctx.chat.id, botMsg.message_id);
      })
    );
  }
  await ctx.telegram.sendMessage(
    ctx.chat.id,
    `Tap to button "Delete list" to delete all list `,
    deleteListKeyboard.open({ resize_keyboard: true })
  );
}

module.exports = {
  getListMessages,
  cleanListMessages,
  strikeThrough,
  getListInlineKeyboard,
  deleteListKeyboard,
  deleteListItem
};
