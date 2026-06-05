import UploadPanel from "../components/UploadPanel";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "20px auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Vehicle Data Upload</h1>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 15px",
            border: "none",
            background: "#6c757d",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>

      <UploadPanel />
    </div>
  );
}