const { rejects } = require("assert");
const db = require("../db");
const fs = require("fs-extra");
const moment = require("moment");
const path = require("path");

const currentDate = moment().format("DD-MM-YYYY");
const trashPath = "/Volumes/Cloud/Papierkorb";

//// ================= 📂 File-Functions ================= ////

function uploadSingleFile(fileData, currentViewPath, localFileName) {
  const fileType = fileData.originalname.split(".").pop();
  const fullFilePath = `${currentViewPath}${fileData.originalname}`;
  const formatSize = formatFileSize(fileData.size);

  const params = [
    fileData.originalname,
    fileType,
    formatSize,
    fullFilePath,
    currentDate,
    localFileName,
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
}

async function deleteFile(id, filepath, filetype, localFilePath) {
  try {
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
    console.error(`Error deleting ${filetype}: ${filepath}`, error);
    return;
  }

  try {
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

function renameFile(newFileName, fileId) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE files SET filename = ? WHERE id = ?",
      [newFileName, fileId],
      (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve({ message: "Successfully renamed the file" });
        }
      }
    );
  });
}

//// ================= 📁 Folder-Functions ================= ////

function createFolder(currentPath, folderName) {
  const directory = path.join(currentPath, folderName);
  let message;

  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
      console.log(`${folderName} wurde im Pfad ${directory} erstellt`);

      const params = [
        folderName,
        "folder",
        "-",
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
      message = `Der Ordner ${folderName} mit dem Pfad ${currentPath} existiert bereits`;
    }
  } catch (err) {
    console.log(`Error to create folder: ${err}`);
  }
  return message;
}

function getFilesInFolder(folderPath) {
  return new Promise((resolve, reject) => {
    if (!folderPath.endsWith("/")) {
      folderPath += "/";
    }

    console.log(folderPath);
    const likePattern = `${folderPath}%`;
    const depthCondition = `instr(substr(filepath, length(?) + 1), '/') = 0`;

    db.all(
      `SELECT * FROM files WHERE filepath LIKE ? AND ${depthCondition}`,
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

function getAllFilesFromFolder(filepath) {
  filepath = filepath + "/%";
  return new Promise((resolve, reject) => {
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

//// ================= 🗑️ Trash ================= ////

function moveIntoTrash(id, localFilePath, fileName) {
  const localFileName = path.basename(localFilePath);
  const onlyFileName = path.basename(fileName);

  fs.rename(localFilePath, `${trashPath}/${localFileName}`, (e) => {
    if (e) {
      console.log(e);
    }
  });

  db.all("UPDATE files SET localFilePath = ?, filepath = ? WHERE id = ?", [
    `${trashPath}/${localFileName}`,
    `${trashPath}/${onlyFileName}`,
    id,
  ]);
}

function getTrashFiles() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM files WHERE localFilePath LIKE ?",
      [`${trashPath}/%`],
      (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

function recreateFile(id, localFilePath, filepath, fileName, macBookUsbPath) {
  const localFileName = path.basename(localFilePath);
  const onlyFileName = path.basename(fileName);

  fs.rename(localFilePath, `${macBookUsbPath}/${localFileName}`, (e) => {
    if (e) {
      console.log(e);
    }
  });

  db.all("UPDATE files SET localFilePath = ?, filepath = ? WHERE id = ?", [
    `${macBookUsbPath}/${localFileName}`,
    `${macBookUsbPath}/${onlyFileName}`,
    id,
  ]);
}

//// ================= 📥 File/Folder-Download ================= ////

function downloadData(id) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM files WHERE id = ?", [id], (err, rows) => {
      if (err) {
        reject(`Error to get the file or folder with id ${id}: ${err}`);
      } else {
        resolve(rows);
      }
    });
  });
}

//// ================= 🔧 File Size  ================= ////

function formatFileSize(size) {
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(2)} ${units[index]}`;
}

module.exports = {
  uploadSingleFile,
  getFilesInFolder,
  downloadData,
  deleteFile,
  renameFile,
  createFolder,
  getAllFilesFromFolder,
  moveIntoTrash,
  getTrashFiles,
  recreateFile,
  formatFileSize,
};
