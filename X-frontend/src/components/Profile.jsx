import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch the aircraft profile from the backend
    axios.get("http://localhost:5000/api/profile", { withCredentials: true })
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Aircraft Profile</h2>
      {profile ? (
        <div className="card p-4 shadow-lg">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Type:</strong> {profile.type}</p>
          <p><strong>Date:</strong> {profile.date}</p>
        </div>
      ) : (
        <p className="text-center">No profile data available.</p>
      )}
    </div>
  );
}

export default Profile;
