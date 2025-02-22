import React from "react";
import { useParams } from "react-router-dom";

const PostDefect = () => {
  const { componentId } = useParams(); // Retrieve componentId from URL

  return (
    <div>
      <h1>Add the Defect Register</h1>
      <p>Defect register for component ID: {componentId}</p>
      {/* You can add the defect register form or other details here */}
    </div>
  );
};

export default PostDefect;
