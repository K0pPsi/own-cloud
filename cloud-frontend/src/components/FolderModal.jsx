import React, { useState } from "react";

const NewFolderModal = ({ show, handleClose, handleCreateFolder }) => {
  const [folderName, setFolderName] = useState("");

  const handleChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleSubmit = () => {
    handleCreateFolder(folderName);
    handleClose();
  };

  return (
    <div
      className={`modal ${show ? "d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Neuer Ordner</h5>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <input
                type="text"
                className="form-control mt-2"
                id="folderName"
                placeholder="Ordnername eingeben"
                value={folderName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFolderModal;
