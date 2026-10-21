
import { apiRequest } from './api'

export const register = (userData) =>
  apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })

export const login = (credentials) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

export const getCurrentUser = () =>
  apiRequest('/auth/me')

export const logout = () =>
  apiRequest('/auth/logout', {
    method: 'POST',
  })