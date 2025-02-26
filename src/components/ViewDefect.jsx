import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewDefect = () => {
  const { componentId } = useParams();
  const [defects, setDefects] = useState([]);
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    // Fetch defect data
    const fetchDefectData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/viewDefect/${componentId}`);
        setDefects(response.data.defects);
      } catch (error) {
        console.error("Error fetching defect data:", error);
      }
    };

    // Fetch signatures as images
    const fetchSignatures = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/viewSignatures/${componentId}`);
        setSignatures(response.data.signatures);
      } catch (error) {
        console.error("Error fetching signatures:", error);
      }
    };

    fetchDefectData();
    fetchSignatures();
  }, [componentId]);

  return (
    <div className="container mt-4">
      <h1 className="mb-3">View Defect Register</h1>
      <p>Defect register for component ID: {componentId}</p>

      {/* Defects Table */}
      <h3>Defects</h3>
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
          {defects.length > 0 ? (
            defects.map((defect, index) => (
              <tr key={index}>
                <td>{defect.defect_name}</td>
                <td>{defect.elimination_method}</td>
                <td>{defect.date_work_done}</td>
                <td>{defect.performer_name}</td>
                <td>{defect.master_name}</td>
                <td>{defect.qc_name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No defects found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Signature Row */}
      <h3>Signatures</h3>
      <div className="d-flex justify-content-center mt-3">
        {signatures.length > 0 ? (
          signatures.map((signature, index) => (
            <div key={index} className="mx-2">
              {signature.performerSignature && (
                <img
                  src={`http://localhost:5000${signature.performerSignature}`}
                  alt="Performer Signature"
                  className="img-thumbnail"
                  style={{ width: "120px", height: "60px" }}
                />
              )}
              {signature.masterSignature && (
                <img
                  src={`http://localhost:5000${signature.masterSignature}`}
                  alt="Master Signature"
                  className="img-thumbnail"
                  style={{ width: "120px", height: "60px" }}
                />
              )}
              {signature.qcSignature && (
                <img
                  src={`http://localhost:5000${signature.qcSignature}`}
                  alt="QC Signature"
                  className="img-thumbnail"
                  style={{ width: "120px", height: "60px" }}
                />
              )}
              {signature.technicalSignature && (
                <img
                  src={`http://localhost:5000${signature.technicalSignature}`}
                  alt="Technical Engineer Signature"
                  className="img-thumbnail"
                  style={{ width: "120px", height: "60px" }}
                />
              )}
            </div>
          ))
        ) : (
          <p>No signatures found.</p>
        )}
      </div>
       {/* Add Defect Register Button */}
       <div className="text-center mt-4">
        <Link to={`/post-defect/${componentId}`} className="btn btn-primary">
          Add More to Defect Register
        </Link>
      </div>
    </div>
    
  );
};

export default ViewDefect;
