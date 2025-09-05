const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {
  getHomeData,
  movieService,
  getMovieDetail,
  getMovieDetailOld,
} = require("./devil.js");

const fs = require("fs");

function createMainWindow() {
  const win = new BrowserWindow({
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
      preload: path.join(__dirname, "preload.js"),
      devTools: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
    frame: false,
    icon: path.join(__dirname, "assets", "fire.ico"),
  });

  win.loadURL("http://localhost:5173");
  // win.loadFile(path.join(__dirname, "./vite-movies/dist/index.html"));

  ipcMain.on("minimize", (_) => {
    win.minimize();
  });

  ipcMain.on("maximize", (_) => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on("close", (_) => {
    win.close();
  });

  ipcMain.on("offline-search", async (_, keyword) => {
    const data = JSON.parse(fs.readFileSync("movies.json", "utf-8"));
    const query = keyword.toLowerCase();

    const results = data.filter(
      (item) =>
        item.actors.join(",").toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query)
    );

    win.webContents.send("offline-search-result", results);
  });

  ipcMain.on("get-other-cate", async (_, inputData) => {
    const data = await movieService.getOtherCate(inputData);
    win.webContents.send("other-cate", data);
  });

  ipcMain.on("get-tiktok", async (_) => {
    const data = await movieService.getTikTok();
    win.webContents.send("tiktok", data);
  });

  ipcMain.on("load-more-tiktok", async (_) => {
    const data = await movieService.getTikTok();
    win.webContents.send("load-more-tiktok-data", data);
  });

  ipcMain.on("get-devil-home", async () => {
    const data = await getHomeData();
    win.webContents.send("home-data", data);
  });

  ipcMain.on("get-old", async (_, page = 1) => {
    const data = await movieService.getAllOld(page);
    win.webContents.send("old-data", data);
  });
  ipcMain.on("get-eporn", async (_, params) => {
    const data = await movieService.getEporn(params);
    win.webContents.send("eporn", data);
  });

  ipcMain.on("get-movie-detail", async (_, id) => {
    const data = await getMovieDetail(id);
    win.webContents.send("movie-detail", data);
  });
  ipcMain.on("get-movie-detail-old", async (_, id) => {
    const data = await getMovieDetailOld(id);
    win.webContents.send("movie-detail-old", data);
  });

  ipcMain.on("get-by-category", async (_, data) => {
    const res = await movieService.getByCategory(
      +data.category,
      data.page,
      data.keyword
    );
    win.webContents.send("movie-category", res);
  });

  ipcMain.on("search", async (_, data) => {
    const res = await movieService.search(data.keyword, +data.page);
    win.webContents.send("search-result", res);
  });
}

app.whenReady().then(() => {
  createMainWindow();
});
