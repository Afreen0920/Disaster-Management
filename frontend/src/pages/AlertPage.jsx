import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaSignOutAlt
} from "react-icons/fa";
import "../styles/alerts.css";

const API = "http://localhost:5000/api";

export default function AlertPage() {
  const { user, token, logout } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState([]);

  const [alertForm, setAlertForm] = useState({
    title: "",
    description: "",
    location: ""
  });

  const [helpForm, setHelpForm] = useState({
    type: "Medical",
    location: "",
    message: ""
  });

  if (!user) return <p>Loading...</p>;

  /* ================= FETCH ALERTS ================= */
  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API}/alerts/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(res.data || []);
    } catch {
      setAlerts([]);
    }
  };

  /* ================= FETCH HELP REQUESTS ================= */
  const fetchHelpRequests = async () => {
    if (user.role === "admin" || user.role === "responder") {
      try {
        const res = await axios.get(`${API}/emergency`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHelpRequests(res.data || []);
      } catch {
        setHelpRequests([]);
      }
    }
  };

  /* 🔥 FIXED USE EFFECT */
  useEffect(() => {
    if (user && token) {
      fetchAlerts();
      fetchHelpRequests();
    }
  }, [user, token]);

  /* ================= ACTIONS ================= */

  const broadcastAlert = async () => {
    try {
      await axios.post(`${API}/alerts`, alertForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlertForm({ title: "", description: "", location: "" });
      fetchAlerts();
    } catch {
      alert("Failed to broadcast alert");
    }
  };

  const acknowledgeAlert = async (id) => {
    try {
      await axios.post(
        `${API}/acknowledge/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAcknowledgedAlerts((prev) => [...prev, id]);
    } catch {
      alert("Already acknowledged");
    }
  };

  const completeHelp = async (id) => {
    await axios.put(
      `${API}/emergency/${id}/complete`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchHelpRequests();
  };

  const requestHelp = async () => {
    try {
      await axios.post(`${API}/emergency`, helpForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHelpForm({ type: "Medical", location: "", message: "" });
      alert("Help request sent");
    } catch {
      alert("Failed to send help request");
    }
  };

  return (
    <div className="alerts-dark">

      {/* HEADER */}
      <div className="alerts-header">
        <h2>Alerts</h2>
        <button className="logout-icon" onClick={logout}>
          <FaSignOutAlt />
        </button>
      </div>

      {/* ADMIN BROADCAST */}
      {user.role === "admin" && (
        <div className="dark-card">
          <h3>Broadcast Alert</h3>
          <input
            placeholder="Title"
            value={alertForm.title}
            onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={alertForm.description}
            onChange={(e) =>
              setAlertForm({ ...alertForm, description: e.target.value })
            }
          />
          <input
            placeholder="Location"
            value={alertForm.location}
            onChange={(e) =>
              setAlertForm({ ...alertForm, location: e.target.value })
            }
          />
          <button className="btn-green" onClick={broadcastAlert}>
            Broadcast Alert
          </button>
        </div>
      )}

      {/* ACTIVE ALERTS */}
      <div className="dark-card">
        <h3>Active Alerts</h3>

        {alerts.map((a) => (
          <div key={a._id} className="alert-row">
            <FaExclamationTriangle />
            <div className="alert-info">
              <strong>{a.title}</strong>
              <span>
                <FaMapMarkerAlt /> {a.location}
              </span>
            </div>

            {user.role === "responder" &&
              (acknowledgedAlerts.includes(a._id) ? (
                <span>Acknowledged</span>
              ) : (
                <button onClick={() => acknowledgeAlert(a._id)}>
                  Acknowledge
                </button>
              ))}
          </div>
        ))}
      </div>

      {/* 🔥 HELP REQUESTS (FROM CITIZENS) */}
      {(user.role === "admin" || user.role === "responder") && (
        <div className="dark-card">
          <h3>Help Requests</h3>

          {helpRequests.length === 0 && <p>No help requests</p>}

          {helpRequests.map((h) => (
            <div key={h._id} className="help-row">
              <strong>{h.type}</strong> — {h.location}
              <p>{h.message}</p>

              {user.role === "responder" && (
                <button onClick={() => completeHelp(h._id)}>
                  Mark Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CITIZEN HELP FORM */}
      {user.role === "citizen" && (
        <div className="dark-card">
          <h3>Request Emergency Help</h3>

          <select
            value={helpForm.type}
            onChange={(e) =>
              setHelpForm({ ...helpForm, type: e.target.value })
            }
          >
            <option>Medical</option>
            <option>Rescue</option>
            <option>Fire</option>
          </select>

          <input
            placeholder="Location"
            value={helpForm.location}
            onChange={(e) =>
              setHelpForm({ ...helpForm, location: e.target.value })
            }
          />

          <textarea
            placeholder="Message"
            value={helpForm.message}
            onChange={(e) =>
              setHelpForm({ ...helpForm, message: e.target.value })
            }
          />

          <button onClick={requestHelp}>Request Help</button>
        </div>
      )}
    </div>
  );
}
