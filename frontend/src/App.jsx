import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AlertPage from "./pages/AlertPage";
import RiskAssessment from "./pages/RiskAssessment";
import Rescue from "./pages/Rescue";
import Profile from "./pages/Profile";
import ResponderReports from "./pages/ResponderReports";
import SubmitReport from "./pages/SubmitReport";
import MyReports from "./pages/MyReports"; // ✅ ADD THIS

import { AuthProvider, useAuth } from "./context/AuthContext";

/* ===== PRIVATE ROUTE ===== */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ===== DEFAULT ===== */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* ===== PUBLIC ===== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ===== PRIVATE ===== */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/alerts"
            element={
              <PrivateRoute>
                <AlertPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <RiskAssessment />
              </PrivateRoute>
            }
          />

          <Route
            path="/submit-report"
            element={
              <PrivateRoute>
                <SubmitReport />
              </PrivateRoute>
            }
          />

          <Route
            path="/my-reports"
            element={
              <PrivateRoute>
                <MyReports />
              </PrivateRoute>
            }
          />

          <Route
            path="/responder-reports"
            element={
              <PrivateRoute>
                <ResponderReports />
              </PrivateRoute>
            }
          />

          <Route
            path="/rescue"
            element={
              <PrivateRoute>
                <Rescue />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* ===== FALLBACK ===== */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
