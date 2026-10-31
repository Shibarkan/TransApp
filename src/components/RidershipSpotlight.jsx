
import { Link } from 'react-router-dom'
import { corridors, ridershipPeriod } from '../data/routes.js'

// Ambil koridor dengan jumlah penumpang tertinggi
const busiestCorridor = corridors.length
  ? corridors.reduce((busiest, corridor) =>
      Number(corridor.passengersPerDay || 0) >
      Number(busiest.passengersPerDay || 0)
        ? corridor
        : busiest
    )
  : null

function RidershipSpotlight() {
  const period = ridershipPeriod || 'Periode tidak tersedia'

  return (
    <section className="
      overflow-hidden
      rounded-2xl
      border border-[var(--tmd-border)]
      bg-[var(--tmd-surface)]
      px-4 py-4
      shadow-[0_2px_10px_rgba(11,21,51,0.035)]
    ">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--tmd-muted)]">
            Data penumpang
          </p>

          <p className="mt-1 text-[11px] text-[var(--tmd-muted)]">
            {period}
          </p>
        </div>

        <Link
          to="/rute"
          className="
            shrink-0
            text-[11px] font-semibold
            text-[var(--tmd-primary)]
            transition-opacity
            hover:opacity-70
          "
        >
          Semua koridor →
        </Link>

      </div>

      {busiestCorridor ? (
        <>
          {/* TITLE */}
          <h2 className="
            mt-4
            text-[15px] font-bold
            leading-snug
            tracking-tight
            text-[var(--tmd-text)]
          ">
            Koridor dengan penumpang terbanyak
          </h2>

          {/* MAIN DATA */}
          <div className="mt-4 flex items-center justify-between gap-3">

            <div className="min-w-0">

              <p className="
                text-[34px] font-bold
                leading-none tracking-tight
                tabular-nums
                text-[var(--tmd-primary)]
              ">
                {Number(
                  busiestCorridor.passengersPerDay
                ).toLocaleString('id-ID')}
              </p>

              <p className="mt-2 text-[11px] text-[var(--tmd-muted)]">
                Rata-rata penumpang per hari
              </p>

            </div>

            {/* CORRIDOR LABEL */}
            <div className="
              shrink-0 rounded-xl
              bg-[var(--tmd-primary-soft)]
              px-4 py-3
              text-center
            ">
              <p className="text-[9px] font-medium uppercase tracking-wider text-[var(--tmd-muted)]">
                Koridor
              </p>

              <p className="mt-1 text-xl font-bold text-[var(--tmd-primary)]">
                {String(busiestCorridor.id).padStart(2, '0')}
              </p>
            </div>

          </div>

          {/* SOURCE */}
          <div className="
            mt-4 border-t
            border-[var(--tmd-border)]
            pt-3
          ">
            <p className="text-[9px] leading-4 text-[var(--tmd-muted)]">
              Sumber: data penumpang harian Trans Metro Dewata,
              Dishub Provinsi Bali, {period}.
            </p>
          </div>
        </>
      ) : (
        <div className="py-6">
          <p className="text-sm font-semibold text-[var(--tmd-text)]">
            Data belum tersedia
          </p>

          <p className="mt-1 text-xs text-[var(--tmd-muted)]">
            Informasi penumpang akan ditampilkan setelah data tersedia.
          </p>
        </div>
      )}

    </section>
  )
}

export default RidershipSpotlight
