import { useState } from "react";
import { searchVehicle } from "../api/vehicleApi";

const MONTHS = [
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December"
];

const YEARS = Array.from({ length: 28 }, (_, i) => 2000 + i);

export default function SearchPanel({ setResults, setSearchFilters }) {

  const [searchType, setSearchType] = useState("vehicleNo");
  const [searchValue, setSearchValue] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleSearch = async () => {
    try {
      let params = { page: 0 };

      if (searchType === "year") {
        if (selectedYear) params.year = selectedYear;
        if (selectedMonth) params.month = selectedMonth;
      } else {
        if (!searchValue.trim()) {
          setResults([]);
          setSearchFilters({});
          return;
        }
        params[searchType] = searchValue;
      }

      const response = await searchVehicle(params);

      setResults(response.data.content || []);
      setSearchFilters(params); // ✅ IMPORTANT FIX

    } catch (error) {
      console.log(error);
      setResults([]);
      setSearchFilters({});
    }
  };

  return (
    <div style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>

      <h3>Search Vehicles</h3>

      {/* SEARCH TYPE BUTTONS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button
  onClick={() => {
    setSearchType("vehicleNo");
    setSearchValue("");
  }}
>
  Vehicle No
</button>
<button
  onClick={() => {
    setSearchType("chassisNumber");
    setSearchValue("MAT");
  }}
>
  Chassis No
</button>
       <button
  onClick={() => {
    setSearchType("plant");
    setSearchValue("");
  }}
>
  Plant
</button>

<button
  onClick={() => {
    setSearchType("year");
    setSearchValue("");
  }}
>
  Year
</button>
      </div>

      {/* INPUT */}
      {searchType !== "year" && (
  <div style={{ marginTop: "15px" }}>
    <input
      type="text"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder={`Enter ${searchType}`}
      style={{
        width: "100%",
        maxWidth: "400px",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "10px",
        fontSize: "14px",
      }}
    />
  </div>
)}

      {/* YEAR */}
      {searchType === "year" && (
        <div style={{ marginBottom: "10px" }}>
          <h4>Select Year</h4>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                style={{
                  background: selectedYear === y ? "#007bff" : "#eee",
                  color: selectedYear === y ? "#fff" : "#000",
                  padding: "6px"
                }}
              >
                {y}
              </button>
            ))}
          </div>

          {selectedYear && (
            <>
              <h4>Select Month</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {MONTHS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMonth(m)}
                    style={{
                      background: selectedMonth === m ? "#28a745" : "#eee",
                      color: selectedMonth === m ? "#fff" : "#000",
                      padding: "6px"
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

    <div
  style={{
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
  }}
>
  <button
    onClick={handleSearch}
    style={{
      padding: "12px 30px",
      background: "linear-gradient(135deg,#0d6efd,#0a58ca)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: "600",
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    }}
  >
    🔍 Search
  </button>
</div>

    </div>
  );
}