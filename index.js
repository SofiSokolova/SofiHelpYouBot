const config = require("dotenv").config();
const { SCENES } = require("./constants");
const { BUTTONS } = require("./constants");
const TelegramBot = require("telegraf");
const { list } = require("./src/controllers/list");
const { record } = require("./src/controllers/record");
const { findByTag } = require("./src/controllers/findRecords/findByTag");
const { findByDate } = require("./src/controllers/findRecords/findByDate");
const { findAll } = require("./src/controllers/findRecords/findAll");
const { weather } = require("./src/controllers/weather");
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const mongoose = require("mongoose");
const kb = require("./keyboards");
require("./mongoose.connect");

const token = config.parsed.TOKEN;
const db = mongoose.connection;

require("./src/models/user.model");
require("./src/models/diary.model");

db.on("open", () => {
  const bot = new TelegramBot(token, { polling: true });
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
  bot.launch();
});
