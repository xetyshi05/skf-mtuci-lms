export default function ScoreBar({ value, max = 100, className = '', thick = false }) {
  const pct = Math.min(100, Math.max(0, (Number(value) / max) * 100))
  const color =
    pct >= 85 ? 'from-emerald-400 to-emerald-600' :
    pct >= 70 ? 'from-violet-500 to-violet-700' :
    pct >= 55 ? 'from-amber-400 to-orange-500' :
                'from-red-400 to-red-600'
  const h = thick ? 'h-3' : 'h-2'

  return (
    <div className={`w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden ${h} ${className}`}>
      <div
        className={`${h} rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
