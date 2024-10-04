import ListOfAllFiles from "./components/ListOfAllFiles";
import React, { useState } from "react";
import FileUploader from "./components/FileUploader";
import NavBar from "./components/NavBar";

const App = () => {
  const [uploadCount, setUploadCount] = useState(0);
  const [currentPath, setCurrentPath] = useState("/Volumes/Cloud/Home/");

  //increase the upload variable and the useEffect is running
  const handleUploadSuccess = () => {
    setUploadCount((prevCount) => prevCount + 1);
  };

  const handleFolderChange = (newPath) => {
    setCurrentPath(newPath);
  };

  return (
    <div>
      <NavBar folderChange={handleFolderChange} />
      <FileUploader
        onUploadSuccess={handleUploadSuccess}
        currentPath={currentPath}
      />
      <ListOfAllFiles
        uploadCount={uploadCount}
        folderChange={handleFolderChange}
        currentPath={currentPath}
      />
    </div>
  );
};

export default App;
