import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthForm from "./components/AuthForm";
import PostForm from "./components/PostForm";
import X from "./components/X";
import R from "./components/R";
import A from "./components/A";
import SearchResults from "./components/SearchResults";
import PostDefect from "./components/PostDefect";
import ViewDefect from "./components/ViewDefect";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css"; // Import your custom CSS
import Logout from "./components/Logout"; // Import Logout Component
import Home from "./components/Home";
import Role from "./components/Role"; // Import Role component



function App() {
  const [profile, setProfile] = useState(null);
  // console.log("Current Profile:", profile); // Debugging to check profile state
  const [role, setRole] = useState(null); // Store role state

  return (
    <Router>
      <div>
      {!role ? (
          <Role setRole={setRole} />
        ) : !profile ? (
          <AuthForm setProfile={setProfile} role={role} />

        ) : ( 
          <>
          {/* Logout Button at top */}
          <Logout setProfile={setProfile} setRole={setRole} />


            <Navbar profile={profile}  role={role}/> {/* Pass setProfile to Navbar */}

            <Routes>

            <Route path="/" element={<Home profile={profile} />} />
              <Route path="/post" element={<PostForm profile={profile} role={role} />} />
              <Route path="/discover/X" element={<X profile={profile} />} />
              <Route path="/discover/R" element={<R profile={profile} />} />
              <Route path="/discover/A" element={<A profile={profile} />} />
              <Route path="/search" element={<SearchResults profile={profile} role={role}/>} />
              <Route path="/post-defect/:componentId" element={<PostDefect />} />
              <Route path="/view-defect/:componentId" element={<ViewDefect />} />
            </Routes>

          
          
          </>
        )}
      </div>
    </Router>
  );
}

export default App;