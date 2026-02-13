import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ROLES, REGISTRATION_STATUS } from '../lib/constants'

export function ProtectedRoute({ children, allowedRoles, requireApproved }) {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  if (requireApproved && user.role === ROLES.OPTOMETRIST && user.registrationStatus !== REGISTRATION_STATUS.APPROVED) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-md text-center">
          <h1 className="text-xl font-semibold text-slate-800 mb-2">Registration Pending</h1>
          <p className="text-slate-600 mb-4">
            Your account is awaiting admin approval. You will be able to access the dashboard once approved.
          </p>
          <p className="text-sm text-slate-500">Contact support if this takes longer than expected.</p>
        </div>
      </div>
    )
  }

  return children
}
