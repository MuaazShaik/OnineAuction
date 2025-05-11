import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const signup = (userData) => api.post('/users/signup', userData);
export const signin = (userData) => api.post('/users/signin', userData);
export const getFullname = (token) => api.post('/users/getfullname', { csrid: token });

// Product APIs
export const getAllProducts = () => api.get('/products/all');
export const getProductsBySeller = (email) => api.get(`/products/seller/${email}`);
export const getProductById = (id) => api.get(`/products/get/${id}`);
export const addProduct = (productData) => api.post('/products/add', productData);
export const updateProduct = (productData) => api.put('/products/update', productData);
export const deleteProduct = (id) => api.delete(`/products/delete/${id}`);

// Bid APIs
export const placeBid = (bidData) => api.post('/bid/place', bidData);
export const getBidsForProduct = (productId) => api.get(`/bid/getbids?productId=${productId}`);
export const getHighestBid = (productId) => api.get(`/bid/highest?productId=${productId}`);

// Order APIs
export const placeOrder = (orderData) => api.post('/orders/place', orderData);
export const getOrdersByUser = (email) => api.post('/orders/getbyuser', { email });
export const getAllOrders = () => api.get('/orders/all');

// Wallet APIs
export const addMoney = (email, amount) => api.post(`/wallet/add?email=${email}&amount=${amount}`);
export const getBalance = (email) => api.get(`/wallet/balance?email=${email}`);
export const deductBalance = (email, amount) => api.post(`/wallet/deduct?email=${email}&amount=${amount}`);
export const creditBalance = (email, amount) => api.post(`/wallet/credit?email=${email}&amount=${amount}`);

// Transaction APIs
export const recordTransaction = (transactionData) => api.post('/transaction/record', transactionData);
export const getUserTransactions = (email) => api.get(`/transaction/user?email=${email}`);
export const getAllTransactions = () => api.get('/transaction/all');
export const getTransactionsByUser = (email) => {
  return api.get(`/transaction/user?email=${encodeURIComponent(email)}`);
};

// Analytics APIs
export const getDashboardSummary = () => api.get('/admin/analytics/summary');

// Category APIs
export const getAllCategories = () => api.get('/categories/all');
export const addCategory = (categoryData) => api.post('/categories/add', categoryData);
export const updateCategory = (categoryData) => api.put('/categories/update', categoryData);
export const deleteCategory = (id) => api.delete(`/categories/delete/${id}`);

// Delivery APIs
export const createDelivery = (deliveryData) => api.post('/delivery/create', deliveryData);
export const getAllDeliveries = () => api.get('/delivery/all');
export const getDeliveryById = (id) => api.get(`/delivery/${id}`);
export const updateDeliveryStatus = (id, status) => api.post(`/delivery/updatestatus?id=${id}&status=${status}`);

export default api; 