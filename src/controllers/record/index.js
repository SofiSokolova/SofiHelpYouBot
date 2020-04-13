const Stage = require("telegraf").Stage;
const { SCENES } = require("../../../constants");
const WizardScene = require("telegraf/scenes/wizard");
const kb = require("../../../keyboards");
const {
  recordToDiary,
  deleteMessageKeyboard,
  deleteUserMessage
} = require("./helpers");

const { leave } = Stage;
const record = new WizardScene(
  SCENES.RECORD,
  async ctx => {
    ctx.reply(
      `Write me what happened to you today. For example:\n "Today I'm SO happy #happy #theBestDayOfMyLife"\nIn the future, you can find this message by tag`
    );
    return ctx.wizard.next();
  },
  async ctx => {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      "Press the button and I'll delete your message from here, but I'll save it in my memory until you need it",
      deleteMessageKeyboard.open({ resize_keyboard: true })
    );
    recordToDiary(ctx);
    return ctx.wizard.next();
  },
  async ctx => {
    deleteUserMessage(ctx);
    return ctx.scene.leave();
  }
);

record.leave(ctx => {
  ctx.telegram.sendMessage(
    ctx.chat.id,
    `I will keep it in my memory for you`,
    kb.menuKeyboard.open({ resize_keyboard: true })
  );
});

record.command("cancel", leave());

module.exports = {
  record
};
