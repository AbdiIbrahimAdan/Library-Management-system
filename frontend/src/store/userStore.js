import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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
  cart: [],
  borrowedBooks: [],
  stats: { users: 0, books: 0 },
  analytics: {
    totalUsers: 0,
    genderStats: [],
    countryStats: [],
    ageStats: [],
    userGrowth: [],
    totalBooks: 0,
    activeUsers: 0,
    totalBorrowings: 0,
    returnRate: 0,
    categoryDistribution: [],
    borrowingTrends: [],
    popularBooks: [],
    userActivity: [],
  },
  loading: false,
  error: null,
  lastFetch: null,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes cache

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Cart functionality
  addToCart: (book) => {
    const cart = get().cart;
    if (!cart.find((item) => item._id === book._id)) {
      set((state) => ({ cart: [...state.cart, book] }));
    }
  },

  removeFromCart: (bookId) => {
    set((state) => ({
      cart: state.cart.filter((book) => book._id !== bookId),
    }));
  },

  clearCart: () => set({ cart: [] }),

  // Borrowing functionality
  borrowBook: async (bookId, dueDate) => {
    try {
      set({ loading: true, error: null });

      const response = await api.post('/borrowings/', { bookId, dueDate });
      if (response.data.success) {
        set((state) => ({
          borrowedBooks: [...state.borrowedBooks, response.data.borrowing],
          loading: false,
          error: null,
        }));
      } else {
        throw new Error('Borrowing failed.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
    }
  },

  fetchAnalytics: async () => {
    try {
      const now = Date.now();
      const lastFetch = get().lastFetch;

      if (lastFetch && now - lastFetch < get().cacheTimeout) {
        console.log('Using cached analytics data');
        return;
      }

      set({ loading: true, error: null });

      const response = await api.get('/analytics/dashboard');
      if (!response.data) {
        throw new Error('No analytics data received from server');
      }

      const {
        totalUsers = 0,
        genderStats = [],
        countryStats = [],
        ageStats = [],
        userGrowth = [],
        totalBooks = 0,
        activeUsers = 0,
        totalBorrowings = 0,
        returnRate = 0,
        categoryDistribution = [],
        borrowingTrends = [],
        popularBooks = [],
        userActivity = [],
      } = response.data;

      set((state) => ({
        ...state,
        analytics: {
          totalUsers,
          genderStats,
          countryStats,
          ageStats,
          userGrowth,
          totalBooks,
          activeUsers,
          totalBorrowings,
          returnRate,
          categoryDistribution,
          borrowingTrends,
          popularBooks,
          userActivity,
        },
        loading: false,
        lastFetch: now,
        error: null,
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
        error: null,
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
        error: null,
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      console.error('Books fetch error:', errorMessage);
    }
  },

  cleanup: () => {
    set({
      users: [],
      books: [],
      cart: [],
      borrowedBooks: [],
      analytics: {
        totalUsers: 0,
        genderStats: [],
        countryStats: [],
        ageStats: [],
        userGrowth: [],
        totalBooks: 0,
        activeUsers: 0,
        totalBorrowings: 0,
        returnRate: 0,
        categoryDistribution: [],
        borrowingTrends: [],
        popularBooks: [],
        userActivity: [],
      },
      loading: false,
      error: null,
      lastFetch: null,
    });
  },
}));

export default useUserStore;
