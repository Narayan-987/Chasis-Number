import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchPanel from "../components/SearchPanel";
import ResultsTable from "../components/ResultsTable";

export default function Dashboard() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vehicle Chassis System</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/add")}>
          Add Vehicle
        </button>

        <button
          onClick={() => navigate("/vehicles")}
          style={{ marginLeft: "10px" }}
        >
          View All Vehicles
        </button>
      </div>

      <hr />

      <SearchPanel setResults={setResults} />

      <hr />

      <ResultsTable data={results} />
    </div>
  );
}