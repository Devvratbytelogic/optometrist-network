import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useDataStore } from '../../store/dataStore'
import { UserPlus } from 'lucide-react'

export default function CustomersPage() {
  const user = useAuthStore((s) => s.user)
  const { getCustomersByOptometrist, addCustomer } = useDataStore()
  const customers = getCustomersByOptometrist(user?.id) || []

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleRegister = (e) => {
    e.preventDefault()
    addCustomer({ name, email, phone, registeredBy: user?.id })
    setName('')
    setEmail('')
    setPhone('')
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500"
        >
          <UserPlus size={18} /> Register customer
        </button>
      </div>
      <p className="text-slate-600 text-sm mb-4">
        Register customers in the system to upload prescriptions for them. Required before adding a prescription.
      </p>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 max-w-md">
          <h2 className="text-lg font-medium text-slate-800 mb-4">Register new customer</h2>
          <form onSubmit={handleRegister} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
              required
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2 rounded-lg bg-primary-600 text-white font-medium">
                Register
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Name</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Email</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-slate-800 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-slate-600">{c.email}</td>
                <td className="px-4 py-3 text-slate-600">{c.phone || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <p className="px-4 py-8 text-center text-slate-500 text-sm">No customers registered yet.</p>
        )}
      </div>
    </div>
  )
}
