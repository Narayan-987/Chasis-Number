import { useState } from "react";
import axios from "axios";

export default function AddVehicle() {

  const [vehicleNo, setVehicleNo] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 const saveVehicle = async () => {

   try {

     setError("");
     setSuccess("");

     const body = {
       vehicleNo,
       chassisNumber
     };

     const res = await axios.post(
       "http://localhost:8080/api/master",
       body
     );

     // IMPORTANT: only success if response is valid object
     if (res.status === 200 || res.status === 201) {
       setSuccess("Vehicle saved successfully");
       setVehicleNo("");
       setChassisNumber("");
     }

   } catch (err) {

     const data = err.response?.data;

     // validation errors (field-wise)
     if (typeof data === "object" && !data.message) {
       setError(Object.values(data).join(", "));
       return;
     }

     // duplicate or runtime errors
     if (data?.message) {
       setError(data.message);
       return;
     }

     setError("Save failed");
   }
 };
  return (
    <div>

      <h2>Add Vehicle</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input
        type="text"
        placeholder="Vehicle Number"
        value={vehicleNo}
        onChange={(e) => setVehicleNo(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="17 Digit Chassis Number"
        value={chassisNumber}
        onChange={(e) => setChassisNumber(e.target.value)}
      />

      <br /><br />

      <button onClick={saveVehicle}>
        Save Vehicle
      </button>

    </div>
  );
}