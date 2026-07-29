import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import { importGradebook, getTeachers } from '../../api/gradebooks'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'

export default function UploadGradebook() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [file, setFile] = useState(null)
  const [semester, setSemester] = useState('')
  const [academicYear, setAcademicYear] = useState('')
  const [teacherId, setTeacherId] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [dragOver, setDragOver] = useState(false)
  const [teachers, setTeachers] = useState([])

  const isAdmin = user?.role === 'administrator'

  useEffect(() => {
    if (isAdmin) {
      getTeachers()
        .then((res) => setTeachers(res.data.data || res.data))
        .catch(() => {})
    }
  }, [isAdmin])

  const handleFile = (f) => {
    if (!f) return
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['xlsx', 'xls'].includes(ext)) {
      toast.add('Поддерживаются только файлы .xlsx и .xls', 'error')
      return
    }
    setFile(f)
    setErrors((e) => ({ ...e, file: undefined }))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const validate = () => {
    const errs = {}
    if (!file) errs.file = 'Выберите файл ведомости'
    if (!semester.trim()) errs.semester = 'Укажите семестр'
    if (!academicYear.trim()) errs.academicYear = 'Укажите учебный год'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('semester', semester)
    fd.append('academic_year', academicYear)
    if (isAdmin && teacherId) fd.append('teacher_id', teacherId)

    try {
      const res = await importGradebook(fd)
      toast.add(`Ведомость "${res.data.data.title}" загружена`, 'success')
      navigate('/gradebooks')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        const mapped = {}
        if (data.errors.file) mapped.file = data.errors.file[0]
        if (data.errors.semester) mapped.semester = data.errors.semester[0]
        if (data.errors.academic_year) mapped.academicYear = data.errors.academic_year[0]
        setErrors(mapped)
      }
      toast.add(data?.message || 'Ошибка загрузки', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Загрузить ведомость">
      <div className="max-w-xl">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/gradebooks" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">← Ведомости</Link>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Загрузка ведомости МРС</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Файл ведомости (.xlsx / .xls)</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                  ${dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  ${errors.file ? 'border-red-300 dark:border-red-700' : ''}
                `}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null) }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Удалить файл
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">Выберите файл</span> или перетащите сюда
                    </p>
                    <p className="text-xs text-gray-400">XLSX, XLS — файл ведомости МРС</p>
                  </div>
                )}
              </div>
              {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Семестр</label>
                <input
                  type="text"
                  className={`input ${errors.semester ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Например: 1"
                  value={semester}
                  onChange={(e) => { setSemester(e.target.value); setErrors((er) => ({ ...er, semester: undefined })) }}
                />
                {errors.semester && <p className="text-xs text-red-500 mt-1">{errors.semester}</p>}
              </div>

              <div>
                <label className="label">Учебный год</label>
                <input
                  type="text"
                  className={`input ${errors.academicYear ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="2025/2026"
                  value={academicYear}
                  onChange={(e) => { setAcademicYear(e.target.value); setErrors((er) => ({ ...er, academicYear: undefined })) }}
                />
                {errors.academicYear && <p className="text-xs text-red-500 mt-1">{errors.academicYear}</p>}
              </div>
            </div>

            {isAdmin && (
              <div>
                <label className="label">Преподаватель (необязательно)</label>
                <select
                  className="select"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                >
                  <option value="">— Назначить на себя —</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name || `${t.last_name} ${t.first_name}`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">Оставьте пустым, чтобы назначить на себя</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading && <LoadingSpinner size="sm" />}
                {loading ? 'Загрузка...' : 'Загрузить ведомость'}
              </button>
              <Link to="/gradebooks" className="btn-secondary">Отмена</Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
