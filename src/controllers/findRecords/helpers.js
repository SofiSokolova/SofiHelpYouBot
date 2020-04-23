const { INLINE_BUTTONS } = require("../../../constants");
const { BUTTONS } = require("../../../constants");

async function getPagination(current, recLength) {
  let keys = [];
  let deleteKey = [];

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

  if (current !== 0 && current == recLength - 1) {
    deleteKey.push({
      text: BUTTONS.DELETE_THIS_REC,
      callback_data: JSON.stringify({
        type: INLINE_BUTTONS.DELETE_RECORD,
        action: (current - 1).toString(),
      }),
    });
  }
  if (current !== recLength - 1) {
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
  getPagination,
  displaySearchResult,
};
