import { useNavigate } from "react-router-dom";
import { deleteVehicle } from "../api/vehicleApi";
import { useAuth } from "../context/AuthContext";

export default function VehicleTable({
  data,
  onDeleteSuccess
}) {

  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this vehicle?")) {
      return;
    }

    try {

      await deleteVehicle(id);

      if (onDeleteSuccess) {
        onDeleteSuccess(id);
      }

      alert("Vehicle deleted successfully");

    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
        border="1"
      >

        <thead
          style={{
            background: "#1976d2",
            color: "white"
          }}
        >
          <tr>
            <th>Vehicle No</th>
            <th>Chassis Number</th>
            <th>Chassis Type</th>
            <th>Year</th>
            <th>Month</th>
            <th>Plant</th>

            {isAdmin && (
              <th>Actions</th>
            )}
          </tr>
        </thead>

        <tbody>

          {data.length === 0 ? (
            <tr>
              <td
                colSpan={isAdmin ? 7 : 6}
                style={{ textAlign: "center" }}
              >
                No Data Found
              </td>
            </tr>
          ) : (
            data.map((vehicle) => (
              <tr key={vehicle.id}>

                <td>{vehicle.vehicleNo}</td>

                <td>{vehicle.chassisNumber}</td>

                <td>{vehicle.chassisType}</td>

                <td>{vehicle.year}</td>

                <td>{vehicle.month}</td>

                <td>{vehicle.plant}</td>

                {isAdmin && (
                  <td>

                   <button
  onClick={() => handleEdit(vehicle)}
  style={{
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "8px",
  }}
>
  Edit
</button>

                  <button
  onClick={() => handleDelete(vehicle.id)}
  style={{
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
  }}
>
  Delete
</button>

                  </td>
                )}

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}