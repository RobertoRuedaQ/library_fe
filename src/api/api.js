import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1", // tu backend Rails
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API instance for endpoints that don't require authentication
export const PublicAPI = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export default API;
