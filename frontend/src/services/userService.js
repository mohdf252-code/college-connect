import api from "./api";

export const getDiscoverUsers = () => api.get("/users/discover");
export const updateProfile = (data) => api.put("/users/update-profile", data);
export const connectUser = (id) => api.post(`/users/connect/${id}`);
export const getRequests = () => api.get("/users/requests");
export const acceptRequest = (id) => api.post(`/users/accept/${id}`);
export const getConnections = () => api.get("/users/connections");
export const getUserById = (id) => api.get(`/users/${id}`);
export const getMe = () => api.get("/users/me");
export const getDashboardStats = () => api.get("/users/dashboard-stats");
