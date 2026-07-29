import Layout from '../components/Layout'

const students = [
  { name: 'Матвей Мордасов',    initials: 'ММ' },
  { name: 'Дмитрий Котило',     initials: 'ДК' },
  { name: 'Владислав Исчанов',  initials: 'ВИ' },
  { name: 'Тимофей Борисенко',  initials: 'ТБ' },
  { name: 'Георгий Кравцов',    initials: 'ГК' },
  { name: 'Александр Егоренко', initials: 'АЕ' },
]

const avatarColors = [
  'from-violet-500 to-violet-800',
  'from-indigo-500 to-indigo-800',
  'from-blue-500 to-blue-800',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-rose-800',
  'from-amber-500 to-orange-600',
]

export default function AboutPage() {
  return (
    <Layout title="О приложении">
      <div className="max-w-2xl mx-auto space-y-5">

        <div className="card overflow-hidden card-animate">
          <div className="h-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-800" />
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-900 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-200 dark:shadow-violet-900/50">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
                  МРС СКФ МТУСИ
                </h1>
                <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold mt-0.5">
                  Система модульно-рейтинговых оценок
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Версия 1.0 · 2026
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Учебный портал для просмотра оценок студентами, загрузки ведомостей преподавателями
              и администрирования учебного процесса. Поддерживает импорт ведомостей МРС в формате
              Excel, фильтрацию по семестрам и дисциплинам, экспорт данных.
            </p>
          </div>
        </div>

        <div className="card p-6 sm:p-8 card-animate" style={{ animationDelay: '0.08s' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Учебный контекст</h2>
          </div>

          <div className="space-y-3">
            <InfoLine
              label="Учебное заведение"
              value="МТУСИ — Московский Технический Университет Связи и Информатики, СКФ"
            />
            <InfoLine
              label="Дисциплина"
              value="Математические основы баз данных"
            />
            <InfoLine
              label="Вид работы"
              value="Практическая (курсовая) работа"
            />
            <InfoLine
              label="Группа"
              value="ДМО2401"
            />
            <InfoLine
              label="Руководитель"
              value="Докучаев Сергей Аркадьевич"
            />
          </div>
        </div>

        <div className="card p-6 sm:p-8 card-animate" style={{ animationDelay: '0.16s' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Команда разработчиков</h2>
            <span className="badge-blue ml-auto">{students.length} чел.</span>
          </div>

          <div className="space-y-2.5">
            {students.map((s, i) => (
              <div
                key={s.name}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50
                           hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors duration-150
                           card-animate"
                style={{ animationDelay: `${0.2 + i * 0.07}s` }}
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[i]} flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm`}>
                  {s.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{s.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Группа ДМО2401</p>
                </div>
                <span className="ml-auto text-xs text-gray-300 dark:text-gray-600 font-mono">#{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 sm:p-8 card-animate" style={{ animationDelay: '0.28s' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Технологии</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {['React 18', 'Vite', 'Tailwind CSS', 'Laravel', 'PostgreSQL', 'Nginx', 'Docker', 'REST API'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                           text-xs font-semibold border border-gray-200 dark:border-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 dark:text-gray-700 pb-2">
          © 2026 МТУСИ · Группа ДМО2401
        </p>
      </div>
    </Layout>
  )
}

function InfoLine({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide sm:w-40 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  )
}
