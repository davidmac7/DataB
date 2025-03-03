import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import SignaturePad from "react-signature-canvas";

const PostDefect = () => {
  const { componentId } = useParams();
  const navigate = useNavigate();
  
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

  const performerRef = useRef(null);
  const masterRef = useRef(null);
  const qcRef = useRef(null);
  const technicalRef = useRef(null);

  const handleInputChange = (index, field, value) => {
    const newDefects = [...defects];
    newDefects[index][field] = value;
    setDefects(newDefects);
  };

  const handleSubmit = async () => {
    try {
      // Submit defects
      const validDefects = defects.filter(
        (defect) =>
          defect.defectName.trim() !== "" &&
          defect.workDate.trim() !== "" &&
          defect.performerName.trim() !== "" &&
          defect.masterName.trim() !== "" &&
          defect.qcName.trim() !== ""
      );

      await axios.post("http://localhost:5000/api/saveDefect", {
        componentId,
        defects: validDefects,
      });

      // Submit signatures
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

      await axios.post("http://localhost:5000/api/saveSignatures", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Save submission state
      const savedState = JSON.parse(localStorage.getItem("defectSubmitted")) || {};
      savedState[componentId] = true;
      localStorage.setItem("defectSubmitted", JSON.stringify(savedState));

      alert("Defects and signatures saved successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to save defects and signatures.");
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
            <th>Defect Name</th>
            <th>Elimination Method</th>
            <th>Date work was done</th>
            <th>Performer’s Name</th>
            <th>Master’s Name</th>
            <th>QC’s Name</th>
          </tr>
        </thead>
        <tbody>
          {defects.map((defect, index) => (
            <tr key={index}>
              <td><input type="text" className="form-control" value={defect.defectName} onChange={(e) => handleInputChange(index, "defectName", e.target.value)} /></td>
              <td><input type="text" className="form-control" value={defect.eliminationMethod} onChange={(e) => handleInputChange(index, "eliminationMethod", e.target.value)} /></td>
              <td><input type="date" className="form-control" value={defect.workDate} onChange={(e) => handleInputChange(index, "workDate", e.target.value)} /></td>
              <td><input type="text" className="form-control" value={defect.performerName} onChange={(e) => handleInputChange(index, "performerName", e.target.value)} /></td>
              <td><input type="text" className="form-control" value={defect.masterName} onChange={(e) => handleInputChange(index, "masterName", e.target.value)} /></td>
              <td><input type="text" className="form-control" value={defect.qcName} onChange={(e) => handleInputChange(index, "qcName", e.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>

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
            {[performerRef, masterRef, qcRef, technicalRef].map((ref, index) => (
              <td key={index}>
                <SignaturePad ref={ref} canvasProps={{ className: "signature-pad" }} />
                <button onClick={() => clearSignature(ref)}>Clear</button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <button className="btn btn-primary w-100" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default PostDefect;
