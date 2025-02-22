import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function SearchResults({ profile }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/search?query=${query}&aircraftId=${profile.aircraftId}`,
          { withCredentials: true }
        );
        setResults(response.data);
      } catch (err) {
        setError("Error fetching search results");
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query, profile.aircraftId]);

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
