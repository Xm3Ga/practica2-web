import { get, post, put, del } from './api.js';

export function getProducts(nameFilter) {
  const query = nameFilter ? `?name=${encodeURIComponent(nameFilter)}` : '';
  return get(`/productos${query}`);
}

export function createProduct(formData) {
  return post('/productos', formData);
}

export function updateProduct(id, data) {
  return put(`/productos/${id}`, data);
}

export function deleteProduct(id) {
  return del(`/productos/${id}`);
}
