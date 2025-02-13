import React from "react";

function GridTile({ component }) {
  return (
    <div className="card mb-3" style={{ width: "18rem" }}>
      {component.image_path && (
        <img
          src={`http://localhost:5000/uploads/${component.image_path}`}
          className="card-img-top"
          alt="Component"
        />
      )}
      <div className="card-body">
        <h5 className="card-title">{component.name}</h5>
        <p className="card-text">
          <strong>Part Number:</strong> {component.partnumber} <br />
          <strong>Serial Number:</strong> {component.serialnumber} <br />
          <strong>Comment:</strong> {component.comment} <br />
          <strong>Status:</strong> {component.status} <br />
        </p>
      </div>
    </div>
  );
}

export default GridTile;
