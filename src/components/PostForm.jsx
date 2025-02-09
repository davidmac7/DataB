import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

function PostForm({ profile }) {
  const [formData, setFormData] = useState({
    name: "",
    partNumber: "",
    serialNumber: "",
    comment: "",
    status: "functioning", // default status
    image: null,
  });

  // Handle changes in form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile || !profile.aircraftId) {
      console.error("No aircraft profile found in session");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("partNumber", formData.partNumber);
    formDataToSend.append("serialNumber", formData.serialNumber);
    formDataToSend.append("comment", formData.comment);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("image", formData.image); // Attach image file
    formDataToSend.append("aircraftId", profile.aircraftId);
    
    try {
      // Send form data to the backend (API route for submitting post)
      const res = await axios.post("http://localhost:5000/api/post-component", formDataToSend, {
        withCredentials: true,  // Ensure cookies (session) are sent with the request
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      console.log("Post submitted:", res.data);
      // Optionally clear the form after submission
      setFormData({
        name: "",
        partNumber: "",
        serialNumber: "",
        comment: "",
        status: "functioning",
        image: null,
      });
    } catch (error) {
      console.error("Error submitting post:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Component Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <input
            type="text"
            name="partNumber"
            className="form-control"
            placeholder="Part Number"
            value={formData.partNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <input
            type="text"
            name="serialNumber"
            className="form-control"
            placeholder="Serial Number"
            value={formData.serialNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <textarea
            name="comment"
            className="form-control"
            placeholder="Comment"
            value={formData.comment}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group mb-3">
          <select
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="functioning">Functioning</option>
            <option value="non-functioning">Non-functioning</option>
          </select>
        </div>

        <div className="form-group mb-3">
          <input
            type="file"
            name="image"
            className="form-control"
            accept=".jpg, .jpeg, .png"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default PostForm;
