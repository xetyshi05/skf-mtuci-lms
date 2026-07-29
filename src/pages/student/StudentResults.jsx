import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import ScoreBar from '../../components/ScoreBar'
import GradeTag, { getGradeAccent } from '../../components/GradeTag'
import { getStudentResults, getStudentSemesters } from '../../api/student'

const accentBar = {
  emerald: 'bg-emerald-500',
  violet:  'bg-violet-500',
  amber:   'bg-amber-500',
  red:     'bg-red-500',
  gray:    'bg-gray-400',
}

const accentRing = {
  emerald: 'text-emerald-600 dark:text-emerald-400',
  violet:  'text-violet-600 dark:text-violet-400',
  amber:   'text-amber-600 dark:text-amber-400',
  red:     'text-red-600 dark:text-red-400',
  gray:    'text-gray-500 dark:text-gray-400',
}

function MiniScore({ label, value, max, sub }) {
  const pct = Math.min(100, Math.max(0, (Number(value) / max) * 100))
  const color =
    pct >= 85 ? 'bg-emerald-500' :
    pct >= 70 ? 'bg-violet-500' :
    pct >= 55 ? 'bg-amber-500' :
    Number(value) > 0 ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'

  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-none">
        {value !== null && value !== undefined ? Number(value).toFixed(0) : '—'}
      </span>
      <div className="mt-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <div className={`h-1.5 rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {sub && <span className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">{sub}</span>}
    </div>
  )
}

function ResultCard({ item, index }) {
  const gb = item.gradebook
  const accent = getGradeAccent(item.final_grade)
  const barColor = accentBar[accent] || 'bg-gray-400'
  const textColor = accentRing[accent] || 'text-gray-500'
  const totalPct = Math.min(100, Math.max(0, (Number(item.total_score) / 100) * 100))

  return (
    <div
      className="card overflow-hidden hover:shadow-lg transition-all duration-300 card-animate"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className={`h-1 w-full ${barColor}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
              {gb.discipline}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
              {gb.direction_code && (
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{gb.direction_code}</span>
              )}
              {gb.direction_code && <span className="text-gray-200 dark:text-gray-700">·</span>}
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{gb.group_name}</span>
              <span className="text-gray-200 dark:text-gray-700">·</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{gb.academic_year}</span>
              <span className="text-gray-200 dark:text-gray-700">·</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{gb.semester} семестр</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <GradeTag grade={item.final_grade} large />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">МРС (рейтинговый балл)</span>
            <span className={`text-sm font-bold ${textColor}`}>{Number(item.mrs_score).toFixed(0)} / 100</span>
          </div>
          <ScoreBar value={item.mrs_score} max={100} thick />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <MiniScore
            label="Модуль 1"
            value={item.module1_score}
            max={50}
            sub={`т${item.module1_theory}+п${item.module1_practice}`}
          />
          <MiniScore
            label="Модуль 2"
            value={item.module2_score}
            max={50}
            sub={`т${item.module2_theory}+п${item.module2_practice}`}
          />
          <MiniScore
            label="Экзамен"
            value={item.exam_score}
            max={40}
          />
          <MiniScore
            label="Итого"
            value={item.total_score}
            max={100}
          />
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
              <span>Итоговый балл</span>
              <span>{totalPct.toFixed(0)}%</span>
            </div>
            <ScoreBar value={item.total_score} max={100} />
          </div>
        </div>

        {gb.teacher && (
          <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-800">
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs text-gray-400 dark:text-gray-500">{gb.teacher.full_name}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function SemesterTab({ value, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap
        ${active
          ? 'bg-violet-700 text-white shadow-sm shadow-violet-200 dark:shadow-violet-900'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
    >
      {value === '' ? 'Все семестры' : `${value} семестр`}
      {count !== undefined && (
        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
          {count}
        </span>
      )}
    </button>
  )
}

export default function StudentResults() {
  const [results, setResults] = useState([])
  const [semesters, setSemesters] = useState([])
  const [semester, setSemester] = useState('')
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [allResults, setAllResults] = useState([])
  const [allLoaded, setAllLoaded] = useState(false)

  useEffect(() => {
    getStudentSemesters()
      .then((res) => setSemesters(res.data.data || []))
      .catch(() => {})

    getStudentResults({ per_page: 100 })
      .then((res) => { setAllResults(res.data.data || []); setAllLoaded(true) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { per_page: 20, page }
    if (semester) params.semester = semester
    getStudentResults(params)
      .then((res) => {
        setResults(res.data.data || [])
        setMeta(res.data.meta)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [semester, page])

  const handleSemChange = (val) => {
    setSemester(val)
    setPage(1)
  }

  const countForSemester = (sem) => {
    if (!allLoaded) return undefined
    if (!sem) return allResults.length
    return allResults.filter((r) => String(r.semester) === String(sem)).length
  }

  const avgMrs = results.length > 0
    ? (results.reduce((acc, r) => acc + Number(r.mrs_score), 0) / results.length).toFixed(1)
    : null

  return (
    <Layout title="Мои результаты">
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <SemesterTab
            value=""
            active={semester === ''}
            onClick={() => handleSemChange('')}
            count={countForSemester('')}
          />
          {semesters.map((s) => (
            <SemesterTab
              key={s}
              value={s}
              active={semester === s}
              onClick={() => handleSemChange(s)}
              count={countForSemester(s)}
            />
          ))}
        </div>
      </div>

      {!loading && results.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 mb-5 p-4 card animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Дисциплин</p>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{meta?.total ?? results.length}</p>
            </div>
          </div>

          {avgMrs && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Средний МРС</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{avgMrs} / 100</p>
              </div>
            </div>
          )}

          <div className="hidden sm:flex gap-3 ml-auto flex-wrap">
            {[
              { label: 'Отлично', acc: 'emerald' },
              { label: 'Хорошо', acc: 'violet' },
              { label: 'Удовл.', acc: 'amber' },
              { label: 'Неудовл.', acc: 'red' },
            ].map(({ label, acc }) => {
              const cnt = results.filter((r) => {
                const g = r.final_grade
                const a = g === 'Отлично' || g === 'Зачтено' ? 'emerald'
                  : g === 'Хорошо' ? 'violet'
                  : g === 'Удовлетворительно' ? 'amber'
                  : g === 'Неудовлетворительно' || g === 'Не зачтено' ? 'red'
                  : 'gray'
                return a === acc
              }).length
              if (!cnt) return null
              return (
                <span key={label} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${accentBar[acc]}`} />
                  {cnt} {label}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <LoadingSpinner size="lg" />
        </div>
      ) : results.length === 0 ? (
        <div className="card p-14 text-center animate-fade-in">
          <svg className="w-14 h-14 text-gray-200 dark:text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Результатов не найдено</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {semester ? `За ${semester} семестр оценок пока нет` : 'Ведомости ещё не загружены'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {results.map((item, i) => <ResultCard key={item.id} item={item} index={i} />)}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-secondary"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {meta.current_page} / {meta.last_page}
          </span>
          <button
            disabled={page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="btn-secondary"
          >
            Далее
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </Layout>
  )
}
