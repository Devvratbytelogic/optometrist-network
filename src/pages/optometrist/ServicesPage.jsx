import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useDataStore } from '../../store/dataStore'
import { SERVICE_TYPES, SERVICE_LABELS } from '../../lib/constants'
import { Save } from 'lucide-react'

const SERVICE_KEYS = Object.keys(SERVICE_LABELS)

export default function ServicesPage() {
  const user = useAuthStore((s) => s.user)
  const { getOptometristById, updateOptometrist } = useDataStore()
  const opt = getOptometristById(user?.id) || {}

  const [enabledServices, setEnabledServices] = useState([])
  const [onlineMeetingLink, setOnlineMeetingLink] = useState('')

  useEffect(() => {
    setEnabledServices(opt.enabledServices || [SERVICE_TYPES.IN_PERSON_EXAM])
    setOnlineMeetingLink(opt.onlineMeetingLink || '')
  }, [opt.id, opt.enabledServices, opt.onlineMeetingLink])

  const toggle = (key) => {
    setEnabledServices((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const hasOnline = enabledServices.includes(SERVICE_TYPES.ONLINE_CONSULTATION)
    if (hasOnline && !onlineMeetingLink.trim()) {
      alert('Meeting link is required when offering online consultations.')
      return
    }
    updateOptometrist(user?.id, { enabledServices, onlineMeetingLink: onlineMeetingLink.trim() })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Services</h1>
      <p className="text-slate-600 text-sm mb-6">
        Select the services you offer. If you offer online consultations, a meeting link is required.
      </p>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Services offered</label>
          <div className="space-y-2">
            {SERVICE_KEYS.map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabledServices.includes(key)}
                  onChange={() => toggle(key)}
                  className="rounded border-slate-300"
                />
                <span className="text-slate-800">{SERVICE_LABELS[key]}</span>
              </label>
            ))}
          </div>
        </div>

        {enabledServices.includes(SERVICE_TYPES.ONLINE_CONSULTATION) && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Online consultation meeting link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={onlineMeetingLink}
              onChange={(e) => setOnlineMeetingLink(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
              placeholder="https://meet.example.com/your-room"
              required={enabledServices.includes(SERVICE_TYPES.ONLINE_CONSULTATION)}
            />
            <p className="text-xs text-slate-500 mt-1">Used when accepting online consultation bookings.</p>
          </div>
        )}

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
