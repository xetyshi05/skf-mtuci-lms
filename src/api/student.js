import client from './client'

export const getStudentSummary = () =>
  client.get('/api/student/summary')

export const getStudentResults = (params = {}) =>
  client.get('/api/student/results', { params })

export const getStudentSemesters = () =>
  client.get('/api/student/semesters')
