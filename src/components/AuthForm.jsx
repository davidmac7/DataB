import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

function AuthForm({ setProfile, role }) {
 
  const [mode, setMode] = useState("login"); // Default mode is login
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
    try {
      let res;
      if (mode === "create") {
        res = await axios.post("http://localhost:5000/api/create-profile", formData, {
          withCredentials: true,
        });
        
        // If the profile was created successfully, switch back to login mode
        if (res.data) {
          setMode("login");
        }
      } else if (mode === "login") {
        res = await axios.post("http://localhost:5000/api/login", {
          name: formData.name,
        }, { withCredentials: true });
  
        console.log("Response from backend:", res.data);
      }
  
      if (res.data && res.data.aircraftId) {
        setProfile(res.data);
      } else {
        console.error("Error: Aircraft profile not received from backend");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error);
    }
  };
  

  return (
    <div className="container mt-5">
       
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-lg">
            <h3 className="text-center mb-4">{mode === "create" ? "Create Aircraft Profile" : "Enter Aircraft Name"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter Aircraft Name"
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

            

            {/* Show "Create Aircraft Profile" button only if role === "Admin" and mode is login */}
            {role === "Admin" && mode === "login" && (
              
              <button className="btn btn-success mt-3 w-100" onClick={() => setMode("create")}>
                Create Aircraft Profile
              </button>
            )}

            {/* Show Back button only if in 'create' mode */}
            {mode === "create" && (
              <button className="btn btn-secondary mt-3 w-100" onClick={() => setMode("login")}>
                Back
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
