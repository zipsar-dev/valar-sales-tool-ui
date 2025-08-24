import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any request transformations here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Wallet API
export const walletApi = {
  getWallet: () => api.get('/wallet'),
  getTransactions: (limit = 50, offset = 0) => 
    api.get(`/wallet/transactions?limit=${limit}&offset=${offset}`),
  getAllWallets: () => api.get('/wallet/admin/all'),
  processPayout: (userId: string, amount: number) => 
    api.post('/wallet/admin/payout', { userId, amount }),
  getPendingPayouts: () => api.get('/wallet/admin/pending-payouts'),
};

export default api;
