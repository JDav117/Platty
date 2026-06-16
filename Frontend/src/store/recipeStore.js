import { create } from 'zustand';
import { recipesAPI } from '../api';
export const useRecipeStore = create((set) => ({
  recipes: [], currentRecipe: null, total: 0, page: 1, loading: false,
  fetchRecipes: async (p = {}) => { set({ loading: true }); try { const { data } = await recipesAPI.getAll(p); set({ recipes: data.data, total: data.total, page: data.page, loading: false }); } catch { set({ loading: false }); } },
  fetchRecipeBySlug: async (s) => { set({ loading: true, currentRecipe: null }); try { const { data } = await recipesAPI.getBySlug(s); set({ currentRecipe: data.data, loading: false }); return data.data; } catch { set({ loading: false }); return null; } },
  clearCurrentRecipe: () => set({ currentRecipe: null }),
}));
