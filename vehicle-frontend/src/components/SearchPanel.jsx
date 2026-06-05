import { useState } from "react";
import { searchVehicle } from "../api/vehicleApi";

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const YEARS = Array.from({ length: 28 }, (_, i) => 2000 + i); // 2000–2027

export default function SearchPanel({ setResults }) {
  const [searchType, setSearchType] = useState("vehicleNo");
  const [searchValue, setSearchValue] = useState("");

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleSearch = async () => {
    try {
      let params = { page: 0 };

      if (!searchValue.trim() && searchType !== "year") {
        setResults([]);
        return;
      }

      switch (searchType) {
        case "vehicleNo":
          params.vehicleNo = searchValue;
          break;

        case "chassisNumber":
          params.chassisNumber = searchValue;
          break;

        case "plant":
          params.plant = searchValue;
          break;

        case "year":
          if (selectedYear) params.year = selectedYear;
          if (selectedMonth) params.month = selectedMonth;
          break;

        default:
          break;
      }

      const response = await searchVehicle(params);
      setResults(response.data.content || []);
    } catch (error) {
      console.log(error);
      setResults([]);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Search Vehicles</h3>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {/* MAIN SEARCH TYPE */}
        <select
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value);
            setSearchValue("");
            setSelectedYear("");
            setSelectedMonth("");
          }}
        >
          <option value="vehicleNo">Vehicle Number</option>
          <option value="chassisNumber">Chassis Number</option>
          <option value="plant">Plant</option>
          <option value="year">Year</option>
        </select>

        {/* TEXT INPUT (only for non-year searches) */}
        {searchType !== "year" && (
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={`Enter ${searchType}`}
            style={{ padding: "8px", width: "250px" }}
          />
        )}

        {/* YEAR DROPDOWN */}
        {searchType === "year" && (
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedMonth(""); // reset month
            }}
            style={{ padding: "8px" }}
          >
            <option value="">Select Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}

        {/* MONTH DROPDOWN (only after year selected) */}
        {searchType === "year" && selectedYear && (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: "8px" }}
          >
            <option value="">Select Month</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}

       <button
  onClick={handleSearch}
  style={{
    width: "150px",
    height: "42px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  Search
</button>
      </div>
    </div>
  );
}