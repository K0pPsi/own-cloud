import React, { useState } from "react";
import axios from "axios";
import "../styles/FileUploader.css";
import CreateFolderModal from "./modal/CreateFolderModal";

const FileUploader = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await axios.post(
        "http://localhost:3000/api/files/uploads",
        formData
      );

      alert(uploadResponse.data.message);
      onUploadSuccess();
      setUploading(false);
    } catch (e) {
      console.log("Error: " + e);
      setUploading(false);
    }
  };

  return (
    <div className="file-uploader-container">
      <div className="upload-area">
        <button
          className="btn btn-primary custom-btn"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#createFolderModal"
        >
          Ordner erstellen
        </button>
        <label className="btn btn-outline-primary custom-upload-btn">
          Datei hochladen
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
        </label>
      </div>
      <CreateFolderModal onUploadSuccess={onUploadSuccess} />
    </div>
  );
};

export default FileUploader;
