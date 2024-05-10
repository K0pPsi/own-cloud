const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const multer = require("multer");
const macBookUsbPasth = "/Volumes/Cloud";

const fs = require("fs-extra");

const upload = multer({
  dest: "uploads",
});

//save the file on the server and then move it to the hard disk
router.post("/uploads", upload.single("file"), async (req, res) => {
  const fileName = req.file.originalname;
  const filePathOnServer = req.file.path;

  console.log(`${filePathOnServer} filedata`);

  try {
    await fileController.saveFile(fileName, filePathOnServer);

    res.json({
      success: true,
      message: `${fileName} uploaded successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error uploading file." });
  }
});

//send all files to the frontend
router.get("/list", (req, res) => {
  const allFiles = fileController.readAllFiles();
  res.json({ file: allFiles });
});

//delete the file - :file = is needed to delete the correct file
router.delete("/delete/:file", async (req, res) => {
  const fileName = req.params.file;
  try {
    fileController.deleteFile(fileName);
  } catch (error) {
    console.log(error);
  }

  res.json({
    success: true,
    message: `${fileName} delete successfully.`,
  });
});

//download route to get the desired File for the Client
router.get("/download/:file", async (req, res) => {
  const desiredFile = await fileController.downloadFile(req.params.file);
  desiredFile.pipe(res);
});

module.exports = router;
