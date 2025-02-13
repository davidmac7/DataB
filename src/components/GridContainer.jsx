import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const GridContainer = ({ components }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center p-4">
      {components.map((component, index) => (
        <div key={index} className="bg-white p-4 shadow-lg rounded-lg border min-w-[250px]">
          <h3 className="text-lg font-semibold">{component.name}</h3>
          <p className="text-sm text-gray-200">Part #: {component.part_number}</p>
          <p className="text-sm text-gray-200">Serial #: {component.serial_number}</p>
          <p className="text-sm text-gray-200">Comment: {component.comment}</p>
          <p className="text-sm font-bold text-gray-200">Status: {component.status}</p>
          {component.image_url && (
            <img
              src={component.image_url}
              alt="Component"
              className="mt-2 w-[200px] h-[200px] object-cover rounded"

            />
          )}
        </div>
      ))}
    </div>
  );
};

export default GridContainer;
