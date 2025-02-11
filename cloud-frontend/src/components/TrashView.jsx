import axios from "axios";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";

const TrashView = () => {
  const [trashFiles, setTrashFiles] = useState([]);

  // get deleted files
  const getTrashFiles = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/files/trash`);
      setTrashFiles(response.data.response);
    } catch (error) {
      console.error("Fehler beim Laden der Dateien:", error);
    }
  };

  useEffect(() => {
    getTrashFiles();
  }, []);

  // delete file and folder
  async function handleDeleteButton(
    id,
    filename,
    filepath,
    filetype,
    localFilePath
  ) {
    try {
      await axios.delete(`http://localhost:3000/api/files/deleteTrash/${id}`, {
        params: { filepath, filetype, localFilePath, filename },
      });

      Swal.fire({
        title: `${filename} wurde endgültigt gelöscht`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
      getTrashFiles();
    } catch (err) {
      console.log("Fehler beim löschen" + err);
    }
  }

  // recreate file or folder
  async function handleRecreateButton(
    id,
    filename,
    filepath,
    filetype,
    localFilePath
  ) {
    try {
      await axios.patch(
        `http://localhost:3000/api/files/recreateFromTrash/${id}`,
        { filepath, filetype, localFilePath, filename }
      );

      Swal.fire({
        title: `${filename} wurde erfolgreich wiederhergestellt!`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });

      getTrashFiles();
    } catch (err) {
      console.log("Fehler beim Wiederherstellen der Datei" + err);
    }
  }

  return (
    <div className="container mt-4">
      <div className="table-responsive custom-table">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Dateigröße</th>
              <th className="text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {trashFiles.length > 0 ? (
              trashFiles.map((file) => (
                <tr key={file.id}>
                  <td>
                    {file.filetype === "folder" ? (
                      <span style={{ cursor: "pointer" }}>{file.filename}</span>
                    ) : (
                      <span>{file.filename}</span>
                    )}
                  </td>
                  <td>{file.filesize || "Unbekannt"}</td> {}
                  <td className="text-center">
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm me-2"
                        title="Löschen"
                        onClick={() =>
                          handleDeleteButton(
                            file.id,
                            file.filename,
                            file.filepath,
                            file.filetype,
                            file.localFilePath
                          )
                        }
                      >
                        Löschen
                      </button>
                    </div>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn btn-warning btn-sm me-2"
                        title="Wiederherstellen"
                        onClick={() =>
                          handleRecreateButton(
                            file.id,
                            file.filename,
                            file.filepath,
                            file.filetype,
                            file.localFilePath
                          )
                        }
                      >
                        Wiederherstellen
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  Keine Dateien im Papierkorb
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrashView;
