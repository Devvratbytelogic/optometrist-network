import { create } from 'zustand'
import { REGISTRATION_STATUS, APPOINTMENT_STATUS, PLAN_IDS } from '../lib/constants'

// Mock persistent store - in production this would be API calls
const initialOptometrists = [
  {
    id: 'opt-1',
    email: 'dr.smith@eye.com',
    name: 'Dr. Jane Smith',
    role: 'optometrist',
    registrationStatus: REGISTRATION_STATUS.APPROVED,
    planId: PLAN_IDS.PAID,
    specialty: 'General Optometry',
    address: '123 Vision St, City',
    languages: ['English', 'Spanish'],
    experience: '15 years',
    credentials: 'OD, FAAO',
    visitType: 'both',
    consultationFee: 75,
    slotDurationMinutes: 30,
    dailyCapacity: 5,
    onlineMeetingLink: 'https://meet.example.com/dr-smith',
    enabledServices: ['in_person_eye_exam', 'online_consultation', 'follow_up', 'lens_frame_advice'],
    availability: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: null,
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '15:00' },
      saturday: null,
      sunday: null,
    },
    timeOff: [],
    commissionPercent: 10,
    platformFeePercent: 10,
    referralCode: 'DRSMITH01',
  },
  {
    id: 'opt-2',
    email: 'pending@eye.com',
    name: 'Dr. Pending User',
    role: 'optometrist',
    registrationStatus: REGISTRATION_STATUS.PENDING,
    planId: PLAN_IDS.FREEMIUM,
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
    enabledServices: [],
    availability: {},
    timeOff: [],
    commissionPercent: 0,
    platformFeePercent: 20,
    referralCode: '',
  },
]

const initialPlans = [
  { id: PLAN_IDS.FREEMIUM, name: 'Freemium', price: 0, priceYearly: 0, platformFeePercent: 20, commissionPercent: 0, features: ['Basic Dashboard'] },
  { id: PLAN_IDS.PAID, name: 'Professional', priceMonthly: 29, priceYearly: 290, platformFeePercent: 10, commissionPercent: 10, features: ['Advanced dashboard', 'Better commission', 'Reporting', 'Lower platform fee'] },
]

const initialCustomers = [
  { id: 'cust-1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890', registeredBy: 'opt-1' },
]

const initialPrescriptions = [
  { id: 'rx-1', customerId: 'cust-1', optometristId: 'opt-1', source: 'created', createdAt: '2024-06-01', validUntil: '2026-06-01', notes: 'Standard prescription', fileUrl: null },
]

const initialAppointments = [
  { id: 'apt-1', customerId: 'cust-1', optometristId: 'opt-1', date: '2025-02-15', slot: '10:00', type: 'online', status: APPOINTMENT_STATUS.ENQUIRY, meetingLink: 'https://meet.example.com/dr-smith' },
]

// Orders (glasses/lenses purchases) linked to prescription → optometrist commission
const initialOrders = []

