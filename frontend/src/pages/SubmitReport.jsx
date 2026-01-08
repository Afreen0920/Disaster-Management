import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import "../styles/reports.css";

export default function SubmitReport() {
  const { user, authHeader, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    description: ""
  });

  if (user?.role !== "citizen") {
    return <p>Only citizens can submit reports.</p>;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/reports", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      alert("Failed to submit report");
      return;
    }

    alert("Report submitted successfully");
    setForm({ title: "", category: "", location: "", description: "" });
  };

  return (
    <div className="reports-page">
      {/* HEADER WITH ICONS */}
      <div className="reports-header">
        <button
          className="icon-only"
          onClick={() => navigate("/dashboard")}
          title="Back"
        >
          <FaArrowLeft />
        </button>

        <button
          className="icon-only logout"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          title="Logout"
        >
          <FaSignOutAlt />
        </button>
      </div>

      {/* CARD */}
      <div className="report-card">
        <h2>🚨 Submit Incident Report</h2>

        <form className="report-form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Incident Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option>Flood</option>
            <option>Fire</option>
            <option>Accident</option>
            <option>Road Block</option>
            <option>Earthquake</option>
          </select>

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
          />

          <button type="submit" className="primary-btn">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
