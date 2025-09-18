const { app } = require("electron");
const { connectDB } = require("../../config/db.js");
const { crawlLatest } = require("../../crawl/index.js");
const WindowManager = require("./window");
const IpcHandler = require("./ipc");
const UserService = require("../services/userService");
const DeviceIdManager = require("../utils/deviceId");
const { crawlLatestHentai } = require("../../crawl/hentai.js");

async function initialize() {
  // Connect to database
  await connectDB();

  // Initialize user
  const userUid = DeviceIdManager.getAppUniqueId();
  await UserService.initUser(userUid);

  // Start crawling latest content
  crawlLatest();
  crawlLatestHentai();
  // Create main window
  WindowManager.createMainWindow();
  UserService.logAppOpen();

  // Setup IPC handlers
  IpcHandler.initialize();
}

// App startup
app.whenReady().then(() => {
  initialize();
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// macOS specific: re-create window when dock icon is clicked
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    initialize();
  }
});
