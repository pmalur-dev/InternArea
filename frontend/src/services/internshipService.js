
import { apiRequest } from './api'

export const getInternships = (search = '') => {
  const query = search.trim()
    ? `?search=${encodeURIComponent(search.trim())}`
    : ''

  return apiRequest(`/internships${query}`)
}

export const createInternship = (internship) =>
  apiRequest('/internships', {
    method: 'POST',
    body: JSON.stringify(internship),
  })

export const updateInternship = (id, updates) =>
  apiRequest(`/internships/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })

export const deleteInternship = (id) =>
  apiRequest(`/internships/${id}`, {
    method: 'DELETE',
  })