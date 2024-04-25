const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

//Upload File
router.post("/uploads", upload.single("file"), (req, res) => {
  const fileName = req.file.originalname;
  const fileData = req.file.path;

  fileController.saveFile(fileName, fileData);
});

router.get("/list", (req, res) => {
  const allFiles = fileController.readAllFiles();
  res.json({ file: allFiles });
});

module.exports = router;
