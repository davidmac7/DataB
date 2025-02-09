import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthForm from "./components/AuthForm";
import PostForm from "./components/PostForm";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Profile from "./components/Profile";

function App() {
  const [profile, setProfile] = useState(null);

  return (
    <Router>
      <div>
        {!profile ? (
          <AuthForm setProfile={setProfile} />
        ) : (
          <>
            <Navbar profile={profile} />
            <Routes>
              <Route path="/post" element={<PostForm profile={profile} />} /> {/* Pass profile to PostForm */}
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
