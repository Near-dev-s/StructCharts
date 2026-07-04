import { api } from "./client";

export const listModules = (projectId) => api.get(`/projects/${projectId}/modules`);
export const createModule = (projectId, data) => api.post(`/projects/${projectId}/modules`, data);
export const updateModule = (id, data) => api.put(`/modules/${id}`, data);
export const updateModulePosition = (id, posX, posY) => api.patch(`/modules/${id}/position`, { posX, posY });
export const deleteModule = (id) => api.delete(`/modules/${id}`);
