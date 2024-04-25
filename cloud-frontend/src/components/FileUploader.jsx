import React, { useState } from "react";
import axios from "axios";

const FileUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("You must select a file");
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("http://localhost:3000/api/files/uploads", formData);
    } catch (e) {
      console.log("Error: " + e);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
    </div>
  );
};

export default FileUploader;
