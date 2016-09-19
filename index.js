 const {
   app,
   ipcMain,
   BrowserWindow
 } = require('electron');
 const path = require('path');
 const downloader = require('./app/downloader');

 let _mainWindow;

 function startDownload(url, dir) {

   dir = dir || path.resolve(__dirname, 'res');

   downloader.download({
     url: url,
     dir: dir,
     includes: ['image', 'xhr']
   });

 }

 ipcMain.on('download-message', (event, url, dir) => {
   console.log('starting download......', url, dir);
   startDownload(url, dir);
 });

 function ready() {

   _mainWindow = new BrowserWindow({
     width: 1024,
     height: 768
   });

   _mainWindow.loadURL(`file://${__dirname}/index.html`);

   _mainWindow.on('closed', function () {
     _mainWindow = null;
   });
 }

 app.on('ready', ready);

 app.on('window-all-closed', function () {
   // On OS X it is common for applications and their menu bar
   // to stay active until the user quits explicitly with Cmd + Q
   if (process.platform !== 'darwin') {
     app.quit();
   }
 });

 app.on('activate', function () {
   // On OS X it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (_mainWindow === null) {
     ready();
   }
 });
