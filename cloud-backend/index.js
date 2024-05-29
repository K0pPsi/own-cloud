const express = require("express");
const fileRoutes = require("./routes/fileRoutes");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/files", fileRoutes);

app.listen(port, () => {
  console.log("Server started on Port " + port);
});
