 const {
   BrowserWindow
 } = require('electron');
 const path = require('path');
 const url = require('url');
 const fs = require('fs');
 const mkdirp = require('mkdirp');
 const download = require('download');

 let _mainWindow;
 let _counter = 1;

 /**
  * download files from the specified url.
  * params:{
  *   url:'http://url/to/download',
  *   dir:'/path/to/save/the/downloaded/files',
  *   includes:[],//file type to be download.{optional}
  *   excludes:[],//string array of postfix that to be excluded. {optional}
  * }
  *
  * includes & excludes type: 'image','xhr','javascript','css','html'
  */

 function start(params) {

   params.includes = params.includes || [];

   //todo: 兼容flash

   _mainWindow = new BrowserWindow({
     width: 800,
     height: 600,
     webPreferences: {
       nodeIntegration: false
     }
   });

   _mainWindow.loadURL(params.url);

   //listen all http response
   _mainWindow.webContents.on('did-get-response-details', (event, status, newURL, originalURL, httpResponseCode, requestMethod, referrer, headers, resourceType) => {
     let parsedUrl = url.parse(newURL);
     let parsedPath = path.parse(parsedUrl.pathname);

     if(params.includes.length !== 0 && !params.includes.includes(resourceType)) {
       return;
     }

     let dir = path.join(params.dir, parsedPath.dir);
     let fullPath = path.join(params.dir, parsedUrl.pathname);

     console.log(dir, fullPath);

     mkdirp(dir, function(err) {
       if(err) {
         console.error(err);
       } else {
         console.log('downloading', _counter++, newURL);
         download(newURL)
           .then(data => {
             fs.writeFileSync(fullPath, data);
             console.log('---->', fullPath);
           });
       }
     });
   });

   _mainWindow.on('closed', function() {
     _mainWindow = null;
   });
 }

 module.exports = exports = {
   start: start
 };
