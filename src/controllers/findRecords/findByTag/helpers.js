const Diary = require("../../../models/diary.model");

async function findRecordByTag(userId, userTag, skipRec) {
  const record = await Diary.find({
    userId: userId,
    tag: userTag,
  })
    .sort({ $natural: -1 })
    .skip(skipRec)
    .limit(1)
    .select({ text: 1, created: 1, _id: 1 });
  return record;
}

async function countRecords(userId, userTag) {
  let countRec = await Diary.countDocuments({ userId: userId, tag: userTag });
  return countRec;
}

module.exports = {
  findRecordByTag,
  countRecords,
};
