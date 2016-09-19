const {
  ipcRenderer
} = require('electron');

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById('download')
    .addEventListener('click', () => {
      let url = document.getElementById('url')
        .value;
      let dir = document.getElementById('dir')
        .value;
      document.getElementById('result')
        .innerText = 'download' + "," + url + "," + dir;
      ipcRenderer.send('download-message', url, dir);
    });
}, false);
