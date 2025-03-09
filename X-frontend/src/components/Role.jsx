import React, { useState } from "react";
import axios from "axios";

function Role({ setRole }) {
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/getRole", { idNumber, password  });
      setRole(response.data.role);
    } catch (error) {
      setError("Invalid ID number or password.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Enter Your Credentials</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter ID number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default Role;
