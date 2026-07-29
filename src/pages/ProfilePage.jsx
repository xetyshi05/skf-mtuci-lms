import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { getProfile, updateProfile, changePassword, changeEmail } from '../api/profile'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

function Section({ title, children }) {
  return (
    <div className="card p-6 mb-5">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">{title}</h3>
      {children}
    </div>
  )
}

export default function ProfilePage() {
  const { updateUser } = useAuth()
  const toast = useToast()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const [nameForm, setNameForm] = useState({ last_name: '', first_name: '', second_name: '', phone: '' })
  const [nameLoading, setNameLoading] = useState(false)
  const [nameErrors, setNameErrors] = useState({})

  const [pwdForm, setPwdForm] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdErrors, setPwdErrors] = useState({})

  const [emailForm, setEmailForm] = useState({ email: '', password: '' })
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailErrors, setEmailErrors] = useState({})

  useEffect(() => {
    getProfile()
      .then((res) => {
        const p = res.data.data
        setProfile(p)
        setNameForm({
          last_name: p.last_name || '',
          first_name: p.first_name || '',
          second_name: p.second_name || '',
          phone: p.phone || '',
        })
      })
      .catch(() => toast.add('Ошибка загрузки профиля', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleNameSubmit = async (e) => {
    e.preventDefault()
    setNameLoading(true)
    setNameErrors({})
    try {
      const res = await updateProfile(nameForm)
      const p = res.data.data
      setProfile(p)
      updateUser(p)
      toast.add('Профиль обновлён', 'success')
    } catch (err) {
      const errs = err.response?.data?.errors || {}
      setNameErrors(errs)
      toast.add(err.response?.data?.message || 'Ошибка обновления', 'error')
    } finally {
      setNameLoading(false)
    }
  }

  const handlePwdSubmit = async (e) => {
    e.preventDefault()
    setPwdLoading(true)
    setPwdErrors({})
    try {
      await changePassword(pwdForm)
      toast.add('Пароль изменён', 'success')
      setPwdForm({ current_password: '', password: '', password_confirmation: '' })
    } catch (err) {
      const errs = err.response?.data?.errors || {}
      setPwdErrors(errs)
      toast.add(err.response?.data?.message || 'Ошибка смены пароля', 'error')
    } finally {
      setPwdLoading(false)
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setEmailLoading(true)
    setEmailErrors({})
    try {
      const res = await changeEmail(emailForm)
      toast.add(res.data.message || 'Письмо с подтверждением отправлено', 'success')
      setEmailForm({ email: '', password: '' })
    } catch (err) {
      const errs = err.response?.data?.errors || {}
      setEmailErrors(errs)
      toast.add(err.response?.data?.message || 'Ошибка смены email', 'error')
    } finally {
      setEmailLoading(false)
    }
  }

  const fieldErr = (errs, key) =>
    errs[key] ? <p className="text-xs text-red-500 mt-1">{Array.isArray(errs[key]) ? errs[key][0] : errs[key]}</p> : null

  if (loading) return (
    <Layout title="Профиль">
      <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
    </Layout>
  )

  return (
    <Layout title="Профиль">
      <div className="max-w-xl">
        {profile && (
          <div className="card p-5 mb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{profile.full_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="badge-blue">{profile.role_label}</span>
                  {profile.email_verified_at ? (
                    <span className="badge-green">Email подтверждён</span>
                  ) : (
                    <span className="badge-yellow">Email не подтверждён</span>
                  )}
                  {!profile.is_active && <span className="badge-red">Аккаунт неактивен</span>}
                </div>
              </div>
            </div>
            {profile.student_profile && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Студенческий билет: <span className="font-medium text-gray-900 dark:text-gray-100">{profile.student_profile.student_id_number}</span></p>
                {profile.student_profile.group && (
                  <p>Группа: <span className="font-medium text-gray-900 dark:text-gray-100">{profile.student_profile.group.name}</span> · {profile.student_profile.group.education_form_label} · {profile.student_profile.group.course} курс</p>
                )}
              </div>
            )}
          </div>
        )}

        <Section title="Личные данные">
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Фамилия</label>
                <input className={`input ${nameErrors.last_name ? 'border-red-300' : ''}`} value={nameForm.last_name} onChange={(e) => setNameForm((f) => ({ ...f, last_name: e.target.value }))} />
                {fieldErr(nameErrors, 'last_name')}
              </div>
              <div>
                <label className="label">Имя</label>
                <input className={`input ${nameErrors.first_name ? 'border-red-300' : ''}`} value={nameForm.first_name} onChange={(e) => setNameForm((f) => ({ ...f, first_name: e.target.value }))} />
                {fieldErr(nameErrors, 'first_name')}
              </div>
            </div>
            <div>
              <label className="label">Отчество</label>
              <input className={`input ${nameErrors.second_name ? 'border-red-300' : ''}`} value={nameForm.second_name} onChange={(e) => setNameForm((f) => ({ ...f, second_name: e.target.value }))} />
              {fieldErr(nameErrors, 'second_name')}
            </div>
            <div>
              <label className="label">Телефон</label>
              <input type="tel" className={`input ${nameErrors.phone ? 'border-red-300' : ''}`} placeholder="+79001234567" value={nameForm.phone} onChange={(e) => setNameForm((f) => ({ ...f, phone: e.target.value }))} />
              {fieldErr(nameErrors, 'phone')}
            </div>
            <button type="submit" disabled={nameLoading} className="btn-primary">
              {nameLoading && <LoadingSpinner size="sm" />}
              {nameLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </form>
        </Section>

        <Section title="Смена пароля">
          <form onSubmit={handlePwdSubmit} className="space-y-4">
            <div>
              <label className="label">Текущий пароль</label>
              <input type="password" className={`input ${pwdErrors.current_password ? 'border-red-300' : ''}`} value={pwdForm.current_password} onChange={(e) => setPwdForm((f) => ({ ...f, current_password: e.target.value }))} />
              {fieldErr(pwdErrors, 'current_password')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Новый пароль</label>
                <input type="password" className={`input ${pwdErrors.password ? 'border-red-300' : ''}`} value={pwdForm.password} onChange={(e) => setPwdForm((f) => ({ ...f, password: e.target.value }))} />
                {fieldErr(pwdErrors, 'password')}
              </div>
              <div>
                <label className="label">Подтверждение</label>
                <input type="password" className={`input ${pwdErrors.password_confirmation ? 'border-red-300' : ''}`} value={pwdForm.password_confirmation} onChange={(e) => setPwdForm((f) => ({ ...f, password_confirmation: e.target.value }))} />
                {fieldErr(pwdErrors, 'password_confirmation')}
              </div>
            </div>
            <button type="submit" disabled={pwdLoading} className="btn-primary">
              {pwdLoading && <LoadingSpinner size="sm" />}
              {pwdLoading ? 'Смена...' : 'Сменить пароль'}
            </button>
          </form>
        </Section>

        <Section title="Смена email">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            На новый адрес будет отправлено письмо с подтверждением. Email сменится после перехода по ссылке.
          </p>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="label">Новый email</label>
              <input type="email" className={`input ${emailErrors.email ? 'border-red-300' : ''}`} placeholder="new@institute.local" value={emailForm.email} onChange={(e) => setEmailForm((f) => ({ ...f, email: e.target.value }))} />
              {fieldErr(emailErrors, 'email')}
            </div>
            <div>
              <label className="label">Текущий пароль</label>
              <input type="password" className={`input ${emailErrors.password ? 'border-red-300' : ''}`} value={emailForm.password} onChange={(e) => setEmailForm((f) => ({ ...f, password: e.target.value }))} />
              {fieldErr(emailErrors, 'password')}
            </div>
            <button type="submit" disabled={emailLoading} className="btn-primary">
              {emailLoading && <LoadingSpinner size="sm" />}
              {emailLoading ? 'Отправка...' : 'Отправить подтверждение'}
            </button>
          </form>
        </Section>

      </div>
    </Layout>
  )
}
