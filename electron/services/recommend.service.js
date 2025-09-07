// services/recommendService.js

const Video = require("../../model/movie.schema");

const HistoryItem = require("../../model/userData.schema");

const { connectDB } = require("../../config/db");

// Định nghĩa đường dẫn lưu model
async function recommendFromDB(userUid) {
  await connectDB();
  const userHistory = await HistoryItem.findOne({
    userUid,
  }).lean();

  const watchedIds = userHistory.watchHistory.map((h) => h.id);

  const allActors = [
    ...new Set(
      userHistory.watchHistory
        .filter((i) => i.id !== undefined)
        .flatMap((h) => h.actor?.split(",").map((a) => a.trim()))
    ),
  ];

  // Query video có tag/actor/type trùng với lịch sử xem, exclude watched
  const candidates = await Video.find({
    id: { $nin: watchedIds },
    $or: [{ actors: { $in: allActors } }],
  }).lean();

  return candidates.sort(() => Math.random() - 0.5).slice(0, 8);
}

module.exports = {
  recommendFromDB,
};
