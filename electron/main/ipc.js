const { ipcMain } = require("electron");
const WindowManager = require("./window");
const UserService = require("../services/userService");
const MovieService = require("../services/movieService");
const BackupService = require("../services/backupService");
const NotificationService = require("../services/notificationService");
const DeviceIdManager = require("../utils/deviceId");
const { recommendFromDB } = require("../services/recommend.service");
const Store = require("electron-store");

const store = new Store();

const path = require("path");
class IpcHandler {
  static initialize() {
    this.setupWindowControls();
    this.setupUserHandlers();
    this.setupMovieHandlers();
    this.setupBackupHandlers();
    this.setupNotificationHandlers();
    this.setupRecommend();
    this.setupStoreHandlers();
  }

  static setupRecommend() {
    ipcMain.on("recommend", async (_, watchHistory) => {
      const parsed = JSON.parse(watchHistory);
      const data = await recommendFromDB(parsed);

      WindowManager.getMainWindow().webContents.send("recommend-data", data);
    });
  }

  static setupWindowControls() {
    ipcMain.on("minimize", () => {
      WindowManager.getMainWindow().minimize();
    });

    ipcMain.on("maximize", () => {
      const win = WindowManager.getMainWindow();
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    });

    ipcMain.on("close", () => {
      WindowManager.getMainWindow().close();
    });
  }

  static setupUserHandlers() {
    ipcMain.on("get-user-data", async () => {
      const userUid = DeviceIdManager.getAppUniqueId();
      const userData = await UserService.getUserData(userUid);
      WindowManager.getMainWindow().webContents.send("user-data", userData);
    });

    ipcMain.on("sync-data", async (_, clientData) => {
      const userUid = DeviceIdManager.getAppUniqueId();
      const syncedData = await UserService.syncUserData(userUid, clientData);
      WindowManager.getMainWindow().webContents.send("synced-data", syncedData);
    });

    ipcMain.on("get-open-app", async () => {
      const data = await UserService.getOpenApp();
      WindowManager.getMainWindow().webContents.send("open-app-data", data);
    });

    ipcMain.on("set-lock-app", async () => {
      await UserService.setLockApp();
    });

    ipcMain.on("unset-lock-app", async () => {
      await UserService.unsetLockApp();
    });

    ipcMain.on("set-pin", async (_, pin) => {
      const recoverKey = await UserService.setPin(pin);
      WindowManager.getMainWindow().webContents.send("recover-key", recoverKey);
    });

    ipcMain.on("verifyPin", async (_, pin) => {
      const isValid = await UserService.verifyPin(pin);
      WindowManager.getMainWindow().webContents.send(
        "verify-pin-result",
        isValid
      );
    });

    ipcMain.on("get-recovery-key", async () => {
      const key = await UserService.getRecoverKey();
      WindowManager.getMainWindow().webContents.send(
        "get-recovery-key-result",
        key
      );
    });

    ipcMain.on("verify-success", async () => {
      WindowManager.getMainWindow().loadFile(
        path.join(__dirname, "../../vite-movies/dist/index.html")
      );
      // WindowManager.getMainWindow().loadURL("http://localhost:5173");
    });

    ipcMain.on("check-recover-key", async (_, recoverKey) => {
      const isValid = await UserService.checkRecoverKey(recoverKey);
      WindowManager.getMainWindow().webContents.send(
        "check-recover-key-result",
        isValid
      );
    });

    ipcMain.on("forgot-pin", async (_, pin) => {
      const isSuccess = await UserService.recoverPin(pin);
      WindowManager.getMainWindow().webContents.send(
        "forgot-pin-result",
        isSuccess
      );
    });

    ipcMain.on("change-pin", async (_, newPin) => {
      const isSuccess = await UserService.changePin(newPin);
      WindowManager.getMainWindow().webContents.send(
        "change-pin-result",
        isSuccess
      );
    });

    ipcMain.on("apply-theme", async (_, theme) => {
      DeviceIdManager.saveThemePreference(theme);
    });
  }

