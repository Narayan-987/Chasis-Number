export default function ResultsTable({ data }) {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return <h3>No Data Found</h3>;
  }

  return (
    <div>
      <h2>Results</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Vehicle No</th>
            <th>Chassis Number</th>
            <th>Chassis Type</th>
            <th>Year</th>
            <th>Plant</th>
            <th>Month</th>
          </tr>
        </thead>

        <tbody>
          {safeData.map((item) => (
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
    </div>
  );
}