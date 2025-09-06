const mongoose = require("mongoose");

const BackUpSchema = new mongoose.Schema({
  userUid: String,
  appData: mongoose.Schema.Types.Mixed,
  watchHistory: mongoose.Schema.Types.Mixed,
  readHistory: mongoose.Schema.Types.Mixed,
  lastSync: Date,
});

module.exports = mongoose.model("backup", BackUpSchema);
