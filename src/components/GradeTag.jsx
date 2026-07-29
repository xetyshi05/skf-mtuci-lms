const gradeConfig = {
  'Отлично':            { accent: 'emerald', num: '5' },
  'Хорошо':             { accent: 'violet',  num: '4' },
  'Удовлетворительно':  { accent: 'amber',   num: '3' },
  'Неудовлетворительно':{ accent: 'red',     num: '2' },
  'Неявка':             { accent: 'gray',    num: 'Н' },
  'Зачтено':            { accent: 'emerald', num: 'Зач' },
  'Не зачтено':         { accent: 'red',     num: 'Н/з' },
}

const accentCls = {
  emerald: {
    badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    large: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    border: 'border-l-emerald-500',
  },
  violet: {
    badge: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800',
    dot: 'bg-violet-500',
    large: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    border: 'border-l-violet-500',
  },
  amber: {
    badge: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    large: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    border: 'border-l-amber-500',
  },
  red: {
    badge: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
    large: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    border: 'border-l-red-500',
  },
  gray: {
    badge: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-400',
    large: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    border: 'border-l-gray-400',
  },
}

export function getGradeAccent(grade) {
  return gradeConfig[grade]?.accent || 'gray'
}

export default function GradeTag({ grade, large = false }) {
  const cfg = gradeConfig[grade] || { accent: 'gray', num: '—' }
  const cls = accentCls[cfg.accent] || accentCls.gray

  if (large) {
    return (
      <div className={`inline-flex flex-col items-center justify-center rounded-2xl border-2 min-w-[64px] px-3 py-2.5 ${cls.large}`}>
        <span className="text-2xl font-extrabold leading-none">{cfg.num}</span>
        <span className="text-[10px] font-semibold mt-1 opacity-75 text-center leading-tight max-w-[56px]">{grade}</span>
      </div>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${cls.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cls.dot}`} />
      {grade}
    </span>
  )
}
