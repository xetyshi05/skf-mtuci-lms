import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import { addTeacher } from '../../api/admin'
import { useToast } from '../../contexts/ToastContext'

export default function AddTeacher() {
  const toast = useToast()
  const [form, setForm] = useState({
    last_name: '',
    first_name: '',
    second_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(null)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess(null)
    try {
      const res = await addTeacher(form)
      const t = res.data.data || res.data
      setSuccess(`Преподаватель ${t.full_name || form.first_name + ' ' + form.last_name} добавлен.`)
      setForm({ last_name: '', first_name: '', second_name: '', email: '', password: '', password_confirmation: '', phone: '' })
      toast.add('Преподаватель добавлен', 'success')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) setErrors(data.errors)
      toast.add(data?.message || 'Ошибка добавления', 'error')
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className={`input ${errors[key] ? 'border-red-300 focus:ring-red-500' : ''}`}
        placeholder={placeholder}
        value={form[key]}
        onChange={set(key)}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{Array.isArray(errors[key]) ? errors[key][0] : errors[key]}</p>}
    </div>
  )

  return (
    <Layout title="Добавить преподавателя">
      <div className="max-w-xl">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/gradebooks" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">← Ведомости</Link>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Новый преподаватель</h2>

          {success && (
            <div className="mb-5 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-sm text-green-700 dark:text-green-400">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('last_name', 'Фамилия', 'text', 'Иванов')}
              {field('first_name', 'Имя', 'text', 'Иван')}
            </div>
            {field('second_name', 'Отчество', 'text', 'Иванович')}
            {field('email', 'Email', 'email', 'teacher@institute.local')}
            {field('phone', 'Телефон (необязательно)', 'tel', '+79001234567')}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('password', 'Пароль', 'password', 'Минимум 8 символов')}
              {field('password_confirmation', 'Подтверждение пароля', 'password', 'Повторите пароль')}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Добавление...' : 'Добавить преподавателя'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
