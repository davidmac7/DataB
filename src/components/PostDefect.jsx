import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const PostDefect = () => {
  const { componentId } = useParams();
  const [defects, setDefects] = useState(
    Array.from({ length: 5 }, () => ({
      defectName: "",
      eliminationMethod: "",
      workDate: "",
      performerName: "",
      masterName: "",
      qcName: "",
    }))
  );

  const handleInputChange = (index, field, value) => {
    const newDefects = [...defects];
    newDefects[index][field] = value;
    setDefects(newDefects);
  };

  const handleSubmit = async () => {
    try {
            // Filter out defects with missing required fields before sending to backend
            const validDefects = defects.filter(
              (defect) =>
                defect.defectName.trim() !== "" &&
                defect.workDate.trim() !== "" &&
                defect.performerName.trim() !== "" &&
                defect.masterName.trim() !== "" &&
                defect.qcName.trim() !== ""
            );
      
            // Ensure only valid defects are sent to the backend
            const response = await axios.post("http://localhost:5000/api/saveDefect", {
              componentId,
              defects: validDefects,
            });
      
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting defect:", error);
      alert("Failed to save defect.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-3">Add the Defect Register</h1>
      <p>Defect register for component ID: {componentId}</p>

      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th style={{ width: "25%" }}>Defect Name</th>
            <th style={{ width: "35%" }}>Elimination Method</th>
            <th style={{ width: "10%" }}>Date work was done</th>
            <th style={{ width: "10%" }}>Performer’s Name</th>
            <th style={{ width: "10%" }}>Master’s Name</th>
            <th style={{ width: "10%" }}>QC’s Name</th>
          </tr>
        </thead>
        <tbody>
          {defects.map((defect, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  maxLength="200"
                  placeholder="Enter defect name"
                  className="form-control"
                  value={defect.defectName}
                  onChange={(e) => handleInputChange(index, "defectName", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  maxLength="250"
                  placeholder="Enter elimination method"
                  className="form-control"
                  value={defect.eliminationMethod}
                  onChange={(e) => handleInputChange(index, "eliminationMethod", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  className="form-control"
                  value={defect.workDate}
                  onChange={(e) => handleInputChange(index, "workDate", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  maxLength="100"
                  placeholder="Enter performer's name"
                  className="form-control"
                  value={defect.performerName}
                  onChange={(e) => handleInputChange(index, "performerName", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  maxLength="100"
                  placeholder="Enter master's name"
                  className="form-control"
                  value={defect.masterName}
                  onChange={(e) => handleInputChange(index, "masterName", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  maxLength="100"
                  placeholder="Enter QC's name"
                  className="form-control"
                  value={defect.qcName}
                  onChange={(e) => handleInputChange(index, "qcName", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Submit Button */}
      <div className="mt-4">
        <button className="btn btn-success w-100" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default PostDefect;
