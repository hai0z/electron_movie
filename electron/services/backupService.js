const BackUp = require("../../model/backup.schema.js");

class BackupService {
  static async getBackupData(deviceId) {
    const data = await BackUp.find({ userUid: String(deviceId) })
      .sort({ lastSync: -1 })
      .limit(8)
      .lean();

    if (data.length === 0) {
      return {
        message: "device_id không tồn tại",
        success: false,
      };
    }

    const itemsWithSize = data.map((item) => {
      const jsonString = JSON.stringify(item);
      const sizeInBytes = new TextEncoder().encode(jsonString).length;
      const sizeKB = sizeInBytes / 1024;
      return {
        ...item,
        _sizeKB: sizeKB.toFixed(2),
      };
    });

    return {
      message: "Dữ liệu backup hiện có",
      data: itemsWithSize,
      success: true,
    };
  }

  static async createBackup(userUid, clientData) {
    await BackUp.create({
      userUid,
      lastSync: new Date(),
      ...JSON.parse(clientData),
    });

    return {
      message: "Sao lưu dữ liệu thành công",
      success: true,
    };
  }
}

module.exports = BackupService;
