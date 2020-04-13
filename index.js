// eslint-disable-next-line no-undef
const config = require("dotenv").config();
const { SCENES } = require("./constants");
const { BUTTONS } = require("./constants");
const TelegramBot = require("telegraf");
const { list } = require("./src/controllers/list");
const { record } = require("./src/controllers/record");
const { findByTag } = require("./src/controllers/findByTag");
const { findByDate } = require("./src/controllers/findByDate");
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
  const stage = new Stage([list, record, findByTag]);

  stage.register(list);
  stage.register(record);
  stage.register(findByTag);
  stage.register(findByDate);

  bot.use(session());
  bot.use(stage.middleware());

  bot.command("start", ctx =>
    ctx.reply(
      "How can I help you?",
      kb.menuKeyboard.open({ resize_keyboard: true })
    )
  );

  bot.on("message", async ctx => {
    console.log(ctx.message.text);
    switch (ctx.message.text) {
      case BUTTONS.CREATE_LIST:
        await ctx.scene.enter(SCENES.LIST);
        break;
      case BUTTONS.NEW_RECORD:
        await ctx.scene.enter(SCENES.RECORD);
        break;
      case BUTTONS.FIND:
        await ctx.reply(
          "Select search type",
          kb.findKeyboard.open({ resize_keyboard: true })
        );
        break;
      case BUTTONS.FIND_BY_TAG:
        await ctx.scene.enter(SCENES.FIND_BY_TAG);
        break;
        case BUTTONS.FIND_BY_DATE:
          await ctx.scene.enter(SCENES.FIND_BY_DATE);
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
/*
 *bot.onText(/1/, function (msg, match) {
 *var userId = msg.from.id;
 *var text = match[1];
 *var time = match[2];
 *
 *notes.push({ 'uid': userId, 'time': time, 'text': text });
 *
 *bot.sendMessage(userId, 'Отлично! Я обязательно напомню, если не сдохну :)');
 *});
 *
 *bot.on("polling_error", (err) => console.log(err));
 *
 *
 *
 *setInterval(function(){
 *for (var i = 0; i < notes.length; i++) {
 *  const curDate = new Date().getHours() + ':' + new Date().getMinutes();
 *  if (notes[i]['time'] === curDate) {
 *    bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['text'] + ' сейчас.');
 *    notes.splice(i, 1);
 *  }
 *}
 *}, 1000); */
