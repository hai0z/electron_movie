const Noti = require("../../model/noti.schema.js");

class NotificationService {
  static async getUserNotifications(userUid) {
    return await Noti.find({ userUid })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();
  }

  static async markAllAsRead(userUid) {
    return await Noti.updateMany({ userUid }, { $set: { isRead: true } });
  }
}

module.exports = NotificationService;
