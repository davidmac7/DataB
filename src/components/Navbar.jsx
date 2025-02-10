import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

function Navbar({ profile }) {
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
            <li className="nav-item">
              <a className="nav-link" href="#">Discover</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/post">Post</Link> {/* ✅ This will navigate to PostForm */}
            </li>
            <li className="nav-item">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Search" />
                <button className="btn btn-outline-light">🔍</button>
              </div>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger ms-3" onClick={() => window.location.reload()}>
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
