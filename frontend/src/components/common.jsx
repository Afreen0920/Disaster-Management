import React from "react";

export function SectionCard({ title, children }) {
  return (
    <div style={{ padding: "20px", borderRadius: "8px", background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export function Input({ label, type = "text", value, onChange }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} style={{ width: "100%", padding: "8px", marginTop: "4px" }} />
    </div>
  );
}

export function Select({ label, value, onChange, children }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label>{label}</label>
      <select value={value} onChange={onChange} style={{ width: "100%", padding: "8px", marginTop: "4px" }}>
        {children}
      </select>
    </div>
  );
}

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      style={{ width: "100%", padding: "10px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
    >
      {children}
    </button>
  );
}
