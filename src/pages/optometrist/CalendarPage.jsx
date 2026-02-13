import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useDataStore } from '../../store/dataStore'
import { Save } from 'lucide-react'
import { format } from 'date-fns'

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export default function CalendarPage() {
  const user = useAuthStore((s) => s.user)
  const { getOptometristById, updateOptometrist } = useDataStore()
  const opt = getOptometristById(user?.id) || {}

  const [availability, setAvailability] = useState({})
  const [timeOff, setTimeOff] = useState([])
  const [newTimeOffStart, setNewTimeOffStart] = useState('')
  const [newTimeOffEnd, setNewTimeOffEnd] = useState('')

  useEffect(() => {
    setAvailability(opt.availability || {})
    setTimeOff(opt.timeOff || [])
  }, [opt.id, opt.availability, opt.timeOff])

  const updateDay = (day, value) => {
    setAvailability((prev) => ({ ...prev, [day]: value }))
  }

  const handleSaveAvailability = (e) => {
    e.preventDefault()
    updateOptometrist(user?.id, { availability })
  }

  const addTimeOff = (e) => {
    e.preventDefault()
    if (!newTimeOffStart || !newTimeOffEnd) return
    const entry = { start: newTimeOffStart, end: newTimeOffEnd }
    const next = [...timeOff, entry]
    setTimeOff(next)
    updateOptometrist(user?.id, { timeOff: next })
    setNewTimeOffStart('')
    setNewTimeOffEnd('')
  }

  const removeTimeOff = (index) => {
    const next = timeOff.filter((_, i) => i !== index)
    setTimeOff(next)
    updateOptometrist(user?.id, { timeOff: next })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Availability</h1>
      <p className="text-slate-600 text-sm mb-6">Working days/hours and time off (vacations, unavailable periods).</p>

      <form onSubmit={handleSaveAvailability} className="max-w-xl space-y-4 mb-8">
        <h2 className="text-lg font-medium text-slate-800">Working hours by day</h2>
        {DAYS.map((day) => (
          <div key={day} className="flex items-center gap-4 flex-wrap">
            <span className="w-24 capitalize text-slate-700">{day}</span>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!availability[day]}
                onChange={(e) => updateDay(day, e.target.checked ? { start: '09:00', end: '17:00' } : null)}
                className="rounded border-slate-300"
              />
              Available
            </label>
            {availability[day] && (
              <>
                <input
                  type="time"
                  value={availability[day]?.start || '09:00'}
                  onChange={(e) => updateDay(day, { ...availability[day], start: e.target.value })}
                  className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                />
                <span className="text-slate-500">to</span>
                <input
                  type="time"
                  value={availability[day]?.end || '17:00'}
                  onChange={(e) => updateDay(day, { ...availability[day], end: e.target.value })}
                  className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                />
              </>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500"
        >
          <Save size={18} /> Save availability
        </button>
      </form>

      <div className="max-w-xl">
        <h2 className="text-lg font-medium text-slate-800 mb-3">Time off / vacations</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="date"
            value={newTimeOffStart}
            onChange={(e) => setNewTimeOffStart(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
          />
          <input
            type="date"
            value={newTimeOffEnd}
            onChange={(e) => setNewTimeOffEnd(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
          />
          <button
            type="button"
            onClick={addTimeOff}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {timeOff.map((t, i) => (
            <li key={i} className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-700">{t.start} – {t.end}</span>
              <button
                type="button"
                onClick={() => removeTimeOff(i)}
                className="text-red-600 text-sm hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
          {timeOff.length === 0 && <p className="text-slate-500 text-sm">No time off set.</p>}
        </ul>
      </div>
    </div>
  )
}
