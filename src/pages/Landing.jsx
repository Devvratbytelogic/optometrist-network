import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Eye, Calendar, FileText, CreditCard, ArrowRight } from 'lucide-react'

export default function Landing() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
            <Eye size={24} />
          </span>
          <span className="font-semibold text-lg">Optometrist Network</span>
        </div>
        <nav className="flex items-center gap-4">
          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin' : '/optometrist'}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Sign in</Link>
              <Link to="/register" className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 transition-colors">
                Register as Optometrist
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-20">
        <section className="text-center mb-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            Connect patients with optometrists
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            One platform for appointments, prescriptions, and referrals. Manage your practice and grow with flexible membership plans.
          </p>
          {!user ? (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors"
              >
                Join as Optometrist <ArrowRight size={18} />
              </Link>
              <Link
                to="/book"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                Book appointment
              </Link>
              <Link
                to="/checkout"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                Glasses / Checkout
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          ) : null}
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { icon: Calendar, title: 'Calendar & Booking', desc: 'Set availability, time off, and daily capacity. Enquiry-based appointments with confirm/reject.' },
            { icon: FileText, title: 'Prescriptions', desc: 'Create and store prescriptions, link to user profiles. Validity check for glasses orders.' },
            { icon: CreditCard, title: 'Membership & Commission', desc: 'Freemium and paid plans. Referral commission (e.g. give 10 take 10%).' },
            { icon: Eye, title: 'Profile & Services', desc: 'Professional info, services (in-person, online with meeting link), working rules.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 mb-4">
                <Icon size={24} />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
              <p className="text-slate-400 text-sm">{desc}</p>
            </div>
          ))}
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Membership plans</h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            Freemium: basic dashboard, 20% platform fee. Paid: advanced dashboard, reporting, lower platform fee (10%), better commission.
          </p>
          {!user && (
            <Link to="/register" className="text-primary-400 hover:underline font-medium">
              Register to get started →
            </Link>
          )}
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-8 border-t border-white/10 text-slate-500 text-sm text-center">
        Optometrist Network — Demo build with React & Tailwind
      </footer>
    </div>
  )
}
