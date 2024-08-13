const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

function createMainWindow() {
  const win = new BrowserWindow({
    minWidth: 1336,
    minHeight: 768,
    alwaysOnTop: false,
    title: "Movies Hub",
    autoHideMenuBar: true,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: false,
    },
    frame: false,
  });
  win.setPosition(
    screen.getPrimaryDisplay().workArea.x,
    screen.getPrimaryDisplay().workArea.y
  );

  win.loadFile(path.join(__dirname, "./vite-movies/dist/index.html"));
  // win.loadURL("http://localhost:5173");

  ipcMain.on("minimize", (event) => {
    win.minimize();
  });

  ipcMain.on("maximize", (event) => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on("close", (event) => {
    win.close();
  });
}

app.whenReady().then(() => {
  createMainWindow();
});
