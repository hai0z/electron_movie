const mongoose = require("mongoose");

const UserDataSchema = new mongoose.Schema({
  name: String,
  userUid: String,
  appData: mongoose.Schema.Types.Mixed,
  watchHistory: mongoose.Schema.Types.Mixed,
  readHistory: mongoose.Schema.Types.Mixed,
  lastSync: Date,
  lockApp: {
    type: Boolean,
    default: false,
  },
  pin: {
    type: String,
    default: null,
  },
  recoverKey: {
    type: String,
    default: null,
  },
  havedPin: { type: Boolean, default: false },
});

module.exports = mongoose.model("userdata", UserDataSchema);
