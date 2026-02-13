import { useAuthStore } from '../../store/authStore'
import { useDataStore } from '../../store/dataStore'
import { APPOINTMENT_STATUS } from '../../lib/constants'
import { Check, X } from 'lucide-react'
import { format } from 'date-fns'

export default function AppointmentsPage() {
  const user = useAuthStore((s) => s.user)
  const { getAppointmentsByOptometrist, updateAppointmentStatus } = useDataStore()
  const appointments = getAppointmentsByOptometrist(user?.id) || []
  const enquiries = appointments.filter((a) => a.status === APPOINTMENT_STATUS.ENQUIRY)

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Appointments</h1>
      <p className="text-slate-600 text-sm mb-6">Enquiry-based: accept or reject booking requests. Notifications would be sent in production.</p>

      {enquiries.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <h2 className="font-medium text-amber-800 mb-2">{enquiries.length} pending enquiry(ies)</h2>
          <div className="space-y-2">
            {enquiries.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100">
                <div>
                  <span className="font-medium text-slate-800">Customer #{apt.customerId}</span>
                  <span className="text-slate-500 text-sm ml-2">
                    {apt.date} at {apt.slot} ({apt.type})
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateAppointmentStatus(apt.id, APPOINTMENT_STATUS.CONFIRMED)}
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

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Date / Time</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Customer</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Type</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-slate-800">{apt.date} {apt.slot}</td>
                <td className="px-4 py-3 text-slate-600">{apt.customerId}</td>
                <td className="px-4 py-3 text-slate-600 capitalize">{apt.type}</td>
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
