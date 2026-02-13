import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useDataStore } from '../../store/dataStore'
import { APPOINTMENT_STATUS } from '../../lib/constants'
import { Check, X, Copy, ExternalLink } from 'lucide-react'

export default function AppointmentsPage() {
  const user = useAuthStore((s) => s.user)
  const { getAppointmentsByOptometrist, getOptometristById, updateAppointmentStatus, updateAppointment } = useDataStore()
  const appointments = getAppointmentsByOptometrist(user?.id) || []
  const enquiries = appointments.filter((a) => a.status === APPOINTMENT_STATUS.ENQUIRY)
  const opt = getOptometristById(user?.id) || {}

  const [acceptModal, setAcceptModal] = useState(null)
  const [meetingLinkInput, setMeetingLinkInput] = useState('')

  const openAcceptModal = (apt) => {
    const isOnline = apt.type === 'online'
    setAcceptModal(apt)
    setMeetingLinkInput(isOnline ? (apt.meetingLink || opt.onlineMeetingLink || '') : '')
  }

  const closeAcceptModal = () => {
    setAcceptModal(null)
    setMeetingLinkInput('')
  }

  const handleAccept = () => {
    if (!acceptModal) return
    const isOnline = acceptModal.type === 'online'
    if (isOnline && !meetingLinkInput.trim()) {
      return
    }
    if (isOnline) {
      updateAppointment(acceptModal.id, { status: APPOINTMENT_STATUS.CONFIRMED, meetingLink: meetingLinkInput.trim() })
    } else {
      updateAppointmentStatus(acceptModal.id, APPOINTMENT_STATUS.CONFIRMED)
    }
    closeAcceptModal()
  }

  const copyMeetingLink = (link) => {
    if (link) {
      navigator.clipboard.writeText(link)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Appointments</h1>
      <p className="text-slate-600 text-sm mb-6">
        Enquiry-based: accept or reject booking requests. For online consultations, you must enter the meeting link when accepting.
      </p>

      {enquiries.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <h2 className="font-medium text-amber-800 mb-2">{enquiries.length} pending enquiry(ies)</h2>
          <div className="space-y-2">
            {enquiries.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100">
                <div>
                  <span className="font-medium text-slate-800">{apt.customerName || apt.customerId}</span>
                  <span className="text-slate-500 text-sm ml-2">
                    {apt.date} at {apt.slot} ({apt.type})
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openAcceptModal(apt)}
                    className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                    title="Accept"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAppointmentStatus(apt.id, APPOINTMENT_STATUS.REJECTED)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                    title="Reject"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {acceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeAcceptModal}>
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Accept appointment</h3>
            <p className="text-slate-600 text-sm mb-4">
              {acceptModal.customerName || acceptModal.customerId} · {acceptModal.date} at {acceptModal.slot} ({acceptModal.type})
            </p>
            {acceptModal.type === 'online' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Meeting link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={meetingLinkInput}
                  onChange={(e) => setMeetingLinkInput(e.target.value)}
                  placeholder="https://meet.example.com/your-room"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">This link will be stored with the booking and can be shared with the patient.</p>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={closeAcceptModal}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAccept}
                disabled={acceptModal.type === 'online' && !meetingLinkInput.trim()}
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm accept
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Date / Time</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Customer</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Type</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Meeting link</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-slate-800">{apt.date} {apt.slot}</td>
                <td className="px-4 py-3 text-slate-600">{apt.customerName || apt.customerId}</td>
                <td className="px-4 py-3 text-slate-600 capitalize">{apt.type}</td>
                <td className="px-4 py-3">
                  {apt.type === 'online' ? (
                    apt.meetingLink ? (
                      <span className="flex items-center gap-1.5">
                        <a
                          href={apt.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline truncate max-w-45"
                        >
                          {apt.meetingLink}
                        </a>
                        <button
                          type="button"
                          onClick={() => copyMeetingLink(apt.meetingLink)}
                          className="p-1 rounded text-slate-500 hover:bg-slate-100"
                          title="Copy link"
                        >
                          <Copy size={14} />
                        </button>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm">—</span>
                    )
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      apt.status === APPOINTMENT_STATUS.CONFIRMED
                        ? 'bg-green-100 text-green-800'
                        : apt.status === APPOINTMENT_STATUS.ENQUIRY
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <p className="px-4 py-8 text-center text-slate-500 text-sm">No appointments yet.</p>
        )}
      </div>
    </div>
  )
}
