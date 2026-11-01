import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  Minus,
  Plus,
  QrCode,
  Ticket,
} from 'lucide-react'

import PageHeader from '../components/PageHeader.jsx'
import TransitTicketCard from '../components/TransitTicketCard.jsx'
import { paymentMethods, specialFare, standardFare } from '../data/routes.js'
import { savePurchasedTicket } from '../lib/tickets.js'

const paymentIcons = {
  cash: Banknote,
  qris: QrCode,
  emoney: CreditCard,
  lait: Ticket,
}

const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10)

function CheckoutPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [passengerCount, setPassengerCount] = useState(1)
  const [fareType, setFareType] = useState('regular')
  const [paymentMethod, setPaymentMethod] = useState('qris')
  const [travelDate, setTravelDate] = useState(today)
  const [status, setStatus] = useState('review')
  const [ticket, setTicket] = useState(null)

  const unitFare = fareType === 'special' ? specialFare : standardFare
  const total = unitFare * passengerCount
  const selectedMethod = paymentMethods.find((method) => method.id === paymentMethod)
  const trip = state?.segments?.length ? state : null

  async function handlePayment(event) {
    event.preventDefault()
    if (!trip || status !== 'review') return

    setStatus('processing')
    await new Promise((resolve) => window.setTimeout(resolve, 1400))

    const reference = Date.now().toString(36).toUpperCase()
    const nextTicket = {
      id: `TMD-${reference}`,
      code: `TMD-${reference.slice(-8)}`,
      origin: trip.origin,
      destination: trip.destination,
      segments: trip.segments,
      passengerCount,
      fareType,
      unitFare,
      total,
      paymentMethod,
      travelDate,
      createdAt: new Date().toISOString(),
    }

    if (!savePurchasedTicket(nextTicket)) {
      setStatus('error')
      return
    }

    setTicket(nextTicket)
    setStatus('success')
  }

  if (!trip) {
    return (
      <div className="min-h-dvh bg-[var(--tmd-background,#F8FAFC)]">
        <PageHeader title="Checkout" subtitle="Perjalanan Trans Metro Dewata" />
        <div className="px-5 py-6">
          <section className="rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white p-5 text-center">
            <h2 className="text-sm font-bold text-slate-900">Pilih rute terlebih dahulu</h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Rute perjalanan diperlukan untuk menyiapkan detail checkout.
            </p>
            <Link to="/pesan" className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-[var(--tmd-primary,#1769AA)] px-4 text-xs font-semibold text-white">
              Cari perjalanan
            </Link>
          </section>
        </div>
      </div>
    )
  }

  if (status === 'success' && ticket) {
    return (
      <div className="min-h-dvh bg-[var(--tmd-background,#F8FAFC)]">
        <PageHeader title="Pembayaran selesai" subtitle="Tiket perjalananmu sudah siap" />
        <div className="space-y-4 px-5 py-5">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 size={22} aria-hidden="true" />
            <div>
              <h2 className="text-sm font-bold">Pembayaran berhasil</h2>
              <p className="mt-1 text-[11px]">Simpan barcode ini untuk perjalananmu.</p>
            </div>
          </div>
          <TransitTicketCard ticket={ticket} />
          <Link to="/tiket" className="flex min-h-11 items-center justify-center rounded-lg bg-[var(--tmd-primary,#1769AA)] text-xs font-bold text-white">
            Buka Tiket Saya
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'processing') {
    return (
      <div className="grid min-h-[65dvh] place-items-center bg-[var(--tmd-background,#F8FAFC)] px-6 text-center">
        <div>
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--tmd-primary-soft,#EAF4FF)] text-[var(--tmd-primary,#1769AA)]">
            <LoaderCircle size={27} className="animate-spin" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-base font-bold text-slate-900">Memproses pembayaran</h1>
          <p className="mt-2 text-xs text-slate-500">Mohon tunggu, kami sedang menyiapkan tiketmu.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[var(--tmd-background,#F8FAFC)] text-[var(--tmd-text,#0F172A)]">
      <PageHeader title="Checkout" subtitle="Periksa detail sebelum membayar" />
      <form onSubmit={handlePayment} className="space-y-5 px-5 pb-10 pt-5">
        <section className="rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase text-[var(--tmd-primary,#1769AA)]">
                {trip.segments.length === 1 ? 'Perjalanan langsung' : `${trip.segments.length - 1} kali transit`}
              </p>
              <h2 className="mt-1 text-sm font-bold text-slate-900">{trip.origin}</h2>
              <p className="mt-1 text-xs text-slate-500">ke {trip.destination}</p>
            </div>
            <Ticket size={19} className="shrink-0 text-[var(--tmd-primary,#1769AA)]" aria-hidden="true" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {trip.segments.map((segment, index) => (
              <span key={`${segment.corridorId}-${index}`} className="rounded-md bg-[var(--tmd-primary-soft,#EAF4FF)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--tmd-primary,#1769AA)]">
                Koridor {segment.corridorId}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white p-4">
          <label className="block">
            <span className="text-[11px] font-semibold text-slate-700">Tanggal perjalanan</span>
            <input
              type="date"
              min={today}
              value={travelDate}
              onChange={(event) => setTravelDate(event.target.value)}
              className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800"
              required
            />
          </label>

          <div>
            <p className="mb-1.5 text-[11px] font-semibold text-slate-700">Jumlah penumpang</p>
            <div className="flex min-h-11 items-center justify-between rounded-lg border border-slate-200 px-3">
              <span className="text-xs text-slate-600">{passengerCount} orang</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setPassengerCount((count) => Math.max(1, count - 1))} aria-label="Kurangi penumpang" className="grid size-8 place-items-center rounded-full border border-slate-200 text-slate-700 disabled:opacity-40" disabled={passengerCount <= 1}>
                  <Minus size={14} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => setPassengerCount((count) => Math.min(6, count + 1))} aria-label="Tambah penumpang" className="grid size-8 place-items-center rounded-full border border-slate-200 text-slate-700 disabled:opacity-40" disabled={passengerCount >= 6}>
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <fieldset>
            <legend className="mb-1.5 text-[11px] font-semibold text-slate-700">Kategori tarif</legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'regular', label: 'Reguler', fare: standardFare },
                { id: 'special', label: 'Tarif khusus', fare: specialFare },
              ].map((fare) => (
                <button key={fare.id} type="button" aria-pressed={fareType === fare.id} onClick={() => setFareType(fare.id)} className={`min-h-[58px] rounded-lg border px-3 text-left ${fareType === fare.id ? 'border-[var(--tmd-primary,#1769AA)] bg-[var(--tmd-primary-soft,#EAF4FF)]' : 'border-slate-200'}`}>
                  <span className="block text-[10px] text-slate-600">{fare.label}</span>
                  <span className="mt-1 block text-sm font-bold">Rp{fare.fare.toLocaleString('id-ID')}</span>
                </button>
              ))}
            </div>
            {fareType === 'special' && <p className="mt-1.5 text-[10px] text-slate-500">Berlaku sesuai persyaratan tarif khusus.</p>}
          </fieldset>
        </section>

        <fieldset>
          <legend className="mb-2 text-[12px] font-bold text-slate-900">Pilih pembayaran</legend>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map((method) => {
              const Icon = paymentIcons[method.id]
              const selected = paymentMethod === method.id
              return (
                <label key={method.id} className={`flex min-h-[76px] cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition ${selected ? 'border-[var(--tmd-primary,#1769AA)] bg-[var(--tmd-primary-soft,#EAF4FF)]' : 'border-[var(--tmd-border,#E2E8F0)] bg-white'}`}>
                  <input type="radio" name="payment" value={method.id} checked={selected} onChange={() => setPaymentMethod(method.id)} className="sr-only" />
                  <Icon size={17} className={`mt-0.5 shrink-0 ${selected ? 'text-[var(--tmd-primary,#1769AA)]' : 'text-slate-500'}`} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold leading-4 text-slate-800">{method.label}</span>
                    <span className="mt-1 block text-[9px] leading-3.5 text-slate-500">{method.detail}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <section className="rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white px-4 py-3">
          <div className="flex justify-between text-[11px] text-slate-600">
            <span>Tarif × {passengerCount} penumpang</span>
            <span>Rp{total.toLocaleString('id-ID')}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs font-bold text-slate-900">Total pembayaran</span>
            <span className="text-base font-extrabold text-[var(--tmd-primary,#1769AA)]">Rp{total.toLocaleString('id-ID')}</span>
          </div>
        </section>

        <button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--tmd-primary,#1769AA)] px-4 text-sm font-bold text-white transition hover:brightness-90">
          Bayar Rp{total.toLocaleString('id-ID')} via {selectedMethod?.label}
        </button>
        <button type="button" onClick={() => navigate(-1)} className="flex min-h-10 w-full items-center justify-center gap-2 text-xs font-semibold text-slate-600">
          <ArrowLeft size={14} aria-hidden="true" />
          Kembali ke pilihan rute
        </button>
      </form>
    </div>
  )
}

export default CheckoutPage