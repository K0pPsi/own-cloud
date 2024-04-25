import ListOfAllFiles from "./components/ListOfAllFiles";
import React, { useState } from "react";
const { default: FileUploader } = require("./components/FileUploader");

const App = () => {
  return (
    <div>
      <FileUploader />
      <ListOfAllFiles />
    </div>
  );
};

export default App;
