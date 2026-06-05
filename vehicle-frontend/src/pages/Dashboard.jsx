import api from "../api/axiosConfig";
import { useState } from "react";
import SearchPanel from "../components/SearchPanel";
import VehicleTable from "../components/VehicleTable";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

 const isAdmin = user?.role === "ADMIN";
  const [results, setResults] = useState([]);

  const handleViewAllData = async () => {
  try {
    const response = await api.get("/master/all");

    console.log("API RESPONSE:", response.data);

    setResults(response.data);
  } catch (error) {
    console.error("Error loading data:", error);
  }
};
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          paddingBottom: "15px",
          borderBottom: "2px solid #ddd",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Vehicle Chassis Management</h1>
          <p style={{ color: "#555", marginTop: "10px", maxWidth: "620px" }}>
            Central dashboard to navigate vehicle search, add new chassis
            records, upload decoding files, and manage your fleet.
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "0 0 5px 0", color: "#666" }}>
            Welcome, <strong>{user?.username}</strong>
          </p>

          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "12px",
              color: "#999",
            }}
          >
            Role: <strong>{user?.role}</strong>
          </p>

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 15px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* SEARCH PANEL */}
      <div style={{ marginTop: "20px" }}>
        <SearchPanel setResults={setResults} />
      </div>

      {/* TABLE */}
      {/* VIEW ALL DATA BUTTON */}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    marginBottom: "20px",
  }}
>
  <button
  onClick={() => {
    console.log("VIEW ALL CLICKED");
    handleViewAllData();
  }}
>
  View All Data
</button>
</div>

{/* TABLE */}
<div style={{ marginTop: "20px" }}>
  <VehicleTable data={results} />
</div>

      {/* USER INFO */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "15px",
          borderRadius: "4px",
          marginTop: "20px",
          border: "1px solid #e0e0e0",
        }}
      >
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          <strong>Email:</strong> {user?.email}
        </p>

        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          <strong>Company:</strong> {user?.companyName}
        </p>

        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          <strong>GST Number:</strong> {user?.gstNumber}
        </p>
      </div>

      {/* ADMIN BUTTONS */}
      {isAdmin && (
        <div
          style={{
            display: "grid",
            gap: "18px",
            marginTop: "28px",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
       <button
  onClick={() => navigate("/upload")}
  style={{
    minHeight: "140px",
    borderRadius: "16px",
    border: "none",
    backgroundColor: "#28a745",
    color: "white",
    cursor: "pointer",
    padding: "20px",
    fontSize: "18px",
    fontWeight: "700",
    boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
  }}
>
  Upload Vehicle Data
</button>

          <button
  onClick={() => navigate("/add")}
  style={{
    minHeight: "140px",
    borderRadius: "16px",
    border: "none",
    backgroundColor: "#90EE90",
    color: "#111",
    cursor: "pointer",
    padding: "20px",
    fontSize: "18px",
    fontWeight: "700",
    boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
  }}
>
  Add Vehicle
</button>
        </div>
      )}
    </div>
  );
}

const cardButton = {
  minHeight: "140px",
  borderRadius: "16px",
  border: "1px solid #cbd5e1",
  backgroundColor: "white",
  color: "#0f172a",
  cursor: "pointer",
  padding: "20px",
  fontSize: "16px",
  textAlign: "left",
  fontWeight: 700,
  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
};