const express = require("express");
const router = express.Router();
const path = require("path");
const fileController = require("../controllers/fileController");
const multer = require("multer");
const fs = require("fs-extra");
const archiver = require("archiver");
const { addAbortListener } = require("events");

// Dev path for MacBook
const macBookUsbPath = "/Volumes/Cloud/Home";

// Configure multer for file uploads
const upload = multer({
  dest: macBookUsbPath,
});

// Route to upload a single file
router.post(
  "/uploads/:currentPath",
  upload.single("file"),
  async (req, res) => {
    const fileData = req.file;
    const currentViewPath = req.params.currentPath;
    const localFileName = `${macBookUsbPath}/${req.file.filename}`;

    try {
      await fileController.uploadSingleFile(
        fileData,
        currentViewPath,
        localFileName
      );
      res.json({ success: true, message: "Uploaded successfully" });
    } catch (err) {
      console.error(`Error uploading file: ${err}`);
      res.status(500).json({ success: false, message: "Error uploading file" });
    }
  }
);

//route to get all files and folder from current path
router.get("/list/:currentPath", async (req, res) => {
  const folderPath = req.params.currentPath;

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
      req.query.filetype,
      req.query.localFilePath
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
    return res.status(404).send("Folder not found");
  }

  const resource = response[0];

  if (resource.filetype === "folder") {
    const allFilesFromFolder = await fileController.getAllFilesFromFolder(
      req.query.filepath
    );

    const archive = archiver("zip", {
      zlib: { level: 9 }, // Kompressionsstufe
    });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${resource.filename}.zip` //attachment = that the browser know to download file
    );

    archive.on("error", function (err) {
      throw err;
    });

    archive.pipe(res); //pipe = send the zip folder directly to the client

    for (const item of allFilesFromFolder) {
      const localFilePath = item.localFilePath;
      archive.file(localFilePath, { name: item.filename }); // add files to zip archive
    }

    await archive.finalize(); // finalize the archive and complete the compression process
  } else {
    const desiredFile = await fs.createReadStream(resource.localFilePath);
    desiredFile.pipe(res); //return the desired file
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

router.post("/createFolder", async (req, res) => {
  const folderName = req.body.params.folderName;
  const currentPath = req.body.params.currentPath;

  try {
    const response = await fileController.createFolder(currentPath, folderName);
    res.json({ message: response });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
