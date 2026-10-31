
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  WalletCards,
} from 'lucide-react'

import { Link } from 'react-router-dom'
import SectionTitle from './SectionTitle.jsx'

import {
  corridors,
  fareNote,
  ridershipPeriod,
  specialFare,
  standardFare,
} from '../data/routes.js'

function HomeServiceInfo() {
  return (
    <>
      <section>
        <SectionTitle
          title="Jam layanan koridor"
          action={
            <Link
              to="/rute"
              className="text-xs font-semibold text-[var(--tmd-primary,#1769AA)]"
            >
              Peta koridor
            </Link>
          }
        />

        <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white">
          {corridors.map((corridor) => (
            <details key={corridor.id} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-3 py-2.5 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--tmd-primary-soft,#EAF4FF)] text-[11px] font-bold text-[var(--tmd-primary,#1769AA)]">
                  K{corridor.id}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-slate-800">
                    {corridor.from} → {corridor.to}
                  </span>

                  <span className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock3 size={11} />
                    {corridor.operatingHours}
                  </span>
                </span>

                <ArrowDown
                  size={16}
                  className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>

              <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 pl-14">
                {corridor.via && (
                  <p className="text-xs text-slate-600">
                    Via {corridor.via}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">
                  {corridor.headway && (
                    <span>Selang bus {corridor.headway}</span>
                  )}

                  <span>
                    {corridor.passengersPerDay.toLocaleString('id-ID')}
                    {' '}penumpang/hari
                  </span>

                  <span>
                    Load factor{' '}
                    {corridor.loadFactor.toLocaleString('id-ID', {
                      maximumFractionDigits: 1,
                    })}%
                  </span>
                </div>

                <Link
                  to={`/rute?koridor=${corridor.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--tmd-primary,#1769AA)]"
                >
                  Lihat peta & jalur
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </details>
          ))}
        </div>

        <p className="mt-2 text-[10px] leading-4 text-slate-500">
          Data penumpang: Dishub Provinsi Bali, {ridershipPeriod}.
          Jam operasional dapat berubah.
        </p>
      </section>

      <section className="overflow-hidden rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <WalletCards
              size={18}
              className="text-[var(--tmd-primary,#1769AA)]"
            />
            Tarif & cara naik
          </span>

          <Link
            to="/info"
            aria-label="Informasi tarif"
            className="grid size-8 place-items-center rounded-full bg-[var(--tmd-primary-soft,#EAF4FF)] text-[var(--tmd-primary,#1769AA)]"
          >
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-200 bg-[var(--tmd-primary-soft,#EAF4FF)] px-4 py-4">
          <div>
            <p className="text-[10px] text-slate-500">
              Reguler / orang
            </p>

            <p className="mt-1 text-lg font-bold text-[var(--tmd-primary,#1769AA)]">
              Rp{standardFare.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="pl-4">
            <p className="text-[10px] text-slate-500">
              Tarif khusus
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              Rp{specialFare.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <div className="space-y-2 px-4 py-4 text-xs leading-5 text-slate-600">
          <p>
            Siapkan tiket LAIT atau metode pembayaran
            yang berlaku sebelum naik.
          </p>

          <p>{fareNote}</p>

          <Link
            to="/info"
            className="inline-flex items-center gap-1 font-semibold text-[var(--tmd-primary,#1769AA)]"
          >
            Syarat tarif khusus & TMD Pass
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </>
  )
}

export default HomeServiceInfo
