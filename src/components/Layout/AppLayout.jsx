import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ROLES } from '../../lib/constants'
import { LogOut, LayoutDashboard, User } from 'lucide-react'

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isAdmin = user?.role === ROLES.ADMIN
  const dashboardPath = isAdmin ? '/admin' : '/optometrist'

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link to={dashboardPath} className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-sm">ON</span>
              Optometrist Network
            </Link>
            <nav className="flex items-center gap-4">
              <Link to={dashboardPath} className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 text-sm">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <span className="text-slate-400 text-sm">{user?.email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 text-sm"
              >
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
