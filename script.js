document.getElementById("fakeButton").addEventListener("click", function() {
  document.getElementById("fileUpload").click();
});
document.querySelector('#fileUpload').addEventListener('change', function(event) {
  for (let i = 0; i < event.target.files.length; i++) {
    var FILE_KEY = 'file-' + i + '.xml';
    var reader = new FileReader();
    var file = event.target.files[i];
    reader.readAsText(file);
    reader.onload = function(event) {
      var save = event.target.result;
      console.log(save);
      window.sessionStorage.setItem(FILE_KEY, save);
      download("file-" + (i + 1) + ".svg", convert(FILE_KEY));
    };
  }
}, false);

function convert(file) {
  let toConvert = sessionStorage.getItem(file);
  if (toConvert.includes('width="100%" height="100%"')) {
    toConvert = toConvert.replace('width="100%" height="100%"', '');
  }
  return toConvert;
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.getElementById('upload').addEventListener(eventName, preventDefaults, false)
})

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}

['dragenter', 'dragover'].forEach(eventName => {
  document.getElementById('upload').addEventListener(eventName, dragHandler, false)
})

document.getElementById('upload').addEventListener("dragenter", dragHandler);

document.getElementById('upload').addEventListener("dragleave", leaveHandler);
['dragleave', 'drop'].forEach(eventName => {
  document.getElementById('upload').addEventListener(eventName, leaveHandler, false)
})
document.getElementById('upload').addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files
  for (let i = 0; i < files.length; i++) {
    var FILE_KEY = 'file-' + i + '.xml';
    var reader = new FileReader();
    var file = files[i];
    reader.readAsText(file);
    reader.onload = function(event) {
      var save = event.target.result;
      console.log(save);
      window.sessionStorage.setItem(FILE_KEY, save);
      download("file-" + (i + 1) + ".svg", convert(FILE_KEY));
    };
  }
}

function dragHandler(ev) {
  ev.preventDefault();
  document.getElementById("fakeButton").innerText = "Drop files";
}

function leaveHandler(ev) {
  ev.preventDefault();
  document.getElementById("fakeButton").innerText = "Upload SVG(s)"
}