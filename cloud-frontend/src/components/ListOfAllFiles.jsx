import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import RenameModal from "./modal/RenameModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faFile } from "@fortawesome/free-solid-svg-icons";

import "../styles/ListOfAllFiles.css"; // Neue CSS-Datei

const ListOfAllFiles = ({ uploadCount, folderChange, currentPath }) => {
  const [files, setFiles] = useState([]);
  const [fileData, setFileData] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/files/list/${encodeURIComponent(
          currentPath
        )}`
      );
      setFiles(response.data.data);
    } catch (err) {
      console.error(`Error fetching files: ${err}`);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [uploadCount, folderChange]);

  async function handleDeleteButton(
    id,
    filename,
    filepath,
    filetype,
    localFilePath
  ) {
    alert(localFilePath);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/files/delete/${id}`,
        { params: { filepath, filetype, localFilePath } }
      );

      alert(`${filename} ${response.data.message}`);
      fetchFiles();
    } catch (err) {
      console.log(err);
      alert("Error deleting file");
    }
  }

  async function handleDownloadButton(id, filename, filetype, filepath) {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/files/download/${id}`,
        { responseType: "blob", params: { filepath } } //blob = binary data
      );

      const blob = new Blob([response.data], {
        type:
          filetype === "folder"
            ? "application/zip"
            : "application/octet-stream",
      });

      const temporaryUrl = window.URL.createObjectURL(blob);
      // If it's a folder, save as .zip, otherwise use the file's original name
      const extension = filetype === "folder" ? ".zip" : "";
      saveAs(temporaryUrl, `${filename}${extension}`);
    } catch (err) {
      console.error(`Error downloading file: ${err}`);
    }
  }

  function handleRenameButton(file) {
    setFileData(file);
  }

  async function handleFolderClick(folderPath) {
    folderChange(folderPath + "/");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/files/list/${encodeURIComponent(
          folderPath + "/"
        )}`
      );
      setFiles(response.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  // Extract the path after "Home/"
  const basePath = "/Volumes/Cloud/Home";
  const relativePath = currentPath.replace(basePath, ""); // Strip out the base path

  // Split the relative path into parts for breadcrumbs
  const pathParts = relativePath.split("/").filter(Boolean); //pathParts = Array

  // Handle breadcrumb click
  const handleBreadcrumbClick = (index) => {
    // Rebuild the path based on the clicked breadcrumb
    const newPath =
      basePath + "/" + pathParts.slice(0, index + 1).join("/") + "/";
    folderChange(newPath); // Navigate to the clicked path
  };

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    return (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li
            className="breadcrumb-item"
            style={{ cursor: "pointer" }}
            onClick={() => handleFolderClick(basePath)}
          >
            Home
          </li>
          {/* Called only when the pathParts array contains elements */}
          {pathParts.map((part, index) => (
            <li
              key={index}
              className={`breadcrumb-item ${
                index === pathParts.length - 1 ? "active" : ""
              }`}
              style={{
                cursor: index !== pathParts.length - 1 ? "pointer" : "default",
              }}
              onClick={() =>
                index !== pathParts.length - 1 && handleBreadcrumbClick(index)
              }
              aria-current={index === pathParts.length - 1 ? "page" : undefined}
            >
              {part}
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  return (
    <div className="container mt-4">
      {renderBreadcrumbs()} {/* Breadcrumb navigation */}
      <div className="table-responsive custom-table">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Hochgeladen am</th>
              <th className="text-center" scope="col">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>
                  <FontAwesomeIcon
                    icon={file.filetype === "folder" ? faFolder : faFile}
                    className="me-2"
                  />
                  {file.filetype === "folder" ? (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => handleFolderClick(file.filepath)}
                    >
                      {file.filename}
                    </span>
                  ) : (
                    <span>{file.filename}</span>
                  )}
                </td>
                <td>{file.date}</td>
                <td className="text-center">
                  <button
                    type="button"
                    className="btn btn-danger me-2"
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
                  <button
                    type="button"
                    className="btn btn-warning me-2"
                    onClick={() =>
                      handleDownloadButton(
                        file.id,
                        file.filename,
                        file.filetype,
                        file.filepath
                      )
                    }
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
