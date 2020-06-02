const config = require("dotenv").config();
const { SCENES } = require("../constants");
const { BUTTONS } = require("../constants");
const TelegramBot = require("telegraf");
const { list } = require("./controllers/list");
const { record } = require("./controllers/record");
const { findByTag } = require("./controllers/findRecords/findByTag");
const { findByDate } = require("./controllers/findRecords/findByDate");
const { findAll } = require("./controllers/findRecords/findAll");
const { weather } = require("./controllers/weather");
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const kb = require("../keyboards");

const options = {
  webHook: {
    port: process.env.PORT,
  },
};
const url =
  /* process.env.APP_URL || */ "https://telegram-bot-shybot.herokuapp.com:443";
const token = process.env.TOKEN;
const PORT = process.env.PORT || 3000;

const bot =
  process.env.NODE_ENV === "DEV"
    ? new TelegramBot(token, { polling: true })
    : new TelegramBot(token, options);

console.log(`Bot ${bot}`);
console.log(`Bot ${options}`);

bot.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});

const stage = new Stage([
  list,
  record,
  findByTag,
  findByDate,
  findAll,
  weather,
]);

stage.register(list);
stage.register(record);
stage.register(findByTag);
stage.register(findByDate);
stage.register(findAll);
stage.register(weather);

bot.use(session());
bot.use(stage.middleware());

bot.command("start", (ctx) =>
  ctx.reply(
    "How can I help you?",
    kb.menuKeyboard.open({ resize_keyboard: true })
  )
);

bot.on("message", async (ctx) => {
  switch (ctx.message.text) {
    case BUTTONS.CREATE_LIST:
      await ctx.scene.enter(SCENES.LIST);
      break;
    case BUTTONS.NEW_RECORD:
      await ctx.scene.enter(SCENES.RECORD);
      break;
    case BUTTONS.FIND:
      await ctx.reply(
        "Select search type ⬇",
        kb.findKeyboard.open({ resize_keyboard: true })
      );
      break;
    case BUTTONS.WEATHER:
      {
        await ctx.scene.enter(SCENES.WEATHER);
      }
      break;
    case BUTTONS.FIND_BY_TAG:
      await ctx.scene.enter(SCENES.FIND_BY_TAG);
      break;
    case BUTTONS.FIND_BY_DATE:
      await ctx.scene.enter(SCENES.FIND_BY_DATE);
      break;
    case BUTTONS.FIND_All:
      await ctx.scene.enter(SCENES.FIND_All);
      break;
    case BUTTONS.BACK:
      await ctx.reply(
        "How can I help you?",
        kb.menuKeyboard.open({ resize_keyboard: true })
      );
      break;
  }
});

bot.telegram.setWebhook(`${url}/${process.env.TOKEN}`);

bot.startWebhook(`/${process.env.TOKEN}`, null, 5000);

const webhookStatus = Telegram.getWebhookInfo();
console.log("Webhook status", webhookStatus);

/* bot.launch(); */

module.exports = bot;
