
import { ArrowRight, Bookmark, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSavedCorridors } from '../hooks/useSavedCorridors.js'

function CorridorCard({ corridor }) {
  const { savedCorridors, toggleSavedCorridor } = useSavedCorridors()
  const isSaved = savedCorridors.includes(corridor.id)

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white transition-shadow hover:shadow-sm">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-md bg-[var(--tmd-primary-soft,#EAF4FF)] px-2.5 py-1 text-[11px] font-bold text-[var(--tmd-primary,#1769AA)]">
              Koridor {corridor.id}
            </span>

            <h3 className="mt-3 text-[15px] font-bold leading-5 text-[var(--tmd-text,#0F172A)]">
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
          </div>

          <button
            type="button"
            onClick={() => toggleSavedCorridor(corridor.id)}
            aria-label={
              isSaved
                ? `Hapus Koridor ${corridor.id} dari favorit`
                : `Simpan Koridor ${corridor.id}`
            }
            aria-pressed={isSaved}
            className={`flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-semibold transition active:scale-95 ${
              isSaved
                ? 'border-[var(--tmd-primary,#1769AA)] bg-[var(--tmd-primary-soft,#EAF4FF)]'
                : 'border-[var(--tmd-border,#E2E8F0)] bg-white'
            } text-[var(--tmd-primary,#1769AA)]`}
          >
            <Bookmark
              size={15}
              fill={isSaved ? 'currentColor' : 'none'}
            />
            {isSaved ? 'Tersimpan' : 'Simpan'}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} />
            {corridor.operatingHours}
          </span>

          {corridor.headway && (
            <span>Interval {corridor.headway}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[var(--tmd-border,#E2E8F0)] px-4 py-3">
        <span className="text-[11px] text-slate-400">
          Trans Metro Dewata
        </span>

        <Link
          to={`/pesan?koridor=${corridor.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--tmd-primary,#1769AA)]"
        >
          Cari perjalanan
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  )
}

export default CorridorCard
