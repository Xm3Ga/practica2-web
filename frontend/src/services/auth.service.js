import { post } from './api.js';

export function login(username, password) {
  return post('/login', { username, password });
}

export function register(username, password) {
  return post('/register', { username, password });
}
