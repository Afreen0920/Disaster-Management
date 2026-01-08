import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import "../styles/reports.css";

export default function MyReports() {
  const { authHeader, logout } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      const res = await fetch("http://localhost:5000/api/reports/my", {
        headers: authHeader()
      });

      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    };

    loadReports();
  }, [authHeader]);

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
        <h2>📄 My Reports</h2>

        {reports.length === 0 && (
          <p>No reports submitted yet.</p>
        )}

        {reports.map((r) => (
          <div key={r._id} className="report-item">
            <h4>{r.title}</h4>
            <p><b>Category:</b> {r.category}</p>
            <p><b>Location:</b> {r.location}</p>
            <p>
              <b>Status:</b>{" "}
              <span className={`status ${r.status?.toLowerCase()}`}>
                {r.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
