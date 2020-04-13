const Stage = require("telegraf").Stage;
const { SCENES } = require("../../../constants");
const WizardScene = require("telegraf/scenes/wizard");
const kb = require("../../../keyboards");
const { strikeAction, deleteAction } = require("./actions");
const {
  getListMessages,
  cleanListMessages,
} = require("./helpers");

const { leave } = Stage;
const list = new WizardScene(
  SCENES.LIST,
  ctx => {
    ctx.reply(
      "Hi, glad to see you.\nSend me a to-do list in the format: \nHomework\nCinema\nWrite an essay\netc."
    );
    return ctx.wizard.next();
  },
  async ctx => {
    getListMessages(ctx);
    return ctx.wizard.next();
  },
  async ctx => {
    cleanListMessages(ctx);
    return ctx.scene.leave();
  }
);

list.leave(ctx => {
  ctx.telegram.sendMessage(
    ctx.chat.id,
    `I hope to see you later `,
    kb.menuKeyboard.open({ resize_keyboard: true })
  );
});

list.command("cancel", leave());
list.action(/edit/, strikeAction);
list.action(/delete/, deleteAction);

module.exports = {
  list
};
