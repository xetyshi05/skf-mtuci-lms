import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'

const iconCls = 'w-4.5 h-4.5 flex-shrink-0'

const Icons = {
  dashboard: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  results: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  gradebooks: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  upload: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  profile: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  addTeacher: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  about: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  logout: (
    <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
}

const link = ({ isActive }) => `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const { dark } = useTheme()
  const navigate = useNavigate()
  const toast = useToast()
  const role = user?.role

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    toast.add('Выход выполнен успешно.', 'info')
  }

  return (
    <aside className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <img
          src={dark ? '/assets/ЛОГОТИП-СКФ-белый-рус.svg' : '/assets/ЛОГОТИП-СКФ-фиолетовый-рус.svg'}
          alt="МТУСИ"
          className="h-14 w-auto object-contain object-left"
        />
        <div className="mt-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">МРС · Учебный портал</span>
          <span className="badge-blue text-[10px] px-1.5 py-0 ml-auto">{user?.role_label}</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {role === 'student' && (
          <>
            <NavLink to="/dashboard" className={link} onClick={onClose}>{Icons.dashboard} Сводка</NavLink>
            <NavLink to="/results"   className={link} onClick={onClose}>{Icons.results}   Мои результаты</NavLink>
          </>
        )}

        {(role === 'teacher' || role === 'administrator') && (
          <>
            <NavLink to="/gradebooks"        className={link} onClick={onClose}>{Icons.gradebooks} Ведомости</NavLink>
            <NavLink to="/gradebooks/upload" className={link} onClick={onClose}>{Icons.upload}     Загрузить ведомость</NavLink>
          </>
        )}

        {role === 'administrator' && (
          <NavLink to="/admin/teachers" className={link} onClick={onClose}>{Icons.addTeacher} Добавить преподавателя</NavLink>
        )}

        <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800 space-y-0.5">
          <NavLink to="/profile" className={link} onClick={onClose}>{Icons.profile} Профиль</NavLink>
          <NavLink to="/about"   className={link} onClick={onClose}>{Icons.about}   О приложении</NavLink>
        </div>
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 select-none shadow-sm">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.full_name || user?.email}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
        >
          {Icons.logout} Выйти из системы
        </button>
      </div>
    </aside>
  )
}
