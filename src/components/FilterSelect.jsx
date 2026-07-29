import { useState, useRef, useEffect } from 'react'

export default function FilterSelect({ value, onChange, options, placeholder = 'Все', minWidth = '140px' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find((o) => String(o.value) === String(value))

  return (
    <div ref={ref} className="relative flex-shrink-0" style={{ minWidth }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm
          bg-white dark:bg-gray-900
          border transition-all duration-150
          ${open
            ? 'border-violet-400 dark:border-violet-500 ring-2 ring-violet-500/20 shadow-sm'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }
          text-gray-700 dark:text-gray-300 font-medium
        `}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`
        absolute z-50 left-0 mt-1.5 w-full min-w-max
        bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-700
        rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-gray-950/60
        overflow-hidden
        transition-[opacity,transform] duration-200
        ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}
      `}>
        <div className="max-h-56 overflow-y-auto py-1.5 scrollbar-hide">
          <button
            type="button"
            onClick={() => { onChange(''); setOpen(false) }}
            className={`
              w-full text-left px-3.5 py-2 text-sm transition-colors duration-100
              ${!value
                ? 'text-violet-600 dark:text-violet-400 font-semibold bg-violet-50 dark:bg-violet-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            {placeholder}
          </button>
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(String(o.value)); setOpen(false) }}
              className={`
                w-full text-left px-3.5 py-2 text-sm transition-colors duration-100
                ${String(value) === String(o.value)
                  ? 'text-violet-600 dark:text-violet-400 font-semibold bg-violet-50 dark:bg-violet-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
