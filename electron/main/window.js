const { BrowserWindow } = require("electron");
const path = require("path");
const DeviceIdManager = require("../utils/deviceId");

class WindowManager {
  static mainWindow = null;

  static createMainWindow() {
    this.mainWindow = new BrowserWindow({
      minWidth: 1366,
      minHeight: 768,
      width: 1366,
      height: 768,
      alwaysOnTop: false,
      title: "Movies Hub",
      autoHideMenuBar: true,
      center: true,
      show: true,
      webPreferences: {
        preload: path.join(__dirname, "../preload/preload.js"),
        devTools: true,
        contextIsolation: true,
        nodeIntegration: false,
      },
      frame: false,
      icon: path.join(__dirname, "../../assets/fire.ico"),
    });

    // Load the app
    this.mainWindow.loadURL("http://localhost:5173");
    // For production: this.mainWindow.loadFile(path.join(__dirname, '../../vite-movies/dist/index.html'));

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
