import api from './axios';

export const authAPI = {
  login: (d) => api.post('/auth/login', d),
  register: (d) => api.post('/auth/register', d),
  me: () => api.get('/auth/me'),
  refreshToken: (t) => api.post('/auth/refresh', { refreshToken: t }),
  forgotPassword: (e) => api.post('/auth/forgot-password', { email: e }),
  resetPassword: (d) => api.post('/auth/reset-password', d),
  verifyOtp: (d) => api.post('/auth/verify-otp', d),
  resendOtp: (e) => api.post('/auth/resend-otp', { email: e }),
};
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (d) => api.put('/users/profile', d),
  updateAvatar: (f) => { const fd = new FormData(); fd.append('imagen', f); return api.put('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  changePassword: (d) => api.put('/users/password', d),
  closeSessions: () => api.post('/users/close-sessions'),
  deactivateAccount: () => api.post('/users/deactivate'),
  deleteAccount: (p) => api.delete('/users/account', { data: { contraseña: p } }),
};
export const recipesAPI = {
  getAll: (p) => api.get('/recipes', { params: p }),
  getByUser: (id, p) => api.get(`/recipes/user/${id}`, { params: p }),
  getById: (id) => api.get(`/recipes/${id}`),
  getBySlug: (s) => api.get(`/recipes/${s}`),
  create: (fd) => api.post('/recipes', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, fd) => api.put(`/recipes/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/recipes/${id}`),
};
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};
export const commentsAPI = {
  getByRecipe: (id, p) => api.get(`/comments/recipe/${id}`, { params: p }),
  create: (d) => api.post('/comments', d),
  update: (id, d) => api.put(`/comments/${id}`, d),
  delete: (id) => api.delete(`/comments/${id}`),
};
export const ratingsAPI = {
  rate: (d) => api.post('/ratings', d),
  getByRecipe: (id) => api.get(`/ratings/${id}`),
};
export const favoritesAPI = {
  getAll: (p) => api.get('/favorites', { params: p }),
  toggle: (id) => api.post('/favorites/toggle', { receta_id: id }),
  check: (id) => api.get(`/favorites/check/${id}`),
};
export const searchAPI = { search: (p) => api.get('/search', { params: p }) };
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (p) => api.get('/admin/users', { params: p }),
  updateUserRole: (id, r) => api.put(`/admin/users/${id}/rol`, { rol: r }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getRecipes: (p) => api.get('/admin/recipes', { params: p }),
  deleteRecipe: (id) => api.delete(`/admin/recipes/${id}`),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (d) => api.post('/admin/categories', d),
  updateCategory: (id, d) => api.put(`/admin/categories/${id}`, d),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getAuditLog: (p) => api.get('/admin/audit', { params: p }),
  getReport: (m, a, f) => api.get(`/admin/reports/${m}/${a}`, { params: { format: f }, responseType: f !== 'json' ? 'blob' : 'json' }),
};
