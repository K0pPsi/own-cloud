const express = require("express");
const router = express.Router();
const path = require("path");
const fileController = require("../controllers/fileController");
const multer = require("multer");
const fs = require("fs-extra");
const archiver = require("archiver");

//dev path for macbook
const macBookUsbPasth = "/Volumes/Cloud/Home";
//storagepath
// Funktion, um den Zielordner dynamisch festzulegen
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const currentPath = req.params.currentPath;
    console.log("Insert path: " + currentPath);

    // Hier den gewünschten Upload-Pfad anpassen
    const dir = currentPath; // Direkt auf das USB-Laufwerk zeigen

    // Überprüfe, ob der Zielordner existiert, wenn nicht, erstelle ihn
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating directory: ${err}`);
        return cb(err); // Fehler an multer zurückgeben
      }
      console.log(`Upload directory created or exists: ${dir}`);
      cb(null, dir); // Zielordner an multer zurückgeben
    });
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Du kannst hier auch den Dateinamen ändern
  },
});

// Initialisiere multer mit der benutzerdefinierten Storage Engine
const upload = multer({ storage });

router.post(
  "/uploads/:currentPath",
  upload.single("file"),
  async (req, res) => {
    const fileData = req.file;
    const currentPath = req.params.currentPath;

    console.log(`Current path: ${currentPath}`);

    try {
      await fileController.uploadSingleFile(fileData, currentPath);
      res.json({ success: true, message: "Uploaded successfully" });
    } catch (err) {
      console.log(`Error uploading file: ${err}`);
      res.status(500).json({ success: false, message: "Error uploading file" });
    }
  }
);

//route to get all files and folder from current path
router.get("/list/:currentPath", async (req, res) => {
  const folderPath = req.params.currentPath;
  console.log(folderPath);
  try {
    const response = await fileController.getFilesInFolder(folderPath);
    res.json({ success: true, data: response });
  } catch (err) {
    console.error(`Error fetching data: ${err}`);
    res
      //500 = server error
      .status(500)
      .json({ success: false, message: "Error querying the database" });
  }
});

router.get("/list/:folderpath", async (req, res) => {
  const folderPath = req.params.folderpath;

  console.log(folderPath);
  try {
    const response = await fileController.getFilesInFolder(folderPath);
    console.log("response: " + response);
    res.json({ success: true, data: response });
  } catch (err) {
    console.log(`Error fetching data: ${err}`);
  }
});

//route to delete metadata and file from hard disk
router.delete("/delete/:id", async (req, res) => {
  try {
    fileController.deleteFile(
      req.params.id,
      req.query.filepath,
      req.query.filetype
    );
    res.json({ success: true, message: `delete successfull` });
  } catch (err) {
    console.log(`Error deleting the file: ${err}`);
    res.json({ success: false, message: `Error deleting file` });
  }
});

// Route to download a file
router.get("/download/:id", async (req, res) => {
  const response = await fileController.downloadData(req.params.id);

  if (!response || response.length === 0) {
    return res.status(404).send("File not found");
  }

  const file = response[0];

  if (file.filetype === "folder") {
    // If it's a folder, zip it and send
    const folderPath = file.filepath;

    // Set the headers to indicate a zip file download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.filename}.zip`
    );

    const archive = archiver("zip", {
      zlib: { level: 9 }, // Compression level
    });

    archive.on("error", function (err) {
      throw err;
    });

    // Pipe the archive to the response
    archive.pipe(res);

    // Append files from the folder
    archive.directory(folderPath, false);

    // Finalize the archive
    await archive.finalize();
  } else {
    // If it's a file, send the file as before
    const desiredFile = await fs.createReadStream(file.filepath);
    desiredFile.pipe(res);
  }
});

//route to rename the file in the database
router.patch("/rename/:id", async (req, res) => {
  const newFileName = req.body.params.newFileName;
  const fileId = req.body.params.fileData.id;

  try {
    await fileController.renameFile(newFileName, fileId);
    res.json({ success: true });
  } catch (e) {
    console.log(e);
  }
});

router.post("/create", async (req, res) => {
  const folderName = req.body.params.folderName;
  try {
    const resultMessage = await fileController.createFolder(
      macBookUsbPasth,
      folderName
    );
    res.json({ message: resultMessage });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
