import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD FROM LOCAL STORAGE ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("dm_user");
    const storedToken = localStorage.getItem("dm_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      return false;
    }

    const data = await res.json();

    localStorage.setItem("dm_user", JSON.stringify(data.user));
    localStorage.setItem("dm_token", data.token);

    setUser(data.user);
    setToken(data.token);

    return true;
  };

  /* ================= REGISTER ================= */
  const register = async (formData) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Registration failed");
    }

    return await res.json();
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("dm_user");
    localStorage.removeItem("dm_token");
    setUser(null);
    setToken(null);
  };

  /* ================= AUTH HEADER ================= */
  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        authHeader
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= USE AUTH ================= */
export const useAuth = () => useContext(AuthContext);
