import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteVehicle } from "../api/vehicleApi";

export default function ResultsTable({ data, onDelete }) {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState({});
  const [error, setError] = useState("");

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  const handleDelete = async (id, vehicleNo) => {
    if (
      !window.confirm(
        `Are you sure you want to delete vehicle: ${vehicleNo}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setLoading((prev) => ({ ...prev, [id]: true }));
    setError("");

    try {
      await deleteVehicle(id);
      // Remove from local state
      onDelete?.();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete vehicle"
      );
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (safeData.length === 0) {
    return <h3 style={{ color: "#999" }}>No Data Found</h3>;
  }

  return (
    <div>
      <h2>Results</h2>

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
          ⚠️ {error}
        </div>
      )}

      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f8f9fa" }}>
            <th style={{ padding: "10px" }}>Vehicle No</th>
            <th style={{ padding: "10px" }}>Chassis Number</th>
            <th style={{ padding: "10px" }}>Chassis Type</th>
            <th style={{ padding: "10px" }}>Year</th>
            <th style={{ padding: "10px" }}>Plant</th>
            <th style={{ padding: "10px" }}>Month</th>
            {isAdmin && <th style={{ padding: "10px" }}>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {safeData.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{item.vehicleNo}</td>
              <td style={{ padding: "10px" }}>{item.chassisNumber}</td>
              <td style={{ padding: "10px" }}>{item.chassisType}</td>
              <td style={{ padding: "10px" }}>{item.year}</td>
              <td style={{ padding: "10px" }}>{item.plant}</td>
              <td style={{ padding: "10px" }}>{item.month}</td>
              {isAdmin && (
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <button
                    onClick={() => handleDelete(item.id, item.vehicleNo)}
                    disabled={loading[item.id]}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: loading[item.id] ? "#ccc" : "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: loading[item.id] ? "not-allowed" : "pointer",
                      fontSize: "12px",
                    }}
                  >
                    {loading[item.id] ? "Deleting..." : "Delete"}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}