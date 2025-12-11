import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.role) {
      setError("Please select a role");
      return;
    }

    const ok = register(form);
    if (ok) navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2 className="auth-title">Create Your Account</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              className="input-field"
              placeholder=" "
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <label className="input-label">Full Name</label>
          </div>

          <div className="input-group">
            <input
              className="input-field"
              placeholder=" "
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
            <label className="input-label">Address</label>
          </div>

          <div className="input-group">
            <input
              className="input-field"
              placeholder=" "
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <label className="input-label">Phone Number</label>
          </div>

          <div className="input-group">
            <input
              className="input-field"
              placeholder=" "
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label className="input-label">Email</label>
          </div>

          <div className="input-group password-wrapper">
            <input
              className="input-field"
              placeholder=" "
              name="password"
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
            />
            <label className="input-label">Password</label>

            <span className="eye-icon" onClick={() => setShowPass(!showPass)}>
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="input-group password-wrapper">
            <input
              className="input-field"
              placeholder=" "
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <label className="input-label">Confirm Password</label>

            <span
              className="eye-icon"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <select
            name="role"
            className="select-field"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="citizen">Citizen</option>
            <option value="responder">Responder</option>
          </select>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className="primary-btn" type="submit">
            Register
          </button>

        </form>
      </div>
    </div>
  );
}
