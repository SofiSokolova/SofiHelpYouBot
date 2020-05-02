const Diary = require("../../../models/diary.model");

async function findRecordByDate(userId, startUserDate, endUserDate, skipRec) {
  const record = await Diary.find({
    userId: userId,
    created: { $gte: startUserDate, $lte: endUserDate },
  })
    .sort({ $natural: -1 })
    .skip(skipRec)
    .limit(1)
    .select({ text: 1, created: 1, _id: 1 });
  return record;
}

async function countRecords(userId, startUserDate, endUserDate) {
  let countRec = await Diary.countDocuments({
    userId: userId,
    created: { $gte: startUserDate, $lte: endUserDate },
  });
  return countRec;
}

module.exports = {
  findRecordByDate,
  countRecords,
};
