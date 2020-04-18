const { ReplyKeyboard } = require("telegram-keyboard-wrapper");
const { BUTTONS } = require("./constants");

const menuKeyboard = new ReplyKeyboard()
  .addRow(BUTTONS.CREATE_LIST, BUTTONS.NEW_RECORD)
  .addRow( BUTTONS.WEATHER, BUTTONS.FIND);

const findKeyboard = new ReplyKeyboard()
  .addRow(BUTTONS.FIND_BY_TAG, BUTTONS.FIND_BY_DATE)
  .addRow(BUTTONS.FIND_All)
  .addRow(BUTTONS.BACK);

module.exports = {
  menuKeyboard,
  findKeyboard,
};
