import { useState } from "react";
import axios from "axios";

export default function UploadFile() {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async () => {

    try {
      setMessage("");
      setError("");

      if (!file) {
        setError("Please select an Excel file");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const res = await axios.post(
        "http://localhost:8080/api/master/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setMessage(res.data); // backend success message
      setFile(null);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Upload failed"
      );
    }
  };

  return (
    <div>

      <h2>Upload Excel File</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      {/* ✅ THIS IS YOUR SAVE BUTTON */}
      <button onClick={handleUpload}>
        Save Excel File
      </button>

    </div>
  );
}