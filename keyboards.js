const { Extra, Markup } = require("telegraf");
const { ReplyKeyboard } = require("telegram-keyboard-wrapper");
const { BUTTONS } = require("./constants");

const menuKeyboard = new ReplyKeyboard()
  .addRow(BUTTONS.CREATE_LIST, BUTTONS.NEW_RECORD)
  .addRow(BUTTONS.FIND);


const findKeyboard = new ReplyKeyboard().addRow(BUTTONS.FIND_BY_TAG, BUTTONS.FIND_BY_DATE).addRow(BUTTONS.BACK)



module.exports = {
  menuKeyboard,
  findKeyboard,

};
