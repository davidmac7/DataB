import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PostDefect = () => {
  const { componentId } = useParams(); // Get componentId from the URL
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("componentId", componentId); // Ensure componentId is included

    try {
      const response = await axios.post("http://localhost:5000/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };

  return (
    <div>
      <h3>Upload Document or Image for Component {componentId}</h3>
      <input type="file" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};

export default PostDefect;
