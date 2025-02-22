import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

function Navbar({ profile }) {

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          {profile ? `Aircraft: ${profile.name}` : "Aircraft"}
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
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
                <li><Link className="dropdown-item" to="/discover/X">X</Link></li>
                <li><Link className="dropdown-item" to="/discover/R">R</Link></li>
                <li><Link className="dropdown-item" to="/discover/A">A</Link></li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/post">Post</Link> {/* ✅ This will navigate to PostForm */}
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link" to="/post-defect">Post Defect</Link> 
            </li> */}
            <li className="nav-item">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search by Name or Part Number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button onClick={handleSearch} className="search-btn">
                  🔍
                </button>
              </div>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-danger ms-3"
                onClick={() => {
                  window.location.href = "/logout";
                }}
              >
                Logout
              </button>


            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
