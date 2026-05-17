import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gf_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gf_token');
      localStorage.removeItem('gf_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Goals endpoints
export const goalsAPI = {
  getAll: (params) => api.get('/goals', { params }),
  getById: (id) => api.get(`/goals/${id}`),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
  submit: (id) => api.post(`/goals/${id}/submit`),
  approve: (id, data) => api.post(`/goals/${id}/approve`, data),
  reject: (id, data) => api.post(`/goals/${id}/reject`, data),
  rework: (id, data) => api.post(`/goals/${id}/rework`, data),
  unlock: (id) => api.post(`/goals/${id}/unlock`),
};

// Check-ins endpoints
export const checkinsAPI = {
  getByGoal: (goalId) => api.get(`/checkins/goal/${goalId}`),
  create: (data) => api.post('/checkins', data),
  update: (id, data) => api.put(`/checkins/${id}`, data),
  getTeamCheckins: (params) => api.get('/checkins/team', { params }),
};

// Users endpoints
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getTeam: () => api.get('/users/team'),
};

// Dashboard analytics
export const analyticsAPI = {
  employeeDashboard: () => api.get('/analytics/employee'),
  managerDashboard: () => api.get('/analytics/manager'),
  adminDashboard: () => api.get('/analytics/admin'),
  goalTrends: (params) => api.get('/analytics/trends', { params }),
  teamComparison: () => api.get('/analytics/team-comparison'),
  departmentStats: () => api.get('/analytics/departments'),
};

// Audit logs
export const auditAPI = {
  getLogs: (params) => api.get('/audit', { params }),
};

// Notifications
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export default api;
