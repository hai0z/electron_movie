const os = require("os");
const UserData = require("../../model/userData.schema.js");
const { connectDB } = require("../../config/db.js");
const { logUserOpen, UserDaily } = require("../../model/userDaily.schema.js");
const DeviceIdManager = require("../utils/deviceId");

class UserService {
  static async initUser(userUid) {
    await connectDB();

    let user = await UserData.findOne({ userUid });
    if (user) {
      return user;
    }

    user = await UserData.create({
      userUid,
      name: os.userInfo().username,
      appData: {},
      readHistory: {},
      watchHistory: {},
    });
    return user;
  }

  static async getUserData(userUid) {
    const user = await UserData.findOne({ userUid });
    return user ? user._doc : null;
  }

  static async syncUserData(userUid, clientData) {
    const user = await UserData.findOneAndUpdate(
      { userUid },
      {
        $set: {
          appData: clientData.appData,
          readHistory: clientData.readHistory,
          watchHistory: clientData.watchHistory,
          lastSync: new Date(),
        },
      },
      { new: true }
    );
    return user._doc;
  }

  static async logAppOpen() {
    const userUid = DeviceIdManager.getAppUniqueId();
    return logUserOpen(userUid);
  }
  static async getOpenApp() {
    const userUid = DeviceIdManager.getAppUniqueId();
    const data = await UserDaily.find({ userUid }).lean();
    return data;
  }
}

module.exports = UserService;
