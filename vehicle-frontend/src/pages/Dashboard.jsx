import api from "../api/axiosConfig";
import { useEffect, useState } from "react";
import SearchPanel from "../components/SearchPanel";
import VehicleTable from "../components/VehicleTable";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UploadPanel from "../components/UploadPanel";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [results, setResults] = useState([]);
  const [searchFilters, setSearchFilters] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [searchExportType, setSearchExportType] = useState("");

  // ================= DEBUG USER =================
  useEffect(() => {
    console.log("🔥 USER OBJECT:", user);
    console.log("🔥 ROLE RAW:", user?.role);
    console.log("🔥 AUTHORITIES:", user?.authorities);
  }, [user]);

  // ================= SAFE ADMIN CHECK (FIXED) =================
  const isAdmin = (() => {
    const role =
      user?.role ||
      user?.userRole ||
      user?.authority ||
      user?.roles?.[0] ||
      user?.authorities?.[0];

    if (!role) return false;

    return role.toString().toUpperCase().includes("ADMIN");
  })();

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ================= PAGINATION API =================
  const fetchData = async (pageNo = 0) => {
    try {
      const res = await api.get("/master/all-paginated", {
        params: { page: pageNo, size },
      });

      setResults(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (showAll) {
      fetchData(page);
    }
  }, [page, showAll]);

  // ================= VIEW ALL =================
  const handleViewAllData = async () => {
    try {
      if (!showAll) {
        setPage(0);

        const res = await api.get("/master/all-paginated", {
          params: { page: 0, size },
        });

        setResults(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } else {
        setResults([]);
      }

      setShowAll(!showAll);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EXPORT =================
  const downloadBlob = async (params, filename) => {
    try {
      const res = await api.get("/master/export", {
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  const handleExportSearch = async (type) => {
    if (!results.length) return;

    await downloadBlob(
      { type, ...searchFilters },
      `search.${type}`
    );
  };

  const showExport = results.length > 0;

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "20px", position: "relative" }}>
        <h1 style={{ margin: 0 }}>🚗 Vehicle Management System</h1>

        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            background: "red",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* SEARCH */}
      <SearchPanel
        setResults={setResults}
        setSearchFilters={setSearchFilters}
      />

      {/* EXPORT SEARCH */}
      {showExport && (
        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <select
            value={searchExportType}
            onChange={(e) => setSearchExportType(e.target.value)}
          >
            <option value="">Select Format</option>
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
          </select>

          <button
            disabled={!searchExportType}
            onClick={() => handleExportSearch(searchExportType)}
            style={{
              background: "#007bff",
              color: "white",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
            }}
          >
            Download Search
          </button>
        </div>
      )}

      {/* VIEW ALL */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleViewAllData}
          style={{
            padding: "10px 15px",
            background: showAll ? "red" : "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          {showAll ? "Reset View" : "View All Data"}
        </button>
      </div>

      {/* TABLE */}
      <VehicleTable data={results} />

      {/* PAGINATION */}
      {showAll && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            Prev
          </button>

          <span>Page {page + 1} / {totalPages}</span>

          <button onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}

      {/* 🔥 ADMIN BUTTONS (FIXED - WILL NOW SHOW) */}
      {user && isAdmin && (
        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <button
            onClick={() => setShowUpload(!showUpload)}
            style={{
              background: "#0d6efd",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            📤 Upload File
          </button>

          <button
            onClick={() => navigate("/add-vehicle")}
            style={{
              background: "#198754",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ➕ Add Vehicle
          </button>
        </div>
      )}

      {/* UPLOAD PANEL */}
      {showUpload && (
        <div style={{ marginTop: "20px" }}>
          <UploadPanel />
        </div>
      )}

    </div>
  );
}