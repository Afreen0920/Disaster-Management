import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/reports.css";

const API_BASE = "http://localhost:5000";

export default function ResponderReports() {
  const navigate = useNavigate();
  const { authHeader, logout } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/reports/assigned`, {
        headers: authHeader()
      })
      .then((res) => setReports(res.data));
  }, [authHeader]);

  const completeTask = async (id) => {
    await axios.put(
      `${API_BASE}/api/reports/complete/${id}`,
      {},
      { headers: authHeader() }
    );

    setReports(reports.filter((r) => r._id !== id));
  };

  return (
    <div className="reports-page">
      {/* ===== HEADER ===== */}
      <div className="reports-header">
        <button className="icon-only" onClick={() => navigate("/dashboard")}>
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

      {/* ===== CONTENT ===== */}
      <div className="report-card">
        {reports.length === 0 ? (
          <p>No tasks assigned</p>
        ) : (
          reports.map((r) => (
            <div key={r._id} className="report-item">
              <h4>{r.title}</h4>
              <p>{r.location}</p>
              <p className="status assigned">{r.status}</p>

              <button
                className="primary-btn"
                onClick={() => completeTask(r._id)}
              >
                Mark as Completed
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
