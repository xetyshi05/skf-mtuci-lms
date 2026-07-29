import client from './client'

export const getGradebookFilters = () =>
  client.get('/api/gradebooks/filters')

export const getGradebooks = (params = {}) =>
  client.get('/api/gradebooks', { params })

export const getGradebook = (id) =>
  client.get(`/api/gradebooks/${id}`)

export const deleteGradebook = (id) =>
  client.delete(`/api/gradebooks/${id}`)

export const exportGradebook = (id) =>
  client.get(`/api/gradebooks/${id}/export`, { responseType: 'blob' })

export const importGradebook = (formData) =>
  client.post('/api/gradebooks/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const getTeachers = () =>
  client.get('/api/gradebooks/teachers')
