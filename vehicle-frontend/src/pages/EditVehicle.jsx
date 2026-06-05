import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VehicleForm from "../components/VehicleForm";
import { getVehicleById } from "../api/vehicleApi";

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVehicle = async () => {
      setError("");
      setLoading(true);

      try {
        const response = await getVehicleById(id);
        setVehicle(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Unable to load vehicle data."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadVehicle();
    }
  }, [id]);

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Edit Vehicle</h1>
          <p style={{ color: "#555", marginTop: "8px" }}>
            Modify the selected chassis record and save the updated data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            padding: "12px 18px",
            backgroundColor: "#141ed3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#444" }}>Loading vehicle data...</div>
      ) : error ? (
        <div
          style={{
            backgroundColor: "#ffe6e6",
            color: "#e12828",
            padding: "14px 16px",
            borderRadius: "8px",
            border: "1px solid #f5c2c7",
          }}
        >
          {error}
        </div>
      ) : (
        <VehicleForm
          key={vehicle?.id || "edit"}
          mode="edit"
          initialValues={vehicle}
          onSuccess={() => navigate("/search")}
        />
      )}
    </div>
  );
}
