const { BrowserWindow } = require("electron");
const path = require("path");
const DeviceIdManager = require("../utils/deviceId");
const userdata = require("../../model/userData.schema");
class WindowManager {
  static mainWindow = null;
  static lockWindow = null;
  static verifyWindow = null;
  static theme = DeviceIdManager.getThemePreference();

  static async createMainWindow() {
    this.mainWindow = new BrowserWindow({
      minWidth: 1366,
      minHeight: 768,
      width: 1366,
      height: 768,
      alwaysOnTop: false,
      title: "Movies Hub",
      backgroundColor: this.theme.bgColor,
      autoHideMenuBar: true,
      center: true,
      show: true,
      webPreferences: {
        preload: path.join(__dirname, "../preload/preload.js"),
        devTools: true,
        contextIsolation: true,
        nodeIntegration: false,
        additionalArguments: [`--theme=${this.theme.name}`],
      },
      frame: false,
      icon: path.join(__dirname, "../../assets/fire.ico"),
    });

    const user = await userdata.findOne({
      userUid: DeviceIdManager.getAppUniqueId(),
    });
    if (user && user.lockApp)
      this.mainWindow.loadFile(path.join(__dirname, "../unlock.html"));
    else
      this.mainWindow.loadFile(
        path.join(__dirname, "../../vite-movies/dist/index.html")
      );

    // Check restore flag
    if (DeviceIdManager.checkRestoreFlag()) {
      this.mainWindow.webContents.once("did-finish-load", () => {
        this.mainWindow.webContents.send("restore-success");
      });
    }

    return this.mainWindow;
  }

  static getMainWindow() {
    return this.mainWindow;
  }
}

module.exports = WindowManager;
