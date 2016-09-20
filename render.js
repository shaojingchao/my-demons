const {
  ipcRenderer,
  remote
} = require('electron');

const {
  dialog
} = remote;

const path = require('path');
const url = require('url');

function download() {

  let downloadUrl = document.getElementById('url').value;
  let dir = document.getElementById('dir').value;
  let parsedUrl = url.parse(downloadUrl);

  dir = dir || __dirname;
  dir = path.resolve(dir, parsedUrl.host);

  document.getElementById('result').innerText = 'download' + "," + downloadUrl + "," + dir;
  ipcRenderer.send('download-message', downloadUrl, dir);
}

function showOpenDialog() {
  let selectDir = dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  });
  selectDir = selectDir || '';
  document.getElementById('dir').value = selectDir;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('dir').value = __dirname;
  document.getElementById('download').addEventListener('click', download);
  document.getElementById('showOpenDialog').addEventListener('click', showOpenDialog);
}, false);
