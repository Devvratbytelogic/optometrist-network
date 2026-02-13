import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useDataStore } from '../store/dataStore'
import { ROLES, REGISTRATION_STATUS } from '../lib/constants'
import { Eye, Mail, Lock, User } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const addOptometrist = useDataStore((s) => s.addOptometrist)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const newOpt = {
      email,
      name,
      role: ROLES.OPTOMETRIST,
      registrationStatus: REGISTRATION_STATUS.PENDING,
      planId: 'freemium',
      specialty: '',
      address: '',
      languages: [],
      experience: '',
      credentials: '',
      visitType: 'offline',
      consultationFee: 0,
      slotDurationMinutes: 30,
      dailyCapacity: 5,
      onlineMeetingLink: '',
      availability: {},
      timeOff: [],
      commissionPercent: 0,
      platformFeePercent: 20,
    }
    addOptometrist(newOpt)
    setSuccess(true)
    // Optional: auto-login as pending user
    const added = useDataStore.getState().optometrists.find((o) => o.email === email)
    if (added) {
      login(
        { id: added.id, email: added.email, name: added.name, role: ROLES.OPTOMETRIST, registrationStatus: REGISTRATION_STATUS.PENDING },
        'demo-token'
      )
      setTimeout(() => navigate('/optometrist'), 2000)
    }
  }

  if (success) {
    return (
      <div className="flex justify-center py-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-md">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">✓</div>
          <h1 className="text-xl font-semibold text-slate-800 mb-2 text-center">Registration Submitted</h1>
          <p className="text-slate-600 mb-4 text-center">
            Your account is pending admin approval. You will be redirected to your dashboard; access to full features will be enabled after approval.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-left">
            <p className="text-sm font-medium text-slate-800 mb-1">How to log in later</p>
            <p className="text-sm text-slate-600">
              Go to <strong>Sign in</strong> (top right), choose <strong>Optometrist</strong>, then use the <strong>email you just registered</strong> and password: <strong>opt123</strong> (demo).
            </p>
          </div>
          <p className="text-sm text-slate-500 text-center mt-4">Redirecting...</p>
        </div>
      </div>
    )
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
          <h1 className="text-xl font-bold text-slate-800 text-center mb-1">Optometrist Registration</h1>
          <p className="text-slate-500 text-center text-sm mb-6">Create an account. Admin approval required.</p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Dr. Jane Smith"
                    required
                  />
                </div>
              </div>
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-sm">
            Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
