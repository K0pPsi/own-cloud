import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import NewFolderModal from "./FolderModal";

const FileUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  //post function to upload the file
  const handleUpload = async () => {
    if (!file) {
      alert("You must select a file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await axios.post(
        "http://localhost:3000/api/files/uploads",
        formData
      );

      alert(uploadResponse.data.message);

      setUploading(false);
      onUploadSuccess(); // Call Back function to update the list
    } catch (e) {
      console.log("Error: " + e);
      setUploading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCreateFolder = async (folderName) => {
    const response = await axios.get(
      `http://localhost:3000/api/files/folder/${folderName}`
    );

    onUploadSuccess();
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
            <div>
              <button className="btn btn-dark" onClick={handleOpenModal}>
                Ordner erstellen
              </button>
              <NewFolderModal
                show={showModal}
                handleClose={handleCloseModal}
                handleCreateFolder={handleCreateFolder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
