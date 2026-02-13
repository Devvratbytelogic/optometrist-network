import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useDataStore } from '../../store/dataStore'
import { PRESCRIPTION_MAX_AGE_YEARS, PRESCRIPTION_SOURCE } from '../../lib/constants'
import { FileText, Plus, Upload } from 'lucide-react'
import { format, addYears } from 'date-fns'

export default function PrescriptionsPage() {
  const user = useAuthStore((s) => s.user)
  const { getPrescriptionsByOptometrist, getCustomersByOptometrist, getCustomerById, addPrescription } = useDataStore()
  const prescriptions = getPrescriptionsByOptometrist(user?.id) || []
  const customers = getCustomersByOptometrist(user?.id) || []

  const [showForm, setShowForm] = useState(false)
  const [uploadMode, setUploadMode] = useState(false) // false = create, true = upload
  const [customerId, setCustomerId] = useState('')
  const [notes, setNotes] = useState('')
  const [validUntil, setValidUntil] = useState(format(addYears(new Date(), PRESCRIPTION_MAX_AGE_YEARS), 'yyyy-MM-dd'))
  const [uploadFileName, setUploadFileName] = useState('')

  const handleCreate = (e) => {
    e.preventDefault()
    if (!customerId) {
      alert('Register the customer first in Customers, then create or upload a prescription.')
      return
    }
    addPrescription({
      customerId,
      optometristId: user?.id,
      source: uploadMode ? PRESCRIPTION_SOURCE.UPLOADED : PRESCRIPTION_SOURCE.CREATED,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      validUntil,
      notes,
      fileUrl: uploadMode && uploadFileName ? `/uploads/${uploadFileName}` : null,
    })
    setCustomerId('')
    setNotes('')
    setValidUntil(format(addYears(new Date(), PRESCRIPTION_MAX_AGE_YEARS), 'yyyy-MM-dd'))
    setUploadFileName('')
    setShowForm(false)
  }

  const isValid = (validUntilStr) => {
    return new Date(validUntilStr) >= new Date()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Prescriptions</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setUploadMode(false); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500"
          >
            <Plus size={18} /> Create
          </button>
          <button
            type="button"
            onClick={() => { setUploadMode(true); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-600 text-primary-600 text-sm font-medium hover:bg-primary-50"
          >
            <Upload size={18} /> Upload
          </button>
        </div>
      </div>
      <p className="text-slate-600 text-sm mb-4">
        Create prescriptions in-dashboard or upload an existing one. Customers must be registered in Customers first. Prescriptions attach to the user profile; at checkout the system suggests a valid prescription (max {PRESCRIPTION_MAX_AGE_YEARS} years).
      </p>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 max-w-md">
          <h2 className="text-lg font-medium text-slate-800 mb-4">{uploadMode ? 'Upload prescription' : 'New prescription'}</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                required
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {customers.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">Register customers in Customers first.</p>
              )}
            </div>
            {uploadMode && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prescription file</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadFileName(e.target.files?.[0]?.name || '')}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 text-sm"
                />
                <p className="text-xs text-slate-500 mt-1">PDF or image. In production this uploads to storage.</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valid until</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Prescription details"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2 rounded-lg bg-primary-600 text-white font-medium">
                {uploadMode ? 'Save uploaded' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Customer</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Source</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Valid until</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {prescriptions.map((rx) => (
              <tr key={rx.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-slate-800 font-medium">{getCustomerById(rx.customerId)?.name ?? rx.customerId}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${rx.source === PRESCRIPTION_SOURCE.UPLOADED ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'}`}>
                    {rx.source === PRESCRIPTION_SOURCE.UPLOADED ? 'Uploaded' : 'Created'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{rx.validUntil}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${isValid(rx.validUntil) ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                    {isValid(rx.validUntil) ? 'Valid' : 'Expired'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{rx.notes || (rx.fileUrl ? 'File attached' : '—')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {prescriptions.length === 0 && (
          <p className="px-4 py-8 text-center text-slate-500 text-sm">No prescriptions yet.</p>
        )}
      </div>
    </div>
  )
}
