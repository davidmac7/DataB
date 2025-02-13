import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear profile from localStorage
    localStorage.removeItem("userProfile");

    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return null; // You don't need to render anything for logout
}

export default Logout;
