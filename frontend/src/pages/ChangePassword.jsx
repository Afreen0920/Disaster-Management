import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/changepass.css";

export default function ChangePassword() {
  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirm: ""
  });

  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [msg, setMsg] = useState("");

  const strong =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const submit = async (e) => {
    e.preventDefault();

    if (!strong.test(form.newPassword)) {
      return setMsg(
        "New password must be 8+ chars with uppercase, lowercase, number & special char."
      );
    }

    if (form.newPassword !== form.confirm) {
      return setMsg("Passwords do not match.");
    }

    const ok = await changePassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword
    });

    if (!ok) return setMsg("Failed to change password. Check your old password.");

    setMsg("Password changed successfully!");
    setTimeout(() => navigate("/profile"), 800);
  };

  return (
    <div className="cp-wrapper">
      <form className="cp-card" onSubmit={submit}>
        <h2>Change Password</h2>

        {/* OLD PASSWORD */}
        <label>Old Password</label>
        <div className="cp-input-wrap">
          <input
            type={show.old ? "text" : "password"}
            value={form.oldPassword}
            onChange={(e) =>
              setForm({ ...form, oldPassword: e.target.value })
            }
            required
          />
          <span onClick={() => setShow({ ...show, old: !show.old })}>
            {show.old ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* NEW PASSWORD */}
        <label>New Password</label>
        <div className="cp-input-wrap">
          <input
            type={show.new ? "text" : "password"}
            value={form.newPassword}
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
            required
            placeholder="8+ chars, Aa, 0-9, @#"
          />
          <span onClick={() => setShow({ ...show, new: !show.new })}>
            {show.new ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <label>Confirm New Password</label>
        <div className="cp-input-wrap">
          <input
            type={show.confirm ? "text" : "password"}
            value={form.confirm}
            onChange={(e) =>
              setForm({ ...form, confirm: e.target.value })
            }
            required
          />
          <span
            onClick={() =>
              setShow({ ...show, confirm: !show.confirm })
            }
          >
            {show.confirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {msg && <div className="cp-msg">{msg}</div>}

        <div className="cp-actions">
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
          <button className="btn-primary" type="submit">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
