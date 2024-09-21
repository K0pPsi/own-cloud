import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";
import { useState } from "react";

const CreateFolderModal = ({ onUploadSuccess }) => {
  const [folderName, setFolderName] = useState("");

  const handleSave = async () => {
    console.log("Ordnername:", folderName);
    const response = await axios.post(
      "http://localhost:3000/api/files/create",
      {
        params: {
          folderName: folderName,
        },
      }
    );

    onUploadSuccess(); // Refreshes the view of files and folders to ensure all new data is displayed.
    console.log(response);
  };

  const handleInputChange = (event) => {
    setFolderName(event.target.value);
  };

  return (
    <div
      className="modal fade"
      id="createFolderModal"
      tabIndex="-1"
      aria-labelledby="createFolderModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createFolderModalLabel">
              Ordner erstellen
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control"
              value={folderName}
              onChange={handleInputChange}
              placeholder="Ordnername eingeben"
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              data-bs-dismiss="modal"
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
