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

  const strongPassword = (p) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/.test(p);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!strongPassword(form.password)) {
      setError("Password must be strong!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const ok = await register(form);
    if (!ok) {
      setError("Registration failed!");
      return;
    }

    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input className="input-field" name="name" required onChange={handleChange} />
            <label className="input-label">Full Name</label>
          </div>

          <div className="input-group">
            <input className="input-field" name="address" required onChange={handleChange} />
            <label className="input-label">Address</label>
          </div>

          <div className="input-group">
            <input className="input-field" name="phone" required onChange={handleChange} />
            <label className="input-label">Phone Number</label>
          </div>

          <div className="input-group">
            <input className="input-field" name="email" required onChange={handleChange} />
            <label className="input-label">Email</label>
          </div>

          <div className="input-group password-wrapper">
            <input
              className="input-field"
              name="password"
              type={showPass ? "text" : "password"}
              required
              onChange={handleChange}
            />
            <label className="input-label">Password</label>
            <span className="eye-icon" onClick={() => setShowPass(!showPass)}>
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="input-group password-wrapper">
            <input
              className="input-field"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              onChange={handleChange}
            />
            <label className="input-label">Confirm Password</label>

            <span className="eye-icon" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <select name="role" className="select-field" required onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="citizen">Citizen</option>
            <option value="responder">Responder</option>
          </select>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className="primary-btn" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
