import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import VehicleForm from "../components/VehicleForm";

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ padding: "24px", maxWidth: "920px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Add New Vehicle</h1>
          <p style={{ color: "#555", marginTop: "8px" }}>
            Create a new chassis record in the system. Required fields are Vehicle Number and Chassis Number.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            padding: "12px 18px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "22px",
          marginBottom: "24px",
        }}
      >
        <p style={{ margin: 0, color: "#334155" }}>
          Logged in as <strong>{user?.username}</strong> • {user?.companyName}
        </p>
      </div>

      <VehicleForm onSuccess={() => navigate("/search")} />
    </div>
  );
}