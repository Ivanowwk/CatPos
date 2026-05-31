import { useEffect, useState } from 'react'

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric'
})

const timeFormatter = new Intl.DateTimeFormat('es-CO', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
})

export const ClockBadge = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(
      () => setNow(new Date()),
      1000
    )

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-3xl bg-slate-900 px-4 py-3 text-right text-white shadow-lg shadow-slate-200/40">
      <p className="text-lg font-semibold tracking-[0.1em] uppercase text-slate-200">
        {timeFormatter.format(now)}
      </p>
      <p className="text-xs text-slate-400">
        {dateFormatter.format(now)}
      </p>
    </div>
  )
}
