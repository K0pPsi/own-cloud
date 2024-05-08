import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ListOfAllFiles = ({ uploadCount }) => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/files/list");

      //filter Trash file
      const visibleFiles = response.data.file.filter(
        (file) => !file.startsWith(".") && !file.startsWith("/.")
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
  async function handleDeleteButton(file) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/files/delete/${file}`
      );

      alert(response.data.message);
      fetchFiles();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Alle Dateien:</h1>
      <div className="list-group">
        {files.map((file, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="">{file}</h6>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteButton(file)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOfAllFiles;
