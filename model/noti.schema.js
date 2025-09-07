const mongoose = require("mongoose");

const NotiSchema = new mongoose.Schema({
  userUid: String,
  content: mongoose.Schema.Types.Mixed,
  timestamp: Date,
  isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model("noti", NotiSchema);
