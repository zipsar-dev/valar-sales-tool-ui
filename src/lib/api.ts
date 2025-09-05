import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(new Error(error.message || 'Request failed'))
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(new Error(error.message || 'Request failed'));
  }
);

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
