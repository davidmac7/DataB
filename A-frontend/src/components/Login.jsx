import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        // Register User
        await axios.post("http://localhost:5000/register", { email, password });
        alert("Account created successfully! Please log in.");
        setIsRegistering(false);
      } else {
        // Login User
        const res = await axios.post("http://localhost:5000/login", { email, password });
        alert(res.data.message);
        navigate("/home"); // Redirect to Home.jsx on successful login
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">{isRegistering ? "Create Account" : "Login"}</h2>
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {isRegistering ? "Sign Up" : "Login"}
        </button>
        <p className="text-center mt-3">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? " Login" : " Sign Up"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
