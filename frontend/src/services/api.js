import axios from "axios";

let rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
rawBaseURL = rawBaseURL.trim().replace(/\/+$/, "");

// Ensure it points to the API route cleanly
const baseURL = rawBaseURL.endsWith("/api") ? rawBaseURL : `${rawBaseURL}/api`;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
