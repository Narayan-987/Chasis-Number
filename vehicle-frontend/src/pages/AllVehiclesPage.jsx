import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AllVehicles from "../components/AllVehicles";

export default function AllVehiclesPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>All Vehicles</h2>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px 15px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          ← Back to Dashboard
        </button>
        {isAdmin && (
          <button
            onClick={() => navigate("/add")}
            style={{
              padding: "8px 15px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ➕ Add Vehicle
          </button>
        )}
      </div>

      <AllVehicles />
    </div>
  );
}