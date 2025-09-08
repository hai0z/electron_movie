// services/recommendService.js

const Video = require("../../model/movie.schema");

const HistoryItem = require("../../model/userData.schema");
const Actor = require("../../model/actor.schema");

// Định nghĩa đường dẫn lưu model
async function recommendFromDB(userUid) {
  const userHistory = await HistoryItem.findOne({
    userUid,
  }).lean();

  let watchedIds;

  if (userHistory.watchHistory?.length <= 0) {
    watchedIds = await Video.aggregate([
      { $match: { actors: { $exists: true, $ne: [] } } }, // mảng có phần tử
      { $sample: { size: 10 } },
    ]);
  }

  watchedIds = userHistory.watchHistory.map((h) => h.id);

  let allActors;

  allActors = [
    ...new Set(
      userHistory.watchHistory
        .filter((i) => i.id !== undefined)
        .flatMap((h) => h.actor?.split(",").map((a) => a.trim()))
    ),
  ];
  const actorHasInDb = await Actor.find({
    name: { $in: allActors },
  });

  if (allActors.length <= 0 || actorHasInDb.length <= 4) {
    const allActorsDocs = await Actor.aggregate([{ $sample: { size: 10 } }]);

    allActors = [...allActors, ...allActorsDocs.map((actor) => actor.name)];
  }

  // Query video có tag/actor/type trùng với lịch sử xem, exclude watched
  const candidates = await Video.find({
    id: { $nin: watchedIds },
    $or: [{ actors: { $in: allActors } }],
    actors: { $exists: true, $not: { $size: 0 } },
  }).lean();

  return candidates.sort(() => Math.random() - 0.5).slice(0, 8);
}

module.exports = {
  recommendFromDB,
};
