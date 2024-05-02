import { useEffect, useState } from "react";
import axios from "axios";

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
    <div>
      <h1>Alle Dateien:</h1>
      {files.map((file, index) => (
        <p key={index}>{file}</p>
      ))}
    </div>
  );
};

export default ListOfAllFiles;
