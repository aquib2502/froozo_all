import axios from 'axios';

const API = axios.create({
  baseURL: 'https://froozo.anatech.fun/api',
});

export const getCategories = () => API.get('/categories');
export const createCategory = (data) => API.post('/categories', data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export const getProducts = (categoryId) =>
  API.get('/products', { params: categoryId ? { categoryId } : {} });
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const getOrders = (status) =>
  API.get('/orders', { params: status ? { status } : {} });
export const getOrder = (id) => API.get(`/orders/${id}`);
export const createOrder = (data) => API.post('/orders', data);
export const updateOrderStatus = (id, orderStatus) =>
  API.patch(`/orders/${id}/status`, { orderStatus });
export const updateOrderPayment = (id, paymentMethod) =>
  API.patch(`/orders/${id}/payment`, { paymentMethod });

export const getDashboard = () => API.get('/dashboard');
