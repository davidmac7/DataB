import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewDefect = () => {
  const { componentId } = useParams();
  const [defects, setDefects] = useState([]);
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    // Fetch defects data
    const fetchDefectData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/viewDefect/${componentId}`);
        setDefects(response.data.defects);
      } catch (error) {
        console.error("Error fetching defect data:", error);
      }
    };

    // Fetch signatures data
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

      {/* Signatures Table
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
          {signatures.length > 0 ? (
            signatures.map((signature, index) => (
              <tr key={index}>
                <td>
                  {signature.performerSignature ? (
                    <img
                      src={signature.performerSignature}
                      alt="Performer Signature"
                      className="signature-img"
                      style={{ backgroundColor: "white", padding: "5px", border: "1px solid #ddd" }}
                    />
                  ) : "No Signature"}
                </td>
                <td>
                  {signature.masterSignature ? (
                    <img
                      src={signature.masterSignature}
                      alt="Master Signature"
                      className="signature-img"
                      style={{ backgroundColor: "white", padding: "5px", border: "1px solid #ddd" }}
                    />
                  ) : "No Signature"}
                </td>
                <td>
                  {signature.qcSignature ? (
                    <img
                      src={signature.qcSignature}
                      alt="QC Signature"
                      className="signature-img"
                      style={{ backgroundColor: "white", padding: "5px", border: "1px solid #ddd" }}
                    />
                  ) : "No Signature"}
                </td>
                <td>
                  {signature.technicalSignature ? (
                    <img
                      src={signature.technicalSignature}
                      alt="Technical Engineer Signature"
                      className="signature-img"
                      style={{ backgroundColor: "white", padding: "5px", border: "1px solid #ddd" }}
                    />
                  ) : "No Signature"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No signatures found.</td>
            </tr>
          )}
        </tbody>
      </table> */}
    </div>
  );
};

export default ViewDefect;
