import React, { createContext, useContext, useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("dm_user");
    return raw ? JSON.parse(raw) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("dm_token") || "");
  const [loadingUser, setLoadingUser] = useState(false);

  // Save to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("dm_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("dm_token", token);
  }, [token]);

  // --------------------------------------------------
  // ⭐ LOAD USER FROM TOKEN (for Profile page)
  // --------------------------------------------------
  const loadMe = async () => {
    if (!token) return;

    try {
      setLoadingUser(true);
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.log("LoadMe Error:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  // Auto-load user on refresh
  useEffect(() => {
    loadMe();
  }, [token]);

  // -------------------- REGISTER ---------------------
  const register = async (form) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    return res.ok;
  };

  // --------------------- LOGIN -----------------------
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    return true;
  };

  // --------------------- LOGOUT -----------------------
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.clear();
  };

  return (
    <AuthCtx.Provider
      value={{
        user,
        token,
        register,
        login,
        logout,
        loadMe,
        loadingUser,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
