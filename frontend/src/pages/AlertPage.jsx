import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/alerts.css";

const API = "http://localhost:5000/api";

export default function AlertPage() {
  const { user, token } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState([]);

  const [alertForm, setAlertForm] = useState({
    title: "",
    description: "",
    location: "",
  });

  const [helpForm, setHelpForm] = useState({
    type: "Medical",
    location: "",
    message: "",
  });

  if (!user) return <p>Loading alerts...</p>;

  // ================= FETCH ALERTS =================
  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API}/alerts/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(res.data);
    } catch {
      setAlerts([]);
    }
  };

  // ================= FETCH HELP REQUESTS =================
  const fetchHelpRequests = async () => {
    if (user.role === "admin" || user.role === "responder") {
      try {
        const res = await axios.get(`${API}/emergency`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHelpRequests(res.data);
      } catch {}
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchHelpRequests();
  }, []);

  // ================= BROADCAST ALERT =================
  const broadcastAlert = async (e) => {
    e.preventDefault();

    await axios.post(`${API}/alerts`, alertForm, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setAlertForm({ title: "", description: "", location: "" });
    fetchAlerts();
  };

  // ================= ACKNOWLEDGE ALERT =================
  const acknowledgeAlert = async (alertId) => {
    try {
      await axios.post(
        `${API}/acknowledge/${alertId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAcknowledgedAlerts((prev) => [...prev, alertId]);
    } catch {
      alert("Already acknowledged");
    }
  };

  // ================= REQUEST HELP =================
  const requestHelp = async (e) => {
    e.preventDefault();

    await axios.post(`${API}/emergency`, helpForm, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Help request sent");
    setHelpForm({ type: "Medical", location: "", message: "" });
  };

  return (
    <div className="alerts-container">
      <h2>Alerts</h2>

      {/* ADMIN: BROADCAST ALERT */}
      {user.role === "admin" && (
        <div className="card">
          <h3>Broadcast Alert</h3>

          <form onSubmit={broadcastAlert}>
            <input
              placeholder="Alert title"
              value={alertForm.title}
              onChange={(e) =>
                setAlertForm({ ...alertForm, title: e.target.value })
              }
              required
            />

            <textarea
              placeholder="Alert description"
              value={alertForm.description}
              onChange={(e) =>
                setAlertForm({ ...alertForm, description: e.target.value })
              }
              required
            />

            <input
              placeholder="Affected area"
              value={alertForm.location}
              onChange={(e) =>
                setAlertForm({ ...alertForm, location: e.target.value })
              }
              required
            />

            <button className="btn-green">Broadcast Alert</button>
          </form>
        </div>
      )}

      {/* ACTIVE ALERTS */}
      <div className="card">
        <h3>Active Alerts</h3>

        {alerts.length === 0 && <p className="muted">No active alerts</p>}

        {alerts.map((alert) => (
          <div key={alert._id} className="alert-item">
            <div>
              <strong>{alert.title}</strong>
              <p>{alert.description}</p>
              <p className="muted">Zone: {alert.location}</p>
            </div>

            {user.role === "responder" ? (
              acknowledgedAlerts.includes(alert._id) ? (
                <span className="status">Acknowledged</span>
              ) : (
                <button
                  className="btn-outline"
                  onClick={() => acknowledgeAlert(alert._id)}
                >
                  Acknowledge
                </button>
              )
            ) : (
              <span className="status">Active</span>
            )}
          </div>
        ))}
      </div>

      {/* HELP REQUESTS (ADMIN / RESPONDER) */}
      {(user.role === "admin" || user.role === "responder") && (
        <div className="card">
          <h3>Help Requests</h3>

          {helpRequests.length === 0 && (
            <p className="muted">No help requests</p>
          )}

          {helpRequests.map((req) => (
            <div key={req._id} className="help-item">
              <strong>{req.type}</strong>
              <p>From: {req.citizenId?.name}</p>
              <p>Location: {req.location}</p>
              <p>{req.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* CITIZEN: REQUEST HELP */}
      {user.role === "citizen" && (
        <div className="card">
          <h3>Request Emergency Help</h3>

          <form onSubmit={requestHelp}>
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
              required
            />

            <textarea
              placeholder="Message"
              value={helpForm.message}
              onChange={(e) =>
                setHelpForm({ ...helpForm, message: e.target.value })
              }
              required
            />

            <button className="btn-green">Request Help</button>
          </form>
        </div>
      )}
    </div>
  );
}
