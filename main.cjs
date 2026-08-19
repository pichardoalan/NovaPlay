const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, 'icon.ico'),
    autoHideMenuBar: true, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  
  win.maximize();

  // Prevent external pop-ups and unwanted new windows
  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    win.loadURL('http://localhost:5173');
  }
}

app.whenReady().then(() => {
  
  // Basic Ad and Tracker Interceptor
  session.defaultSession.webRequest.onBeforeRequest({ urls: ['*://*/*'] }, (details, callback) => {
    const url = details.url.toLowerCase();

    // Common ad networks and tracker patterns
    const adBlockList = [
      'exoclick', 'adsterra', 'propellerads', 'popunder', 
      'syndication', 'banners', '/ad/', 'ad_system', 
      'ads.js', 'banner.js', 'pop.js', 'track.js', 'onclick'
    ];

    const isAd = adBlockList.some(keyword => url.includes(keyword));

    if (isAd) {
      callback({ cancel: true }); 
    } else {
      callback({});
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});