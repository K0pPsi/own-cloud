const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const multer = require("multer");
const fs = require("fs-extra");

//dev path for macbook
const macBookUsbPasth = "/Volumes/Cloud";
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
    fileController.deleteFile(req.params.id, req.query.filepath);
    res.json({ success: true, message: `delete successfull` });
  } catch (err) {
    console.log(`Error deleting the file: ${err}`);
    res.json({ success: false, message: `Error deleting file` });
  }
});

//route to download file from server
router.get("/download/:id", async (req, res) => {
  const response = await fileController.downloadData(req.params.id);

  const desiredFile = await fs.createReadStream(response[0].filepath);
  desiredFile.pipe(res);
});

module.exports = router;
