import { useState } from "react";
import api from "../api/axiosConfig";

const TYPES = [
  { value: "EXCEL", label: "Excel (.xlsx)" },
  { value: "PDF", label: "PDF" },
  { value: "IMAGE", label: "Image (OCR)" },
];

const ACCEPT_MAP = {
  EXCEL: ".xlsx,.xls,.csv",
  PDF: ".pdf",
  IMAGE: "image/*",
};

export default function UploadPanel() {
  const [uploadType, setUploadType] = useState("");
  const [file, setFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  console.log("UPLOAD BUTTON CLICKED");

  if (!uploadType || !file) {
    console.log("uploadType =", uploadType);
    console.log("file =", file);
    return;
  }

  console.log("Selected file:", file);
  console.log("Upload type:", uploadType);

  setLoading(true);
  setStatusMessage("");
  setErrorMessage("");

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", uploadType);

    console.log("Before API Call");

    const response = await api.post("/master/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("After API Call");
    console.log("Response:", response);

    setStatusMessage(
      response.data?.message || "Upload completed successfully."
    );
  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);

    setErrorMessage(
      err.response?.data?.message ||
      err.message ||
      "Upload failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <section style={{ maxWidth: "720px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px" }}>File Upload</h2>

      {statusMessage && (
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
          {statusMessage}
        </div>
      )}

      {errorMessage && (
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
          {errorMessage}
        </div>
      )}

      <div style={{ display: "grid", gap: "18px" }}>
        <label style={{ display: "block" }}>
          File Type *
          <select
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
            disabled={loading}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "8px" }}
          >
            <option value="">Select upload type</option>
            {TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "block" }}>
          Select File *
         <input
  type="file"
  accept={ACCEPT_MAP[uploadType] || "*/*"}
  onChange={(e) => {
    const selected = e.target.files?.[0];
    console.log("FILE SELECTED:", selected);
    setFile(selected || null);
  }}
/>
        </label>

        {file && (
          <p style={{ margin: "0", color: "#444" }}>
            Selected file: <strong>{file.name}</strong>
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !uploadType || !file}
          style={{
            padding: "14px 24px",
            borderRadius: "8px",
            border: "none",
            color: "white",
            backgroundColor: !uploadType || !file ? "#999" : "#007bff",
            cursor: !uploadType || !file ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </div>
    </section>
  );
}
