const mongoose = require("mongoose");

const UserDailySchema = new mongoose.Schema({
  userUid: { type: String },
  date: { type: String }, // "2025-09-07"
  count: { type: Number, default: 0 },
});
const UserDaily = mongoose.model("UserDaily", UserDailySchema);

async function logUserOpen(userId) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Tìm log ngày hôm nay
  const log = await UserDaily.findOne({ userUid: userId, date: today });

  if (log) {
    log.count += 1;
    await log.save();
  } else {
    await UserDaily.create({ userUid: userId, date: today, count: 1 });
  }
}

module.exports = UserDaily;
module.exports = {
  logUserOpen,
};
