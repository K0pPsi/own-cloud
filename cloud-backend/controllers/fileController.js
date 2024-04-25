const fs = require("fs-extra");

const externStoragePath = "/media/kopp/3665-A632";

//handle Upload File
function saveFile(fileName, fileData) {
  try {
    fs.writeFile(externStoragePath + "/" + fileName, fileData, (e) => {
      if (e) {
        console.log("Error to save file: " + e);
        return false;
      }
    });
  } catch (e) {}
}

function readAllFiles() {
  try {
    const allFiles = fs.readdirSync(externStoragePath);
    //console.log(allFiles);
    return allFiles;
  } catch (e) {
    console.log("Fail to read files: " + e);
  }
}

module.exports = { saveFile, readAllFiles };
