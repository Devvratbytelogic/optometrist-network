import { useAuthStore } from '../../store/authStore'
import { useDataStore } from '../../store/dataStore'
import { CreditCard, Check, ArrowRight, Tag, Copy } from 'lucide-react'
import { useState } from 'react'

export default function MembershipPage() {
  const user = useAuthStore((s) => s.user)
  const { getOptometristById, plans, updateOptometrist } = useDataStore()
  const opt = getOptometristById(user?.id) || {}
  const currentPlanId = opt.planId || 'freemium'
  const currentPlan = plans.find((p) => p.id === currentPlanId) || plans[0]

  const handleSelectPlan = (plan) => {
    updateOptometrist(user?.id, {
      planId: plan.id,
      platformFeePercent: plan.platformFeePercent,
      commissionPercent: plan.commissionPercent,
    })
  }

  const getActionLabel = (plan) => {
    if (plan.id === currentPlanId) return null
    const onFree = currentPlanId === 'freemium'
    if (plan.id === 'freemium' || plan.price === 0) return 'Switch to Freemium'
    if (onFree) return 'Upgrade to this plan'
    return 'Switch to this plan'
  }

  const priceLabel = (p) =>
    p.price === 0 && (p.priceMonthly == null || p.priceMonthly === 0)
      ? 'Free'
      : `$${p.priceMonthly ?? p.price}/mo or $${p.priceYearly ?? 0}/yr`

  const referralCode = opt.referralCode || ''
  const [copied, setCopied] = useState(false)
  const copyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Manage your membership</h1>
      <p className="text-slate-600 text-sm mb-6">
        View your current plan and switch or upgrade anytime. Admin can override your commission % in their dashboard.
      </p>

      {/* Current plan summary */}
      <div className="mb-8 p-5 rounded-xl border-2 border-primary-200 bg-primary-50/40 max-w-3xl">
        <p className="text-xs font-medium text-primary-700 uppercase tracking-wide mb-2">Your current plan</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{currentPlan?.name ?? 'Freemium'}</p>
              <p className="text-sm text-slate-600">{priceLabel(currentPlan)}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-medium">
            <Check size={12} /> Active
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-3">
          Platform fee {opt.platformFeePercent ?? currentPlan?.platformFeePercent ?? 20}% · Commission {opt.commissionPercent ?? currentPlan?.commissionPercent ?? 0}%
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Change your plan below. Upgrading gives you a better commission and lower platform fee.
        </p>
      </div>

      {referralCode && (
        <div className="mb-8 p-5 rounded-xl border-2 border-slate-200 bg-slate-50/50 max-w-3xl">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-2">
            <Tag size={14} /> Your referral code
          </p>
          <p className="text-slate-600 text-sm mb-2">
            Share this code with patients. When they buy glasses/lenses at checkout and enter this code, you get commission (give 10 / take 10%).
          </p>
          <div className="flex items-center gap-2">
            <code className="px-3 py-2 rounded-lg bg-white border border-slate-200 font-mono text-lg font-semibold text-slate-800">
              {referralCode}
            </code>
            <button
              type="button"
              onClick={copyCode}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
              title="Copy code"
            >
              <Copy size={18} />
            </button>
            {copied && <span className="text-sm text-green-600">Copied!</span>}
          </div>
        </div>
      )}
      {!referralCode && (
        <div className="mb-8 p-4 rounded-xl border border-amber-200 bg-amber-50/50 max-w-3xl text-amber-800 text-sm">
          You don’t have a referral code yet. Ask admin to add one in Optometrists → Edit so patients can attribute purchases to you at checkout.
        </div>
      )}

      <h2 className="text-lg font-semibold text-slate-800 mb-3">Available plans</h2>
      <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
        {plans.map((p) => {
          const isCurrent = currentPlanId === p.id
          const actionLabel = getActionLabel(p)
          return (
            <div
              key={p.id}
              className={`rounded-xl border-2 p-6 transition-colors ${
                isCurrent ? 'border-primary-500 bg-primary-50/30' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                    <CreditCard size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">{p.name}</h3>
                </div>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 text-xs font-medium">
                    <Check size={12} /> Current
                  </span>
                )}
              </div>
              <p className="text-slate-600 text-sm mb-2 font-medium">{priceLabel(p)}</p>
              <p className="text-slate-500 text-xs mb-3">
                Platform fee {p.platformFeePercent}% · Commission {p.commissionPercent}%
              </p>
              <ul className="text-sm text-slate-600 space-y-1 mb-4">
                {p.features?.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
              {actionLabel && (
                <button
                  type="button"
                  onClick={() => handleSelectPlan(p)}
                  className="w-full py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 inline-flex items-center justify-center gap-1.5"
                >
                  {actionLabel}
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
