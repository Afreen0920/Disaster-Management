import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/dashboard.css";
import {
  FaBell,
  FaMap,
  FaSignOutAlt,
  FaSearch,
  FaChevronDown,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaExclamationTriangle,
  FaSun,
  FaMoon,
  FaDesktop
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? 12, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const settingsMenuRef = useRef(null);

  const [theme, setTheme] = useState(() => localStorage.getItem("dw_theme") || "light");

  useEffect(() => {
    const effective =
      theme === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme;

    document.documentElement.setAttribute("data-theme", effective);
    localStorage.setItem("dw_theme", theme);
  }, [theme]);


  useEffect(() => {
    function closeMenus(e) {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target)) {
        setShowSettingsMenu(false);
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);


  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/alerts`);
        const data = await res.json();
        setAlerts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load alerts", e);
      } finally {
        setLoadingAlerts(false);
      }
    })();
  }, []);

  const [typeF, setTypeF] = useState("");
  const [severityF, setSeverityF] = useState("");
  const [locationF, setLocationF] = useState("");

  const types = useMemo(() => ["Flood", "Earthquake", "Weather"], []);
  const severities = useMemo(() => ["Low", "Moderate", "High"], []);

  const locations = useMemo(() => {
    const vals = new Set();
    alerts.forEach((a) => {
      if (a.location && a.location.trim()) vals.add(a.location.trim());
    });
    return Array.from(vals);
  }, [alerts]);

  const filteredAlerts = alerts.filter(
    (a) =>
      (!typeF || a.type === typeF) &&
      (!severityF || a.severity === severityF) &&
      (!locationF || a.location === locationF)
  );

  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 });

  const redIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png",
    iconSize: [28, 28],
    iconAnchor: [14, 28]
  });


  const [query, setQuery] = useState("");
  const searchingRef = useRef(false);

  const searchLocation = async (e) => {
    e.preventDefault();
    if (!query || searchingRef.current) return;
    searchingRef.current = true;

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data?.length) {
        setCenter({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      searchingRef.current = false;
    }
  };


  const doLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHelp = () => {
    alert("Help: Contact support.");
    setShowSettingsMenu(false);
  };

  const handleEmergency = () => {
    window.open("tel:112");
    setShowSettingsMenu(false);
  };


  return (
    <div className="dm-wrapper">

      <aside className="dm-sidebar">
        <button className="side-link"><FaMap /> Dashboard</button>
        <button className="side-link"><FaBell /> Alerts</button>
        <button className="side-link"><FaMap /> Reports</button>

        <button className="side-link logout" onClick={doLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="dm-content">

        {/* TOP BAR */}
        <div className="dm-topbar">
          <h1 className="page-title">Disaster Monitoring</h1>

          <div className="right-actions" ref={settingsMenuRef}>

            {/* SETTINGS ICON */}
            <button
              className="icon-btn"
              onClick={() => {
                setShowSettingsMenu(!showSettingsMenu);
                setShowProfile(false);
              }}
            >
              <FaCog />
            </button>

            {/* SETTINGS MENU */}
            {showSettingsMenu && (
              <div className="settings-menu">

                <button className="menu-item" onClick={() => { setTheme("light"); setShowSettingsMenu(false); }}>
                  <FaSun className="mi-ic" /> Light
                </button>

                <button className="menu-item" onClick={() => { setTheme("dark"); setShowSettingsMenu(false); }}>
                  <FaMoon className="mi-ic" /> Dark
                </button>

                <button className="menu-item" onClick={() => { setTheme("system"); setShowSettingsMenu(false); }}>
                  <FaDesktop className="mi-ic" /> System
                </button>

                <button className="menu-item danger" onClick={handleEmergency}>
                  <FaExclamationTriangle className="mi-ic" /> Emergency
                </button>

                <button className="menu-item" onClick={handleHelp}>
                  <FaQuestionCircle className="mi-ic" /> Help
                </button>

              </div>
            )}

            {/* PROFILE ICON */}
            <div
              className="avatar"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowSettingsMenu(false);
              }}
            >
              <FaUser />
            </div>

            {/* PROFILE POPUP */}
            {showProfile && (
              <div className="profile-pop">
                <div className="pp-row"><span>Name</span> <b>{user?.name || "User"}</b></div>
                <div className="pp-row"><span>Email</span> <b>{user?.email || "-"}</b></div>
                <div className="pp-row"><span>Role</span> <b>{user?.role || "-"}</b></div>

                <button className="pp-logout" onClick={doLogout}>Logout</button>
              </div>
            )}

          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="controls">
          <form className="search" onSubmit={searchLocation}>
            <FaSearch className="search-ic" />
            <input
              type="text"
              placeholder="Search for location"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </form>

          <div className="filters">

            <div className="select-wrap">
              <select value={typeF} onChange={(e) => setTypeF(e.target.value)}>
                <option value="">Type</option>
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
              <FaChevronDown className="chev" />
            </div>

            <div className="select-wrap">
              <select value={severityF} onChange={(e) => setSeverityF(e.target.value)}>
                <option value="">Severity</option>
                {severities.map(s => <option key={s}>{s}</option>)}
              </select>
              <FaChevronDown className="chev" />
            </div>

            <div className="select-wrap">
              <select value={locationF} onChange={(e) => setLocationF(e.target.value)}>
                <option value="">Location</option>
                {locations.map(l => <option key={l}>{l}</option>)}
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
            scrollWheelZoom
            className="leaflet-host"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FlyTo center={center} />

            {filteredAlerts.map(a => (
              <Marker key={a._id} position={[a.lat, a.lng]} icon={redIcon}>
                <Popup>
                  <b>{a.title}</b><br />
                  Type: {a.type}<br />
                  Severity: {a.severity}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* LIVE ALERTS */}
        <div className="list-section">
          <h3>Live Alerts</h3>

          {loadingAlerts && <div className="muted">Loading…</div>}

          {filteredAlerts.map(a => (
            <div key={a._id} className={`alert-item sev-${a.severity.toLowerCase()}`}>
              <div className="icon">{a.type === "Flood" ? "🌊" : a.type === "Earthquake" ? "⛰️" : "☀️"}</div>
              <div className="text">
                <div className="title">{a.title}</div>
                <div className="sub">{a.severity}</div>
              </div>
            </div>
          ))}

        </div>

      </main>
    </div>
  );
}
