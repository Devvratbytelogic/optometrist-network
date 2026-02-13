import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useDataStore } from '../../store/dataStore'
import { VISIT_TYPES } from '../../lib/constants'
import { Save } from 'lucide-react'

export default function WorkingRulesPage() {
  const user = useAuthStore((s) => s.user)
  const { getOptometristById, updateOptometrist } = useDataStore()
  const opt = getOptometristById(user?.id) || {}

  const [visitType, setVisitType] = useState(opt.visitType || 'offline')
  const [consultationFee, setConsultationFee] = useState(opt.consultationFee ?? 0)
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(opt.slotDurationMinutes ?? 30)
  const [dailyCapacity, setDailyCapacity] = useState(opt.dailyCapacity ?? 5)

  useEffect(() => {
    setVisitType(opt.visitType || 'offline')
    setConsultationFee(opt.consultationFee ?? 0)
    setSlotDurationMinutes(opt.slotDurationMinutes ?? 30)
    setDailyCapacity(opt.dailyCapacity ?? 5)
  }, [opt.id, opt.visitType, opt.consultationFee, opt.slotDurationMinutes, opt.dailyCapacity])

  const handleSubmit = (e) => {
    e.preventDefault()
    updateOptometrist(user?.id, {
      visitType,
      consultationFee: Number(consultationFee),
      slotDurationMinutes: Number(slotDurationMinutes),
      dailyCapacity: Number(dailyCapacity),
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Working rules</h1>
      <p className="text-slate-600 text-sm mb-6">Visit type, fees, slot duration, and daily capacity.</p>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type of visit</label>
          <select
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
          >
            <option value={VISIT_TYPES.ONLINE}>Online only</option>
            <option value={VISIT_TYPES.OFFLINE}>In-person only</option>
            <option value={VISIT_TYPES.BOTH}>Both</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Consultation fee ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={consultationFee}
            onChange={(e) => setConsultationFee(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Duration per slot (minutes)</label>
          <input
            type="number"
            min="5"
            max="120"
            value={slotDurationMinutes}
            onChange={(e) => setSlotDurationMinutes(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Daily capacity (max patients per day)</label>
          <input
            type="number"
            min="1"
            max="50"
            value={dailyCapacity}
            onChange={(e) => setDailyCapacity(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500"
        >
          <Save size={18} /> Save
        </button>
      </form>
    </div>
  )
}
