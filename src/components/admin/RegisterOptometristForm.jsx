import { useState } from 'react'
import { useDataStore } from '../../store/dataStore'
import { REGISTRATION_STATUS } from '../../lib/constants'
import { X } from 'lucide-react'

export default function RegisterOptometristForm({ onClose, onSuccess }) {
  const addOptometrist = useDataStore((s) => s.addOptometrist)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [approveImmediately, setApproveImmediately] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    addOptometrist({
      email,
      name,
      role: 'optometrist',
      registrationStatus: approveImmediately ? REGISTRATION_STATUS.APPROVED : REGISTRATION_STATUS.PENDING,
      planId: 'freemium',
      specialty: '',
      address: '',
      languages: [],
      experience: '',
      credentials: '',
      visitType: 'offline',
      consultationFee: 0,
      slotDurationMinutes: 30,
      dailyCapacity: 5,
      onlineMeetingLink: '',
      availability: {},
      timeOff: [],
      commissionPercent: 0,
      platformFeePercent: 20,
    })
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Register optometrist on behalf</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
              placeholder="Dr. Jane Smith"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
              placeholder="dr@example.com"
              required
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={approveImmediately}
              onChange={(e) => setApproveImmediately(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">Approve immediately</span>
          </label>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
