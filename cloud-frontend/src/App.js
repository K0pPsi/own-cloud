import ListOfAllFiles from "./components/ListOfAllFiles";
import React, { useState } from "react";
import FileUploader from "./components/FileUploader";

const App = () => {
  const [uploadCount, setUploadCount] = useState(0);

  //increase the upload variable and the useEffect is running
  const handleUploadSuccess = () => {
    setUploadCount((prevCount) => prevCount + 1);
  };

  return (
    <div>
      <FileUploader onUploadSuccess={handleUploadSuccess} />
      <ListOfAllFiles uploadCount={uploadCount} />
    </div>
  );
};

export default App;
