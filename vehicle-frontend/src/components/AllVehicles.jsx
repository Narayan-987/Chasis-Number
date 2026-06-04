import { useEffect, useState } from "react";
import { getAllVehicles } from "../api/vehicleApi";

export default function AllVehicles() {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const size = 50;

  const loadData = async (pageNo = 0) => {
    try {
      const res = await getAllVehicles(pageNo, size);

      setData(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);

    } catch (err) {
      console.log(err);
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