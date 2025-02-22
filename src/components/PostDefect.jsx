import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function PostDefect({ profile }) {
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [componentNames, setComponentNames] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState("");
    const [engineer, setEngineer] = useState("");

    useEffect(() => {
        
        const fetchComponents = async () => {
            if (category && profile?.aircraftId) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/components?category=${category}&aircraftId=${profile.aircraftId}`);
                    setComponentNames(response.data);
                    console.log("Component Names:", response.data); // Log the response from backend
                } catch (error) {
                    console.error("Error fetching components:", error);
                    setComponentNames([]); // Reset on error
                }
            } else {
                setComponentNames([]);
            }
        };

        fetchComponents();
    }, [category, profile]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Post Defect</h2>
            <form className="border p-4 rounded shadow-sm bg-light">
                {/* Category Dropdown */}
                <div className="mb-3">
                    <label className="form-label">Category:</label>
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        <option value="X">X</option>
                        <option value="R">R</option>
                        <option value="A">A</option>
                    </select>
                </div>

                {/* Date Picker */}
                <div className="mb-3">
                    <label className="form-label">Date:</label>
                    <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                {/* Component Name Dropdown */}
                <div className="mb-3">
                    <label className="form-label">Component Name:</label>
                    {category ? (
                        <select className="form-select" value={selectedComponent} onChange={(e) => setSelectedComponent(e.target.value)}>
                            <option value="">Select Component</option>
                            {componentNames.map((component, index) => (
                                <option key={index} value={component}>
                                    {component}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input type="text" className="form-control" disabled placeholder="Select a category first" />
                    )}
                </div>

                {/* Engineer Input */}
                <div className="mb-3">
                    <label className="form-label">Technical Engineer:</label>
                    <input type="text" className="form-control" value={engineer} onChange={(e) => setEngineer(e.target.value)} />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default PostDefect;
