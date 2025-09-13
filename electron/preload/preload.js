const { contextBridge, ipcRenderer } = require("electron");

const themeArg = process.argv.find((arg) => arg.startsWith("--theme="));
const theme = themeArg ? themeArg.replace("--theme=", "") : "light";

contextBridge.exposeInMainWorld("theme", { value: theme });

// Utility function to update version info in DOM
function updateVersionInfo() {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
}

// Update version info when DOM is loaded
window.addEventListener("DOMContentLoaded", updateVersionInfo);

// Expose IPC functionality to renderer
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) =>
      ipcRenderer.on(channel, (event, ...args) => func(...args)),
  },
});
contextBridge.exposeInMainWorld("electronStore", {
  get: (key) => ipcRenderer.invoke("store:get", key),
  set: (key, value) => ipcRenderer.invoke("store:set", key, value),
  remove: (key) => ipcRenderer.invoke("store:remove", key),
});
