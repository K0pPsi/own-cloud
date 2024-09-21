const db = require("../db");
const fs = require("fs-extra");
const moment = require("moment");
const path = require("path");
const currentDate = moment().format("DD-MM-YYYY");

function uploadSingleFile(fileData) {
  const fileType = fileData.originalname.split(".").pop();

  //save metadata in an array for the database entry
  const params = [
    fileData.originalname,
    fileType,
    fileData.size,
    fileData.path,
    currentDate,
  ];

  //insert metadata into the database
  db.run(
    "INSERT INTO files (filename, filetype, filesize, filepath, date) VALUES (?, ?, ?, ?, ?)",
    params,
    (err) => {
      if (err) {
        console.log(`Error to upload metadata: ${err}`);
      }
    }
  );
}

//read all files from the database and return it
function readAllData() {
  return new Promise((resolve, reject) => {
    //select all files
    db.all("SELECT * FROM files", [], (err, rows) => {
      if (err) {
        console.log(`Error cannot read files: ${err}`);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

//delete metadata from database and the file from the hard disk
async function deleteFile(id, filepath) {
  try {
    //delete file
    await fs.unlink(filepath);
    console.log(`File ${filepath} successful deleted`);

    // delete metadata from database
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM files WHERE ID = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    console.log(`databaseentry with the  id ${id} successfully deleted`);
  } catch (err) {
    console.error("Error to delte file", err);
  }
}

//select the desired file and return it
function downloadData(id) {
  return new Promise((resolve, reject) => {
    //select file via id
    db.all("SELECT * From files WHERE id = ? ", [id], (err, rows) => {
      if (err) {
        console.log("ERROR: " + err);
      } else {
        resolve(rows);
      }
    });
  });
}

//select the desired file and change the name
function renameFile(newFileName, fileId) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE files SET filename = ? WHERE id = ?",
      [newFileName, fileId],
      (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve({ messsage: "succefully renmae the file" });
        }
      }
    );
  });
}

//create a new folder on the storage
function createFolder(macBookUsbPasth, folderName) {
  let message;

  //set the whole path
  const directory = path.join(macBookUsbPasth, folderName);

  try {
    //check if the folder already exists
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
      console.log(`${directory} wurde erstellt`);

      //save metadata in an array for the database entry
      const params = [
        folderName,
        "folder",
        0,
        macBookUsbPasth + "/" + folderName,
        currentDate,
      ];

      db.run(
        "INSERT INTO files (filename, filetype, filesize, filepath, date) VALUES (?, ?, ?, ?, ?)",
        params,
        (err) => {
          if (err) {
            console.log(`Error to upload metadata: ${err}`);
          }
        }
      );

      message = `Der Ordner ${directory} wurde erfolgreich erstellt.`;
    } else {
      message = `Der Ordner ${directory} exisitiert bereits`;
    }
  } catch (error) {
    console.log(error);
  }

  return message;
}

module.exports = {
  uploadSingleFile,
  readAllData,
  downloadData,
  deleteFile,
  renameFile,
  createFolder,
};
