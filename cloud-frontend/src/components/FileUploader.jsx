import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import NewFolderModal from "./FolderModal";
import "../styles/FileUploader.css";

const FileUploader = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    console.log("Test");
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
              className="dropdown-item custom-dropdown-item"
              style={{ cursor: "pointer" }}
            >
              Ordner hochladen
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploader;
