 /*jshint esversion: 6 */
 "use strict";

 const {
   app,
   BrowserWindow
 } = require('electron');
 const path = require('path');
 const url = require('url');
 const fs = require('fs');
 const download = require('download');
 const mkdirp = require('mkdirp');


 let mainWindow;
 let contents;
 let count = 1;

 function ready() {

   let resDir = 'e:/res';

   mainWindow = new BrowserWindow({
     width: 1024,
     height: 768,
     webPreferences: {
       nodeIntegration: false
     }
   });

   mainWindow.loadURL('https://www.redbet.com/en/casino/game/theme-park');

   contents = mainWindow.webContents;

   //listen all http response
   contents.on('did-get-response-details', (event, status, newURL, originalURL, httpResponseCode, requestMethod, referrer, headers, resourceType) => {
     let parsedUrl = url.parse(newURL);
     let parsedPath = path.parse(parsedUrl.pathname);

     //filter resource type
     if(resourceType === 'image' || resourceType === 'xhr') {

       let dir = resDir + parsedPath.dir;
       let fullPath = resDir + parsedUrl.pathname;

       mkdirp(dir, function(err) {
         if(err) {
           console.error(err);
         } else {
           console.log('downloading', count++, newURL);
           download(newURL).then(data => {
             fs.writeFileSync(fullPath, data);
             console.log('saved', fullPath);
           });
         }
       });
     }
   });

   mainWindow.webContents.openDevTools();

   mainWindow.on('closed', function() {
     // Dereference the window object, usually you would store windows
     // in an array if your app supports multi windows, this is the time
     // when you should delete the corresponding element.
     mainWindow = null;
   });
 }

 app.on('ready', ready);

 app.on('window-all-closed', function() {
   // On OS X it is common for applications and their menu bar
   // to stay active until the user quits explicitly with Cmd + Q
   if(process.platform !== 'darwin') {
     app.quit();
   }
 });

 app.on('activate', function() {
   // On OS X it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if(mainWindow === null) {
     ready();
   }
 });
