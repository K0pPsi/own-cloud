const fs = require("fs-extra");

//only a path to test the code on my macbook
const macBookUsbPasth = "/Volumes/Cloud";

const externStoragePath = macBookUsbPasth;

///media/kopp/3665-A632 - the path for my linux system

//save the file on the hard disk
async function saveFile(fileName, fileData) {
  try {
    await fs.writeFile(externStoragePath + "/" + fileName, fileData);
    console.log(`${fileName} saved successfully`);
    return true;
  } catch (error) {
    console.log("Error saving file: ", error);
    return false;
  }
}

//read all files from the hard disk
function readAllFiles() {
  try {
    const allFiles = fs.readdirSync(externStoragePath);
    return allFiles;
  } catch (e) {
    console.log("Fail to read files: " + e);
  }
}

//delete file from the hard disk
function deleteFile(fileName) {
  try {
    fs.unlink(externStoragePath + "/" + fileName);
    return true;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { saveFile, readAllFiles, deleteFile };
