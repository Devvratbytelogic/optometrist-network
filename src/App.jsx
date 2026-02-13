import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import AppLayout from './components/Layout/AppLayout'
import { ROLES } from './lib/constants'

import PublicLayout from './components/Layout/PublicLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import BookPage from './pages/BookPage'
import CheckoutPage from './pages/CheckoutPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOverview from './pages/admin/AdminOverview'
import AdminOptometrists from './pages/admin/AdminOptometrists'
import AdminPlans from './pages/admin/AdminPlans'
import AdminRevenue from './pages/admin/AdminRevenue'

import OptometristDashboard from './pages/optometrist/OptometristDashboard'
import OptometristOverview from './pages/optometrist/OptometristOverview'
import ProfilePage from './pages/optometrist/ProfilePage'
import ServicesPage from './pages/optometrist/ServicesPage'
import WorkingRulesPage from './pages/optometrist/WorkingRulesPage'
import CalendarPage from './pages/optometrist/CalendarPage'
import AppointmentsPage from './pages/optometrist/AppointmentsPage'
import CustomersPage from './pages/optometrist/CustomersPage'
import PrescriptionsPage from './pages/optometrist/PrescriptionsPage'
import MembershipPage from './pages/optometrist/MembershipPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<PublicLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="book" element={<BookPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<AdminDashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path="optometrists" element={<AdminOptometrists />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="revenue" element={<AdminRevenue />} />
          </Route>
        </Route>

        <Route
          path="/optometrist"
          element={
            <ProtectedRoute allowedRoles={[ROLES.OPTOMETRIST]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<OptometristDashboard />}>
            <Route index element={<OptometristOverview />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="working-rules" element={<WorkingRulesPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="prescriptions" element={<PrescriptionsPage />} />
            <Route path="membership" element={<MembershipPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
