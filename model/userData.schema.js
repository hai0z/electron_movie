const mongoose = require("mongoose");

const UserDataSchema = new mongoose.Schema({
  name: String,
  userUid: String,
  appData: mongoose.Schema.Types.Mixed,
  watchHistory: mongoose.Schema.Types.Mixed,
  readHistory: mongoose.Schema.Types.Mixed,
  lastSync: Date,
});

module.exports = mongoose.model("userdata", UserDataSchema);
