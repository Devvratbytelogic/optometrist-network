import { useState, useEffect } from 'react'
import { useDataStore } from '../../store/dataStore'
import { CreditCard, Pencil, X } from 'lucide-react'

export default function AdminPlans() {
  const { plans, optometrists, updatePlan } = useDataStore()
  const [editingPlan, setEditingPlan] = useState(null)
  const [form, setForm] = useState({
    name: '',
    price: 0,
    priceMonthly: null,
    priceYearly: null,
    platformFeePercent: 20,
    commissionPercent: 0,
    featuresText: '',
  })

  useEffect(() => {
    if (editingPlan) {
      setForm({
        name: editingPlan.name,
        price: editingPlan.price ?? 0,
        priceMonthly: editingPlan.priceMonthly ?? '',
        priceYearly: editingPlan.priceYearly ?? '',
        platformFeePercent: editingPlan.platformFeePercent ?? 20,
        commissionPercent: editingPlan.commissionPercent ?? 0,
        featuresText: (editingPlan.features || []).join('\n'),
      })
    }
  }, [editingPlan])

  const handleSavePlan = (e) => {
    e.preventDefault()
    if (!editingPlan) return
    const features = form.featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    const isFree = form.price === 0 && (form.priceMonthly === '' || form.priceMonthly == null)
    updatePlan(editingPlan.id, {
      name: form.name.trim(),
      price: isFree ? 0 : undefined,
      priceMonthly: isFree ? null : Number(form.priceMonthly) || null,
      priceYearly: isFree ? null : Number(form.priceYearly) || null,
      platformFeePercent: Number(form.platformFeePercent) || 0,
      commissionPercent: Number(form.commissionPercent) || 0,
      features,
    })
    setEditingPlan(null)
  }

  const getOptometristCount = (planId) =>
    optometrists.filter((o) => (o.planId || 'freemium') === planId).length

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Membership Plans</h1>
      <p className="text-slate-600 mb-6 text-sm">
        Freemium: $0, Basic Dashboard, 20% platform fee. Paid: monthly/yearly price, advanced dashboard, better commission, reporting, lower platform fee (e.g. 10%). Edit a plan below to change name, prices, commission % and platform fee %.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {plans.map((p) => {
          const count = getOptometristCount(p.id)
          return (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                    <CreditCard size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800">{p.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingPlan(p)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                  title="Edit plan"
                >
                  <Pencil size={18} />
                </button>
              </div>
              <div className="space-y-1 text-sm text-slate-600 mb-4">
                {p.price === 0 && p.priceMonthly == null && <p>Price: Free</p>}
                {p.priceMonthly != null && (
                  <p>Monthly: ${p.priceMonthly} | Yearly: ${p.priceYearly ?? 0}</p>
                )}
                <p>Platform fee: {p.platformFeePercent}%</p>
                <p>Commission: {p.commissionPercent}% (customer & optometrist)</p>
                {count > 0 && (
                  <p className="text-slate-500">{count} optometrist{count !== 1 ? 's' : ''} on this plan</p>
                )}
              </div>
              <ul className="text-sm text-slate-500 space-y-1">
                {p.features?.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setEditingPlan(null)}>
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Edit plan: {editingPlan.name}</h2>
              <button type="button" onClick={() => setEditingPlan(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePlan} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plan name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Free plan?</label>
                <select
                  value={form.price === 0 && (form.priceMonthly === '' || form.priceMonthly == null) ? 'yes' : 'no'}
                  onChange={(e) => {
                    const isFree = e.target.value === 'yes'
                    setForm((f) => ({
                      ...f,
                      price: isFree ? 0 : f.price,
                      priceMonthly: isFree ? '' : (f.priceMonthly ?? 29),
                      priceYearly: isFree ? '' : (f.priceYearly ?? 290),
                    }))
                  }}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                >
                  <option value="yes">Yes (Freemium)</option>
                  <option value="no">No (Paid)</option>
                </select>
              </div>
              {form.price !== 0 || form.priceMonthly !== '' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price monthly ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.priceMonthly === null ? '' : form.priceMonthly}
                      onChange={(e) => setForm((f) => ({ ...f, priceMonthly: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price yearly ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.priceYearly === null ? '' : form.priceYearly}
                      onChange={(e) => setForm((f) => ({ ...f, priceYearly: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                    />
                  </div>
                </>
              ) : null}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform fee (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={form.platformFeePercent}
                  onChange={(e) => setForm((f) => ({ ...f, platformFeePercent: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Commission (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={form.commissionPercent}
                  onChange={(e) => setForm((f) => ({ ...f, commissionPercent: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                />
                <p className="text-xs text-slate-500 mt-1">Applied to customer and optometrist; admin can override per optometrist.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Features (one per line)</label>
                <textarea
                  value={form.featuresText}
                  onChange={(e) => setForm((f) => ({ ...f, featuresText: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                  placeholder="Basic Dashboard&#10;Advanced dashboard&#10;Reporting"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditingPlan(null)} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500">
                  Save plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
