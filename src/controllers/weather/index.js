/* const config = require("dotenv").config();  */
/* const axios = require('axios'); */
/* const keys = config.parsed.API_KEYS;  */

const Stage = require("telegraf").Stage;
const { SCENES } = require("../../../constants");
const WizardScene = require("telegraf/scenes/wizard");
const kb = require("../../../keyboards");
const { BUTTONS } = require("../../../constants");
const { sendLocationKeyboard, getWeather } = require("./helpers");

const { leave } = Stage;

const weather = new WizardScene(
  SCENES.WEATHER,
  (ctx) => {
    ctx.reply(
      "🤔 where are you?",
      sendLocationKeyboard.open({ resize_keyboard: true })
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    return ctx.scene.leave();
  }
);

weather.on("location", async (ctx) => {
  await getWeather(ctx);
  await ctx.scene.leave();
});

weather.hears(BUTTONS.BACK, async (ctx) => {
  return ctx.scene.leave();
});

weather.leave((ctx) => {
  ctx.telegram.sendMessage(
    ctx.chat.id,
    `Please come back soon ❤`,
    kb.menuKeyboard.open({ resize_keyboard: true })
  );
});

weather.command("cancel", leave());

module.exports = {
  weather,
};
