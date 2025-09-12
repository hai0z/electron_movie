const os = require("os");
const UserData = require("../../model/userData.schema.js");
const { logUserOpen, UserDaily } = require("../../model/userDaily.schema.js");
const DeviceIdManager = require("../utils/deviceId");
const crypto = require("crypto");
class UserService {
  static async initUser(userUid) {
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
  static async setLockApp() {
    const userUid = DeviceIdManager.getAppUniqueId();
    const user = await UserData.findOne({ userUid });
    if (user) {
      user.lockApp = true;
      await user.save();
    }
  }
  static async unsetLockApp() {
    const userUid = DeviceIdManager.getAppUniqueId();
    const user = await UserData.findOne({ userUid });
    if (user && user.lockApp) {
      user.lockApp = false;
      await user.save();
    }
  }
  static async setPin(pin) {
    const userUid = DeviceIdManager.getAppUniqueId();
    const user = await UserData.findOne({ userUid });
    if (user) {
      user.pin = crypto
        .createHash("sha256")
        .update(pin.toString())
        .digest("hex");
      user.recoverKey = crypto.randomBytes(16).toString("hex");
      user.havedPin = true;
      await user.save();
      return user.recoverKey;
    }
  }

  static async getRecoverKey() {
    const userUid = DeviceIdManager.getAppUniqueId();
    const user = await UserData.findOne({ userUid });
    if (user) {
      return user.recoverKey;
    }
  }

  static async verifyPin(pin) {
    const userUid = DeviceIdManager.getAppUniqueId();
    const user = await UserData.findOne({ userUid });
    if (user) {
      return (
        user.pin ===
        crypto.createHash("sha256").update(pin.toString()).digest("hex")
      );
    }
    return false;
  }

  static async checkRecoverKey(recoverKey) {
    const userUid = DeviceIdManager.getAppUniqueId();
    const user = await UserData.findOne({ userUid, recoverKey });
    if (user) {
      return true;
    }
    return false;
  }

  static async recoverPin(newPin) {
    const userUid = DeviceIdManager.getAppUniqueId();
    const user = await UserData.findOne({ userUid });
    if (user) {
      user.pin = crypto
        .createHash("sha256")
        .update(newPin.toString())
        .digest("hex");
      await user.save();
      return true;
    }
    return false;
  }

  static async changePin(newPin) {
    const userUid = DeviceIdManager.getAppUniqueId();
    const user = await UserData.findOne({ userUid });
    if (user) {
      user.pin = crypto
        .createHash("sha256")
        .update(newPin.toString())
        .digest("hex");
      await user.save();
      return true;
    }
    return false;
  }
}

module.exports = UserService;
