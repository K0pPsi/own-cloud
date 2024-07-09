import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";

const ListOfAllFiles = ({ uploadCount }) => {
  const [files, setFiles] = useState([]);

  //get all files from the server
  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/files/list");
      setFiles(response.data.data);
    } catch (err) {
      console.error(`Error fetching files: ${err}`);
    }
  };

  //when the uploadCount variable was changed the function fetchFiles is running
  useEffect(() => {
    fetchFiles();
  }, [uploadCount]);

  //delete file from server
  async function handleDeleteButton(id, filename, filepath) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/files/delete/${id}`,
        {
          params: { filepath },
        }
      );

      alert(`${filename} ${response.data.message}`);
      fetchFiles();
    } catch (err) {
      console.log(err);
      alert("Error to delte file");
    }
  }

  //recive the file from server and download it on client side
  async function handleDownloadButton(id, filename) {
    const response = await axios.get(
      `http://localhost:3000/api/files/download/${id}`,
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
      <table className="table table-hover">
        <thead>
          <tr className="">
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
                <div aria-label="Aktionen">
                  <button
                    type="button"
                    className="btn btn-danger btn me-2"
                    onClick={() =>
                      handleDeleteButton(file.id, file.filename, file.filepath)
                    }
                  >
                    Löschen
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning btn me-2"
                    onClick={() => {
                      handleDownloadButton(file.id, file.filename);
                    }}
                  >
                    Herunterladen
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary "
                    onClick={handleRenameButton()}
                  >
                    Umbenennen
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListOfAllFiles;
