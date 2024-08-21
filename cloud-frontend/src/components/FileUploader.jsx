import React, { useState } from "react";
import axios from "axios";
import "../styles/FileUploader.css";
import CreateFolderModal from "./modal/CreateFolderModal";

const FileUploader = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);

  //post function to upload the file
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

  const handleCreateFolder = async () => {
    const response = await axios.post("http://localhost:3000/api/files/create");

    console.log(response);
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="dropdown">
        <button
          className="btn btn-lg btn-outline-primary custom-btn dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Neu
        </button>
        <ul
          className="dropdown-menu custom-dropdown-menu"
          aria-labelledby="dropdownMenuButton"
        >
          <li>
            <label
              className="dropdown-item custom-dropdown-item"
              style={{ cursor: "pointer" }}
            >
              Datei hochladen
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
            </label>
          </li>
          <li>
            <label
              data-bs-toggle="modal"
              data-bs-target="#createFolderModal"
              className="dropdown-item custom-dropdown-item"
              style={{ cursor: "pointer" }}
            >
              Ordner erstellen
            </label>
          </li>
        </ul>
      </div>
      <CreateFolderModal />
    </div>
  );
};

export default FileUploader;
