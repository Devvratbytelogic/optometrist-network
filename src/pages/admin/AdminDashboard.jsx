import { Outlet } from 'react-router-dom'
import DashboardNav from '../../components/Layout/DashboardNav'
import { ROLES } from '../../lib/constants'

export default function AdminDashboard() {
  return (
    <div className="flex gap-8">
      <aside className="w-56 shrink-0 py-2">
        <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Admin</p>
          <DashboardNav role={ROLES.ADMIN} />
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
