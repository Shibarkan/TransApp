
import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownUp,
  ArrowRight,
  LoaderCircle,
  Search,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import PageHeader from '../components/PageHeader.jsx'
import { corridors, standardFare } from '../data/routes.js'
import { corridorPaths, transitPoints } from '../data/terminals.js'
import { findJourneyOptions } from '../data/journeyPlanner.js'

// ==========================================
// DATA
// ==========================================

const pointById = Object.fromEntries(
  transitPoints.map((point) => [point.id, point])
)

const corridorById = Object.fromEntries(
  corridors.map((corridor) => [corridor.id, corridor])
)

const rupiah = (value) =>
  `Rp${Number(value).toLocaleString('id-ID')}`

// ==========================================
// HASIL PERJALANAN
// ==========================================

function RouteCard({ journey, index }) {
  const transfers = journey.segments.length - 1

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white shadow-sm">

      {/* HEADER HASIL */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--tmd-border,#E2E8F0)] px-4 py-3">

        <div>
          <span className="text-[11px] text-[var(--tmd-muted,#64748B)]">
            Pilihan {index + 1}
          </span>

          <p className="mt-1 text-xs font-bold text-[var(--tmd-primary,#1769AA)]">
            {transfers === 0
              ? 'Perjalanan langsung'
              : `${transfers} kali transit`}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold text-[var(--tmd-text,#0F172A)]">
            {rupiah(standardFare)}
          </p>

          <span className="text-[10px] text-[var(--tmd-muted,#64748B)]">
            Per orang
          </span>
        </div>
      </div>

      {/* DETAIL PERJALANAN */}
      <div className="space-y-4 p-4">
        {journey.segments.map((segment, segmentIndex) => {
          const corridor = corridorById[segment.corridorId]
          const from = pointById[segment.fromPointId]
          const to = pointById[segment.toPointId]

          if (!corridor) return null

          const transferPoint =
            journey.transferPoints?.[segmentIndex]

          return (
            <div
              key={`${segment.corridorId}-${segmentIndex}`}
              className="flex gap-3"
            >

              {/* TIMELINE */}
              <div className="flex w-5 shrink-0 flex-col items-center py-1">

                <span className="size-3 shrink-0 rounded-full bg-[var(--tmd-primary,#1769AA)]" />

                <span className="my-1 min-h-12 border-l-2 border-dashed border-[var(--tmd-border,#E2E8F0)]" />

                <span className="size-3 shrink-0 rounded-full border-[3px] border-[var(--tmd-primary,#1769AA)] bg-white" />

              </div>

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center justify-between gap-2">

                  <span className="rounded-md bg-[var(--tmd-primary-soft,#EAF4FF)] px-2.5 py-1 text-[11px] font-bold text-[var(--tmd-primary,#1769AA)]">
                    Koridor {corridor.id}
                  </span>

                  <span className="text-[10px] text-[var(--tmd-muted,#64748B)]">
                    {corridor.operatingHours}
                  </span>

                </div>

                <div className="mt-4">
                  <p className="text-[10px] text-[var(--tmd-muted,#64748B)]">
                    Naik dari
                  </p>

                  <p className="mt-1 text-[13px] font-semibold text-[var(--tmd-text,#0F172A)]">
                    {from?.name || segment.fromPointId}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] text-[var(--tmd-muted,#64748B)]">
                    Turun di
                  </p>

                  <p className="mt-1 text-[13px] font-semibold text-[var(--tmd-text,#0F172A)]">
                    {to?.name || segment.toPointId}
                  </p>
                </div>

                {transferPoint && (
                  <div className="mt-3 rounded-lg bg-[var(--tmd-primary-soft,#EAF4FF)] px-3 py-2 text-[11px] font-medium text-[var(--tmd-primary,#1769AA)]">
                    Transit di {transferPoint.name}
                  </div>
                )}

                <Link
                  to={`/rute?koridor=${corridor.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--tmd-primary,#1769AA)] transition hover:opacity-70"
                >
                  Lihat jalur
                  <ArrowRight size={13} />
                </Link>

              </div>
            </div>
          )
        })}
      </div>

      {transfers > 0 && (
        <div className="border-t border-[var(--tmd-border,#E2E8F0)] bg-[var(--tmd-primary-soft,#EAF4FF)] px-4 py-3 text-[11px] leading-5 text-[var(--tmd-muted,#64748B)]">
          Transit antarkoridor gratis sesuai ketentuan
          LAIT, kecuali menggunakan QRIS Scan (MPM).
        </div>
      )}

    </article>
  )
}

// ==========================================
// BOOKING PAGE
// ==========================================

function BookingPage() {
  const [searchParams] = useSearchParams()
  const timerRef = useRef(null)

  const requestedCorridorId = Number(
    searchParams.get('koridor')
  )

  const requestedPath = corridorPaths.find(
    (path) => path.corridorId === requestedCorridorId
  )

  const initialFrom =
    searchParams.get('asal') ||
    requestedPath?.pointIds[0] ||
    'ubung'

  const initialTo =
    searchParams.get('tujuan') ||
    requestedPath?.pointIds.at(-1) ||
    'sanur-intersection'

  const hasInitialSearch = Boolean(
    searchParams.get('asal') &&
    searchParams.get('tujuan')
  )

  const [fromPointId, setFromPointId] = useState(initialFrom)
  const [toPointId, setToPointId] = useState(initialTo)

  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(
    hasInitialSearch
  )

  // Sinkronisasi parameter URL
  useEffect(() => {
    setFromPointId(initialFrom)
    setToPointId(initialTo)
    setHasSearched(hasInitialSearch)
    setIsLoading(false)

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [initialFrom, initialTo, hasInitialSearch])

  // Membersihkan timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const origin = pointById[fromPointId]
  const destination = pointById[toPointId]

  const isSameLocation = fromPointId === toPointId

  const journeys = hasSearched
    ? findJourneyOptions(fromPointId, toPointId)
    : []

  // ==========================================
  // FUNCTIONS
  // ==========================================

  function resetSearch() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    setHasSearched(false)
    setIsLoading(false)
  }

  function swapLocations() {
    resetSearch()
    setFromPointId(toPointId)
    setToPointId(fromPointId)
  }

  function handleSearch(event) {
    event.preventDefault()

    if (
      isSameLocation ||
      !origin ||
      !destination
    ) return

    resetSearch()
    setIsLoading(true)

    // Loading visual singkat
    timerRef.current = setTimeout(() => {
      setIsLoading(false)
      setHasSearched(true)
      timerRef.current = null
    }, 450)
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-dvh bg-[var(--tmd-background,#F8FAFC)] text-[var(--tmd-text,#0F172A)]">

      <PageHeader
        title="Cari Rute"
        subtitle="Rencanakan perjalananmu"
      />

      <div className="space-y-4 px-5 pb-10 pt-5">

        {/* ==================================
            FORM PENCARIAN
        ================================== */}

        <section className="overflow-hidden rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white shadow-sm">

          <div className="px-4 pb-3 pt-5">
            <h2 className="text-[17px] font-bold tracking-tight text-[var(--tmd-text,#0F172A)]">
              Mau ke mana hari ini?
            </h2>

            <p className="mt-1 text-[11px] text-[var(--tmd-muted,#64748B)]">
              Pilih asal dan tujuan perjalananmu.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="space-y-4 px-3 pb-3"
          >
            <div className="relative space-y-2">

              {/* LOKASI ASAL */}
              <label className="flex min-h-[70px] items-center gap-3 rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-[var(--tmd-background,#F8FAFC)] px-3 transition-colors focus-within:border-[var(--tmd-primary,#1769AA)]">

                <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-[var(--tmd-primary,#1769AA)] bg-white text-[10px] font-bold text-[var(--tmd-primary,#1769AA)]">
                  A
                </span>

                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-[var(--tmd-muted,#64748B)]">
                    Lokasi asal
                  </span>

                  <select
                    value={fromPointId}
                    onChange={(event) => {
                      resetSearch()
                      setFromPointId(event.target.value)
                    }}
                    className="mt-1 w-full cursor-pointer bg-transparent text-[13px] font-semibold text-[var(--tmd-text,#0F172A)] outline-none"
                  >
                    {transitPoints.map((point) => (
                      <option
                        key={point.id}
                        value={point.id}
                      >
                        {point.name}
                        {point.approximate ? ' (perkiraan)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

              </label>

              {/* TOMBOL TUKAR */}
              <button
                type="button"
                onClick={swapLocations}
                aria-label="Tukar asal dan tujuan"
                title="Tukar lokasi"
                className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border-[4px] border-white bg-[var(--tmd-primary,#1769AA)] text-white shadow-sm transition-transform duration-200 hover:brightness-90 active:scale-95"
              >
                <ArrowDownUp size={16} />
              </button>

              {/* LOKASI TUJUAN */}
              <label className="flex min-h-[70px] items-center gap-3 rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-[var(--tmd-background,#F8FAFC)] px-3 transition-colors focus-within:border-[var(--tmd-primary,#1769AA)]">

                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--tmd-primary,#1769AA)] text-[10px] font-bold text-white">
                  B
                </span>

                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-[var(--tmd-muted,#64748B)]">
                    Lokasi tujuan
                  </span>

                  <select
                    value={toPointId}
                    onChange={(event) => {
                      resetSearch()
                      setToPointId(event.target.value)
                    }}
                    className="mt-1 w-full cursor-pointer bg-transparent text-[13px] font-semibold text-[var(--tmd-text,#0F172A)] outline-none"
                  >
                    {transitPoints.map((point) => (
                      <option
                        key={point.id}
                        value={point.id}
                      >
                        {point.name}
                        {point.approximate ? ' (perkiraan)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

              </label>

            </div>

            {/* VALIDASI */}
            {isSameLocation && (
              <p className="text-[11px] font-medium text-[var(--tmd-accent,#E11D48)]">
                Asal dan tujuan harus berbeda.
              </p>
            )}

            {/* CARI RUTE */}
            <button
              type="submit"
              disabled={isSameLocation || isLoading}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--tmd-primary,#1769AA)] px-4 text-[12px] font-bold text-white transition-all duration-200 hover:brightness-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isLoading ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin motion-reduce:animate-none"
                  />
                  Mencari rute...
                </>
              ) : (
                <>
                  <Search size={17} />
                  Cari Rute
                  <ArrowRight size={15} />
                </>
              )}
            </button>

          </form>
        </section>

        {/* ==================================
            LOADING
        ================================== */}

        {isLoading && (
          <section
            role="status"
            aria-live="polite"
            className="rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white p-5"
          >
            <div className="flex items-center gap-3">

              <LoaderCircle
                size={23}
                className="animate-spin text-[var(--tmd-primary,#1769AA)] motion-reduce:animate-none"
              />

              <div>
                <h3 className="text-[13px] font-semibold text-[var(--tmd-text,#0F172A)]">
                  Mencari perjalanan
                </h3>

                <p className="mt-1 text-[11px] text-[var(--tmd-muted,#64748B)]">
                  Memeriksa pilihan koridor...
                </p>
              </div>

            </div>

            <div className="mt-5 space-y-3 motion-safe:animate-pulse">
              <div className="h-3 w-1/3 rounded-full bg-[var(--tmd-primary-soft,#EAF4FF)]" />
              <div className="h-4 w-3/4 rounded-full bg-[var(--tmd-primary-soft,#EAF4FF)]" />
              <div className="h-3 w-1/2 rounded-full bg-[var(--tmd-primary-soft,#EAF4FF)]" />
            </div>
          </section>
        )}

        {/* ==================================
            HASIL PENCARIAN
        ================================== */}

        {hasSearched && !isLoading && (
          <section
            aria-live="polite"
            className="space-y-3"
          >
            <div className="flex items-center justify-between gap-3 py-1">

              <div className="min-w-0">
                <h2 className="text-[15px] font-bold text-[var(--tmd-text,#0F172A)]">
                  Pilihan perjalanan
                </h2>

                <p className="mt-1 text-[11px] text-[var(--tmd-muted,#64748B)]">
                  {origin?.name} → {destination?.name}
                </p>
              </div>

              <span className="shrink-0 rounded-lg bg-[var(--tmd-primary-soft,#EAF4FF)] px-3 py-1.5 text-[11px] font-semibold text-[var(--tmd-primary,#1769AA)]">
                {journeys.length} rute
              </span>

            </div>

            {journeys.length === 0 ? (
              <div className="rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white p-6 text-center">

                <h3 className="text-sm font-bold text-[var(--tmd-text,#0F172A)]">
                  Rute belum ditemukan
                </h3>

                <p className="mt-2 text-xs leading-5 text-[var(--tmd-muted,#64748B)]">
                  Belum ada koneksi berdasarkan titik koridor
                  yang tersedia. Coba pilih lokasi lain.
                </p>

                <button
                  type="button"
                  onClick={resetSearch}
                  className="mt-4 text-xs font-semibold text-[var(--tmd-primary,#1769AA)]"
                >
                  Ubah pencarian
                </button>

              </div>
            ) : (
              journeys.map((journey, index) => (
                <RouteCard
                  key={`${journey.segments
                    .map((segment) => segment.corridorId)
                    .join('-')}-${index}`}
                  journey={journey}
                  index={index}
                />
              ))
            )}
          </section>
        )}

        {/* ==================================
            SEBELUM MENCARI
        ================================== */}

        {!hasSearched && !isLoading && (
          <Link
            to="/rute"
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white px-4 py-4 transition-colors hover:bg-[var(--tmd-primary-soft,#EAF4FF)]"
          >
            <div>
              <p className="text-[12px] font-bold text-[var(--tmd-text,#0F172A)]">
                Lihat semua koridor
              </p>

              <p className="mt-1 text-[11px] text-[var(--tmd-muted,#64748B)]">
                Jelajahi jaringan Trans Metro Dewata
              </p>
            </div>

            <ArrowRight
              size={17}
              className="shrink-0 text-[var(--tmd-primary,#1769AA)]"
            />
          </Link>
        )}

        {/* ==================================
            INFORMASI SINGKAT
        ================================== */}

        <div className="px-3 pb-4 text-center">
          <p className="text-[10px] leading-5 text-[var(--tmd-muted,#64748B)]">
            Rute berdasarkan titik koridor yang tersedia,
            bukan seluruh halte operasional.
          </p>

          <Link
            to="/info"
            className="mt-1 inline-flex text-[11px] font-semibold text-[var(--tmd-primary,#1769AA)]"
          >
            Informasi tarif
          </Link>
        </div>

      </div>
    </div>
  )
}

export default BookingPage
