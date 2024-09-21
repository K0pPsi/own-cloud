const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const multer = require("multer");
const fs = require("fs-extra");
const archiver = require("archiver");

//dev path for macbook
const macBookUsbPasth = "/Volumes/Cloud/Home";
//storagepath
const upload = multer({
  dest: macBookUsbPasth,
});

//route to upload single file
router.post("/uploads", upload.single("file"), async (req, res) => {
  //save file data from client
  const fileData = req.file;

  try {
    await fileController.uploadSingleFile(fileData);
    res.json({ success: true, message: "uploaded successfully" });
  } catch (err) {
    console.log(`Error to upload file ${err}`);
  }
});

//route to get all files information from the database
router.get("/list", async (req, res) => {
  try {
    const response = await fileController.readAllData();
    res.json({ success: true, data: response });
  } catch (err) {
    console.error(`Error fetching data: ${err}`);
    res
      //500 = server error
      .status(500)
      .json({ success: false, message: "Error querying the database" });
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
