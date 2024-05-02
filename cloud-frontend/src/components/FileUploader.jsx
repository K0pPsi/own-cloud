import React, { useState } from "react";
import axios from "axios";

const FileUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  //post function to upload the file
  const handleUpload = async () => {
    if (!file) {
      alert("You must select a file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await axios.post(
        "http://localhost:3000/api/files/uploads",
        formData
      );

      if (uploadResponse.data.success) {
        alert(uploadResponse.data.name + uploadResponse.data.message);
      } else {
        alert(uploadResponse.data.message);
      }

      setUploading(false);
      onUploadSuccess(); // Call Back function to update the list
    } catch (e) {
      console.log("Error: " + e);
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
};

export default FileUploader;
