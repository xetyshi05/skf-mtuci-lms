import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'

const roles = [
  {
    label: 'Студент',
    desc: 'Оценки и семестры',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    label: 'Преподаватель',
    desc: 'Ведомости и загрузка',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: 'Администратор',
    desc: 'Полный доступ',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      toast.add(`Добро пожаловать, ${user.first_name}!`, 'success')
      if (user.role === 'student') navigate('/dashboard')
      else navigate('/gradebooks')
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный email или пароль.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">

      <div className="hidden lg:flex flex-1 flex-col relative overflow-hidden">
        <img
          src="/assets/background.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[#1e0a4a]/40" />

        <div className="relative z-10 flex flex-col h-full p-10 justify-between">

          <div className="login-panel-logo">
            <img
              src="/assets/ЛОГОТИП-СКФ-белый-рус.svg"
              alt="МТУСИ"
              className="h-20 w-auto object-contain drop-shadow-lg"
            />
          </div>

          <div className="login-panel-text">
            <h2 className="text-4xl font-bold text-white leading-tight mb-3 drop-shadow">
              Учебный портал<br />МРС СКФ МТУСИ
            </h2>
            <p className="text-white/65 text-sm leading-relaxed mb-8 max-w-xs">
              Система модульно-рейтинговых оценок. Просматривайте оценки,
              загружайте ведомости и отслеживайте прогресс.
            </p>

            <div className="flex flex-col gap-2 max-w-xs">
              {roles.map((r, i) => (
                <div
                  key={r.label}
                  className="login-role-card"
                  style={{ animationDelay: `${0.15 + i * 0.12}s` }}
                >
                  <span className="text-white/70 flex-shrink-0">{r.icon}</span>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold leading-none">{r.label}</p>
                    <p className="text-white/55 text-xs mt-0.5">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-xs login-panel-footer">
            © 2026 СКФ МТУСИ — Северо-Кавказский Филиал МТУСИ
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md login-form-panel">

          <div className="lg:hidden mb-8">
            <img
              src={dark ? '/assets/ЛОГОТИП-СКФ-белый-рус.svg' : '/assets/ЛОГОТИП-СКФ-фиолетовый-рус.svg'}
              alt="МТУСИ"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="hidden lg:flex items-center gap-3 mb-3">
                <img
                  src="/assets/logo.png"
                  alt=""
                  className="w-12 h-12 rounded-2xl object-contain shadow-sm"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Вход в систему</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Единый вход для всех ролей
              </p>
            </div>

            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"
              title={dark ? 'Светлая тема' : 'Тёмная тема'}
            >
              {dark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                              text-sm text-red-700 dark:text-red-400 flex items-center gap-2 login-error-shake">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="login-field" style={{ animationDelay: '0.05s' }}>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="user@institute.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="login-field" style={{ animationDelay: '0.1s' }}>
              <label className="label" htmlFor="password">Пароль</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  className="input pr-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400
                             hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPwd ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="login-field" style={{ animationDelay: '0.15s' }}>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Выполняется вход...
                  </>
                ) : 'Войти'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
