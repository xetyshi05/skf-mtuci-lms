import client from './client'

export const login = (email, password) =>
  client.post('/api/auth/login', { email, password })

export const logout = () =>
  client.post('/api/auth/logout')

export const me = () =>
  client.get('/api/auth/me')

export const connectCheck = () =>
  client.post('/api/connect/check')
