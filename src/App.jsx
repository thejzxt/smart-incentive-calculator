import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./components/shared/LoginPage";
import Navbar from "./components/shared/Navbar";
import AdminDashboard from "./components/admin/AdminDashboard";
import OfficerDashboard from "./components/officer/OfficerDashboard";


function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {

    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {

    const defaultRedirect = user.role === "admin" ? "/admin" : "/officer";
    return <Navigate to={defaultRedirect} replace />;
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-toyota-dark transition-colors duration-300">
      <Navbar />
      <main className="animate-fade-in">
        {children}
      </main>
    </div>
  );
}


function HomeRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === "admin" ? "/admin" : "/officer"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/officer"
            element={
              <ProtectedRoute allowedRoles={["officer"]}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
