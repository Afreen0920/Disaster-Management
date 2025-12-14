import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/editprofile.css";

export default function EditProfile() {
  const { user, loadMe, updateProfile, uploadAvatar } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [file, setFile] = useState(null);
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
    if (file) {
      const up = await uploadAvatar(file);
      if (!up) return setMsg("Profile updated, but avatar upload failed.");
    }
    setMsg("Profile updated successfully!");
    setTimeout(() => navigate("/profile"), 800);
  };

  return (
    <div className="ep-wrapper">
      <form className="ep-card" onSubmit={handleSave}>
        <h2>Edit Profile</h2>

        <label>Full Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <label>Phone</label>
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Optional"
        />

        <label>Address</label>
        <textarea
          rows={3}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Optional"
        />

        <label>Profile Photo</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />

        {file && (
          <div className="preview">
            <img src={URL.createObjectURL(file)} alt="preview" />
          </div>
        )}

        {msg && <div className="ep-msg">{msg}</div>}

        <div className="ep-actions">
          <button type="button" className="btn-outline" onClick={() => navigate("/profile")}>
            Cancel
          </button>
          <button className="btn-primary" type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
