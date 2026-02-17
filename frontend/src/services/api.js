import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const password = localStorage.getItem("adminPassword");

  if (password) {
    config.headers["x-admin-password"] = password;
  }

  return config;
});

export default api;
