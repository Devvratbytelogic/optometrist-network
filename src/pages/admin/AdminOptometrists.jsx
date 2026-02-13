import { useState } from 'react'
import { useDataStore } from '../../store/dataStore'
import { REGISTRATION_STATUS } from '../../lib/constants'
import { Check, X, UserPlus, Pencil } from 'lucide-react'
import RegisterOptometristForm from '../../components/admin/RegisterOptometristForm'
import EditOptometristForm from '../../components/admin/EditOptometristForm'

export default function AdminOptometrists() {
  const { optometrists, setOptometristApproval, updateOptometrist } = useDataStore()
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [editingOptometrist, setEditingOptometrist] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = optometrists.filter((o) => {
    if (filter === 'pending') return o.registrationStatus === REGISTRATION_STATUS.PENDING
    if (filter === 'approved') return o.registrationStatus === REGISTRATION_STATUS.APPROVED
    return true
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Optometrists</h1>
          <p className="text-slate-500 text-sm mt-1">Edit any row: use the pencil to open details; set Platform fee % and Commission % per optometrist. Approve or reject pending registrations.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
          <button
            type="button"
            onClick={() => setShowRegisterForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500"
          >
            <UserPlus size={18} /> Register on behalf
          </button>
        </div>
      </div>

      {showRegisterForm && (
        <RegisterOptometristForm
          onClose={() => setShowRegisterForm(false)}
          onSuccess={() => setShowRegisterForm(false)}
        />
      )}
      {editingOptometrist && (
        <EditOptometristForm
          optometrist={editingOptometrist}
          onClose={() => setEditingOptometrist(null)}
          onSuccess={() => setEditingOptometrist(null)}
        />
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Name</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Email</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Plan</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Platform fee %</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Commission %</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Referral code</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-slate-800 font-medium">{o.name}</td>
                <td className="px-4 py-3 text-slate-600">{o.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      o.registrationStatus === REGISTRATION_STATUS.APPROVED
                        ? 'bg-green-100 text-green-800'
                        : o.registrationStatus === REGISTRATION_STATUS.PENDING
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {o.registrationStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{o.planId || 'freemium'}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={o.platformFeePercent ?? 20}
                    onChange={(e) => updateOptometrist(o.id, { platformFeePercent: Number(e.target.value) ?? 0 })}
                    className="w-14 rounded border border-slate-200 px-2 py-1 text-sm"
                    title="Platform fee %"
                  />
                  %
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={o.commissionPercent ?? 0}
                    onChange={(e) => updateOptometrist(o.id, { commissionPercent: Number(e.target.value) || 0 })}
                    className="w-14 rounded border border-slate-200 px-2 py-1 text-sm"
                    title="Commission %"
                  />
                  %
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-slate-700">{o.referralCode || '—'}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingOptometrist(o)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    {o.registrationStatus === REGISTRATION_STATUS.PENDING && (
                      <>
                        <button
                          type="button"
                          onClick={() => setOptometristApproval(o.id, REGISTRATION_STATUS.APPROVED)}
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setOptometristApproval(o.id, REGISTRATION_STATUS.REJECTED)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                    {o.registrationStatus === REGISTRATION_STATUS.APPROVED && (
                      <button
                        type="button"
                        onClick={() => setOptometristApproval(o.id, REGISTRATION_STATUS.PENDING)}
                        className="text-sm text-slate-500 hover:text-slate-700"
                        title="Revoke approval"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
