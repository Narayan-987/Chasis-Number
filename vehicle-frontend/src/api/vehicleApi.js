import api from "./axiosConfig";

// ✅ Signup with custom fields
export const signup = (signupData) => {
  return api.post("/auth/signup", signupData);
};

// ✅ Login
export const login = (credentials) => {
  return api.post("/auth/login", credentials);
};

// ✅ Set JWT token in localStorage
export const setToken = (token) => {
  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// ✅ Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// ✅ Clear token on logout
export const logout = () => {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
};

// ✅ Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// ✅ Get user role from localStorage
export const getUserRole = () => {
  return localStorage.getItem("userRole");
};

// ✅ Store user info
export const setUserInfo = (user) => {
  localStorage.setItem("userId", user.id);
  localStorage.setItem("username", user.username);
  localStorage.setItem("email", user.email);
  localStorage.setItem("userRole", user.role);
  localStorage.setItem("gstNumber", user.gstNumber);
  localStorage.setItem("companyName", user.companyName);
};

// ✅ Get user info
export const getUserInfo = () => {
  return {
    id: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("userRole"),
    gstNumber: localStorage.getItem("gstNumber"),
    companyName: localStorage.getItem("companyName"),
  };
};

// Vehicle API calls
export const createVehicle = (data) => {
  return api.post("/master", data);
};

export const updateVehicle = (id, data) => {
  return api.put(`/master/${id}`, data);
};

export const getVehicleById = (id) => {
  return api.get(`/master/${id}`);
};

export const uploadFile = (formData) => {
  return api.post("/master/upload", formData);
};

export const searchVehicle = (params) => {
  return api.get("/master/search", { params });
};

export const getAllVehicles = (page = 0, size = 10) => {
  return api.get("/master/all-paginated", {
    params: { page, size },
  });
};

// ✅ NEW: Delete vehicle (ADMIN only)
export const deleteVehicle = (id) => {
  return api.delete(`/master/${id}`);
};