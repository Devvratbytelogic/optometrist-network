# Optometrist Network

A React + Tailwind CSS front-end for an optometrist network: registration, admin approval, profiles, calendar, enquiry-based booking, prescriptions, and membership/commission model.

## Features

### A) Optometrist & admin
- **Optometrist self-register** and login; **registration approved by admin**.
- **Admin can register an optometrist on behalf** (sidebar → Optometrists → "Register on behalf").
- **Optometrist dashboard**: profile & business details, services (in-person, online with required meeting link, follow-ups, lens/frame advice), working rules (visit type, fees, slot duration, daily capacity), prescriptions, calendar, appointments, customers, membership.

### B) Calendar & booking
- **Availability**: working days/hours, time off/vacations, daily capacity.
- **Booking flow**: user selects optometrist → sees available slots → submits **enquiry** → optometrist can **accept or reject** in Appointments (enquiry-based only).

### C) Prescriptions
- Optometrist **registers customers** (required before adding prescription).
- **Create and store** prescriptions; link to customer (user) profile; **validity** (e.g. 1–2 years) shown; ready to link to glasses order at checkout.

### D) Revenue
- **Membership plans**: Freemium (0, basic dashboard, 20% platform fee) and Paid (monthly/yearly, 10% platform fee, commission).
- **Referral/commission**: give 10 take 10%; **admin can set commission % per optometrist** in Admin → Optometrists (editable column).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Demo login

- **Admin**: `admin@network.com` / `admin123`
- **Approved optometrist**: `dr.smith@eye.com` / `opt123`
- **Pending optometrist**: register at `/register` or use `pending@eye.com` / `opt123` if already in store

## Tech

- React 19, Vite 7, React Router 7
- Tailwind CSS 4
- Zustand (auth + in-memory data store; replace with API in production)
- Lucide React icons, date-fns
