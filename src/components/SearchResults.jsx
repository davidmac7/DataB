import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function SearchResults({ profile, role }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchResults = async () => {
      if (!role || !profile || !profile.aircraftId) {
        setError("Invalid profile data");
        setLoading(false);
        return;
      }
      console.log("Role:", role); // Log the role for debugging

      // Define the base API URL dynamically based on role
      const rolePaths = {
        Admin: "api/search",
        X: "api/X/search",
        R: "api/R/search",
        A: "api/A/search",
      };

      const rolePath = rolePaths[role] || "api/search"; // Default to Admin if role is unknown
      const apiUrl = `http://localhost:5000/${rolePath}?query=${query}&aircraftId=${profile.aircraftId}`;

      try {
        console.log("Fetching from URL:", apiUrl); // Log the API URL for debugging
        const response = await axios.get(apiUrl, { withCredentials: true });
        setResults(response.data);
      } catch (err) {
        setError("Error fetching search results");
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query,profile, profile.aircraftId, role]); // Re-fetch results when query, profile, or role changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <div className="grid-container">
        {results.length > 0 ? (
          results.map((item, index) => (
            <div key={index} className="grid-item">
              <h3>{item.name}</h3>
              <p>Part Number: {item.part_number}</p>
              <p>Serial Number: {item.serial_number}</p>
              <p>Comment: {item.comment}</p>
              <p>Status: {item.status}</p>
              {item.image_url ? (
                <img src={item.image_url} alt="Component" width="200" height="200" />
              ) : (
                <p>No Image Available</p>
              )}
              
            </div>
          ))
        ) : (
          <p>No matching components found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
