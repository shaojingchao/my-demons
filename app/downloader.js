 /*jshint esversion: 6 */
 "use strict";

 const {
   BrowserWindow
 } = require('electron');
 const path = require('path');
 const url = require('url');
 const fs = require('fs');
 const mkdirp = require('mkdirp');

 let mainWindow;
 let counter = 1;

 /**
  * download all files from the specified url.
  * options:{
  *   url:'http://url/to/download',
  *   dir:'/path/to/save/the/downloaded/files',
  *   includes:[],//file type to be download.
  *   excludes:[],//string array of postfix that to be excluded.
  * }
  *
  * includes & excludes type: 'image','xhr','javascript','css','html'
  */

 function download(options) {

   //todo: 兼容flash

   mainWindow = new BrowserWindow({
     width: 800,
     height: 600,
     webPreferences: {
       nodeIntegration: false
     }
   });

   mainWindow.loadURL(options.url);

   //listen all http response
   mainWindow.webContents.on('did-get-response-details', (event, status, newURL, originalURL, httpResponseCode, requestMethod, referrer, headers, resourceType) => {
     let parsedUrl = url.parse(newURL);
     let parsedPath = path.parse(parsedUrl.pathname);

     if (options.includes.includes(resourceType)) {

       let dir = options.dir + parsedPath.dir;
       let fullPath = dir + parsedUrl.pathname;

       mkdirp(dir, function (err) {
         if (err) {
           console.error(err);
         } else {
           console.log('downloading', counter++, newURL);
           download(newURL)
             .then(data => {
               fs.writeFileSync(fullPath, data);
               console.log('---->', fullPath);
             });
         }
       });
     }
   });

   mainWindow.on('closed', function () {
     mainWindow = null;
   });
 }

 module.exports = exports = {
   download: download
 };
