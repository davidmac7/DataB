import React from "react";

const Home = () => {
  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    backgroundImage: "url('/360_F.jpg')", // Update with correct path
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: -1, // Puts the image behind the content
  };

  const textStyle = {
    position: "relative",
    textAlign: "center",
    paddingTop: "50px", // Adjust as needed to move the text higher
    fontWeight: "bold",
  };

  return (
    <>
      {/* Background Image */}
      <div style={backgroundStyle}></div>

      {/* Heading */}
      <div style={textStyle}>
        <h1 className="text-success">Welcome to Proheli!</h1>
      </div>
    </>
  );
};

export default Home;
