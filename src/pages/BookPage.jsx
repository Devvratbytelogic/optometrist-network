import { useState, useMemo } from 'react'
import { useDataStore } from '../store/dataStore'
import { format, addDays, parseISO } from 'date-fns'
import { REGISTRATION_STATUS } from '../lib/constants'

// Generate slots for a day from availability and capacity
function getSlotsForDay(opt, dateStr) {
  const day = format(parseISO(dateStr), 'EEEE').toLowerCase()
  const avail = opt.availability?.[day]
  if (!avail) return []
  const [startH, startM] = avail.start.split(':').map(Number)
  const [endH, endM] = avail.end.split(':').map(Number)
  const duration = opt.slotDurationMinutes || 30
  const slots = []
  let min = startH * 60 + startM
  const endMin = endH * 60 + endM
  while (min + duration <= endMin) {
    const h = Math.floor(min / 60)
    const m = min % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    min += duration
  }
  return slots
}

export default function BookPage() {
  const { optometrists, appointments, addAppointment } = useDataStore()
  const approved = optometrists.filter((o) => o.registrationStatus === REGISTRATION_STATUS.APPROVED)

  const [step, setStep] = useState(1)
  const [selectedOptId, setSelectedOptId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [booked, setBooked] = useState(false)

  const selectedOpt = useMemo(() => approved.find((o) => o.id === selectedOptId), [approved, selectedOptId])

  const availableDates = useMemo(() => {
    const dates = []
    for (let i = 0; i < 14; i++) {
      const d = addDays(new Date(), i)
      dates.push(format(d, 'yyyy-MM-dd'))
    }
    return dates
  }, [])

  const slotsForDate = useMemo(() => {
    if (!selectedOpt || !selectedDate) return []
    return getSlotsForDay(selectedOpt, selectedDate)
  }, [selectedOpt, selectedDate])

  const existingForSlot = useMemo(() => {
    if (!selectedOptId || !selectedDate || !selectedSlot) return 0
    return appointments.filter(
      (a) => a.optometristId === selectedOptId && a.date === selectedDate && a.slot === selectedSlot && a.status !== 'rejected' && a.status !== 'cancelled'
    ).length
  }, [appointments, selectedOptId, selectedDate, selectedSlot])

  const handleSubmitEnquiry = (e) => {
    e.preventDefault()
    addAppointment({
      optometristId: selectedOptId,
      customerId: 'cust-book-' + Date.now(),
      customerName,
      customerEmail,
      date: selectedDate,
      slot: selectedSlot,
      type: selectedOpt?.visitType === 'both' ? 'online' : selectedOpt?.visitType,
      meetingLink: selectedOpt?.onlineMeetingLink,
    })
    setBooked(true)
  }

  if (booked) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4 text-2xl">✓</div>
          <h1 className="text-xl font-semibold text-slate-800 mb-2">Enquiry sent</h1>
          <p className="text-slate-600 text-sm">
            The optometrist will review and accept or reject your appointment. You will be notified.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Book an appointment</h1>
        <p className="text-slate-600 text-sm mb-6">Select optometrist → choose date & slot → submit enquiry.</p>

        {step === 1 && (
          <div>
            <h2 className="text-lg font-medium text-slate-800 mb-3">1. Select optometrist</h2>
            <div className="space-y-2">
              {approved.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => { setSelectedOptId(o.id); setStep(2) }}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors bg-slate-50/50"
                >
                  <span className="font-medium text-slate-800">{o.name}</span>
                  <span className="text-slate-500 text-sm block">{o.specialty} · ${o.consultationFee} per consultation</span>
                </button>
              ))}
              {approved.length === 0 && <p className="text-slate-500 text-sm">No optometrists available.</p>}
            </div>
          </div>
        )}

        {step === 2 && selectedOpt && (
          <div>
            <button type="button" onClick={() => setStep(1)} className="text-sm text-primary-600 hover:underline mb-4">← Change optometrist</button>
            <h2 className="text-lg font-medium text-slate-800 mb-3">2. Select date</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {availableDates.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => { setSelectedDate(d); setSelectedSlot('') }}
                  className={`px-3 py-2 rounded-lg text-sm ${selectedDate === d ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {format(parseISO(d), 'EEE MMM d')}
                </button>
              ))}
            </div>

            {selectedDate && (
              <>
                <h2 className="text-lg font-medium text-slate-800 mb-3">3. Select time slot</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {slotsForDate.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-2 rounded-lg text-sm ${selectedSlot === slot ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {slot}
                    </button>
                  ))}
                  {slotsForDate.length === 0 && <p className="text-slate-500 text-sm">No slots this day. Try another date.</p>}
                </div>
              </>
            )}

            {selectedSlot && (
              <>
                <h2 className="text-lg font-medium text-slate-800 mb-3">4. Your details (enquiry)</h2>
                <form onSubmit={handleSubmitEnquiry} className="space-y-3 max-w-sm">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                    required
                  />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500"
                  >
                    Send enquiry
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
