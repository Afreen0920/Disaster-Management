import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function RescuePage() {
  const { user, token } = useAuth();
  const [rescues, setRescues] = useState([]);
  const [form, setForm] = useState({ location: "", description: "" });
  const [responderId, setResponderId] = useState("");

  const fetchRescues = async () => {
    const res = await axios.get(`${API}/rescue`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRescues(res.data);
  };

  useEffect(() => {
    fetchRescues();
  }, []);

  /* CITIZEN */
  const requestRescue = async () => {
    await axios.post(`${API}/rescue`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRescues();
  };

  /* ADMIN */
  const assignResponder = async (id) => {
    await axios.put(
      `${API}/rescue/${id}/assign`,
      { responderId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchRescues();
  };

  /* RESPONDER */
  const completeRescue = async (id) => {
    await axios.put(
      `${API}/rescue/${id}/complete`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchRescues();
  };

  return (
    <div className="page">
      <h2>🚑 Rescue Operations</h2>

      {/* CITIZEN REQUEST */}
      {user.role === "citizen" && (
        <div>
          <input placeholder="Location" onChange={e=>setForm({...form,location:e.target.value})}/>
          <textarea placeholder="Description" onChange={e=>setForm({...form,description:e.target.value})}/>
          <button onClick={requestRescue}>Request Rescue</button>
        </div>
      )}

      {/* LIST */}
      {rescues.map((r) => (
        <div key={r._id} className="card">
          <p><b>Location:</b> {r.location}</p>
          <p><b>Status:</b> {r.status}</p>

          {/* ADMIN */}
          {user.role === "admin" && r.status === "Pending" && (
            <>
              <input
                placeholder="Responder ID"
                onChange={(e) => setResponderId(e.target.value)}
              />
              <button onClick={() => assignResponder(r._id)}>Assign</button>
            </>
          )}

          {/* RESPONDER */}
          {user.role === "responder" && r.status === "Assigned" && (
            <button onClick={() => completeRescue(r._id)}>Complete</button>
          )}
        </div>
      ))}
    </div>
  );
}
