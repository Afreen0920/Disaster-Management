import React, { useEffect, useRef, useState } from "react";
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
import { NavLink, useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? 6, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuRef = useRef(null);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("dw_theme") || "light"
  );

  useEffect(() => {
    const effective =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    document.documentElement.setAttribute("data-theme", effective);
    localStorage.setItem("dw_theme", theme);
  }, [theme]);

  useEffect(() => {
    function closeMenus(e) {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target)) {
        setShowSettingsMenu(false);
      }
    }
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  // ==========================
  // LOAD ALERTS + AUTO REFRESH
  // ==========================
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/alerts`);
        const data = await res.json();
        setAlerts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load alerts", e);
      } finally {
        setLoadingAlerts(false);
      }
    };

    loadAlerts();
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  // ==========================
  // FILTER STATES
  // ==========================
  const [typeF, setTypeF] = useState("");
  const [severityF, setSeverityF] = useState("");

  // ==========================
  // COUNTRY & STATE FILTERING
  // ==========================
  const [countries, setCountries] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/states");
        const data = await res.json();
        setCountries(data.data || []);
      } catch (err) {
        console.log("Location API error:", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (!selectedCountry) return setStatesList([]);
    const c = countries.find((x) => x.name === selectedCountry);
    setStatesList(c?.states || []);
  }, [selectedCountry, countries]);

  // ==========================
  // MAP CONTROLLER
  // ==========================
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 });

  const moveToLocation = async (place) => {
    if (!place) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          place
        )}`
      );
      const data = await res.json();

      if (data?.length) {
        setCenter({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
      }
    } catch (error) {
      console.log("Failed to move map:", error);
    }
  };

  // ==========================
  // FILTER RESULTS
  // ==========================
  const filteredAlerts = alerts.filter(
    (a) =>
      (!typeF || a.type === typeF) &&
      (!severityF || a.severity === severityF) &&
      (!selectedState || a.location === selectedState)
  );

  // AUTO MOVE MAP TO FIRST RESULT
  useEffect(() => {
    if (filteredAlerts.length > 0) {
      setCenter({
        lat: filteredAlerts[0].lat,
        lng: filteredAlerts[0].lng
      });
    }
  }, [typeF, severityF, selectedState]);

  // ==========================
  // SEARCH BOX
  // ==========================
  const [query, setQuery] = useState("");
  const searchingRef = useRef(false);

  const searchLocation = async (e) => {
    e.preventDefault();
    if (!query || searchingRef.current) return;
    searchingRef.current = true;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();

      if (data?.length) {
        const place = data[0];
        const locationName = place.display_name || "";

        setCenter({
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon)
        });

        // Filter alerts matching searched city/state/country
        setSelectedCountry("");
        setSelectedState("");
        setTypeF("");
        setSeverityF("");
      }
    } finally {
      searchingRef.current = false;
    }
  };

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  const types = ["Flood", "Earthquake", "Weather"];
  const severities = ["Low", "Moderate", "High"];

  const iconByType = {
    Flood: "🌊",
    Earthquake: "⛰️",
    Weather: "☀️"
  };

  const redIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png",
    iconSize: [28, 28],
    iconAnchor: [14, 28]
  });

  return (
    <div className="dm-wrapper">
      {/* SIDEBAR */}
      <aside className="dm-sidebar">
        <NavLink to="/dashboard" className="side-link">
          <FaMap /> Dashboard
        </NavLink>

        <NavLink to="/alerts" className="side-link">
          <FaBell /> Alerts
        </NavLink>

        <NavLink to="/reports" className="side-link">
          <FaMap /> Reports
        </NavLink>

        <NavLink to="/profile" className="side-link">
          <FaUser /> Profile
        </NavLink>

        <button className="side-link logout" onClick={doLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dm-content">
        <div className="dm-topbar">
          <h1 className="page-title">Disaster Monitoring</h1>

          <div className="right-actions" ref={settingsMenuRef}>
            <button
              className="icon-btn"
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            >
              <FaCog />
            </button>

            {showSettingsMenu && (
              <div className="settings-menu">
                <button className="menu-item" onClick={() => setTheme("light")}>
                  <FaSun /> Light
                </button>
                <button className="menu-item" onClick={() => setTheme("dark")}>
                  <FaMoon /> Dark
                </button>
                <button className="menu-item" onClick={() => setTheme("system")}>
                  <FaDesktop /> System
                </button>
                <button
                  className="menu-item danger"
                  onClick={() => window.open("tel:112")}
                >
                  <FaExclamationTriangle /> Emergency
                </button>
                <button
                  className="menu-item"
                  onClick={() => alert("Help: Contact support.")}
                >
                  <FaQuestionCircle /> Help
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="controls">
          {/* SEARCH */}
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

          {/* FILTER ROW */}
          <div className="filters">
            {/* TYPE */}
            <div className="select-wrap">
              <select value={typeF} onChange={(e) => setTypeF(e.target.value)}>
                <option value="">Type</option>
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <FaChevronDown className="chev" />
            </div>

            {/* SEVERITY */}
            <div className="select-wrap">
              <select
                value={severityF}
                onChange={(e) => setSeverityF(e.target.value)}
              >
                <option value="">Severity</option>
                {severities.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <FaChevronDown className="chev" />
            </div>

            {/* COUNTRY */}
            <div className="select-wrap">
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedState("");
                  moveToLocation(e.target.value);
                }}
              >
                <option value="">Country</option>
                {countries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="chev" />
            </div>

            {/* STATE */}
            <div className="select-wrap">
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  moveToLocation(`${e.target.value}, ${selectedCountry}`);
                }}
                disabled={!selectedCountry}
              >
                <option value="">State</option>
                {statesList.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
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
            scrollWheelZoom
            className="leaflet-host"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <FlyTo center={center} />

            {filteredAlerts.map((a) => (
              <Marker key={a._id} position={[a.lat, a.lng]} icon={redIcon}>
                <Popup>
                  <b>{a.title}</b>
                  <br />
                  Type: {a.type}
                  <br />
                  Severity: {a.severity}
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
              <div className="live-alert-icon-box">
                {iconByType[a.type] || "⚠️"}
              </div>

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
