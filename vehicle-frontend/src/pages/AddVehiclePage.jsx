import AddVehicle from "../components/AddVehicle";
import UploadFile from "../components/UploadFile";

export default function AddVehiclePage() {

  return (
    <div style={{ padding: "20px" }}>

      <h2>Add Vehicle</h2>

      <AddVehicle />

      <hr />

      <UploadFile />

    </div>
  );
}