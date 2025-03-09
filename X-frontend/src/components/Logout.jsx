import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ setProfile, setRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setProfile(null); // Clear profile state
    setRole(null); // Clear role state
    navigate("/"); // Redirect to Role selection
  };

  return (
    <div style={styles.container}>
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    top: "10px",
    right: "20px",
    zIndex: 1000, // Ensures it's above other elements
  },
};

export default Logout;
