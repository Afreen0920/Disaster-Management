import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaIdBadge, FaArrowLeft } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "../styles/profile.css";

export default function Profile() {
  const { user, loadMe } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await loadMe();
      setLoading(false);
    })();
  }, []);

  if (loading || !user) {
    return (
      <div className="profile-wrapper">
        <div className="profile-card">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div className="profile-header">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" className="avatar-lg" />
          ) : (
            <div className="avatar-lg placeholder"><FaUser /></div>
          )}
          <h2>Your Profile</h2>
        </div>

        <div className="profile-actions">
          <Link to="/profile/edit" className="btn-primary">Edit Profile</Link>
          <Link to="/profile/password" className="btn-outline">Change Password</Link>
        </div>

        <div className="profile-info">
          <div className="info-box">
            <FaUser className="info-icon" />
            <div><label>Name</label><p>{user.name}</p></div>
          </div>

          <div className="info-box">
            <FaEnvelope className="info-icon" />
            <div><label>Email</label><p>{user.email}</p></div>
          </div>

          <div className="info-box">
            <FaIdBadge className="info-icon" />
            <div><label>Role</label><p>{user.role}</p></div>
          </div>

          {user.phone && (
            <div className="info-box">
              <span className="info-icon">📞</span>
              <div><label>Phone</label><p>{user.phone}</p></div>
            </div>
          )}

          {user.address && (
            <div className="info-box">
              <span className="info-icon">📍</span>
              <div><label>Address</label><p>{user.address}</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
