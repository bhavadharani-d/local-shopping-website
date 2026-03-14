import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

const api = axios.create({
  baseURL: API_URL,
});

// Fetch products with images populated
export const getProducts = () => api.get('/products?populate=*');

// Create order: expectation is data: { token, total, order_status, items, products }
export const createOrder = (orderData) => api.post('/orders', { data: orderData });

// Track order by token
export const getOrderDetails = (token) => api.get(`/orders?filters[token][$eq]=${token}&populate=*`);

export default api;
