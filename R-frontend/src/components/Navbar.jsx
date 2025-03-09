import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

function Navbar({ profile }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [aircraftProfiles, setAircraftProfiles] = useState([]); // Store aircraft names
  const navigate = useNavigate();

  // Fetch aircraft profiles from backend
  useEffect(() => {
    const fetchAircraftProfiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/aircraft-profiles");
        setAircraftProfiles(response.data);
      } catch (error) {
        console.error("Error fetching aircraft profiles:", error);
      }
    };
    fetchAircraftProfiles();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Aircraft Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="aircraftDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {profile ? `Aircraft: ${profile.name}` : "Select Aircraft"}
          </button>
          <ul className="dropdown-menu" aria-labelledby="aircraftDropdown">
            {aircraftProfiles.map((aircraft) => (
              <li key={aircraft.id}>
                <Link className="dropdown-item" to={`/aircraft/${aircraft.id}`}>
                  {aircraft.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="mx-auto">
          <ul className="navbar-nav d-flex justify-content-center">
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="discoverDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Discover
              </Link>
              <ul className="dropdown-menu" aria-labelledby="discoverDropdown">
              <li>
                  <Link className="dropdown-item" to="/discover/X">
                    X
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/discover/R">
                    R
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/discover/X">
                  <li>
                  <Link className="dropdown-item" to="/discover/A">
                    A
                  </Link>
                </li>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/post">
                Post
              </Link>
            </li>

            <li className="nav-item">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search Name or Part Number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="search-input"
                />
                <button onClick={handleSearch} className="search-btn">
                  🔍
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
