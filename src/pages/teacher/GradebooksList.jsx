import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getGradebooks, getGradebookFilters, deleteGradebook, exportGradebook } from '../../api/gradebooks'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'
import FilterSelect from '../../components/FilterSelect'

function GradebookCard({ item, onDelete, onExport, isAdmin, index = 0 }) {
  const [deleting, setDeleting] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Удалить ведомость "${item.title}"?`)) return
    setDeleting(true)
    await onDelete(item.id)
    setDeleting(false)
  }

  const handleExport = async () => {
    setExporting(true)
    await onExport(item.id, item.title)
    setExporting(false)
  }

  return (
    <div
      className="card p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 card-animate"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">{item.discipline}</h3>
          {item.direction_code && (
            <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 mt-0.5">{item.direction_code}</p>
          )}
        </div>
        <span className="badge-blue flex-shrink-0">{item.rows_count} студ.</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="badge-gray">{item.group_name}</span>
        <span className="badge-gray">{item.academic_year}</span>
        <span className="badge-gray">{item.semester} сем.</span>
      </div>

      {item.teacher && (
        <div className="flex items-center gap-1.5 mb-4">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{item.teacher.full_name}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-50 dark:border-gray-800">
        <Link to={`/gradebooks/${item.id}`} className="btn-secondary text-xs px-3 py-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Открыть
        </Link>
        <button onClick={handleExport} disabled={exporting} className="btn-secondary text-xs px-3 py-1.5">
          {exporting ? <LoadingSpinner size="sm" /> : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
          XLSX
        </button>
        {isAdmin && (
          <button onClick={handleDelete} disabled={deleting} className="btn-danger text-xs px-3 py-1.5 ml-auto">
            {deleting ? <LoadingSpinner size="sm" /> : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            Удалить
          </button>
        )}
      </div>
    </div>
  )
}

export default function GradebooksList() {
  const { user } = useAuth()
  const toast = useToast()
  const isAdmin = user?.role === 'administrator'

  const [items, setItems] = useState([])
  const [filters, setFilters] = useState(null)
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)

  const [search, setSearch] = useState('')
  const [discipline, setDiscipline] = useState('')
  const [groupName, setGroupName] = useState('')
  const [semFilter, setSemFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [teacherFilter, setTeacherFilter] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    getGradebookFilters()
      .then((res) => setFilters(res.data.data))
      .catch(() => {})
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    const params = { per_page: 12, page, sort }
    if (search) params.search = search
    if (discipline) params.discipline = discipline
    if (groupName) params.group_name = groupName
    if (semFilter) params.semester = semFilter
    if (yearFilter) params.academic_year = yearFilter
    if (teacherFilter) params.teacher_id = teacherFilter

    getGradebooks(params)
      .then((res) => {
        setItems(res.data.data || [])
        setMeta(res.data.meta)
      })
      .catch(() => toast.add('Ошибка загрузки ведомостей', 'error'))
      .finally(() => setLoading(false))
  }, [search, discipline, groupName, semFilter, yearFilter, teacherFilter, sort, page])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    try {
      await deleteGradebook(id)
      toast.add('Ведомость удалена', 'success')
      load()
    } catch {
      toast.add('Не удалось удалить ведомость', 'error')
    }
  }

  const handleExport = async (id, title) => {
    try {
      const res = await exportGradebook(id)
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      toast.add('Ведомость экспортирована', 'success')
    } catch {
      toast.add('Не удалось экспортировать ведомость', 'error')
    }
  }

  const resetFilters = () => {
    setSearch(''); setDiscipline(''); setGroupName('')
    setSemFilter(''); setYearFilter(''); setTeacherFilter('')
    setSort('newest'); setPage(1)
  }

  return (
    <Layout title="Ведомости">
      <div className="card p-4 mb-6 space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            className="input flex-1"
            placeholder="Поиск по дисциплине, группе..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
          <Link to="/gradebooks/upload" className="btn-primary flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Загрузить</span>
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide items-start">
          {filters?.disciplines && (
            <FilterSelect
              value={discipline}
              onChange={(v) => { setDiscipline(v); setPage(1) }}
              options={filters.disciplines.map((d) => ({ value: d, label: d }))}
              placeholder="Все дисциплины"
              minWidth="160px"
            />
          )}
          {filters?.groups && (
            <FilterSelect
              value={groupName}
              onChange={(v) => { setGroupName(v); setPage(1) }}
              options={filters.groups.map((g) => ({ value: g, label: g }))}
              placeholder="Все группы"
              minWidth="120px"
            />
          )}
          {filters?.semesters && (
            <FilterSelect
              value={semFilter}
              onChange={(v) => { setSemFilter(v); setPage(1) }}
              options={filters.semesters.map((s) => ({ value: s, label: `${s} семестр` }))}
              placeholder="Все семестры"
              minWidth="130px"
            />
          )}
          {filters?.academic_years && (
            <FilterSelect
              value={yearFilter}
              onChange={(v) => { setYearFilter(v); setPage(1) }}
              options={filters.academic_years.map((y) => ({ value: y, label: y }))}
              placeholder="Все годы"
              minWidth="120px"
            />
          )}
          {isAdmin && filters?.teachers && (
            <FilterSelect
              value={teacherFilter}
              onChange={(v) => { setTeacherFilter(v); setPage(1) }}
              options={filters.teachers.map((t) => ({ value: t.id, label: t.full_name }))}
              placeholder="Все преподаватели"
              minWidth="180px"
            />
          )}
          {filters?.sort_options && (
            <FilterSelect
              value={sort}
              onChange={(v) => { setSort(v || 'newest'); setPage(1) }}
              options={filters.sort_options.map((o) => ({ value: o.value, label: o.label }))}
              placeholder="Сортировка"
              minWidth="140px"
            />
          )}
          <button onClick={resetFilters} className="btn-secondary flex-shrink-0 text-sm px-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="hidden sm:inline">Сбросить</span>
          </button>
        </div>

        {meta && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Найдено: <span className="font-semibold text-gray-600 dark:text-gray-300">{meta.total}</span> ведомост{meta.total === 1 ? 'ь' : meta.total < 5 ? 'и' : 'ей'}
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">Ведомости не найдены</p>
          <Link to="/gradebooks/upload" className="btn-primary mt-4 inline-flex">Загрузить ведомость</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <GradebookCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onExport={handleExport}
              isAdmin={isAdmin}
              index={i}
            />
          ))}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary">Назад</button>
          <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">{meta.current_page} / {meta.last_page}</span>
          <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)} className="btn-secondary">Далее</button>
        </div>
      )}
    </Layout>
  )
}
