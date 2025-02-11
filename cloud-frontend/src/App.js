import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListOfAllFiles from "./components/ListOfAllFiles";
import FileUploader from "./components/FileUploader";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import TrashView from "./components/TrashView"; // Papierkorb-Komponente importieren
import "./styles/App.css";

const App = () => {
  const [uploadCount, setUploadCount] = useState(0);
  const [currentPath, setCurrentPath] = useState("/Volumes/Cloud/Home/");

  const handleUploadSuccess = () => {
    setUploadCount((prevCount) => prevCount + 1);
  };

  const handleFolderChange = (newPath) => {
    setCurrentPath(newPath);
  };

  return (
    <Router>
      <NavBar folderChange={handleFolderChange} />
      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <FileUploader
                  onUploadSuccess={handleUploadSuccess}
                  currentPath={currentPath}
                />
                <ListOfAllFiles
                  uploadCount={uploadCount}
                  folderChange={handleFolderChange}
                  currentPath={currentPath}
                />
              </>
            }
          />

          <Route path="/trash" element={<TrashView />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
