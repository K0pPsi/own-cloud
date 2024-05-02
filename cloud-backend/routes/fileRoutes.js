const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Upload File
router.post("/uploads", upload.single("file"), async (req, res) => {
  const fileName = req.file.originalname;
  //save the file on the server and then upload it to the hard disk
  const fileData = req.file.path;

  console.log(`${fileData} filedata`);

  try {
    await fileController.saveFile(fileName, fileData);

    res.json({
      success: true,
      message: " uploaded successfully.",
      name: fileName,
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

module.exports = router;
