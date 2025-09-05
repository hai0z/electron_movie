const { app, BrowserWindow, ipcMain } = require("electron");

const Movie = require("./model/movie.schema.js");

const path = require("path");
const {
  getHomeData,
  movieService,
  getMovieDetail,
  getMovieDetailOld,
} = require("./devil.js");
const { connectDB } = require("./config/db.js");

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

  ipcMain.on("offline-search", async (_, query) => {
    await connectDB();

    const { q } = query;
    const page = parseInt(query.page) || 1;

    const limit = parseInt(query.limit) || 20;

    const skip = (page - 1) * limit;

    // Tìm kiếm bằng text index
    const [movies, total] = await Promise.all([
      Movie.find({ $text: { $search: q } })
        .skip(skip)
        .limit(limit)
        .sort({ score: { $meta: "textScore" } })
        .select({ score: { $meta: "textScore" } }),
      Movie.countDocuments({ $text: { $search: q } }),
    ]);

    win.webContents.send(
      "offline-search-result",
      JSON.stringify({
        status: true,
        msg: "Tìm kiếm thành công",
        page: {
          current_page: page,
          per_page: limit,
          total,
          last_page: Math.ceil(total / limit),
        },
        movies,
      })
    );
  });

  ipcMain.on("get-other-cate", async (_, inputData) => {
    const data = await movieService.getOtherCate(inputData);
    win.webContents.send("other-cate", data);
  });

  ipcMain.on("get-live", async (_) => {
    const data = await movieService.getLive();
    win.webContents.send("live-data", data);
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
