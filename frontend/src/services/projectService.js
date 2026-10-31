import api from "./api";

export const getProjects = () => api.get("/projects");
export const createProject = (project) => api.post("/projects", project);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