export const useDataStore = create((set, get) => ({
  optometrists: initialOptometrists,
  plans: initialPlans,
  customers: initialCustomers,
  prescriptions: initialPrescriptions,
  appointments: initialAppointments,
  orders: initialOrders,

  addOptometrist: (data) => set((s) => ({
    optometrists: [...s.optometrists, { ...data, id: 'opt-' + Date.now(), registrationStatus: data.registrationStatus || REGISTRATION_STATUS.PENDING }],
  })),

  updateOptometrist: (id, data) => set((s) => ({
    optometrists: s.optometrists.map((o) => (o.id === id ? { ...o, ...data } : o)),
  })),

  setOptometristApproval: (id, status) => set((s) => ({
    optometrists: s.optometrists.map((o) => (o.id === id ? { ...o, registrationStatus: status } : o)),
  })),

  addCustomer: (data) => set((s) => ({
    customers: [...s.customers, { ...data, id: 'cust-' + Date.now() }],
  })),

  addPrescription: (data) => set((s) => ({
    prescriptions: [...s.prescriptions, { source: 'created', ...data, id: 'rx-' + Date.now() }],
  })),

  addAppointment: (data) => set((s) => ({
    appointments: [...s.appointments, { ...data, id: 'apt-' + Date.now(), status: APPOINTMENT_STATUS.ENQUIRY }],
  })),

  updateAppointmentStatus: (id, status) => set((s) => ({
    appointments: s.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
  })),

  updateAppointment: (id, data) => set((s) => ({
    appointments: s.appointments.map((a) => (a.id === id ? { ...a, ...data } : a)),
  })),

  updatePlan: (id, data) => set((s) => ({
    plans: s.plans.map((p) => (p.id === id ? { ...p, ...data } : p)),
  })),

  // Effective commission/platform fee: optometrist override if set, else from plan
  getEffectiveRates: (optometristId) => {
    const opt = get().optometrists.find((o) => o.id === optometristId)
    if (!opt) return { commissionPercent: 0, platformFeePercent: 0 }
    const plan = get().plans.find((p) => p.id === (opt.planId || 'freemium'))
    return {
      commissionPercent: typeof opt.commissionPercent === 'number' ? opt.commissionPercent : (plan?.commissionPercent ?? 0),
      platformFeePercent: typeof opt.platformFeePercent === 'number' ? opt.platformFeePercent : (plan?.platformFeePercent ?? 20),
    }
  },

  addOrder: ({ customerId, prescriptionId, referralCode, amount }) => {
    let optometristId = null
    let orderPrescriptionId = null
    let orderReferralCode = null

    if (prescriptionId) {
      const prescription = get().prescriptions.find((p) => p.id === prescriptionId)
      if (!prescription || prescription.customerId !== customerId) return null
      optometristId = prescription.optometristId
      orderPrescriptionId = prescriptionId
    } else if (referralCode) {
      const opt = get().getOptometristByReferralCode(referralCode)
      if (!opt) return null
      optometristId = opt.id
      orderReferralCode = referralCode
    } else {
      return null
    }

    const { commissionPercent, platformFeePercent } = get().getEffectiveRates(optometristId)
    const commissionAmount = Math.round((amount * commissionPercent / 100) * 100) / 100
    const platformFeeAmount = Math.round((amount * platformFeePercent / 100) * 100) / 100
    const order = {
      id: 'ord-' + Date.now(),
      customerId,
      prescriptionId: orderPrescriptionId,
      referralCode: orderReferralCode,
      optometristId,
      amount,
      commissionPercent,
      platformFeePercent,
      commissionAmount,
      platformFeeAmount,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    set((s) => ({ orders: [...s.orders, order] }))
    return order
  },

  getOptometristById: (id) => get().optometrists.find((o) => o.id === id),
  getOptometristByReferralCode: (code) => {
    const normalized = (code || '').toUpperCase().replace(/\s/g, '')
    return get().optometrists.find((o) => (o.referralCode || '').toUpperCase().replace(/\s/g, '') === normalized)
  },
  getCustomerById: (id) => get().customers.find((c) => c.id === id),
  getCustomersByOptometrist: (optometristId) => get().customers.filter((c) => c.registeredBy === optometristId),
  getPrescriptionsByCustomer: (customerId) => get().prescriptions.filter((p) => p.customerId === customerId),
  getValidPrescriptionsForCustomer: (customerId, maxAgeYears = 2) => {
    const prescriptions = get().prescriptions.filter((p) => p.customerId === customerId)
    const now = new Date()
    const cutoff = new Date(now)
    cutoff.setFullYear(cutoff.getFullYear() - maxAgeYears)
    return prescriptions.filter((p) => {
      const validUntil = new Date(p.validUntil)
      const createdAt = new Date(p.createdAt)
      return validUntil >= now && createdAt >= cutoff
    })
  },
  getPrescriptionsByOptometrist: (optometristId) => get().prescriptions.filter((p) => p.optometristId === optometristId),
  getAppointmentsByOptometrist: (optometristId) => get().appointments.filter((a) => a.optometristId === optometristId),
  getOrdersByOptometrist: (optometristId) => get().orders.filter((o) => o.optometristId === optometristId),
  getOrders: () => get().orders,
}))
