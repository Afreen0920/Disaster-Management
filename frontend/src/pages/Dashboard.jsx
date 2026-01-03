import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import {
  FaBell,
  FaMap,
  FaSignOutAlt,
  FaSearch,
  FaChevronDown,
  FaUser,
  FaExclamationTriangle
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/* ================= MAP FLY ================= */
function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.flyTo([center.lat, center.lng], 6, { duration: 0.8 });
    }
  }, [center, map]);
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, authHeader } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [query, setQuery] = useState("");
  const [typeF, setTypeF] = useState("");
  const [severityF, setSeverityF] = useState("");
  const [locationF, setLocationF] = useState("");

  const [center, setCenter] = useState({
    lat: 20.5937,
    lng: 78.9629
  });

  /* ================= LOAD ALERTS ================= */
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/alerts/active`, {
          headers: authHeader()
        });
        const data = await res.json();
        setAlerts(Array.isArray(data) ? data : []);
      } catch {
        setAlerts([]);
      }
    };

    loadAlerts();
    const i = setInterval(loadAlerts, 5000);
    return () => clearInterval(i);
  }, [authHeader]);

  /* ================= SEARCH LOCATION ================= */
  const searchLocation = async (e) => {
    e.preventDefault();
    if (!query) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await res.json();

    if (data?.length) {
      setCenter({
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      });
    }
  };

  /* ================= FILTERED ALERTS ================= */
  const filteredAlerts = alerts.filter((a) => {
    return (
      (!typeF || a.type === typeF) &&
      (!severityF || a.severity === severityF) &&
      (!locationF || a.location === locationF)
    );
  });

  const redIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png",
    iconSize: [28, 28],
    iconAnchor: [14, 28]
  });

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dm-wrapper">
      {/* ================= SIDEBAR ================= */}
      <aside className="dm-sidebar">
        <NavLink to="/dashboard" className="side-link">
          <FaMap /> Dashboard
        </NavLink>

        <NavLink to="/alerts" className="side-link">
          <FaBell /> Alerts
        </NavLink>

        {/* ✅ FIX: Rescue visible for ALL roles */}
        <NavLink to="/rescue" className="side-link">
          <FaExclamationTriangle /> Rescue
        </NavLink>

        <NavLink to="/profile" className="side-link">
          <FaUser /> Profile
        </NavLink>

        <button className="side-link logout" onClick={doLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="dm-content">
        <div className="dm-topbar">
          <h1 className="page-title">Disaster Monitoring</h1>
        </div>

        {/* SEARCH */}
        <div className="controls">
          <form className="search" onSubmit={searchLocation}>
            <FaSearch />
            <input
              placeholder="Search for location"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </form>

          {/* FILTERS */}
          <div className="filters">
            <div className="select-wrap">
              <select value={typeF} onChange={(e) => setTypeF(e.target.value)}>
                <option value="">Type</option>
                <option>Flood</option>
                <option>Earthquake</option>
                <option>Fire</option>
              </select>
              <FaChevronDown className="chev" />
            </div>

            <div className="select-wrap">
              <select
                value={severityF}
                onChange={(e) => setSeverityF(e.target.value)}
              >
                <option value="">Severity</option>
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
                <option>Critical</option>
              </select>
              <FaChevronDown className="chev" />
            </div>

            <div className="select-wrap">
              <select
                value={locationF}
                onChange={(e) => setLocationF(e.target.value)}
              >
                <option value="">Location</option>
                {[...new Set(alerts.map((a) => a.location))].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <FaChevronDown className="chev" />
            </div>
          </div>
        </div>

        {/* MAP */}
        <div className="map-box">
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={5}
            className="leaflet-host"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FlyTo center={center} />

            {filteredAlerts
              .filter((a) => a.latitude && a.longitude)
              .map((a) => (
                <Marker
                  key={a._id}
                  position={[a.latitude, a.longitude]}
                  icon={redIcon}
                >
                  <Popup>
                    <b>{a.title}</b>
                    <br />
                    {a.type} • {a.severity}
                    <br />
                    {a.location}
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        {/* LIVE ALERTS */}
        <div className="live-alerts-container">
          <h2 className="live-alerts-title">Live Alerts</h2>

          {filteredAlerts.length === 0 && (
            <div className="no-alerts">No active alerts</div>
          )}

          {filteredAlerts.map((a) => (
            <div key={a._id} className="live-alert-item">
              <div className="live-alert-icon-box">⚠️</div>
              <div className="live-alert-info">
                <div className="live-alert-title">{a.title}</div>
                <div className="live-alert-severity">
                  {a.severity} • {a.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
