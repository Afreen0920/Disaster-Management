import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/editprofile.css";

export default function EditProfile() {
  const { loadMe, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const me = await loadMe();
      setForm({
        name: me?.name || "",
        phone: me?.phone || "",
        address: me?.address || ""
      });
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const ok = await updateProfile(form);
    if (!ok) return setMsg("Failed to update profile");
    setMsg("Profile updated successfully!");
    setTimeout(() => navigate("/profile"), 800);
  };

  return (
    <div className="ep-wrapper">
      <form className="ep-card" onSubmit={handleSave}>
        <h2>Edit Profile</h2>

        <label>Full Name</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

        <label>Phone</label>
        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

        <label>Address</label>
        <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />

        {msg && <div className="ep-msg">{msg}</div>}

        <div className="ep-actions">
          <button type="button" onClick={() => navigate("/profile")}>Cancel</button>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
