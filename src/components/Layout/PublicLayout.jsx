import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ROLES } from '../../lib/constants'
import { LayoutDashboard, LogOut } from 'lucide-react'

export default function PublicLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const dashboardPath = user?.role === ROLES.ADMIN ? '/admin' : '/optometrist'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link to="/" className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-sm">ON</span>
              Optometrist Network
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/" className="text-slate-600 hover:text-primary-600 text-sm">
                Home
              </Link>
              <Link to="/book" className="text-slate-600 hover:text-primary-600 text-sm">
                Book appointment
              </Link>
              {user ? (
                <>
                  <Link to={dashboardPath} className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 text-sm">
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <span className="text-slate-400 text-sm">{user.email}</span>
                  <button type="button" onClick={handleLogout} className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 text-sm">
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 hover:text-primary-600 text-sm">
                    Sign in
                  </Link>
                  <Link to="/register" className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500">
                    Register
                  </Link>
                </>
              )}
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
