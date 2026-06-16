import { create } from 'zustand';
import { adminAPI } from '../api';
export const useAdminStore = create((set) => ({
  dashboardData: null, users: [], usersTotal: 0, recipes: [], recipesTotal: 0, categories: [], auditLog: [], auditTotal: 0, loading: false,
  fetchDashboard: async () => { try { const { data } = await adminAPI.getDashboard(); set({ dashboardData: data.data }); } catch {} },
  fetchUsers: async (p = {}) => { set({ loading: true }); try { const { data } = await adminAPI.getUsers(p); set({ users: data.data, usersTotal: data.total, loading: false }); } catch { set({ loading: false }); } },
  fetchRecipes: async (p = {}) => { set({ loading: true }); try { const { data } = await adminAPI.getRecipes(p); set({ recipes: data.data, recipesTotal: data.total, loading: false }); } catch { set({ loading: false }); } },
  fetchCategories: async () => { try { const { data } = await adminAPI.getCategories(); set({ categories: data.data }); } catch {} },
  fetchAuditLog: async (p = {}) => { set({ loading: true }); try { const { data } = await adminAPI.getAuditLog(p); set({ auditLog: data.data, auditTotal: data.total, loading: false }); } catch { set({ loading: false }); } },
}));
