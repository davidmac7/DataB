import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

function AuthForm({ setProfile }) {
  const [mode, setMode] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    type: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "create") {
      const res = await axios.post("http://localhost:5000/api/create-profile", formData);
      setProfile(res.data);
    } else if (mode === "login") {
      const res = await axios.post("http://localhost:5000/api/login", {
        name: formData.name,
        password: formData.password,
      });
      setProfile(res.data);
    }
  };

  return (
    <div className="container mt-5">
      {!mode && (
        <div className="text-center">
          <button className="btn btn-primary m-2" onClick={() => setMode("login")}>
            Login
          </button>
          <button className="btn btn-success m-2" onClick={() => setMode("create")}>
            Create Aircraft Profile
          </button>
        </div>
      )}

      {mode && (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow-lg">
              <h3 className="text-center mb-4">{mode === "create" ? "Create Aircraft Profile" : "Login"}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Name"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Create Password"
                    onChange={handleChange}
                    required
                  />
                </div>

                {mode === "create" && (
                  <>
                    <div className="form-group mb-3">
                      <input
                        type="text"
                        name="type"
                        className="form-control"
                        placeholder="Type"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group mb-3">
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}

                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthForm;
