import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function X({ profile }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [defectSubmitted, setDefectSubmitted] = useState({}); // Store button state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/get-components/X", { withCredentials: true });
        console.log("API Response:", response.data);
        setComponents(response.data);
        setLoading(false);
        
        // Load defect submission state from localStorage
        const savedState = JSON.parse(localStorage.getItem("defectSubmitted")) || {};
        setDefectSubmitted(savedState);
      } catch (error) {
        setError("Error fetching components");
        setLoading(false);
        console.error("API Error:", error);
      }
    };

    fetchComponents();
  }, []);

  const handleAddDefectRegister = (componentId) => {
    navigate(`/post-defect/${componentId}`);
  };

  const handleViewDefect = (componentId) => {
    navigate(`/view-defect/${componentId}`);
  };

  if (loading) return <p>Loading components...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Components in Category X</h2>
      {components.length > 0 ? (
        <div className="grid-container">
          {components.map((component, index) => (
            <div key={index} className="grid-item">
              <h3>Name: {component.name}</h3>
              <p>Part Number: {component.part_number}</p>
              <p>Serial Number: {component.serial_number}</p>
              <p>Comment: {component.comment}</p>
              <p>Status: {component.status}</p>
              {component.image_url && (
                <img src={component.image_url} alt="Component" width="200" height="200" />
              )}
              {/* Dynamic Button */}
              {defectSubmitted[component.id] ? (
                <button onClick={() => handleViewDefect(component.id)}>View Defect</button>
              ) : (
                <button onClick={() => handleAddDefectRegister(component.id)}>Add Defect Register</button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No components found in Category X.</p>
      )}
    </div>
  );
}

export default X;
