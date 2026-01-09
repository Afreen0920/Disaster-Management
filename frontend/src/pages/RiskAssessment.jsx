import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/reports.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const API_BASE = "http://localhost:5000";

export default function RiskAssessment() {
  const navigate = useNavigate();
  const { user, loading, authHeader, logout } = useAuth();

  const [reports, setReports] = useState([]);
  const [riskData, setRiskData] = useState({
    areas: [],
    engagement: { acknowledged: 0, ignored: 0 }
  });

  const [loadingPage, setLoadingPage] = useState(false);

  if (loading) return <div className="reports-page">Loading...</div>;
  if (!user) return <div className="reports-page">Not logged in</div>;

  const role = user.role;

  useEffect(() => {
    if (role === "responder") {
      navigate("/responder-reports");
    }
  }, [role, navigate]);

  useEffect(() => {
    if (role === "admin") {
      setLoadingPage(true);
      Promise.all([
        axios.get(`${API_BASE}/api/reports/all`, { headers: authHeader() }),
        axios.get(`${API_BASE}/api/reports/risk`, { headers: authHeader() })
      ]).then(([r1, r2]) => {
        setReports(r1.data || []);
        setRiskData(r2.data);
        setLoadingPage(false);
      });
    }
  }, [role, authHeader]);

  const assignResponder = async (id) => {
    await axios.put(
      `${API_BASE}/api/reports/assign/${id}`,
      {},
      { headers: authHeader() }
    );
    const res = await axios.get(`${API_BASE}/api/reports/all`, {
      headers: authHeader()
    });
    setReports(res.data);
  };

  const Header = () => (
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
  );

  /* ================= CITIZEN ================= */
  if (role === "citizen") {
    return (
      <div className="reports-page">
        <Header />
        <h2 className="page-title">Reports</h2>

        <div className="report-card">
          <button
            className="primary-btn"
            onClick={() => navigate("/submit-report")}
          >
            Submit Report
          </button>
          <br /><br />
          <button
            className="primary-btn"
            onClick={() => navigate("/my-reports")}
          >
            My Reports
          </button>
        </div>
      </div>
    );
  }

  /* ================= ADMIN ================= */
  if (role === "admin") {
    if (loadingPage)
      return <div className="reports-page">Loading...</div>;

    const barData = {
      labels: riskData.areas.map((a) => a._id || "Unknown"),
      datasets: [
        {
          label: "Reports",
          data: riskData.areas.map((a) => a.count),
          backgroundColor: "#2563eb"
        }
      ]
    };

    const pieData = {
      labels: ["Acknowledged", "Ignored"],
      datasets: [
        {
          data: [
            riskData.engagement.acknowledged,
            riskData.engagement.ignored
          ],
          backgroundColor: ["#16a34a", "#dc2626"]
        }
      ]
    };

    return (
      <div className="reports-page">
        <Header />
        <h2 className="page-title">Reports</h2>

        {/* Charts first */}
        <div className="analytics-grid">
          <div className="report-card">
            <h3>High-Risk Areas</h3>
            <Bar data={barData} />
          </div>

          <div className="report-card">
            <h3>Alert Engagement</h3>
            <Pie data={pieData} />
          </div>
        </div>

        {/* Table after */}
        <div className="report-card">
          <h3>All Citizen Reports</h3>

          <table className="report-table">
            <thead>
              <tr>
                <th>Citizen</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id}>
                  <td>{r.citizenName}</td>
                  <td>{r.category}</td>
                  <td>{r.location}</td>
                  <td className={`status ${r.status?.toLowerCase()}`}>
                    {r.status}
                  </td>
                  <td>
                    {r.status === "Submitted" && (
                      <button
                        className="assign-btn"
                        onClick={() => assignResponder(r._id)}
                      >
                        Assign
                      </button>
                    )}
                    {r.status !== "Submitted" && (
                      <span className={`status ${r.status.toLowerCase()}`}>
                        {r.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}
