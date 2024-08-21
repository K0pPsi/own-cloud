import { useEffect, useState } from "react";
import axios from "axios";

const RenameModal = ({ fileData, fetchFiles }) => {
  const { id, filename, filepath, date, filesize, filetype } = fileData;
  const [newFileName, setNewFileName] = useState("");

  //set the current filename as the new filename because the user should see the current name of the file before renaming it
  useEffect(() => {
    if (filename !== null && filename !== undefined) {
      setNewFileName(filename);
    } else {
      setNewFileName("");
    }
  }, [fileData]);

  //handle input field and set new name
  function handleInput(value) {
    setNewFileName(value);
  }

  //rename file function
  async function handleSaveRename() {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/files/rename/${id}`,
        {
          params: { fileData, newFileName },
        }
      );
    } catch (e) {
      console.log(e);
    }

    //update list
    fetchFiles();
  }

  return (
    <div
      className="modal fade"
      id="renameModal"
      tabIndex="-1"
      aria-labelledby="renameModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="renameModalLabel">
              Umbennen
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
              value={newFileName || ""}
              onChange={(e) => handleInput(e.target.value)}
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
              onClick={() => handleSaveRename()}
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

export default RenameModal;
