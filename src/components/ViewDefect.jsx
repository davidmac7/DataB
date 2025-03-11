import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewDefect = () => {
  const { componentId } = useParams();
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    // Fetch signatures as images
    const fetchSignatures = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/viewSignatures/${componentId}`);
        setSignatures(response.data.signatures);
      } catch (error) {
        console.error("Error fetching signatures:", error);
      }
    };

    fetchSignatures();
  }, [componentId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container mt-4">
      <h3>Defects</h3>
      <p>Defect register for component ID: {componentId}</p>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
          <th>ID</th> {/* New column for ID */}
            <th>Defect Name</th>
            <th>Elimination Method</th>
            <th>Date Work Done</th>
            <th>Performer’s Name</th>
            <th>Master’s Name</th>
            <th>QC’s Name</th>
            <th>Performer’s Signature</th>
            <th>Master’s Signature</th>
            <th>QC’s Signature</th>
            <th>Technical Engineer’s Signature</th>
          </tr>
        </thead>
        <tbody>
          {signatures.length > 0 ? (
            signatures.map((signature, index) => (
              <tr key={index}>
                <td>{signature.id}</td> {/* Displaying the ID */}
                <td>{signature.defectName}</td>
                <td>{signature.eliminationMethod}</td>
                <td>{formatDate(signature.dateWorkDone)}</td>
                <td>{signature.performerName}</td>
                <td>{signature.masterName}</td>
                <td>{signature.qcName}</td>
                <td>
                  {signature.performerSignature && (
                    <img
                      src={`http://localhost:5000${signature.performerSignature}`}
                      alt="Performer Signature"
                      className="img-thumbnail"
                      style={{ width: "120px", height: "60px" }}
                    />
                  )}
                </td>
                <td>
                  {signature.masterSignature && (
                    <img
                      src={`http://localhost:5000${signature.masterSignature}`}
                      alt="Master Signature"
                      className="img-thumbnail"
                      style={{ width: "120px", height: "60px" }}
                    />
                  )}
                </td>
                <td>
                  {signature.qcSignature && (
                    <img
                      src={`http://localhost:5000${signature.qcSignature}`}
                      alt="QC Signature"
                      className="img-thumbnail"
                      style={{ width: "120px", height: "60px" }}
                    />
                  )}
                </td>
                <td>
                  {signature.technicalSignature && (
                    <img
                      src={`http://localhost:5000${signature.technicalSignature}`}
                      alt="Technical Engineer Signature"
                      className="img-thumbnail"
                      style={{ width: "120px", height: "60px" }}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">No signatures found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Defect Register Button */}
      <div className="text-center mt-4">
        <Link to={`/post-defect/${componentId}`} className="btn btn-primary">
          Add to Defect Register
        </Link>
      </div>
    

    {/* Update Button */}
    <div className="text-center mt-4">
    <Link to={`/update-defect`} className="btn btn-warning">
      Delete Defect
    </Link>
  </div>
</div>
  );
};

export default ViewDefect;
