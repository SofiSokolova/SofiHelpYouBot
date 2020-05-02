const Diary = require("../../../models/diary.model");

async function findAllRec(userId, skipRec) {
  let record = await Diary.find({
    userId: userId,
  })
    .sort({ $natural: -1 })
    .skip(skipRec)
    .limit(1)
    .select({ text: 1, created: 1, _id: 1 });
  return record;
}

async function countRecords(ctx) {
  let countRec = await Diary.countDocuments({ userId: ctx.chat.id });
  return countRec;
}

module.exports = {
  findAllRec,
  countRecords,
};
