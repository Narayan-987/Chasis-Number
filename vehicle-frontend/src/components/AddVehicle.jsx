import { useState } from "react";
import api from "../api/axiosConfig";

export default function AddVehicle({ onSuccess }) {
  const [vehicleNo, setVehicleNo] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const saveVehicle = async () => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      // Validation
      if (!vehicleNo.trim()) {
        throw new Error("Vehicle Number is required");
      }
      if (!chassisNumber.trim()) {
        throw new Error("Chassis Number is required");
      }

      const body = {
        vehicleNo: vehicleNo.trim(),
        chassisNumber: chassisNumber.trim(),
      };

      const res = await api.post("/master", body);

      if (res.status === 200 || res.status === 201) {
        setSuccess("✅ Vehicle saved successfully");
        setVehicleNo("");
        setChassisNumber("");

        // Callback if provided
        if (onSuccess) {
          setTimeout(() => onSuccess(), 1500);
        }
      }
    } catch (err) {
      const data = err.response?.data;

      if (typeof data === "object" && !data.message) {
        setError("❌ " + Object.values(data).join(", "));
      } else if (data?.message) {
        setError("❌ " + data.message);
      } else {
        setError(err.message || "Failed to save vehicle");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          {success}
        </div>
      )}

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
          Vehicle Number *
        </label>
        <input
          type="text"
          placeholder="Enter vehicle number"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
          17 Digit Chassis Number *
        </label>
        <input
          type="text"
          placeholder="e.g., MAT1AB1234567890"
          value={chassisNumber}
          onChange={(e) => setChassisNumber(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <button
        onClick={saveVehicle}
        disabled={loading}
        style={{
          padding: "12px 25px",
          backgroundColor: loading ? "#ccc" : "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        {loading ? "Saving..." : "Save Vehicle"}
      </button>
    </div>
  );
}