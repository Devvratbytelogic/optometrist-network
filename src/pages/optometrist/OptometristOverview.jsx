import { useAuthStore } from '../../store/authStore'
import { useDataStore } from '../../store/dataStore'
import { REGISTRATION_STATUS } from '../../lib/constants'
import { CalendarCheck, Users, FileText, AlertCircle, DollarSign } from 'lucide-react'

export default function OptometristOverview() {
  const user = useAuthStore((s) => s.user)
  const isPending = user?.registrationStatus === REGISTRATION_STATUS.PENDING
  const { getAppointmentsByOptometrist, getCustomersByOptometrist, getPrescriptionsByOptometrist, getOrdersByOptometrist } = useDataStore()
  const appointments = getAppointmentsByOptometrist(user?.id) || []
  const customers = getCustomersByOptometrist(user?.id) || []
  const prescriptions = getPrescriptionsByOptometrist(user?.id) || []
  const orders = getOrdersByOptometrist(user?.id) || []
  const pendingEnquiries = appointments.filter((a) => a.status === 'enquiry')
  const totalCommission = orders.reduce((s, o) => s + o.commissionAmount, 0)

  return (
    <div>
      {isPending && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="text-amber-600 shrink-0" size={24} />
          <p className="text-amber-800 text-sm">Your registration is pending admin approval. You can complete your profile in the meantime.</p>
        </div>
      )}
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome, {user?.name}</h1>
      <p className="text-slate-600 mb-6">Manage your profile, calendar, and appointments from here.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
            <CalendarCheck size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-800">{appointments.length}</p>
            <p className="text-sm text-slate-500">Appointments</p>
            {pendingEnquiries.length > 0 && (
              <p className="text-xs text-amber-600 mt-0.5">{pendingEnquiries.length} enquiry(ies) to review</p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-800">{customers.length}</p>
            <p className="text-sm text-slate-500">Registered customers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-800">{prescriptions.length}</p>
            <p className="text-sm text-slate-500">Prescriptions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-800">${totalCommission.toFixed(2)}</p>
            <p className="text-sm text-slate-500">Referral commission ({orders.length} orders)</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent activity</h2>
        {pendingEnquiries.length > 0 ? (
          <p className="text-slate-600 text-sm">
            You have {pendingEnquiries.length} appointment enquiry(ies). Go to <strong>Appointments</strong> to accept or reject.
          </p>
        ) : (
          <p className="text-slate-500 text-sm">No pending enquiries. Set your availability in Calendar to receive bookings.</p>
        )}
      </div>
    </div>
  )
}
