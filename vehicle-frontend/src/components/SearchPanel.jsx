import { useState } from "react";
import { searchVehicle } from "../api/vehicleApi";

export default function SearchPanel({ setResults }) {
  const [searchType, setSearchType] = useState("vehicleNo");
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = async () => {
    try {
      if (!searchValue) {
        setResults([]);
        return;
      }

      let params = {
        page: 0,
      };

      if (searchType === "vehicleNo") {
        params.vehicleNo = searchValue;
      }

      if (searchType === "chassisNumber") {
        params.chassisNumber = searchValue;
      }

      if (searchType === "plant") {
        params.plant = searchValue;
      }

      if (searchType === "year") {
        params.year = searchValue;
      }

      if (searchType === "month") {
        params.month = searchValue;
      }

      const res = await searchVehicle(params);

      setResults(res.data.content || []);

    } catch (err) {
      console.log(err);
      setResults([]);
    }
  };

  return (
    <div>
      <h2>Search Panel</h2>

      {/* Example input */}
      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Enter search"
      />

      <button onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}