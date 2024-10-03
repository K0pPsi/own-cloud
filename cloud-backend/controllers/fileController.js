const { rejects } = require("assert");
const db = require("../db");
const fs = require("fs-extra");
const moment = require("moment");
const path = require("path");
const currentDate = moment().format("DD-MM-YYYY");

function uploadSingleFile(fileData, currentViewPath, localFileName) {
  const fileType = fileData.originalname.split(".").pop();
  const fullFilePath = `${currentViewPath}${fileData.originalname}`;

  //save metadata in an array for the database entry
  const params = [
    fileData.originalname,
    fileType,
    fileData.size,
    fullFilePath,
    currentDate,
    localFileName,
  ];

  //insert metadata into the database
  db.run(
    "INSERT INTO files (filename, filetype, filesize, filepath, date, localFilePath) VALUES (?, ?, ?, ?, ?, ?)",
    params,
    (err) => {
      if (err) {
        console.log(`Error to upload metadata: ${err}`);
      }
    }
  );
}

function getFilesInFolder(folderPath) {
  return new Promise((resolve, reject) => {
    // Sicherstellen, dass der Ordnerpfad mit einem Slash endet
    if (!folderPath.endsWith("/")) {
      folderPath += "/";
    }

    console.log(folderPath);
    // LIKE-Muster, um alle Dateien und Ordner im aktuellen Ordner zu finden
    const likePattern = `${folderPath}%`;

    // Diese Bedingung stellt sicher, dass es keine weiteren '/' im Pfad gibt,
    // damit nur Dateien und Ordner direkt in folderPath gefunden werden
    const depthCondition = `instr(substr(filepath, length(?) + 1), '/') = 0`;

    db.all(
      `SELECT * FROM files 
       WHERE filepath LIKE ? 
       AND ${depthCondition}`,
      [likePattern, folderPath],
      (err, rows) => {
        if (err) {
          console.log(`Error: ${err}`);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

//this function can be deleted when i tested all
function getDataFromFolder(folderPath) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM files WHERE filepath LIKE ?",
      [`${folderPath}/%`],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

async function deleteFile(id, filepath, filetype, localFilePath) {
  try {
    // Checks if the file path exists and is accessible
    //await fs.access(localFilePath);

    // delete folder or file
    if (filetype === "folder") {
      await fs.rm(filepath, { recursive: true, force: true });
    } else {
      await fs.unlink(localFilePath);
    }
    console.log(
      `${
        filetype === "folder" ? "Folder" : "File"
      } ${filepath} successfully deleted`
    );
  } catch (error) {
    console.error(
      `Error deleting ${
        filetype === "folder" ? "folder" : "file"
      } ${filepath}:`,
      error
    );
    return;
  }

  try {
    // delete database entry
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM files WHERE ID = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    console.log(`Database entry with the id ${id} successfully deleted`);
  } catch (err) {
    console.error("Error deleting metadata from database", err);
  }
}

//select the desired file or folder and return it
function downloadData(id) {
  return new Promise((resolve, reject) => {
    //select file via id
    db.all("SELECT * From files WHERE id = ? ", [id], (err, rows) => {
      if (err) {
        reject(
          `Error to get the file or folder with the id ${id}. Error: ${err}`
        );
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
function createFolder(currentPath, folderName) {
  let message;

  //set the whole path
  const directory = path.join(currentPath, folderName);

  try {
    //check if the folder already exists
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
      console.log(`${folderName} wurde im Pfad ${directory} erstellt`);

      //save metadata in an array for the database entry
      const params = [
        folderName,
        "folder", //type=folder
        0, //memory size
        directory,
        currentDate,
        directory,
      ];

      db.run(
        "INSERT INTO files (filename, filetype, filesize, filepath, date, localFilePath) VALUES (?, ?, ?, ?, ?, ?)",
        params,
        (err) => {
          if (err) {
            console.log(`Error to upload metadata: ${err}`);
          }
        }
      );

      message = `Der Ordner ${folderName} mit dem Pfad ${currentPath} wurde erfolgreich erstellt.`;
    } else {
      message = `Der Ordner ${folderName} mit dem Pfad ${currentPath} exisitiert bereits`;
    }
  } catch (err) {
    console.log(`Error to create folder: ${err}`);
  }
  return message;
}

function getAllFilesFromFolder(filepath) {
  filepath = filepath + "/%";
  return new Promise((resolve, rejects) => {
    db.all(
      "SELECT * FROM files WHERE filepath LIKE ?",
      [filepath],
      (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(`get all files from folder: ${rows}`);
          resolve(rows);
        }
      }
    );
  });
}

module.exports = {
  uploadSingleFile,
  getFilesInFolder,
  downloadData,
  deleteFile,
  renameFile,
  createFolder,
  getDataFromFolder,
  getAllFilesFromFolder,
};
