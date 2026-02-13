import { useState, useMemo } from 'react'
import { useDataStore } from '../store/dataStore'
import { PRESCRIPTION_MAX_AGE_YEARS } from '../lib/constants'
import { FileCheck, ShoppingBag, AlertCircle, Tag } from 'lucide-react'

export default function CheckoutPage() {
  const {
    customers,
    getValidPrescriptionsForCustomer,
    getCustomerById,
    getOptometristById,
    getOptometristByReferralCode,
    addOrder,
  } = useDataStore()

  const [customerId, setCustomerId] = useState('')
  const [prescriptionId, setPrescriptionId] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [amount, setAmount] = useState('')
  const [placed, setPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const validPrescriptions = useMemo(
    () => (customerId ? getValidPrescriptionsForCustomer(customerId, PRESCRIPTION_MAX_AGE_YEARS) : []),
    [customerId, getValidPrescriptionsForCustomer]
  )

  const selectedPrescription = useMemo(
    () => validPrescriptions.find((p) => p.id === prescriptionId),
    [validPrescriptions, prescriptionId]
  )

  const optometristFromCode = useMemo(
    () => (referralCode.trim() ? getOptometristByReferralCode(referralCode) : null),
    [referralCode, getOptometristByReferralCode]
  )

  const customer = getCustomerById(customerId)
  const optometrist = selectedPrescription
    ? getOptometristById(selectedPrescription.optometristId)
    : optometristFromCode

  const canUsePrescription = !!prescriptionId
  const canUseCode = referralCode.trim() && !!optometristFromCode
  const canPlace = !!customerId && (canUsePrescription || canUseCode) && Number(amount) > 0

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    const numAmount = Number(amount)
    if (!customerId || !numAmount || numAmount <= 0) return
    const order = canUsePrescription
      ? addOrder({ customerId, prescriptionId, amount: numAmount })
      : addOrder({ customerId, referralCode: referralCode.trim(), amount: numAmount })
    if (order) {
      setOrderId(order.id)
      setPlaced(true)
    }
  }

  if (placed && orderId) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4">
            <ShoppingBag size={28} />
          </div>
          <h1 className="text-xl font-semibold text-slate-800 mb-2">Order placed</h1>
          <p className="text-slate-600 text-sm mb-1">Order ID: {orderId}</p>
          <p className="text-slate-600 text-sm">
            Commission is recorded for the referring optometrist (via prescription or referral code).
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Checkout — Glasses / Lenses</h1>
        <p className="text-slate-600 text-sm mb-6">
          Attribute this purchase via a <strong>saved prescription</strong> or a <strong>referral code</strong> from your optometrist. Commission is recorded for the linked optometrist (give 10 / take 10%).
        </p>

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Customer</label>
            <select
              value={customerId}
              onChange={(e) => { setCustomerId(e.target.value); setPrescriptionId('') }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
              required
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Tag size={18} /> Referral code
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 font-mono"
              placeholder="e.g. DRSMITH01"
            />
            {referralCode.trim() && !optometristFromCode && (
              <p className="text-amber-600 text-xs mt-1">Code not found. Check with your optometrist or use a saved prescription below.</p>
            )}
            {optometristFromCode && (
              <p className="text-green-700 text-sm mt-1">Attributing to <strong>{optometristFromCode.name}</strong></p>
            )}
          </div>

          {customerId && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <FileCheck size={18} /> Or use a saved prescription
              </label>
              {validPrescriptions.length === 0 ? (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-sm">
                  <AlertCircle size={18} />
                  No valid prescription for this customer (valid, max {PRESCRIPTION_MAX_AGE_YEARS} years). Use a referral code above instead.
                </div>
              ) : (
                <div className="space-y-2">
                  {validPrescriptions.map((rx) => (
                    <label
                      key={rx.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        prescriptionId === rx.id ? 'border-primary-500 bg-primary-50/50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="prescription"
                        value={rx.id}
                        checked={prescriptionId === rx.id}
                        onChange={() => setPrescriptionId(rx.id)}
                        className="rounded border-slate-300 text-primary-600"
                      />
                      <FileCheck size={18} className="text-slate-500" />
                      <span className="text-slate-800">
                        Valid until {rx.validUntil}
                        {rx.notes && ` · ${rx.notes}`}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {optometrist && !selectedPrescription && (
            <p className="text-sm text-slate-600">
              This order will be linked to <strong>{optometrist.name}</strong> via referral code for commission.
            </p>
          )}
          {selectedPrescription && optometrist && (
            <p className="text-sm text-slate-600">
              This order will be linked to <strong>{optometrist.name}</strong> via prescription for referral commission.
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Order amount ($)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
              placeholder="e.g. 199.00"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!canPlace}
            className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Place order
          </button>
        </form>
      </div>
    </div>
  )
}
