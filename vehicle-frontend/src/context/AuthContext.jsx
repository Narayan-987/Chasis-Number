/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";
import { isAuthenticated, getUserInfo } from "../api/vehicleApi";

// ✅ Create Auth Context
const AuthContext = createContext(null);

/**
 * ✅ AuthProvider - Wraps the app and provides auth state
 * Usage: <AuthProvider><App /></AuthProvider>
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return isAuthenticated() ? getUserInfo() : null;
  });
  const loading = false;
  const [isAuth, setIsAuth] = useState(() => isAuthenticated());

  const refreshAuth = () => {
    const authenticated = isAuthenticated();
    setUser(authenticated ? getUserInfo() : null);
    setIsAuth(authenticated);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("userRole");
    localStorage.removeItem("gstNumber");
    localStorage.removeItem("companyName");
    setUser(null);
    setIsAuth(false);
  };

  const value = {
    user,
    isAuth,
    loading,
    logout,
    refreshAuth,
    isAdmin: user?.role === "ADMIN",
    isUser: user?.role === "USER",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * ✅ useAuth Hook - Access auth state anywhere in the app
 * Usage: const { user, isAuth, logout, isAdmin } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
