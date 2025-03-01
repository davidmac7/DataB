import React, { useEffect, useState } from "react";
import axios from "axios";

function A({ profile }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {



    const fetchComponents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/get-components/A", { withCredentials: true });
        console.log("API Response:", response.data);
        setComponents(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching components");
        setLoading(false);
        console.error("API Error:", error);
      }
    };

    fetchComponents();
  }, []);

  if (loading) return <p>Loading components...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Components in Category A</h2>
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
                <img
                  src={component.image_url}
                  alt="Component"
                  width="200"
                  height="200"
                />
              )}

            </div>
          ))}
        </div>
      ) : (
        <p>No components found in Category A.</p>
      )}
    </div>
  );
}

export default A;
