import { useDataStore } from '../../store/dataStore'
import { REGISTRATION_STATUS } from '../../lib/constants'
import { Users, UserCheck, UserX, CreditCard } from 'lucide-react'

export default function AdminOverview() {
  const { optometrists, plans } = useDataStore()
  const pending = optometrists.filter((o) => o.registrationStatus === REGISTRATION_STATUS.PENDING)
  const approved = optometrists.filter((o) => o.registrationStatus === REGISTRATION_STATUS.APPROVED)

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-800">{optometrists.length}</p>
            <p className="text-sm text-slate-500">Total Optometrists</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-800">{pending.length}</p>
            <p className="text-sm text-slate-500">Pending Approval</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-800">{approved.length}</p>
            <p className="text-sm text-slate-500">Approved</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-800">{plans.length}</p>
            <p className="text-sm text-slate-500">Membership Plans</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick actions</h2>
        <p className="text-slate-600 text-sm">
          Use the sidebar to manage optometrists (approve/reject, register on behalf), and configure membership plans and commission percentages per optometrist.
        </p>
      </div>
    </div>
  )
}
