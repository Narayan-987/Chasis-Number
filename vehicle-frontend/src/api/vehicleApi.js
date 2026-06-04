import api from "./axiosConfig";

// Upload Excel
export const uploadFile = (formData) => {
  return api.post("/master/upload", formData);
};

// Search
export const searchVehicle = (params) => {
  return api.get("/master/search", { params });
};

// 🆕 Get ALL with pagination
export const getAllVehicles = (page = 0, size = 10) => {
  return api.get("/master/all-paginated", {
    params: { page, size },
  });
};