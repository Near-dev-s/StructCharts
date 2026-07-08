import { api } from "./client";

export const getQualityReport = (projectId) => api.get(`/projects/${projectId}/quality-report`);
