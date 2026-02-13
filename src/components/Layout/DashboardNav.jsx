import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Settings,
  Calendar,
  CalendarCheck,
  Users,
  CreditCard,
  DollarSign,
} from 'lucide-react'
import { ROLES } from '../../lib/constants'

const optometristNav = [
  { to: '.', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: 'profile', label: 'Profile & Business', icon: User },
  { to: 'services', label: 'Services', icon: Briefcase },
  { to: 'working-rules', label: 'Working Rules', icon: Settings },
  { to: 'calendar', label: 'Availability', icon: Calendar },
  { to: 'appointments', label: 'Appointments', icon: CalendarCheck },
  { to: 'customers', label: 'Customers', icon: Users },
  { to: 'prescriptions', label: 'Prescriptions', icon: FileText },
  { to: 'membership', label: 'Membership', icon: CreditCard },
]

const adminNav = [
  { to: '.', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: 'optometrists', label: 'Optometrists', icon: Users },
  { to: 'plans', label: 'Membership Plans', icon: CreditCard },
  { to: 'revenue', label: 'Revenue & Commissions', icon: DollarSign },
]

export default function DashboardNav({ role }) {
  const items = role === ROLES.ADMIN ? adminNav : optometristNav

  return (
    <nav className="flex flex-col gap-0.5">
      {items.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive ? 'bg-primary-100 text-primary-800 font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
