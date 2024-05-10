import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";

const ListOfAllFiles = ({ uploadCount }) => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/files/list");

      //filter Trash file
      const visibleFiles = response.data.file.filter(
        (file) =>
          !file.startsWith(".") &&
          !file.startsWith("/.") &&
          !file.startsWith("System Volume Information")
      );
      setFiles(visibleFiles);
    } catch (error) {
      console.error("Error fetching files: ", error);
    }
  };

  //when the uploadCount variable was changed the function fetchFiles is running
  useEffect(() => {
    fetchFiles();
  }, [uploadCount]);

  //delete file from server
  async function handleDeleteButton(filename) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/files/delete/${filename}`
      );

      alert(response.data.message);
      fetchFiles();
    } catch (error) {
      console.log(error);
    }
  }

  //recive the file from server and download it on client side
  async function handleDownloadButton(filename) {
    const response = await axios.get(
      `http://localhost:3000/api/files/download/${filename}`,
      // The option '{ responseType: "blob" }' is necessary to receive the data as Blob data.
      { responseType: "blob" }
    );

    //blob (binary large object) is used to store  data recived from the server
    const blob = new Blob([response.data]);

    //create an url that represents the blob data as if it were hosted from the server
    const url = window.URL.createObjectURL(blob);

    //npm package - file saver is used to download the data from the url
    saveAs(url, filename);
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Alle Dateien:</h4>
      <div className="list-group">
        {files.map((filename, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="">{filename}</h6>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteButton(filename)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      handleDownloadButton(filename);
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOfAllFiles;
