import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import ScoreBar from '../../components/ScoreBar'
import GradeTag from '../../components/GradeTag'
import { getGradebook, deleteGradebook, exportGradebook } from '../../api/gradebooks'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'

export default function GradebookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()
  const isAdmin = user?.role === 'administrator'

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGradebook(id)
      .then((res) => setData(res.data.data))
      .catch(() => toast.add('Не удалось загрузить ведомость', 'error'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Удалить эту ведомость?')) return
    try {
      await deleteGradebook(id)
      toast.add('Ведомость удалена', 'success')
      navigate('/gradebooks')
    } catch {
      toast.add('Ошибка удаления', 'error')
    }
  }

  const handleExport = async () => {
    try {
      const res = await exportGradebook(id)
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.title}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      toast.add('Экспорт выполнен', 'success')
    } catch {
      toast.add('Ошибка экспорта', 'error')
    }
  }

  if (loading) return (
    <Layout title="Ведомость">
      <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
    </Layout>
  )

  if (!data) return (
    <Layout title="Ведомость">
      <div className="card p-6 text-center text-red-600">Ведомость не найдена</div>
    </Layout>
  )

  const rows = data.rows || []

  return (
    <Layout title={data.discipline}>
      <div className="card p-5 mb-6 card-animate">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link to="/gradebooks" className="inline-flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Все ведомости
              </Link>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{data.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2.5">
              {data.direction_code && <span className="badge-gray font-mono text-[11px]">{data.direction_code}</span>}
              <span className="badge-gray">{data.group_name}</span>
              <span className="badge-gray">{data.academic_year}</span>
              <span className="badge-gray">{data.semester} семестр</span>
              {data.rows_count !== undefined && <span className="badge-blue">{data.rows_count} студентов</span>}
            </div>
            {data.teacher && (
              <div className="flex items-center gap-1.5 mt-2.5">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm text-gray-500 dark:text-gray-400">{data.teacher.full_name}</span>
              </div>
            )}
            {data.original_filename && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-mono">📄 {data.original_filename}</p>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0 flex-wrap">
            <button onClick={handleExport} className="btn-secondary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Экспорт</span> XLSX
            </button>
            {isAdmin && (
              <button onClick={handleDelete} className="btn-danger">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Удалить</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {rows.length > 0 && (() => {
        const counts = rows.reduce((acc, r) => { acc[r.final_grade] = (acc[r.final_grade] || 0) + 1; return acc }, {})
        const avgMrs = (rows.reduce((s, r) => s + Number(r.mrs_score), 0) / rows.length).toFixed(1)
        const gradeOrder = ['Отлично', 'Хорошо', 'Удовлетворительно', 'Неудовлетворительно', 'Неявка', 'Зачтено', 'Не зачтено']
        return (
          <div className="card p-4 mb-4 card-animate" style={{ animationDelay: '0.08s' }}>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Средний МРС</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{avgMrs} / 100</p>
              </div>
              <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 hidden sm:block" />
              <div className="flex flex-wrap gap-2">
                {gradeOrder.filter((g) => counts[g]).map((g) => (
                  <span key={g} className="flex items-center gap-1.5">
                    <GradeTag grade={g} />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{counts[g]}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      })()}

      {rows.length === 0 ? (
        <div className="card p-10 text-center">
          <svg className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Строк в ведомости нет</p>
        </div>
      ) : (
        <div className="card overflow-hidden card-animate" style={{ animationDelay: '0.12s' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
                  {[
                    { label: '№', cls: 'w-10' },
                    { label: 'Студент', cls: '' },
                    { label: 'М1', cls: 'text-center' },
                    { label: 'М2', cls: 'text-center' },
                    { label: 'МРС', cls: 'text-center' },
                    { label: 'Экзамен', cls: 'text-center' },
                    { label: 'Итог', cls: '' },
                    { label: 'Оценка', cls: '' },
                  ].map((h) => (
                    <th key={h.label} className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${h.cls}`}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/80">
                {rows.map((row, i) => (
                  <tr key={row.id} className="hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors group">
                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-600 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">{row.student_name}</td>
                    <td className="px-4 py-3 text-center tabular-nums text-gray-700 dark:text-gray-300">{Number(row.module1_score).toFixed(0)}</td>
                    <td className="px-4 py-3 text-center tabular-nums text-gray-700 dark:text-gray-300">{Number(row.module2_score).toFixed(0)}</td>
                    <td className="px-4 py-3 text-center tabular-nums font-bold text-gray-900 dark:text-gray-100">{row.mrs_score}</td>
                    <td className="px-4 py-3 text-center tabular-nums text-gray-700 dark:text-gray-300">{Number(row.exam_score).toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <ScoreBar value={row.total_score} max={100} className="w-14" />
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 tabular-nums">{Number(row.total_score).toFixed(0)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><GradeTag grade={row.final_grade} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  )
}
