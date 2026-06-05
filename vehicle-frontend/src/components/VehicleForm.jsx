import { useState } from "react";
import { createVehicle, updateVehicle } from "../api/vehicleApi";

const DEFAULT_FIELDS = {
  vehicleNo: "",
  chassisNumber: "",
  // chassisType: "",
  // plant: "",
  // year: "",
  // month: "",
};

//const CHASSIS_TYPE_OPTIONS = ["Sedan", "SUV", "Truck", "Van", "Coupe", "Convertible"];
//const PLANT_OPTIONS = ["Plant A", "Plant B", "Plant C", "Plant D"];
//const YEAR_OPTIONS = [2022, 2023, 2024, 2025, 2026];
//const MONTH_OPTIONS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function VehicleForm({ initialValues = {}, mode = "add", onSuccess }) {
  const [formValues, setFormValues] = useState({
    ...DEFAULT_FIELDS,
    ...initialValues,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (key) => (event) => {
    setFormValues((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        vehicleNo: formValues.vehicleNo.trim(),
        chassisNumber: formValues.chassisNumber.trim(),
        // chassisType: formValues.chassisType,
        // plant: formValues.plant,
        // year: formValues.year,
        // month: formValues.month,
      };

      if (!payload.vehicleNo || !payload.chassisNumber) {
        throw new Error("Vehicle Number and Chassis Number are required.");
      }

      if (mode === "edit") {
        await updateVehicle(initialValues.id, payload);
        setSuccess("✅ Vehicle updated successfully.");
      } else {
        await createVehicle(payload);
        setSuccess("✅ Vehicle created successfully.");
        setFormValues(DEFAULT_FIELDS);
      }

      onSuccess?.();
    } catch (err) {
      const data = err.response?.data;
      if (data?.message) {
        setError(data.message);
      } else if (data && typeof data === "object") {
        setError(Object.values(data).join(", "));
      } else {
        setError(err.message || "Failed to save vehicle.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "720px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px" }}>
        {mode === "edit" ? "Modify Vehicle" : "Add Vehicle"}
      </h2>

      {error && (
        <div
          style={{
            backgroundColor: "#ffe6e6",
            color: "#881111",
            padding: "14px 16px",
            borderRadius: "8px",
            border: "1px solid #f5c2c7",
            marginBottom: "18px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            backgroundColor: "#e6ffed",
            color: "#1f6e3d",
            padding: "14px 16px",
            borderRadius: "8px",
            border: "1px solid #b7ebc6",
            marginBottom: "18px",
          }}
        >
          {success}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "20px",
        }}
      >
        <label>
          Vehicle Number *
          <input
            type="text"
            value={formValues.vehicleNo}
            onChange={handleChange("vehicleNo")}
            disabled={loading}
            placeholder="Vehicle number"
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
        </label>

        <label>
          Chassis Number *
          <input
            type="text"
            value={formValues.chassisNumber}
            onChange={handleChange("chassisNumber")}
            disabled={loading}
            placeholder="Chassis number"
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
        </label>

        {/* <label>
          Chassis Type
          <select
            value={formValues.chassisType}
            onChange={handleChange("chassisType")}
            disabled={loading}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <option value="">Select type</option>
            {CHASSIS_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          Plant
          <select
            value={formValues.plant}
            onChange={handleChange("plant")}
            disabled={loading}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <option value="">Select plant</option>
            {PLANT_OPTIONS.map((plant) => (
              <option key={plant} value={plant}>
                {plant}
              </option>
            ))}
          </select>
        </label>

        <label>
          Year
          <select
            value={formValues.year}
            onChange={handleChange("year")}
            disabled={loading}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <option value="">Select year</option>
            {YEAR_OPTIONS.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </label>

        <label>
          Month
          <select
            value={formValues.month}
            onChange={handleChange("month")}
            disabled={loading || !formValues.year}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <option value="">Select month</option>
            {MONTH_OPTIONS.map((monthOption) => (
              <option key={monthOption} value={monthOption}>
                {monthOption}
              </option>
            ))}
          </select>
        </label> */}
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "14px 24px",
          borderRadius: "8px",
          backgroundColor: loading ? "#999" : "#007bff",
          color: "white",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 700,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        {loading ? (mode === "edit" ? "Updating..." : "Saving...") : mode === "edit" ? "Save Changes" : "Create Vehicle"}
      </button>
    </form>
  );
}
