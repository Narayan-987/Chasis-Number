import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { login, setToken, setUserInfo } from "../api/vehicleApi";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation
      if (!credentials.username.trim()) {
        throw new Error("Username is required");
      }
      if (!credentials.password.trim()) {
        throw new Error("Password is required");
      }

      // Submit
      const response = await login(credentials);

      // Store token and user info
      setToken(response.data.token);
      setUserInfo(response.data);
      refreshAuth();

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Vehicle Chassis System</h1>
      <h2 style={{ textAlign: "center", color: "#666", fontSize: "18px" }}>
        Sign In
      </h2>

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
            Username
          </label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Enter your username"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            disabled={loading}
            autoFocus
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            disabled={loading}
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* Demo Credentials */}
        <div
          style={{
            backgroundColor: "#e7f3ff",
            padding: "12px",
            borderRadius: "4px",
            marginTop: "20px",
            fontSize: "13px",
            color: "#0066cc",
          }}
        >
          <strong>Demo Credentials:</strong>
          <br />
          Username: testuser
          <br />
          Password: Test@123
        </div>

        {/* Signup Link */}
        <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          Don't have an account?{" "}
         <Link to="/signup">Create one here</Link>
        </p>
      </form>
    </div>
  );
}
