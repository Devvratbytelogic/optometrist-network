import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useDataStore } from '../../store/dataStore'
import { Save } from 'lucide-react'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const { getOptometristById, updateOptometrist } = useDataStore()
  const opt = getOptometristById(user?.id) || {}

  const [form, setForm] = useState({
    name: '',
    specialty: '',
    address: '',
    languages: '',
    experience: '',
    credentials: '',
  })

  useEffect(() => {
    setForm({
      name: opt.name || user?.name || '',
      specialty: opt.specialty || '',
      address: opt.address || '',
      languages: Array.isArray(opt.languages) ? opt.languages.join(', ') : (opt.languages || ''),
      experience: opt.experience || '',
      credentials: opt.credentials || '',
    })
  }, [opt.id, opt.name, opt.specialty, opt.address, opt.languages, opt.experience, opt.credentials, user?.name])

  const handleSubmit = (e) => {
    e.preventDefault()
    updateOptometrist(user?.id, {
      ...form,
      languages: form.languages ? form.languages.split(',').map((s) => s.trim()).filter(Boolean) : [],
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Profile & business details</h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
          <input
            type="text"
            value={form.specialty}
            onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
            placeholder="e.g. General Optometry"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
            placeholder="Practice address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Spoken languages (comma-separated)</label>
          <input
            type="text"
            value={form.languages}
            onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
            placeholder="English, Spanish, French"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
          <input
            type="text"
            value={form.experience}
            onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
            placeholder="e.g. 15 years"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Credentials</label>
          <input
            type="text"
            value={form.credentials}
            onChange={(e) => setForm((f) => ({ ...f, credentials: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
            placeholder="e.g. OD, FAAO"
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
