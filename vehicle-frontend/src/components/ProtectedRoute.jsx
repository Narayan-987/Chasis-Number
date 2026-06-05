import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>Access Denied</h2>
        <p>Required role: {requiredRole}</p>
        <p>Your role: {user?.role}</p>
        <a href="/">Go back</a>
      </div>
    );
  }

  return children;
}