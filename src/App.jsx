import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthForm from "./components/AuthForm";
import PostForm from "./components/PostForm";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



function App() {
  const [profile, setProfile] = useState(null);
  console.log("Current Profile:", profile); // Debugging to check profile state


  return (
    <Router>
      <div>
        {!profile ? (
          <AuthForm setProfile={setProfile} />
        ) : (
          <>
            <Navbar profile={profile}  /> {/* Pass setProfile to Navbar */}
            <Routes></Routes>
            <Routes>
              <Route path="/post" element={<PostForm profile={profile}/>} /> {/* Pass setProfile */}
              </Routes>
            
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
