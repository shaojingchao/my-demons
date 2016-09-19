 /*jshint esversion: 6 */
 "use strict";

 const {
   app,
   ipcMain,
   BrowserWindow
 } = require('electron');
 const path = require('path');
 const downloader = require('./app/downloader');

 ipcMain.on('download-message', (event, url, dir) => {
   console.log('------>', url, dir);
   //  event.sender.send('asynchronous-reply', 'pong');
 });

 // ipcMain.on('synchronous-message', (event, arg) => {
 //   console.log(arg);
 //   event.returnValue = 'pong';
 // });

 let mainWindow;

 function startDownload() {
   downloader.download({
     url: 'https://www.redbet.com/en/casino/game/theme-park',
     dir: path.resolve(__dirname, 'res'),
     includes: ['image', 'xhr']
   });
 }

 function ready() {

   mainWindow = new BrowserWindow({
     width: 1024,
     height: 768
   });

   mainWindow.loadURL(`file://${__dirname}/index.html`);

   mainWindow.on('closed', function () {
     mainWindow = null;
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
   if (mainWindow === null) {
     ready();
   }
 });
