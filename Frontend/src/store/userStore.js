import { create } from 'zustand';
import { usersAPI, recipesAPI, favoritesAPI } from '../api';
export const useUserStore = create((set) => ({
  profile: null, userRecipes: [], favorites: [],
  fetchProfile: async () => { try { const { data } = await usersAPI.getProfile(); set({ profile: data.data }); } catch {} },
  updateProfile: async (d) => { const { data } = await usersAPI.updateProfile(d); set({ profile: data.data }); return data; },
  updateAvatar: async (f) => { const { data } = await usersAPI.updateAvatar(f); set((s) => ({ profile: { ...s.profile, avatar_url: data.data.avatar_url } })); return data; },
  fetchUserRecipes: async (id, p = {}) => { try { const { data } = await recipesAPI.getByUser(id, p); set({ userRecipes: data.data }); return data; } catch {} },
  fetchFavorites: async (p = {}) => { try { const { data } = await favoritesAPI.getAll(p); set({ favorites: data.data }); } catch {} },
}));
