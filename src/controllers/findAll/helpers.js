const { INLINE_BUTTONS } = require("../../../constants");
const Diary = require("../../models/diary.model");
const moment = require('../../../node_modules/moment');

async function getPagination(current, recLength) {
  let keys = [];
  let deleteKey = [];

  if (current > 0) {
    keys.push({
      text: `<<`,
      callback_data: JSON.stringify({
        type: "pre",
        action: (current - 1).toString()
      })
    });
  }

  if (current == 0 && recLength - 1 == 0) {
    deleteKey.push({
      text: `Delete this record`,
      callback_data: JSON.stringify({
        type: INLINE_BUTTONS.DELETE_LAST_REC
      })
    });
  }

  keys.push({
    text: `${current + 1}`,
    callback_data: JSON.stringify({
      type: "now",
      action: current.toString()
    })
  });

  if (current !== 0 && current == recLength - 1) {
    deleteKey.push({
      text: `Delete this record`,
      callback_data: JSON.stringify({
        type: INLINE_BUTTONS.DELETE_RECORD,
        action: (current - 1).toString()
      })
    });
  }
  if (current !== recLength - 1) {
    keys.push({
      text: `>>`,
      callback_data: JSON.stringify({
        type: "next",
        action: (current + 1).toString()
      })
    });
    deleteKey.push({
      text: `Delete this record`,
      callback_data: JSON.stringify({
        type: INLINE_BUTTONS.DELETE_RECORD,
        action: (current + 1).toString()
      })
    });
  }

  deleteKey.push({
    text: `Hide it`,
    callback_data: JSON.stringify({
      type: "hide"
    })
  });

  return {
    reply_markup: JSON.stringify({
      inline_keyboard: [keys, deleteKey]
    })
  };
}


async function findRecordByDate(ctx) {

let startDate = moment(ctx.message.text).format('YYYY-MM-DD HH:mm')
let endDate =  moment(ctx.message.text).add(23, 'hours').add(59, 'minutes').format('YYYY-MM-DD HH:mm')

const record = await Diary.find({
  userId: ctx.chat.id,
  created: { $gte: startDate, $lte: endDate }
})
  .select({ text: 1, created: 1, _id: 1 });
  console.log(record)
  if (record.length !== 0) {
    displaySearchResult(ctx, record);
  } else {
    ctx.reply("You have no records on this day");
    ctx.scene.leave();
  }
}

async function displaySearchResult(ctx, searchResult) {
  ctx.reply(
    `${searchResult[0].text}\n${searchResult[0].created
      .toString()
      .split("G")
      .slice(0, 1)} \nid: ${searchResult[0]._id}`,
    await getPagination(0, searchResult.length)
  );
}

module.exports = {
  findRecordByDate,
  displaySearchResult,
  getPagination
};
