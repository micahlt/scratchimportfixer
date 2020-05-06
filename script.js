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
      // notice the filename: it's the original filename plus "-fixed" before the .SVG extension
      download(file.name.slice(0, -4) + "-fixed.svg", convert(FILE_KEY));
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
  // remove the useless link element
  document.body.removeChild(element);
}

// prevent browser defaults for all drag events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.getElementById('upload').addEventListener(eventName, preventDefaults, false)
})

// prevent the browser's various default behaviors, used in the above forEach statement
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// handle the drag over event(s)
['dragenter', 'dragover'].forEach(eventName => {
  // place an event listener on the entire upload div, which gives the user a large space to drop files
  document.getElementById('upload').addEventListener(eventName, dragHandler, false)
})

// call dragHandler when the file the user is dragging moves over the upload area
document.getElementById('upload').addEventListener("dragenter", dragHandler);

// call leaveHandler when the file the user is dragging is dropped or exits the upload area
['dragleave', 'drop'].forEach(eventName => {
  document.getElementById('upload').addEventListener(eventName, leaveHandler, false)
})

// call handleDrop when the user drops a file in the upload area
document.getElementById('upload').addEventListener('drop', handleDrop, false)

// the meaty stuff of handling drag-and-drop
function handleDrop(e) {
  // create an event.dataTransfer variable called dt
  let dt = e.dataTransfer
  // set the files to process to the element's dataTransfer files
  let files = dt.files
  // loop through the files (if there are multiple)
  for (let i = 0; i < files.length; i++) {
    // set a unique file key
    // once again, this is in XML since that's what SVGs really are at the core
    var FILE_KEY = 'file-' + i + '.xml';
    // set up a new FileReader
    var reader = new FileReader();
    // set the specific file we're looking at to the ith file in the file list
    var file = files[i];
    // use the FileReader to read the selected file as plaintext
    reader.readAsText(file);
    // when the reader has loaded the file
    reader.onload = function(event) {
      // set the save variable to the plaintext file
      var save = event.target.result;
      // save the file with its key in sessionStorage
      window.sessionStorage.setItem(FILE_KEY, save);
      // use the download and convert functions to save the file
      // notice the filename: it's the original filename plus "-fixed" before the .SVG extension
      download(file.name.slice(0, -4) + "-fixed.svg", convert(FILE_KEY));
    };
  }
}

// handle dragover
function dragHandler(ev) {
  // prevent any browser defaults
  ev.preventDefault();
  // change the fake button's text to prompt a file drop
  document.getElementById("fakeButton").innerText = "Drop files";
}

// handle drag exit
function leaveHandler(ev) {
  // prevent any browser defaults
  ev.preventDefault();
  // change the fake button's text to prompt a click
  document.getElementById("fakeButton").innerText = "Upload SVG(s)"
}
