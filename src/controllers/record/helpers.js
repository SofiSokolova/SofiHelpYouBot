require("../../models/diary.model");
const { BUTTONS } = require("../../../constants");
const Diary = require("../../models/diary.model");
const { ReplyKeyboard } = require("telegram-keyboard-wrapper");

const deleteMessageKeyboard = new ReplyKeyboard().addRow(
  BUTTONS.DELETE_MESSAGE
);

async function deleteUserMessage(ctx) {
  if (ctx.message.text === BUTTONS.DELETE_MESSAGE) {
    await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id - 1);
    await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id - 2);
  }
}

async function recordToDiary(ctx) {
  const toDiary = new Diary({
    userId: ctx.chat.id,
    text: ctx.message.text,
    tag: ctx.message.text.match(/#\S+/g)
  });
  await toDiary.save();
}

module.exports = {
  recordToDiary,
  deleteMessageKeyboard,
  deleteUserMessage
};
