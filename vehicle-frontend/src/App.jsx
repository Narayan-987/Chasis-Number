import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddVehiclePage from "./pages/AddVehiclePage";
import AllVehiclesPage from "./pages/AllVehiclesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddVehiclePage />} />
        <Route path="/vehicles" element={<AllVehiclesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;