// handle "fake" upload button onclick
document.getElementById("fakeButton").addEventListener("click", function() {
  document.getElementById("fileUpload").click();
});
// get files from upload
document.querySelector('#fileUpload').addEventListener('change', function(event) {
  // loop through all of the uploaded files
  for (let i = 0; i < event.target.files.length; i++) {
    // set a file key for each file
    // notice we upload the file as XML, as that's what SVG really is at the core
    var FILE_KEY = 'file-' + i + '.xml';
    // set up a new FileReader as the reader variable
    var reader = new FileReader();
    // set the file to the selected file
    var file = event.target.files[i];
    // read the XML file as plaintext with FileReader
    reader.readAsText(file);
    // when the reader is ready, pass event into a new function
    reader.onload = function(event) {
      // place the plaintext in the save variable
      var save = event.target.result;
      // save the plaintext in sessionStorage under the file key
      window.sessionStorage.setItem(FILE_KEY, save);
      // download the file using several functions, documented after this
      download("file-" + (i + 1) + ".svg", convert(FILE_KEY));
    };
  }
}, false);
// handle actually fixing the file
function convert(file) {
  // set the file to convert as the file that we set in sessionStorage earlier
  let toConvert = sessionStorage.getItem(file);
  // if the file is not SVE-compatible
  if (toConvert.includes('width="100%" height="100%"')) {
    // replace the file's contents with the same contents, removing the width and height
    toConvert = toConvert.replace('width="100%" height="100%"', '');
  }
  // return the converted file
  return toConvert;
}
// download the file
// this takes in the filename to download and the plaintext file
function download(filename, text) {
  // create a link element to "click" (automatic download)
  var element = document.createElement('a');
  // set the link's href attribute to the file to download
  element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  // hide the link element
  element.style.display = 'none';
  // append the element to the DOM
  document.body.appendChild(element);
  // "click" the element
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
