// User roles
export const ROLES = {
  ADMIN: 'admin',
  OPTOMETRIST: 'optometrist',
  CUSTOMER: 'customer',
}

// Registration status for optometrists
export const REGISTRATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

// Appointment status (enquiry-based)
export const APPOINTMENT_STATUS = {
  ENQUIRY: 'enquiry',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
}

// Visit types
export const VISIT_TYPES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  BOTH: 'both',
}

// Service types
export const SERVICE_TYPES = {
  IN_PERSON_EXAM: 'in_person_eye_exam',
  ONLINE_CONSULTATION: 'online_consultation',
  FOLLOW_UP: 'follow_up',
  LENS_FRAME_ADVICE: 'lens_frame_advice',
}

export const SERVICE_LABELS = {
  in_person_eye_exam: 'In-person eye exam',
  online_consultation: 'Online consultation',
  follow_up: 'Follow-up',
  lens_frame_advice: 'Lens/Frame selection advice',
}

// Prescription validity (years)
export const PRESCRIPTION_MAX_AGE_YEARS = 2

// Prescription source: created by optometrist in dashboard, or uploaded (existing)
export const PRESCRIPTION_SOURCE = {
  CREATED: 'created',
  UPLOADED: 'uploaded',
}

// Membership plan IDs
export const PLAN_IDS = {
  FREEMIUM: 'freemium',
  PAID: 'paid',
}

// Default membership plans
export const DEFAULT_PLANS = [
  {
    id: PLAN_IDS.FREEMIUM,
    name: 'Freemium',
    price: 0,
    interval: null,
    priceYearly: null,
    platformFeePercent: 20,
    commissionPercent: 0,
    features: ['Basic Dashboard'],
  },
  {
    id: PLAN_IDS.PAID,
    name: 'Professional',
    priceMonthly: 29,
    priceYearly: 290,
    interval: 'monthly', // or 'yearly'
    platformFeePercent: 10,
    commissionPercent: 10, // give 10 take 10 - admin can override per optometrist
    features: ['Advanced dashboard', 'Better commission', 'Reporting', 'Lower platform fee'],
  },
]
