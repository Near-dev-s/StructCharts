import { api } from "./client";

export const listConnections = (projectId) => api.get(`/projects/${projectId}/connections`);
export const createConnection = (projectId, data) => api.post(`/projects/${projectId}/connections`, data);
export const updateConnection = (id, data) => api.put(`/connections/${id}`, data);
export const deleteConnection = (id) => api.delete(`/connections/${id}`);
