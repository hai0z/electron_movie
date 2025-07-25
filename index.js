const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { getHomeData, movieService, getMovieDetail } = require("./devil.js");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const cheerio = require("cheerio");

// Cấu hình đường dẫn ffmpeg
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// Hàm tìm link m3u8 từ HTML
async function findM3U8Links(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Tìm tất cả các thẻ script
    const scripts = $("script")
      .map((_, el) => $(el).html())
      .get();

    // Tìm tất cả các link m3u8 trong nội dung script
    const m3u8Links = [];
    const m3u8Regex = /https?:\/\/[^"']*?\.m3u8[^"']*/g;

    scripts.forEach((script) => {
      const matches = script.match(m3u8Regex);
      if (matches) {
        m3u8Links.push(...matches);
      }
    });

    // Tìm trong các thuộc tính src của video
    $("video source").each((_, el) => {
      const src = $(el).attr("src");
      if (src && src.includes(".m3u8")) {
        m3u8Links.push(src);
      }
    });

    // Tìm trong các thuộc tính data-src hoặc data-url
    $("[data-src], [data-url]").each((_, el) => {
      const src = $(el).attr("data-src") || $(el).attr("data-url");
      if (src && src.includes(".m3u8")) {
        m3u8Links.push(src);
      }
    });

    return [...new Set(m3u8Links)]; // Loại bỏ các link trùng lặp
  } catch (error) {
    console.error("Error finding m3u8 links:", error);
    return [];
  }
}

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

  // win.loadFile(path.join(__dirname, "./vite-movies/dist/index.html"));
  win.loadURL("http://localhost:5173");

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

  ipcMain.on("get-football-url", async (_, link) => {
    const res = await fetch(link, {
      headers: {
        Referer: "https://vebotv.tv",
        Origin: "https://vebotv.tv",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
    win.webContents.send("football-url", res);
  });
  ipcMain.on("get-devil-home", async () => {
    const data = await getHomeData();
    win.webContents.send("home-data", data);
  });

  ipcMain.on("get-movie-detail", async (_, id) => {
    const data = await getMovieDetail(id);
    win.webContents.send("movie-detail", data);
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

  ipcMain.on("download-m3u8", async (_, url) => {
    try {
      // Open save dialog to let user choose where to save the video
      const { filePath } = await dialog.showSaveDialog({
        title: "Save Video",
        defaultPath: path.join(
          process.env.HOME || process.env.USERPROFILE || "",
          "Downloads",
          "video.mp4"
        ),
        filters: [{ name: "Videos", extensions: ["mp4"] }],
      });

      if (!filePath) {
        win.webContents.send("download-m3u8", "User cancelled download");
      }

      // Download and convert m3u8 to mp4 using ffmpeg
      await new Promise((resolve, reject) => {
        ffmpeg(url)
          .outputOptions("-c copy") // Copy streams without re-encoding
          .output(filePath)
          .on("end", () => {
            resolve(true);
          })
          .on("error", (err) => {
            reject(err);
          })
          .run();
      });
      win.webContents.send("download-m3u8", "success");
    } catch (error) {
      console.error("Download error:", error);
      win.webContents.send("download-m3u8", error);
    }
  });

  // Thêm handler để tìm link m3u8
  ipcMain.on("find-m3u8-links", async (_, url) => {
    try {
      const links = await findM3U8Links(url);
      win.webContents.send("find-m3u8-links", links);
    } catch (error) {
      console.error("Error:", error);
      win.webContents.send("find-m3u8-links", error);
    }
  });
}

app.whenReady().then(() => {
  createMainWindow();
});
