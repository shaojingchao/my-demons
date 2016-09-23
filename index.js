 const {
   app,
   ipcMain,
   BrowserWindow
 } = require('electron');
 const path = require('path');
 const downloader = require('./app/downloader');

 let ppapi_flash_path;
 //app.getPath('pepperFlashSystemPlugin')

 let ppapi_flash_ver;

 if (process.platform === 'win32') {
   ppapi_flash_path = path.join(__dirname, 'plugins/pepflashplayer_x64.dll');
   ppapi_flash_ver = '23.0.0.162';
 } else if (process.platform === 'linux') {
   ppapi_flash_path = path.join(__dirname, 'plugins/libpepflashplayer.so');
 } else if (process.platform === 'darwin') {
   ppapi_flash_path = path.join(__dirname, 'plugins/PepperFlashPlayer.plugin');
   ppapi_flash_ver = '23.0.0.166';
 }

 app.commandLine.appendSwitch('ppapi-flash-path', ppapi_flash_path);

 // Optional: Specify flash version, for example, v17.0.0.169
 // app.commandLine.appendSwitch('ppapi-flash-version', ppapi_flash_ver);

 function startDownload(url, dir) {

   dir = dir || path.resolve(__dirname, 'res');

   downloader.start({
     url: url,
     dir: dir,
     includes: ['image', 'xhr']
   });

 }

 ipcMain.on('download-message', (event, url, dir) => {
   console.log('starting download......', url, dir);
   startDownload(url, dir);
 });

 let _mainWindow;

 function ready() {

   _mainWindow = new BrowserWindow({
     width: 1024,
     height: 768,
     webPreferences: {
       plugins: true
     }
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
