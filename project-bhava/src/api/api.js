import axios from 'axios';

const API_URL = 'http://localhost:1337/api';
const UPLOAD_URL = 'http://localhost:1337/api/upload';

const api = axios.create({
  baseURL: API_URL,
});

const withShopFilter = (shopName) =>
  shopName ? `&filters[shopName][$eq]=${encodeURIComponent(shopName)}` : '';

export const getProducts = () => api.get('/products?populate=*&pagination[limit]=100');

export const getShops = () =>
  api.get('/shops?filters[isActive][$eq]=true&sort=name:asc&pagination[limit]=100');

export const updateProduct = (id, data) => api.put(`/products/${id}`, { data });

export const addProduct = (data) =>
  api.post('/products', { data: { ...data, publishedAt: new Date() } });

export const uploadImage = (formData) =>
  axios.post(UPLOAD_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getOrders = (shopName = '') =>
  api.get(`/orders?sort=createdAt:desc&populate=*&pagination[limit]=100${withShopFilter(shopName)}`);

export const createOrder = (orderData) =>
  api.post('/orders', {
    data: {
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      orderType: 'Pickup',
      shopName: orderData.shopName,
      pickupTime: orderData.pickupTime,
      orderNotes: orderData.orderNotes,
      status: 'Received',
    },
  });

export const updateOrderStatus = (id, status) => api.put(`/orders/${id}`, { data: { status } });

export const getOrderDetails = (tokenNumber) =>
  api.get(`/orders?filters[tokenNumber][$eq]=${tokenNumber}&populate=*`);

export default api;
