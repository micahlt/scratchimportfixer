document.getElementById("fakeButton").addEventListener("click", function() {
  document.getElementById("fileUpload").click();
});
var FILE_KEY = 'save.xml';
document.querySelector('#fileUpload').addEventListener('change', handleFileUpload, false);
console.log('previous save: ', retrieveSave());
var reader = new FileReader();
reader.onload = handleFileRead;

function handleFileUpload(event) {
  var file = event.target.files[0];
  reader.readAsText(file);
}

function handleFileRead(event) {
  var save = event.target.result;
  console.log(save);
  window.localStorage.setItem(FILE_KEY, save);
  download("test.svg", convert(FILE_KEY));
}

function retrieveSave() {
  return localStorage.getItem(FILE_KEY);
}

function convert(file) {
  let toConvert = localStorage.getItem(file);
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