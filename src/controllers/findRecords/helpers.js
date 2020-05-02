const { INLINE_BUTTONS } = require("../../../constants");
const { BUTTONS } = require("../../../constants");

async function getPagination(current, recLength) {
  let keys = [];
  let deleteKey = [];
  console.log(`tak blet ya neponyav ${current}`);

  if (current > 0) {
    keys.push({
      text: `<<`,
      callback_data: JSON.stringify({
        type: "pre",
        action: (current - 1).toString(),
      }),
    });
  }

  if (current == 0 && recLength - 1 == 0) {
    deleteKey.push({
      text: BUTTONS.DELETE_THIS_REC,
      callback_data: JSON.stringify({
        type: INLINE_BUTTONS.DELETE_LAST_REC,
      }),
    });
  }

  keys.push({
    text: `${current + 1}`,
    callback_data: JSON.stringify({
      type: "now",
      action: current.toString(),
    }),
  });

  //if you remove the first record
  if (current == 0 && recLength - 1 !== 0) {
    keys.push({
      text: `>>`,
      callback_data: JSON.stringify({
        type: "next",
        action: (current + 1).toString(),
      }),
    });
    deleteKey.push({
      text: BUTTONS.DELETE_THIS_REC,
      callback_data: JSON.stringify({
        type: INLINE_BUTTONS.DELETE_FIRST_RECORD,
        action: (current + 1).toString(),
      }),
    });
  }

  if (current !== 0 && current == recLength - 1) {
    deleteKey.push({
      text: BUTTONS.DELETE_THIS_REC,
      callback_data: JSON.stringify({
        type: INLINE_BUTTONS.DELETE_RECORD,
        action: (current - 1).toString(),
      }),
    });
  }
  if (current !== 0 && current !== recLength - 1) {
    keys.push({
      text: `>>`,
      callback_data: JSON.stringify({
        type: "next",
        action: (current + 1).toString(),
      }),
    });
    deleteKey.push({
      text: BUTTONS.DELETE_THIS_REC,
      callback_data: JSON.stringify({
        type: INLINE_BUTTONS.DELETE_RECORD,
        action: (current + 1).toString(),
      }),
    });
  }

  deleteKey.push({
    text: `Hide it`,
    callback_data: JSON.stringify({
      type: "hide",
    }),
  });

  return {
    reply_markup: JSON.stringify({
      inline_keyboard: [keys, deleteKey],
    }),
  };
}

async function displaySearchResult(ctx, searchResult, recLength) {
  ctx.reply(
    `${searchResult[0].text}\n${searchResult[0].created.toUTCString()}`,
    await getPagination(0, recLength)
  );
}

async function editMessageWithUserRec(ctx, numOfRec, record, recLength) {
  let editOptions = Object.assign(
    {},
    await getPagination(numOfRec, recLength),
    {
      chat_id: ctx.chat.id,
      message_id: ctx.update.callback_query.message.message_id,
    }
  );
  await ctx.editMessageText(
    `${record[0].text}` + `\n` + `${record[0].created.toUTCString()}`,
    editOptions
  );
}

module.exports = {
  getPagination,
  displaySearchResult,
  editMessageWithUserRec,
};
