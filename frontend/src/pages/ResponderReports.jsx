import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/reports.css";

const API_BASE = "http://localhost:5000";

export default function ResponderReports() {
  const { authHeader } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/reports/assigned`, {
        headers: authHeader()
      })
      .then((res) => setReports(res.data));
  }, [authHeader]);

  return (
    <div className="reports-page">
      <div className="report-card">
        <h3>Assigned Tasks</h3>

        {reports.length === 0 ? (
          <p>No tasks assigned</p>
        ) : (
          reports.map((r) => (
            <div key={r._id} className="report-item">
              <h4>{r.title}</h4>
              <p>{r.location}</p>
              <p className="status in-progress">{r.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
