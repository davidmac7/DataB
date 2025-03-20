import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

function PostForm({ profile, role }) {
  const [formData, setFormData] = useState({
    systemName: "", // ✅ Added System Name
    name: "",
    partNumber: "",
    serialNumber: "",
    comment: "",
    status: "", // default status
    category: "", 
    image: null,
    doc: null, // ✅ Added document field
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const roleCategories = [];
    if (role === "Admin") {
      roleCategories.push("X", "R", "A");
    } else if (role === "X") {
      roleCategories.push("X");
    } else if (role === "R") {
      roleCategories.push("R");
    } else if (role === "A") {
      roleCategories.push("A");
    }
    setCategories(roleCategories);
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleDocChange = (e) => {
    const file = e.target.files[0];
    if (file && !["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      alert("Only .doc, .docx, and .pdf files are allowed.");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      doc: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile || !profile.aircraftId) {
      console.error("No aircraft profile found in session");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("systemName", formData.systemName); // ✅ Include System Name
    formDataToSend.append("name", formData.name);
    formDataToSend.append("partNumber", formData.partNumber);
    formDataToSend.append("serialNumber", formData.serialNumber);
    formDataToSend.append("comment", formData.comment);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("image", formData.image);
    formDataToSend.append("doc", formData.doc);
    formDataToSend.append("aircraftId", profile.aircraftId);

    try {
      const res = await axios.post("http://localhost:5000/api/post-component", formDataToSend, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Post submitted:", res.data);
      setFormData({
        systemName: "", // ✅ Clear System Name after submit
        name: "",
        partNumber: "",
        serialNumber: "",
        comment: "",
        status: "",
        category: "",
        image: null,
        doc: null,
      });
    } catch (error) {
      console.error("Error submitting post:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Component Post</h2>
      <form onSubmit={handleSubmit}>
        {/* ✅ System Name Field */}
        <div className="form-group mb-3">
          <input
            type="text"
            name="systemName"
            className="form-control"
            placeholder="System Name"
            value={formData.systemName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <input type="text" name="name" className="form-control" placeholder="Name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <input type="text" name="partNumber" className="form-control" placeholder="Part Number" value={formData.partNumber} onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <input type="text" name="serialNumber" className="form-control" placeholder="Serial Number" value={formData.serialNumber} onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <textarea name="comment" className="form-control" placeholder="Comment" value={formData.comment} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group mb-3">
          <label>Status</label>
          <select name="status" className="form-control" value={formData.status} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="functioning">Functioning</option>
            <option value="non-functioning">Non-functioning</option>
          </select>
        </div>
        <div className="form-group mb-3">
          <label>Category</label>
          <select name="category" className="form-control" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mb-3">
          <label>Attach Image</label>
          <input type="file" name="image" className="form-control" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
        </div>
        <div className="form-group mb-3">
          <label>Attach Doc (PDF, Word)</label>
          <input type="file" name="doc" className="form-control" accept=".pdf, .doc, .docx" onChange={handleDocChange} />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default PostForm;
