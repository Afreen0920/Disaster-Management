import { useEffect, useState } from "react";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/rescue.css";

const API = "http://localhost:5000/api";

export default function Rescue() {
  const { user, token, logout } = useAuth();
  const [rescues, setRescues] = useState([]);
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  /* ================= FETCH ================= */
  const fetchRescues = async () => {
    const res = await axios.get(`${API}/rescue`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRescues(res.data);
  };

  useEffect(() => {
    fetchRescues();
  }, []);

  /* ================= CITIZEN ================= */
const sendRescue = async () => {
  try {
    await axios.post(
      `${API}/rescue`,
      { location, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Rescue request sent successfully");

    setLocation("");
    setMessage("");
    fetchRescues();
  } catch (err) {
    alert("Failed to send rescue request");
  }
};


  /* ================= ADMIN ================= */
  const assignRescue = async (id) => {
  try {
    await axios.put(
      `${API}/rescue/${id}/assign`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Rescue assigned successfully");

    fetchRescues();
  } catch (err) {
    alert("Failed to assign rescue");
  }
};


  /* ================= RESPONDER ================= */
 const completeRescue = async (id) => {
  try {
    await axios.put(
      `${API}/rescue/${id}/complete`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ SUCCESS POPUP
    alert("Successfully completed the rescue operation");

    // 🔥 REMOVE FROM UI
    setRescues((prev) => prev.filter((r) => r._id !== id));
  } catch {
    alert("Failed to complete the rescue operation");
  }
};


  return (
    <div className="rescue-page">
      {/* HEADER */}
      <div className="rescue-header">
        <h2>Rescue Operations</h2>
        <FaSignOutAlt className="logout-icon" onClick={logout} />
      </div>

      {/* ================= CITIZEN ================= */}
      {user.role === "citizen" && (
        <div className="card">
          <h3>Request Rescue</h3>

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <textarea
            placeholder="Describe emergency"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button className="btn" onClick={sendRescue}>
            Send Rescue Request
          </button>
        </div>
      )}

      {/* ================= ADMIN ================= */}
      {user.role === "admin" && (
        <div className="card">
          <h3>Rescue Requests</h3>

          {rescues.map((r) => (
            <div key={r._id} className="rescue-item">
              <div className="rescue-info">
                <b>{r.location}</b>
                <p>{r.message}</p>
              </div>

              <button onClick={() => assignRescue(r._id)}>
                Assign
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= RESPONDER ================= */}
      {user.role === "responder" && (
        <div className="card">
          <h3>Assigned Rescues</h3>

          {rescues.length === 0 && <p>No assigned rescues</p>}

          {rescues.map((r) => (
            <div key={r._id} className="rescue-item">
              <div className="rescue-info">
                <b>{r.location}</b>
                <p>{r.message}</p>
              </div>

              {/* ✅ SMALL POLAROID / PILL BOX */}
              <div
                className="complete-box"
                onClick={() => completeRescue(r._id)}
              >
                Completed
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
