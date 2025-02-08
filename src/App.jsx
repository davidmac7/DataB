import React, { useState } from "react";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";

function App() {
  const [profile, setProfile] = useState(null);

  return (
    <div>
      {!profile ? (
        <AuthForm setProfile={setProfile} />
      ) : (
        <Navbar profile={profile} />
      )}
    </div>
  );
}

export default App;
