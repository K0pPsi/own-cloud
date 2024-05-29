const sqlite3 = require("sqlite3").verbose();
const dbPath = "/Volumes/CLOUD/own-cloud-db";

// connect database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Error to open database:", err.message);
  } else {
    console.log("Open database successfully");
  }
});

module.exports = db;
