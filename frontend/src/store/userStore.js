import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Token handling interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const useUserStore = create((set, get) => ({
  users: [],
  books: [],
  stats: { users: 0, books: 0 },
  analytics: { 
    totalUsers: 0, 
    genderStats: [], 
    countryStats: [], 
    ageStats: [],
    userGrowth: []
  },
  loading: false,
  error: null,
  lastFetch: null,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes cache

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchAnalytics: async () => {
    try {
      const now = Date.now();
      const lastFetch = get().lastFetch;
      
      // Check cache validity
      if (lastFetch && (now - lastFetch) < get().cacheTimeout) {
        return;
      }

      set({ loading: true, error: null });
      const response = await api.get('/users/analytics');
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      set((state) => ({
        ...state,
        analytics: response.data,
        loading: false,
        lastFetch: now,
        error: null
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      console.error('Analytics fetch error:', errorMessage);
    }
  },

  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/users');
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      set((state) => ({
        ...state,
        users: response.data,
        stats: { ...state.stats, users: response.data.length },
        loading: false,
        error: null
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      console.error('Users fetch error:', errorMessage);
    }
  },

  fetchBooks: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/books');
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      set((state) => ({
        ...state,
        books: response.data.books,
        stats: { ...state.stats, books: response.data.count || response.data.books.length },
        loading: false,
        error: null
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      console.error('Books fetch error:', errorMessage);
    }
  },

  // Cleanup method
  cleanup: () => {
    set({
      users: [],
      books: [],
      analytics: {
        totalUsers: 0,
        genderStats: [],
        countryStats: [],
        ageStats: [],
        userGrowth: []
      },
      loading: false,
      error: null,
      lastFetch: null
    });
  }
}));

export default useUserStore;