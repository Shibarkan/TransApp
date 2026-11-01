
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  MapPinned,
  Ticket,
  WalletCards,
} from 'lucide-react'

import PageHeader from '../components/PageHeader.jsx'
import TransitTicketCard from '../components/TransitTicketCard.jsx'
import { corridors } from '../data/routes.js'
import { readPurchasedTickets } from '../lib/tickets.js'
import { useSavedCorridors } from '../hooks/useSavedCorridors.js'

function TicketsPage() {
  const {
    savedCorridors,
    toggleSavedCorridor,
  } = useSavedCorridors()

  const [corridorToRemove, setCorridorToRemove] = useState(null)
  const [tickets] = useState(readPurchasedTickets)
  const cancelButtonRef = useRef(null)

  const routes = corridors.filter((corridor) =>
    savedCorridors.includes(corridor.id)
  )

  // Tutup popup dengan tombol Escape
  useEffect(() => {
    if (!corridorToRemove) return

    cancelButtonRef.current?.focus()

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setCorridorToRemove(null)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [corridorToRemove])

  // Hapus hanya setelah dikonfirmasi
  function confirmRemove() {
    if (!corridorToRemove) return

    if (savedCorridors.includes(corridorToRemove.id)) {
      toggleSavedCorridor(corridorToRemove.id)
    }

    setCorridorToRemove(null)
  }

  return (
    <div className="min-h-dvh bg-[var(--tmd-background,#F8FAFC)]">

      <PageHeader
        title="Tiket Saya"
        subtitle="Tiket digital dan rute favorit"
      />

      <div className="space-y-5 px-5 pb-10 pt-5">

        <section aria-labelledby="e-ticket-title">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 id="e-ticket-title" className="text-base font-bold text-slate-900">
                Tiket digital
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Status perjalanan dan tiketmu.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
              {tickets.length ? `${tickets.length} tiket` : 'Belum aktif'}
            </span>
          </div>

          {tickets.length ? (
            <div className="space-y-3">
              {tickets.map((ticket) => <TransitTicketCard key={ticket.id} ticket={ticket} />)}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white">
              <div className="flex items-start gap-3 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--tmd-primary-soft,#EAF4FF)] text-[var(--tmd-primary,#1769AA)]">
                  <Ticket size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900">Belum ada tiket aktif</h3>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">
                    Pilih perjalanan dan selesaikan checkout untuk menyimpan tiketmu di sini.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 p-3">
                <Link to="/pesan" className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[var(--tmd-primary,#1769AA)] px-3 text-[11px] font-semibold text-white transition hover:brightness-90">
                  <MapPinned size={14} aria-hidden="true" />
                  Cari perjalanan
                </Link>
                <Link to="/info#metode-pembayaran" className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50">
                  <WalletCards size={14} aria-hidden="true" />
                  Cara pembayaran
                </Link>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="travel-flow-title">
          <div className="mb-3">
            <h2 id="travel-flow-title" className="text-base font-bold text-slate-900">
              Alur perjalanan
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Dari memilih rute sampai naik bus.
            </p>
          </div>

          <ol className="divide-y divide-slate-100 rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white px-4">
            <li className="flex gap-3 py-3.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--tmd-primary-soft,#EAF4FF)] text-[11px] font-bold text-[var(--tmd-primary,#1769AA)]">1</span>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">Cari rute perjalanan</h3>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">Tentukan asal dan tujuan untuk melihat pilihan koridor.</p>
              </div>
            </li>
            <li className="flex gap-3 py-3.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--tmd-primary-soft,#EAF4FF)] text-[11px] font-bold text-[var(--tmd-primary,#1769AA)]">2</span>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">Cek tarif dan pembayaran</h3>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">Pilih metode yang tersedia dan perhatikan ketentuan transit.</p>
              </div>
            </li>
            <li className="flex gap-3 py-3.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--tmd-primary-soft,#EAF4FF)] text-[11px] font-bold text-[var(--tmd-primary,#1769AA)]">3</span>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">Bayar lalu ikuti arahan petugas</h3>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">Pembayaran dilakukan melalui metode yang diterima operator saat naik.</p>
              </div>
            </li>
          </ol>
        </section>

        {routes.length === 0 ? (
          <section className="flex min-h-[230px] flex-col items-center justify-center rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white px-6 py-8 text-center">

            <h2 className="text-base font-bold text-slate-900">
              Belum ada rute favorit
            </h2>

            <p className="mt-2 max-w-[240px] text-xs leading-5 text-slate-500">
              Simpan koridor yang sering kamu gunakan agar
              lebih mudah ditemukan lagi.
            </p>

            <Link
              to="/rute"
              className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-[var(--tmd-primary,#1769AA)] px-5 text-xs font-semibold text-white transition hover:brightness-90"
            >
              Jelajahi koridor
            </Link>
          </section>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Koridor tersimpan
                </h2>

                <p className="mt-1 text-[11px] text-slate-500">
                  Akses cepat perjalanan favoritmu.
                </p>
              </div>

              <span className="rounded-lg bg-[var(--tmd-primary-soft,#EAF4FF)] px-3 py-1.5 text-[11px] font-semibold text-[var(--tmd-primary,#1769AA)]">
                {routes.length} koridor
              </span>
            </div>

            <div className="space-y-3">
              {routes.map((corridor) => (
                <article
                  key={corridor.id}
                  className="overflow-hidden rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0 flex-1">
                        <span className="inline-flex rounded-md bg-[var(--tmd-primary-soft,#EAF4FF)] px-2.5 py-1 text-[11px] font-bold text-[var(--tmd-primary,#1769AA)]">
                          Koridor {corridor.id}
                        </span>

                        <h3 className="mt-3 text-sm font-bold text-slate-900">
                          {corridor.from}
                        </h3>

                        <p className="mt-1 text-[13px] text-slate-600">
                          ke {corridor.to}
                        </p>

                        {corridor.via && (
                          <p className="mt-1 text-[11px] text-slate-500">
                            Via {corridor.via}
                          </p>
                        )}

                        <p className="mt-3 text-[11px] text-slate-500">
                          Jam layanan: {corridor.operatingHours}
                        </p>
                      </div>

                      {/* TOMBOL HAPUS */}
                      <button
                        type="button"
                        onClick={() => setCorridorToRemove(corridor)}
                        className="shrink-0 rounded-lg border border-[var(--tmd-border,#E2E8F0)] px-3 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50"
                        aria-label={`Hapus Koridor ${corridor.id} dari favorit`}
                      >
                        Hapus
                      </button>

                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-[var(--tmd-border,#E2E8F0)] px-4 py-3">

                    <Link
                      to={`/rute?koridor=${corridor.id}`}
                      className="text-[11px] font-semibold text-[var(--tmd-primary,#1769AA)]"
                    >
                      Lihat jalur
                    </Link>

                    <Link
                      to={`/pesan?koridor=${corridor.id}`}
                      className="rounded-lg bg-[var(--tmd-primary,#1769AA)] px-3 py-2 text-[11px] font-semibold text-white"
                    >
                      Cari perjalanan
                    </Link>

                  </div>
                </article>
              ))}
            </div>

            <Link
              to="/rute"
              className="flex min-h-12 items-center justify-center gap-1 rounded-xl border border-dashed border-[var(--tmd-border,#E2E8F0)] py-3 text-center text-xs font-semibold text-[var(--tmd-primary,#1769AA)]"
            >
              Tambah koridor favorit
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </>
        )}
      </div>

      {/* =====================================
          POPUP KONFIRMASI HAPUS FAVORIT
      ===================================== */}

      {corridorToRemove && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">

          {/* OVERLAY */}
          <button
            type="button"
            aria-label="Tutup konfirmasi"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setCorridorToRemove(null)}
          />

          {/* MODAL */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-favorite-title"
            aria-describedby="remove-favorite-description"
            className="relative z-10 w-full max-w-[350px] animate-[tmdModalEnter_220ms_ease-out] rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
          >
            <h2
              id="remove-favorite-title"
              className="text-center text-[17px] font-bold text-slate-900"
            >
              Hapus dari favorit?
            </h2>

            <p
              id="remove-favorite-description"
              className="mt-2 text-center text-[12px] leading-5 text-slate-500"
            >
              Koridor {corridorToRemove.id} akan dihapus dari
              daftar rute favoritmu.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">

              {/* BATAL */}
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={() => setCorridorToRemove(null)}
                className="min-h-11 rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-slate-50 px-3 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Batal
              </button>

              {/* KONFIRMASI */}
              <button
                type="button"
                onClick={confirmRemove}
                className="min-h-11 rounded-xl bg-[var(--tmd-accent,#E11D48)] px-3 text-[12px] font-semibold text-white transition hover:brightness-90 active:scale-[0.98]"
              >
                Hapus favorit
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ANIMASI POPUP */}
      <style>
        {`
          @keyframes tmdModalEnter {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            [role="dialog"] {
              animation: none !important;
            }
          }
        `}
      </style>

    </div>
  )
}

export default TicketsPage
