import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AlertPage from "./pages/AlertPage";
import RiskAssessment from "./pages/RiskAssessment";
import Rescue from "./pages/Rescue";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import ResponderReports from "./pages/ResponderReports";
import SubmitReport from "./pages/SubmitReport";
import MyReports from "./pages/MyReports"; // ✅ ADDED

import { AuthProvider, useAuth } from "./context/AuthContext";

/* ================= PRIVATE ROUTE ================= */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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

          {/* ✅ FIXED ROUTE */}
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

          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
