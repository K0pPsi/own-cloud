import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import RenameModal from "./modal/RenameModal";
import "../styles/ListOfAllFiles.css"; // Neue CSS-Datei

const ListOfAllFiles = ({ uploadCount }) => {
  const [files, setFiles] = useState([]);
  const [fileData, setFileData] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/files/list");
      setFiles(response.data.data);
    } catch (err) {
      console.error(`Error fetching files: ${err}`);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [uploadCount]);

  async function handleDeleteButton(id, filename, filepath) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/files/delete/${id}`,
        { params: { filepath } }
      );

      alert(`${filename} ${response.data.message}`);
      fetchFiles();
    } catch (err) {
      console.log(err);
      alert("Error deleting file");
    }
  }

  async function handleDownloadButton(id, filename) {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/files/download/${id}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      saveAs(url, filename);
    } catch (err) {
      console.error(`Error downloading file: ${err}`);
    }
  }

  function handleRenameButton(file) {
    setFileData(file);
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Alle Dateien:</h4>
      <div className="table-responsive custom-table">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Dateiname</th>
              <th scope="col">Hochgeladen am</th>
              <th className="text-center" scope="col">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>{file.filename}</td>
                <td>{file.date}</td>
                <td className="text-center">
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={() =>
                      handleDeleteButton(file.id, file.filename, file.filepath)
                    }
                  >
                    Löschen
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning me-2"
                    onClick={() => handleDownloadButton(file.id, file.filename)}
                  >
                    Herunterladen
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleRenameButton(file)}
                    data-bs-toggle="modal"
                    data-bs-target="#renameModal"
                  >
                    Umbenennen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RenameModal fileData={fileData} fetchFiles={fetchFiles} />
    </div>
  );
};

export default ListOfAllFiles;
