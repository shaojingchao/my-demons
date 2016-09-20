const {
  ipcRenderer,
  remote
} = require('electron');

const {
  dialog
} = remote;

function download() {
  let url = document.getElementById('url').value;
  let dir = document.getElementById('dir').value;
  document.getElementById('result').innerText = 'download' + "," + url + "," + dir;
  ipcRenderer.send('download-message', url, dir);
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
