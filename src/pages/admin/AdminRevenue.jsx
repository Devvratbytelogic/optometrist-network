import { useDataStore } from '../../store/dataStore'
import { DollarSign, TrendingUp, User, FileText } from 'lucide-react'

export default function AdminRevenue() {
  const { orders, getOrders, getCustomerById, getOptometristById } = useDataStore()
  const allOrders = getOrders()

  const totalSales = allOrders.reduce((s, o) => s + o.amount, 0)
  const totalPlatformFee = allOrders.reduce((s, o) => s + o.platformFeeAmount, 0)
  const totalCommission = allOrders.reduce((s, o) => s + o.commissionAmount, 0)

  const byOptometrist = allOrders.reduce((acc, o) => {
    if (!acc[o.optometristId]) acc[o.optometristId] = { orders: 0, commission: 0, sales: 0 }
    acc[o.optometristId].orders += 1
    acc[o.optometristId].commission += o.commissionAmount
    acc[o.optometristId].sales += o.amount
    return acc
  }, {})

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Revenue & Commissions</h1>
      <p className="text-slate-600 text-sm mb-6">
        Referral-to-purchase: each order linked to a prescription records commission for the optometrist and platform fee. Percentages are set per plan and can be overridden per optometrist.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-800">${totalSales.toFixed(2)}</p>
            <p className="text-sm text-slate-500">Total sales (orders)</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-800">${totalPlatformFee.toFixed(2)}</p>
            <p className="text-sm text-slate-500">Platform revenue</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <User size={24} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-800">${totalCommission.toFixed(2)}</p>
            <p className="text-sm text-slate-500">Optometrist commissions</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8">
        <h2 className="text-lg font-semibold text-slate-800 p-4 border-b border-slate-200">Commission by optometrist</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Optometrist</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Orders</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Sales</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Commission earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(byOptometrist).map(([optId, data]) => {
                const opt = getOptometristById(optId)
                return (
                  <tr key={optId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-800 font-medium">{opt?.name ?? optId}</td>
                    <td className="px-4 py-3 text-slate-600">{data.orders}</td>
                    <td className="px-4 py-3 text-slate-600">${data.sales.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-600">${data.commission.toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {allOrders.length === 0 && (
          <p className="px-4 py-8 text-center text-slate-500 text-sm">No orders yet. Orders are created at checkout when a prescription is linked.</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <h2 className="text-lg font-semibold text-slate-800 p-4 border-b border-slate-200 flex items-center gap-2">
          <FileText size={20} /> Recent orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Order ID</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Customer</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Via</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Commission %</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Commission</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Platform fee</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...allOrders].reverse().map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-800 font-mono text-sm">{o.id}</td>
                  <td className="px-4 py-3 text-slate-600">{getCustomerById(o.customerId)?.name ?? o.customerId}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {o.referralCode ? <span className="font-mono text-xs">Code: {o.referralCode}</span> : 'Prescription'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">${o.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">{o.commissionPercent}%</td>
                  <td className="px-4 py-3 text-slate-600">${o.commissionAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">${o.platformFeeAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">{o.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allOrders.length === 0 && (
          <p className="px-4 py-8 text-center text-slate-500 text-sm">No orders yet.</p>
        )}
      </div>
    </div>
  )
}
