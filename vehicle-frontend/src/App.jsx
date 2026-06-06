import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminPage from "./pages/AdminPage";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import AddVehiclePage from "./pages/AddVehiclePage";
import EditVehicle from "./pages/EditVehicle";
import UploadPage from "./pages/UploadPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AllVehiclesPage from "./pages/AllVehiclesPage";



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public routes */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute requiredRole="ADMIN"><AddVehiclePage /></ProtectedRoute>} />
          <Route path="/add-vehicle" element={<ProtectedRoute requiredRole="ADMIN"><AddVehiclePage /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute requiredRole="ADMIN"><EditVehicle /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminPage /></ProtectedRoute>} />
          <Route path="/vehicles" element={<ProtectedRoute><AllVehiclesPage /></ProtectedRoute>} />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;