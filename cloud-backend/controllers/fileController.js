const fs = require("fs-extra");

//only a path to test the code on my macbook
const macBookUsbPasth = "/Volumes/Cloud";

const externStoragePath = macBookUsbPasth;

///media/kopp/3665-A632 - the path for my linux system

//move the file data from the upload folder to the hard disk
async function saveFile(fileName, filePathOnServer) {
  try {
    await fs.move(filePathOnServer, externStoragePath + "/" + fileName, {
      overwrite: true,
    });
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

//download function - return the desired file back
async function downloadFile(fileName) {
  const filePath = externStoragePath + "/" + fileName;

  const desiredFile = await fs.createReadStream(filePath);
  return desiredFile;
}

//create a new folder on the hard disk
function createFolder(foldername) {
  try {
    fs.mkdir(externStoragePath + "/" + foldername);
    return true;
  } catch (error) {
    console.log(error);
  }

  return test;
}

module.exports = {
  saveFile,
  readAllFiles,
  deleteFile,
  downloadFile,
  createFolder,
};
