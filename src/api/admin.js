import client from './client'

export const addTeacher = (data) =>
  client.post('/api/admin/teachers', data)
