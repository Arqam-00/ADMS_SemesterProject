import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => api.post('/api/v1/auth/login', { email, password });
export const getCitizenProfile = (cnic) => api.get(`/api/v1/citizens/profile/${cnic}`);
export const getParents = (cnic) => api.get(`/api/v1/citizens/parents/${cnic}`);
export const getOfficerWorkload = () => api.get('/api/v1/officers/workload');
export const createApplication = (data) => api.post('/api/v1/applications/create', data);
// Admin Analytics APIs
export const getApplicationStats = () => api.get('/api/v1/admin/analytics/application-stats');
export const getMonthlyTrend = () => api.get('/api/v1/admin/analytics/monthly-trend');
export const getBranchStats = () => api.get('/api/v1/admin/analytics/branch-stats');
export const getApplicationFees = () => api.get('/api/v1/admin/analytics/application-fees');
export const getProcessingTime = () => api.get('/api/v1/admin/analytics/processing-time');
// Verification Officer APIs
export const getVerificationApplications = () => api.get('/api/v1/verification/applications');
export const verifyApplication = (applicationId, action, remarks) => 
    api.put(`/api/v1/verification/applications/${applicationId}/verify`, null, { params: { action, remarks } });
export const getApplicationDetails = (applicationId) => 
    api.get(`/api/v1/verification/applications/${applicationId}/details`);
// Registration Officer APIs
export const getPendingApplications = () => api.get('/api/v1/registration/applications/pending');
export const getAllApplications = () => api.get('/api/v1/registration/applications/all');
export const issueIDCard = (applicationId) => api.post(`/api/v1/registration/applications/${applicationId}/issue-card`);
export const getCitizenInfo = (cnic) => api.get(`/api/v1/registration/citizen/${cnic}`);
// Family Tree API
export const getFamilyTree = (cnic) => api.get(`/api/v1/family/tree/${cnic}`);
export default api;