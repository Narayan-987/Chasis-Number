import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchPanel from "../components/SearchPanel";
import VehicleTable from "../components/VehicleTable";

export default function SearchPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [searchFilters, setSearchFilters] = useState({});

  return (
    <div style={{ padding: "24px", maxWidth: "1080px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Vehicle Search</h1>
          <p style={{ color: "#555", marginTop: "8px" }}>
            Use the advanced filters to query chassis records from the backend.
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

      <SearchPanel
        setResults={setResults}
        setSearchFilters={setSearchFilters}
      />
      <div style={{ marginTop: "32px" }}>
        <VehicleTable
          data={results}
          onDeleteSuccess={(deletedId) =>
            setResults((current) => current.filter((item) => item.id !== deletedId))
          }
        />
      </div>
    </div>
  );
}
