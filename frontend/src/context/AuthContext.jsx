import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD FROM STORAGE ================= */
  useEffect(() => {
    const u = localStorage.getItem("dm_user");
    const t = localStorage.getItem("dm_token");

    if (u && t) {
      setUser(JSON.parse(u));
      setToken(t);
    }
    setLoading(false);
  }, []);

  /* ================= AUTH HEADER ================= */
  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  });

  /* ================= LOGIN ================= */
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

  /* ================= REGISTER ================= */
  const register = async (formData) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }

    return await res.json();
  };

  /* ================= LOAD CURRENT USER ================= */
  const loadMe = async () => {
    if (!token) return null;

    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: authHeader()
    });

    if (!res.ok) return null;

    const data = await res.json();
    setUser(data);
    localStorage.setItem("dm_user", JSON.stringify(data));
    return data;
  };

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async (form) => {
    const res = await fetch(`${API_BASE}/api/auth/update-profile`, {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify(form)
    });

    if (!res.ok) return false;

    const data = await res.json();
    setUser(data.user);
    localStorage.setItem("dm_user", JSON.stringify(data.user));
    return true;
  };

  /* ================= CHANGE PASSWORD ================= */
  const changePassword = async (payload) => {
    const res = await fetch(`${API_BASE}/api/auth/change-password`, {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify(payload)
    });

    return res.ok;
  };

  /* ================= UPLOAD AVATAR (OPTIONAL) ================= */
  const uploadAvatar = async (file) => {
    const fd = new FormData();
    fd.append("avatar", file);

    const res = await fetch(`${API_BASE}/api/auth/upload-avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: fd
    });

    return res.ok;
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        loading,
        login,
        register,
        loadMe,          // ✅ ADDED
        updateProfile,   // ✅ ADDED
        changePassword,  // ✅ ADDED
        uploadAvatar,    // ✅ ADDED
        logout,
        authHeader
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
