import React from "react";
import { useParams } from "react-router-dom";

const ViewDefect = () => {
  const { componentId } = useParams();

  return (
    <div className="container mt-4">
      <h1>Welcome to View Defect</h1>
      <p>Viewing defect details for Component ID: {componentId}</p>
    </div>
  );
};

export default ViewDefect;
