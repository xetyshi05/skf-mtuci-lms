import client from './client'

export const getProfile = () =>
  client.get('/api/profile')

export const updateProfile = (data) =>
  client.patch('/api/profile', data)

export const changePassword = (data) =>
  client.put('/api/profile/password', data)

export const changeEmail = (data) =>
  client.post('/api/profile/email', data)

export const verifyEmail = (id, hash, params) =>
  client.get(`/api/email/verify/${id}/${hash}`, { params })