  static setupMovieHandlers() {
    ipcMain.on("offline-search", async (_, query) => {
      const result = await MovieService.searchOffline(query);
      WindowManager.getMainWindow().webContents.send(
        "offline-search-result",
        JSON.stringify(result)
      );
    });

    ipcMain.on("get-devil-home", async () => {
      const data = await MovieService.getHomeData();
      WindowManager.getMainWindow().webContents.send("home-data", data);
    });

    ipcMain.on("get-movie-detail", async (_, id) => {
      const data = await MovieService.getMovieDetail(id);
      WindowManager.getMainWindow().webContents.send("movie-detail", data);
    });

    ipcMain.on("get-movie-detail-old", async (_, id) => {
      const data = await MovieService.getMovieDetailOld(id);
      WindowManager.getMainWindow().webContents.send("movie-detail-old", data);
    });

    ipcMain.on("get-by-category", async (_, data) => {
      const res = await MovieService.getByCategory(
        +data.category,
        data.page,
        data.keyword
      );
      WindowManager.getMainWindow().webContents.send("movie-category", res);
    });

    ipcMain.on("search", async (_, data) => {
      const res = await MovieService.search(data.keyword, +data.page);
      WindowManager.getMainWindow().webContents.send("search-result", res);
    });

    ipcMain.on("get-other-cate", async (_, inputData) => {
      const data = await MovieService.getOtherCate(inputData);
      WindowManager.getMainWindow().webContents.send("other-cate", data);
    });

    ipcMain.on("get-live", async () => {
      const data = await MovieService.getLive();
      WindowManager.getMainWindow().webContents.send("live-data", data);
    });

    ipcMain.on("get-tiktok", async () => {
      const data = await MovieService.getTikTok();
      WindowManager.getMainWindow().webContents.send("tiktok", data);
    });

    ipcMain.on("load-more-tiktok", async () => {
      const data = await MovieService.getTikTok();
      WindowManager.getMainWindow().webContents.send(
        "load-more-tiktok-data",
        data
      );
    });

    ipcMain.on("get-old", async (_, page = 1) => {
      const data = await MovieService.getAllOld(page);
      WindowManager.getMainWindow().webContents.send("old-data", data);
    });

    // 1. Lấy danh sách actor
    ipcMain.on("get-actors", async (_, query) => {
      const result = await MovieService.getActor(query);
      WindowManager.getMainWindow().webContents.send(
        "get-actors-result",
        JSON.stringify(result)
      );
    });

    // 2. Lấy movie của 1 actor
    ipcMain.on("get-actor-movies", async (_, query) => {
      const result = await MovieService.getActorMovie(query);
      WindowManager.getMainWindow().webContents.send(
        "get-actor-movies-result",
        JSON.stringify(result)
      );
    });

    // 3. Tìm actor theo tên
    ipcMain.on("search-actors", async (_, query) => {
      const result = await MovieService.searchActors(query);
      WindowManager.getMainWindow().webContents.send(
        "search-actors-result",
        JSON.stringify(result)
      );
    });
    //maybeLike
    ipcMain.on("get-maybeLike", async (_, watchHistory) => {
      const result = await MovieService.getMaybeLike(JSON.parse(watchHistory));
      WindowManager.getMainWindow().webContents.send(
        "get-maybeLike-result",
        JSON.stringify(result)
      );
    });
  }

  static setupBackupHandlers() {
    ipcMain.on("restore-data", async (_, deviceId) => {
      const result = await BackupService.getBackupData(deviceId);
      WindowManager.getMainWindow().webContents.send(
        "restore-data-respone",
        result
      );
    });

    ipcMain.on("backup-data", async (_, clientData) => {
      const userUid = DeviceIdManager.getAppUniqueId();
      const result = await BackupService.createBackup(userUid, clientData);
      WindowManager.getMainWindow().webContents.send(
        "backup-data-respone",
        result
      );
    });

    ipcMain.on("set-device-id", async (_, deviceId) => {
      DeviceIdManager.setDeviceId(deviceId);
      const { app } = require("electron");
      app.relaunch();
      app.exit(0);
    });
  }

  static setupNotificationHandlers() {
    ipcMain.on("get-noti", async () => {
      const userUid = DeviceIdManager.getAppUniqueId();
      const notifications = await NotificationService.getUserNotifications(
        userUid
      );
      WindowManager.getMainWindow().webContents.send(
        "noti-data",
        notifications
      );
    });

    ipcMain.on("read-noti", async () => {
      const userUid = DeviceIdManager.getAppUniqueId();
      await NotificationService.markAllAsRead(userUid);
    });
  }
  static setupStoreHandlers() {
    ipcMain.handle("store:get", (_, key) => {
      return store.get(key);
    });
    ipcMain.handle("store:set", (_, { key, value }) => {
      store.set(key, value);
    });
    ipcMain.handle("store:remove", (_, key) => {
      store.delete(key);
    });
  }
}

module.exports = IpcHandler;
