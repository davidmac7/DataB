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
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
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
                <li><Link className="dropdown-item" to="/discover/X">X</Link></li>

              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/post">Post</Link> {/* ✅ This will navigate to PostForm */}
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
