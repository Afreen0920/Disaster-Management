import React, { createContext, useContext, useState } from "react";

const AuthCtx = createContext();
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("dm_user");
    return raw ? JSON.parse(raw) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("dm_token") || "";
  });

  // -------------------- REGISTER --------------------
  const register = async (form) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    return res.ok;
  };

  // --------------------- LOGIN ----------------------
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();

      // ✅ STORE CORRECTLY
      localStorage.setItem("dm_user", JSON.stringify(data.user));
      localStorage.setItem("dm_token", data.token);

      setUser(data.user);
      setToken(data.token);

      return true;
    } catch (err) {
      return false;
    }
  };

  // --------------------- LOGOUT ---------------------
  const logout = () => {
    localStorage.removeItem("dm_user");
    localStorage.removeItem("dm_token");
    setUser(null);
    setToken("");
  };

  return (
    <AuthCtx.Provider
      value={{
        user,
        token,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
