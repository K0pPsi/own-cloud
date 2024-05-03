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

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Alle Dateien:</h1>
      <ul className="list-group">
        {files.map((file, index) => (
          <li key={index} className="list-group-item list-group-item-action">
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListOfAllFiles;
