import { useEffect, useState } from "react";
import { getAllVehicles } from "../api/vehicleApi";

export default function AllVehicles() {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const size = 10;

 const loadData = async (pageNo = 0) => {
  try {
    const res = await getAllVehicles(pageNo, size);

    console.log("API RESPONSE =", res.data);

    if (Array.isArray(res.data)) {
      setData(res.data);
      setTotalPages(1);
      setPage(0);
    } else {
      setData(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.number || 0);
    }

  } catch (err) {
    console.log("ERROR =", err);
  }
};

  useEffect(() => {
    loadData(0);
  }, []);

  return (
    <div>

      <h2>All Vehicles (Paginated)</h2>

      {/* TABLE */}
      <table border="1">
        <thead>
          <tr>
            <th>Vehicle No</th>
            <th>Chassis No</th>
            <th>Type</th>
            <th>Year</th>
            <th>Plant</th>
            <th>Month</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.vehicleNo}</td>
              <td>{item.chassisNumber}</td>
              <td>{item.chassisType}</td>
              <td>{item.year}</td>
              <td>{item.plant}</td>
              <td>{item.month}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION BUTTONS */}
      <div style={{ marginTop: "10px" }}>

        <button
          disabled={page === 0}
          onClick={() => loadData(page - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 === totalPages}
          onClick={() => loadData(page + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}