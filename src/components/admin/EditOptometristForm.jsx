import { useState, useEffect } from 'react'
import { useDataStore } from '../../store/dataStore'
import { REGISTRATION_STATUS } from '../../lib/constants'
import { X } from 'lucide-react'

export default function EditOptometristForm({ optometrist, onClose, onSuccess }) {
  const { plans, updateOptometrist } = useDataStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [planId, setPlanId] = useState('freemium')
  const [registrationStatus, setRegistrationStatus] = useState(REGISTRATION_STATUS.PENDING)
  const [commissionPercentOverride, setCommissionPercentOverride] = useState('')
  const [platformFeePercentOverride, setPlatformFeePercentOverride] = useState('')
  const [referralCode, setReferralCode] = useState('')

  useEffect(() => {
    if (optometrist) {
      setName(optometrist.name || '')
      setEmail(optometrist.email || '')
      setSpecialty(optometrist.specialty || '')
      setPlanId(optometrist.planId || 'freemium')
      setRegistrationStatus(optometrist.registrationStatus || REGISTRATION_STATUS.PENDING)
      setCommissionPercentOverride(optometrist.commissionPercent != null ? String(optometrist.commissionPercent) : '')
      setPlatformFeePercentOverride(optometrist.platformFeePercent != null ? String(optometrist.platformFeePercent) : '')
      setReferralCode(optometrist.referralCode || '')
    }
  }, [optometrist])

  if (!optometrist) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedPlan = plans.find((p) => p.id === planId)
    updateOptometrist(optometrist.id, {
      name: name.trim(),
      email: email.trim(),
      specialty: specialty.trim(),
      planId,
      registrationStatus,
      commissionPercent: commissionPercentOverride === '' ? null : Number(commissionPercentOverride),
      platformFeePercent: platformFeePercentOverride === '' ? null : Number(platformFeePercentOverride),
      referralCode: referralCode.trim() || null,
    })
    onSuccess?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Edit optometrist</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
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
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
              placeholder="e.g. General Optometry"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Membership plan</label>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Registration status</label>
            <select
              value={registrationStatus}
              onChange={(e) => setRegistrationStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
            >
              <option value={REGISTRATION_STATUS.PENDING}>Pending</option>
              <option value={REGISTRATION_STATUS.APPROVED}>Approved</option>
              <option value={REGISTRATION_STATUS.REJECTED}>Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Referral code</label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 font-mono"
              placeholder="e.g. DRSMITH01"
            />
            <p className="text-xs text-slate-500 mt-1">Unique code for referral-to-purchase. Patients enter this at checkout to attribute the sale to this optometrist. Leave empty to use prescription link only.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Commission % (override)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={commissionPercentOverride}
              onChange={(e) => setCommissionPercentOverride(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
              placeholder={`Plan default: ${plans.find((p) => p.id === planId)?.commissionPercent ?? 0}%`}
            />
            <p className="text-xs text-slate-500 mt-1">Leave empty to use plan default. Give 10 / take 10 per optometrist.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Platform fee % (override)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={platformFeePercentOverride}
              onChange={(e) => setPlatformFeePercentOverride(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
              placeholder={`Plan default: ${plans.find((p) => p.id === planId)?.platformFeePercent ?? 20}%`}
            />
            <p className="text-xs text-slate-500 mt-1">Leave empty to use plan default.</p>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
