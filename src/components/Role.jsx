import React, { useState } from "react";
import axios from "axios";

function Role({ setRole }) {
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRoleInput] = useState(""); // New state for role
  const [error, setError] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/getRole", { idNumber, password });
      setRole(response.data.role);
    } catch (error) {
      setError("Invalid ID number or password.");
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/createRole", { idNumber, password, role  });
      alert("Account created successfully! You can now log in.");
      setIsCreatingAccount(false);
    } catch (error) {
      setError("Error creating account. ID might already exist.");
    }
  };

  return (
    
    <div
    className="container-fluid d-flex align-items-center justify-content-center vh-100"
    style={{
      backgroundImage: `url("/Pro-Heli-Ltd.png")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
      
      <h3 className="text-center mb-3">{isCreatingAccount ? "Create Account" : "Login"}</h3>

      {!isCreatingAccount ? (
        // Login Form
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Enter ID number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      ) : (
        // Registration Form
        <form onSubmit={handleCreateAccount}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Enter ID number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Enter category"
              value={role}
              onChange={(e) => setRoleInput(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Create Account
          </button>
        </form>
      )}

      {error && <p className="text-danger text-center mt-2">{error}</p>}

      {/* Toggle between Login and Create Account */}
      <button
        className="btn btn-link mt-3 w-100"
        onClick={() => setIsCreatingAccount(!isCreatingAccount)}
      >
        {isCreatingAccount ? "Back to Login" : "Create Account"}
      </button>
    </div>
  </div>
);
}

export default Role;
