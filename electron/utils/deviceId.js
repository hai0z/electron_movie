const { app } = require("electron");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const idFile = path.join(app.getPath("userData"), "uuid.txt");
const flagFile = path.join(app.getPath("userData"), "restore.json");
const themeFile = path.join(app.getPath("userData"), "theme.json");

class DeviceIdManager {
  static getAppUniqueId() {
    let deviceId;
    if (fs.existsSync(idFile)) {
      deviceId = fs.readFileSync(idFile, "utf-8");
    } else {
      deviceId = randomUUID();
      fs.writeFileSync(idFile, deviceId);
    }
    return deviceId;
  }

  static setDeviceId(newId) {
    fs.writeFileSync(idFile, newId, "utf-8");
    fs.writeFileSync(flagFile, JSON.stringify({ restored: true }));
    return newId;
  }

  static checkRestoreFlag() {
    if (fs.existsSync(flagFile)) {
      const data = JSON.parse(fs.readFileSync(flagFile, "utf-8"));
      fs.unlinkSync(flagFile); // Delete after reading
      return data.restored === true;
    }
    return false;
  }

  static resetAppUuid() {
    if (fs.existsSync(idFile)) {
      fs.unlinkSync(idFile);
      return true;
    }
    return false;
  }
  static saveThemePreference(theme) {
    fs.writeFileSync(themeFile, JSON.stringify(theme), "utf-8");
  }
  static getThemePreference() {
    if (fs.existsSync(themeFile)) {
      const data = JSON.parse(fs.readFileSync(themeFile, "utf-8"));
      return data;
    }
    return { name: "light", bgColor: "#ffffff" };
  }
}

module.exports = DeviceIdManager;
