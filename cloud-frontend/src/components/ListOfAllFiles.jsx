import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import RenameModal from "./modal/RenameModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import {
  faFolder,
  faFile,
  faTrash,
  faDownload,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/ListOfAllFiles.css";

const ListOfAllFiles = ({ uploadCount, folderChange, currentPath }) => {
  const [files, setFiles] = useState([]);
  const [fileData, setFileData] = useState([]);

  // Fetch files from server
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

  // Handle file deletion
  async function handleDeleteButton(
    id,
    filename,
    filepath,
    filetype,
    localFilePath
  ) {
    try {
      await axios.delete(`http://localhost:3000/api/files/delete/${id}`, {
        params: { filepath, filetype, localFilePath, filename },
      });

      fetchFiles();
      Swal.fire({
        title: `${filename} wurde gelöscht`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (e) {
      console.log(e);
      Swal.fire({
        title: `${filename} konnte nicht gelöscht werden`,
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }

  // Handle file download
  async function handleDownloadButton(id, filename, filetype, filepath) {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/files/download/${id}`,
        { responseType: "blob", params: { filepath } }
      );

      const blob = new Blob([response.data], {
        type:
          filetype === "folder"
            ? "application/zip"
            : "application/octet-stream",
      });

      const temporaryUrl = window.URL.createObjectURL(blob);
      const extension = filetype === "folder" ? ".zip" : "";
      saveAs(temporaryUrl, `${filename}${extension}`);
    } catch (err) {
      console.error(`Error downloading file: ${err}`);
    }
  }

  // Handle renaming file
  function handleRenameButton(file) {
    setFileData(file);
  }

  // Handle folder click to change directory
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
  const relativePath = currentPath.replace(basePath, "");

  // Split the relative path into parts for breadcrumbs
  const pathParts = relativePath.split("/").filter(Boolean);

  // Handle breadcrumb click
  const handleBreadcrumbClick = (index) => {
    const newPath =
      basePath + "/" + pathParts.slice(0, index + 1).join("/") + "/";
    folderChange(newPath);
  };

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    return (
      <nav aria-label="breadcrumb" className="container">
        <ol className="breadcrumb bg-white shadow-sm p-3 mb-4 rounded">
          <li
            className="breadcrumb-item"
            style={{ cursor: "pointer" }}
            onClick={() => handleFolderClick(basePath)}
          >
            <a className="text-decoration-none text-primary">Home</a>
          </li>
          {pathParts.length > 0 &&
            pathParts.map((part, index) => (
              <li
                key={index}
                className={`breadcrumb-item ${
                  index === pathParts.length - 1 ? "active" : ""
                }`}
                style={{
                  cursor:
                    index !== pathParts.length - 1 ? "pointer" : "default",
                }}
                onClick={() =>
                  index !== pathParts.length - 1 && handleBreadcrumbClick(index)
                }
                aria-current={
                  index === pathParts.length - 1 ? "page" : undefined
                }
              >
                {index === pathParts.length - 1 ? (
                  <span className="text-muted">{part}</span> // Active part in gray
                ) : (
                  <a className="text-decoration-none text-primary">{part}</a> // Clickable parts in blue
                )}
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
              <th scope="col">Zuletzt geändert</th>
              <th scope="col">Dateigröße</th>
              <th className="text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>
                  <FontAwesomeIcon
                    icon={file.filetype === "folder" ? faFolder : faFile}
                    className="me-3"
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
                <td>{file.filesize}</td>
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
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      title="Download"
                      onClick={() =>
                        handleDownloadButton(
                          file.id,
                          file.filename,
                          file.filetype,
                          file.filepath
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                  </div>
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      title="Umbennen"
                      onClick={() => handleRenameButton(file)}
                      data-bs-toggle="modal"
                      data-bs-target="#renameModal"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </div>
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
