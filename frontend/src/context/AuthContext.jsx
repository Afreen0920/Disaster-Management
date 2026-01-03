import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ ADD THIS

  useEffect(() => {
    const storedUser = localStorage.getItem("dm_user");
    const storedToken = localStorage.getItem("dm_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false); // ✅ IMPORTANT
  }, []);

  const register = async (form) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    return res.ok;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) return false;

    const data = await res.json();
    localStorage.setItem("dm_user", JSON.stringify(data.user));
    localStorage.setItem("dm_token", data.token);

    setUser(data.user);
    setToken(data.token);
    return true;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  const authHeader = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  });

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, logout, authHeader }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
