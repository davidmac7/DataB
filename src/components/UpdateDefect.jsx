import React, { useState } from "react";
import axios from "axios"; // Ensure axios is installed and imported
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const UpdateDefect = () => {
  const [defectId, setDefectId] = useState("");
  const navigate = useNavigate(); // Instantiate the navigate hook

  const handleChange = (e) => {
    setDefectId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if defectId is provided
    if (!defectId) {
      alert("Please enter a defect ID");
      return;
    }

    try {
      // Make an API call to delete the defect using the defectId
      const response = await axios.delete(`http://localhost:5000/api/deleteDefect/${defectId}`);

      if (response.status === 200) {
        alert("Defect deleted successfully");
        
        // Navigate back to the previous page
        navigate(-1); // Goes back to the previous page in the history
      } else {
        alert("Failed to delete defect");
      }
    } catch (error) {
      console.error("Error deleting defect:", error);
      alert("An error occurred while deleting the defect");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Delete Defect</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="defectId">Enter Defect ID:</label>
          <input
            type="text"
            className="form-control"
            id="defectId"
            placeholder="Enter ID of Defect"
            value={defectId}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-danger mt-3">
          Delete
        </button>
      </form>
    </div>
  );
};

export default UpdateDefect;
