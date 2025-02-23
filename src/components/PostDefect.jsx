import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import SignaturePad from "react-signature-canvas";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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

  // Refs for signature pads
  const performerRef = useRef(null);
  const masterRef = useRef(null);
  const qcRef = useRef(null);
  const technicalRef = useRef(null);

  const handleInputChange = (index, field, value) => {
    const newDefects = [...defects];
    newDefects[index][field] = value;
    setDefects(newDefects);
  };

  const handleSubmitDefects = async () => {
    try {
      const validDefects = defects.filter(
        (defect) =>
          defect.defectName.trim() !== "" &&
          defect.workDate.trim() !== "" &&
          defect.performerName.trim() !== "" &&
          defect.masterName.trim() !== "" &&
          defect.qcName.trim() !== ""
      );

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
  const navigate = useNavigate(); // Initialize navigate
  const handleSubmitSignatures = async () => {
    try {
      const formData = new FormData();
      formData.append("componentId", componentId);
  
      const addSignature = (ref, fieldName) => {
        if (ref.current && !ref.current.isEmpty()) {
          formData.append(fieldName, dataURLtoBlob(ref.current.toDataURL()));
        }
      };
  
      addSignature(performerRef, "performerSignature");
      addSignature(masterRef, "masterSignature");
      addSignature(qcRef, "qcSignature");
      addSignature(technicalRef, "technicalSignature");
  
      const response = await axios.post("http://localhost:5000/api/saveSignatures", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert(response.data.message);
  
      // Update defect submission state in localStorage
      const savedState = JSON.parse(localStorage.getItem("defectSubmitted")) || {};
      savedState[componentId] = true;
      localStorage.setItem("defectSubmitted", JSON.stringify(savedState));
  
      // Redirect using navigate
    navigate("/x");
    } catch (error) {
      console.error("Error submitting signatures:", error);
      alert("Failed to save signatures.");
    }
  };
  

  const clearSignature = (ref) => {
    if (ref.current) ref.current.clear();
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
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

      <button className="btn btn-success w-100 mb-4" onClick={handleSubmitDefects}>
        Submit Defects
      </button>

      {/* Signature Table */}
      <h3>Signatures</h3>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Performer’s Signature</th>
            <th>Master’s Signature</th>
            <th>QC’s Signature</th>
            <th>Technical Engineer’s Signature</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><SignaturePad ref={performerRef} canvasProps={{ className: "signature-pad" }} /><button onClick={() => clearSignature(performerRef)}>Clear</button></td>
            <td><SignaturePad ref={masterRef} canvasProps={{ className: "signature-pad" }} /><button onClick={() => clearSignature(masterRef)}>Clear</button></td>
            <td><SignaturePad ref={qcRef} canvasProps={{ className: "signature-pad" }} /><button onClick={() => clearSignature(qcRef)}>Clear</button></td>
            <td><SignaturePad ref={technicalRef} canvasProps={{ className: "signature-pad" }} /><button onClick={() => clearSignature(technicalRef)}>Clear</button></td>
          </tr>
        </tbody>
      </table>

      <button className="btn btn-primary w-100" onClick={handleSubmitSignatures}>
        Submit Signatures
      </button>
    </div>
  );
};

export default PostDefect;
