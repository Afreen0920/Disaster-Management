import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // registered users

  const login = ({ email, password }) => {
    const existingUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (existingUser) {
      setUser(existingUser);
      return true;
    }
    return false;
  };

  const register = ({ name, address, phone, email, password, role }) => {
    const exists = users.find((u) => u.email === email);
    if (exists) return false;
    const newUser = { name, address, phone, email, password, role };
    setUsers([...users, newUser]);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
