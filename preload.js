// preload.js
// Save/replace as: app/preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getAppInfo: () => ipcRenderer.invoke('app-info'),

  // YouTube data fetch (server-side)
  fetchYouTubeData: (url) => ipcRenderer.invoke('fetch-youtube-data', url),

  // GPT proxy: call main to fetch from free proxies
  sendGPTMessage: (message, history) => ipcRenderer.invoke('gpt-proxy', { message, history }),

  // Pomodoro: send state updates and subscribe to broadcasts
  sendPomodoroUpdate: (state) => ipcRenderer.send('pomodoro-update', state),
  onPomodoroUpdate: (callback) => {
    ipcRenderer.on('pomodoro-update', (event, state) => callback(state));
  }
});
