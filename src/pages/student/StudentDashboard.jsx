import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import ScoreBar from '../../components/ScoreBar'
import { getStudentSummary } from '../../api/student'

function StatCard({ label, value, sub, icon, color = 'violet', index = 0 }) {
  const colors = {
    violet: {
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      icon: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400',
      value: 'text-violet-700 dark:text-violet-300',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      icon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
      value: 'text-emerald-700 dark:text-emerald-300',
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      icon: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
      value: 'text-indigo-700 dark:text-indigo-300',
    },
  }
  const c = colors[color] || colors.violet

  return (
    <div
      className={`card p-5 flex items-center gap-4 card-animate`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${c.icon}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">{label}</p>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className={`text-2xl font-extrabold ${c.value}`}>{value ?? '—'}</span>
          {sub && <span className="text-sm text-gray-400 dark:text-gray-500">{sub}</span>}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  )
}

export default function StudentDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getStudentSummary()
      .then((res) => setData(res.data.data))
      .catch(() => setError('Не удалось загрузить сводку'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Layout title="Сводка">
      <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
    </Layout>
  )

  if (error) return (
    <Layout title="Сводка">
      <div className="card p-8 text-center">
        <svg className="w-12 h-12 text-red-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
      </div>
    </Layout>
  )

  const { student, stats } = data
  const sp = student.student_profile
  const group = sp?.group

  const mrsLevel =
    stats.avg_mrs >= 85 ? { label: 'Отличник', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' } :
    stats.avg_mrs >= 70 ? { label: 'Хорошист', color: 'text-violet-600 dark:text-violet-400',  bg: 'bg-violet-50 dark:bg-violet-900/20' } :
    stats.avg_mrs >= 55 ? { label: 'Удовл.',   color: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-50 dark:bg-amber-900/20' } :
                          { label: 'Требует улучшения', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' }

  return (
    <Layout title="Сводка студента">

      <div className="card p-6 mb-5 card-animate" style={{ animationDelay: '0s' }}>
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg shadow-violet-200 dark:shadow-violet-900/40">
            {student.first_name?.[0]}{student.last_name?.[0]}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{student.full_name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="badge-blue">{student.role_label}</span>
              {group && <span className="badge-gray">{group.name}</span>}
              {group && (
                <span className="badge-gray">{group.education_form_label} · {group.course} курс</span>
              )}
              {sp?.student_id_number && (
                <span className="badge-gray font-mono text-[11px]">{sp.student_id_number}</span>
              )}
              {stats.avg_mrs !== null && (
                <span className={`badge text-xs font-semibold ${mrsLevel.color} ${mrsLevel.bg}`}>
                  {mrsLevel.label}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{student.email}</p>
          </div>
          <Link to="/profile" className="btn-secondary hidden sm:flex flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Профиль
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StatCard
          label="Дисциплин"
          value={stats.disciplines_count}
          color="violet"
          index={1}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          label="Средний МРС"
          value={stats.avg_mrs !== null ? Number(stats.avg_mrs).toFixed(1) : '—'}
          sub="из 100"
          color="indigo"
          index={2}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatCard
          label="Средний итоговый"
          value={stats.avg_total !== null ? Number(stats.avg_total).toFixed(1) : '—'}
          sub="из 100"
          color="emerald"
          index={3}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stats.avg_mrs !== null && (
          <div className="card p-6 card-animate" style={{ animationDelay: '0.32s' }}>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Прогресс успеваемости
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500 dark:text-gray-400">Рейтинговый балл (МРС)</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{Number(stats.avg_mrs).toFixed(1)}</span>
                </div>
                <ScoreBar value={stats.avg_mrs} max={100} thick />
                <div className="flex justify-between text-[11px] text-gray-300 dark:text-gray-600 mt-1">
                  <span>0</span>
                  <span className="text-amber-500">55 — удовл.</span>
                  <span className="text-violet-500">70 — хор.</span>
                  <span className="text-emerald-500">85 — отл.</span>
                  <span>100</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500 dark:text-gray-400">Итоговый балл</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{Number(stats.avg_total).toFixed(1)}</span>
                </div>
                <ScoreBar value={stats.avg_total} max={100} thick />
              </div>
            </div>
          </div>
        )}

        <div className="card p-6 card-animate" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Информация о студенте
          </h3>
          <div>
            <InfoRow label="Студенческий билет" value={sp?.student_id_number || '—'} />
            {group && (
              <>
                <InfoRow label="Группа" value={group.name} />
                <InfoRow label="Форма обучения" value={group.education_form_label} />
                <InfoRow label="Курс" value={`${group.course} курс`} />
              </>
            )}
            <InfoRow label="Email" value={student.email} />
          </div>
          <Link to="/results" className="btn-primary w-full mt-5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Все результаты
          </Link>
        </div>
      </div>
    </Layout>
  )
}
