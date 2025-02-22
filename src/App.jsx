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
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css"; // Import your custom CSS





function App() {
  const [profile, setProfile] = useState(null);
  // console.log("Current Profile:", profile); // Debugging to check profile state


  return (
    <Router>
      <div>
        {!profile ? (
          <AuthForm setProfile={setProfile} />
        ) : (
          <>
            <Navbar profile={profile} /> {/* Pass setProfile to Navbar */}

            <Routes>
              <Route path="/post" element={<PostForm profile={profile} />} />
              <Route path="/discover/X" element={<X profile={profile} />} />
              <Route path="/discover/R" element={<R profile={profile} />} />
              <Route path="/discover/A" element={<A profile={profile} />} />
              <Route path="/search" element={<SearchResults profile={profile} />} />
              <Route path="/post-defect/:componentId" element={<PostDefect />} />
            </Routes>

          </>
        )}
      </div>
    </Router>
  );
}

export default App;