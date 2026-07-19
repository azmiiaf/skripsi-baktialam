import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import LoginPage from "../components/pages/LoginPage";
import LoginPage from "../src/pages/LoginPage";
import RegisterPage from "../src/pages/RegisterPage";
import AdminDashboard from "../src/pages/AdminDashboard";
import UserDashboard from "../src/pages/UserDashboard";
import ModernDashboard from "../src/pages/ModernDashboard";
import MobileAppUI from "../src/pages/MobileAppUI";
import ResetPasswordPage from "../src/pages/ResetPasswordPage";
import VerifyEmailPage from "../src/pages/VerifyEmailPage";
// import { initializeStorage, getCurrentUser } from "./utils/localStorage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = () => {
      const user = localStorage.getItem("banksampah_current_user");
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
      setIsLoading(false);
    };

    initialize();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-pulse"><img src="../../../public/img/loading.gif" alt="loading..." /></div>
          <h2 className="text-secondary font-bold">Memuat...</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Modern UI Previews */}
        <Route path="/modern-dashboard" element={<ModernDashboard />} />
        <Route path="/mobile-app" element={<MobileAppUI />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage onLogin={handleLogin} />} />

        {/* Auth Route */}
        <Route
          path="/login"
          element={
            !currentUser ? (
              <LoginPage onLogin={handleLogin} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/register"
          element={
            !currentUser ? (
              <RegisterPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Protected Dashboard Route */}
        <Route
          path="/"
          element={
            !currentUser ? (
              <Navigate to="/login" />
            ) : currentUser.role === "admin" ? (
              <AdminDashboard
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            ) : (
              <UserDashboard
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
