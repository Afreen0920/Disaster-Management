import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/reports.css";

const API_BASE = "http://localhost:5000";

export default function SubmitReport() {
  const navigate = useNavigate();
  const { authHeader, logout } = useAuth();

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`${API_BASE}/api/reports`, form, {
      headers: authHeader()
    });

    alert("Report submitted successfully");
    navigate("/reports");
  };

  return (
    <div className="reports-page">
      {/* ===== HEADER ===== */}
      <div className="reports-header">
        <button className="icon-only" onClick={() => navigate("/reports")}>
          <FaArrowLeft />
        </button>

        <button
          className="icon-only logout"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <FaSignOutAlt />
        </button>
      </div>

      {/* ===== FORM CARD ===== */}
      <div className="report-card">
        <form className="report-form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          {/* ✅ CATEGORY DROPDOWN */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Fire">Fire</option>
            <option value="Accident">Accident</option>
            <option value="Flood">Flood</option>
            <option value="Medical">Medical Emergency</option>
            <option value="Gas Leak">Gas Leak</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Other">Other</option>
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
            placeholder="Describe the emergency situation"
            rows="4"
            value={form.description}
            onChange={handleChange}
            required
          />

          <button className="primary-btn" type="submit">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
