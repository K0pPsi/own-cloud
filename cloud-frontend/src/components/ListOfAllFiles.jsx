import { useEffect, useState } from "react";
import axios from "axios";

const ListOfAllFiles = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3000/api/files/list");
      console.log(response.data.file);

      //filter Trash file
      const visibleFiles = response.data.file.filter(
        (file) => !file.startsWith(".") && !file.startsWith("/.")
      );
      setFiles(visibleFiles);
    };

    fetchData();
  }, []);

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
