import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useDataStore } from '../store/dataStore'
import { ROLES } from '../lib/constants'
import { Eye, Mail, Lock } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [role, setRole] = useState(ROLES.OPTOMETRIST)
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)
  const { optometrists } = useDataStore()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Demo: admin login
    if (role === ROLES.ADMIN) {
      if (email === 'admin@network.com' && password === 'admin123') {
        login({ id: 'admin-1', email, name: 'Admin', role: ROLES.ADMIN }, 'demo-token')
        navigate(from.startsWith('/admin') ? from : '/admin', { replace: true })
        return
      }
      setError('Invalid admin credentials. Use admin@network.com / admin123')
      return
    }

    // Demo: optometrist login (match from store)
    const opt = optometrists.find((o) => o.email === email)
    if (opt && password === 'opt123') {
      login(
        {
          id: opt.id,
          email: opt.email,
          name: opt.name,
          role: ROLES.OPTOMETRIST,
          registrationStatus: opt.registrationStatus,
        },
        'demo-token'
      )
      navigate(from.startsWith('/optometrist') ? from : '/optometrist', { replace: true })
      return
    }

    setError('Invalid email or password. Use the email you registered with and password: opt123')
  }

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-center mb-4">
            <span className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center text-white">
              <Eye size={28} />
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 text-center mb-1">Sign in</h1>
          <p className="text-slate-500 text-center text-sm mb-2">Sign in to your account</p>
          <p className="text-slate-400 text-center text-xs mb-6">Optometrist: use your registered email. Demo password: <strong>opt123</strong></p>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 mb-4 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setRole(ROLES.OPTOMETRIST)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  role === ROLES.OPTOMETRIST ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Optometrist
              </button>
              <button
                type="button"
                onClick={() => setRole(ROLES.ADMIN)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  role === ROLES.ADMIN ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Admin
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full mt-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-sm">
            Optometrist? <Link to="/register" className="text-primary-600 hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
