import { ArrowRight, Bus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { corridors } from '../data/routes.js'

const corridorStyles = [
  ['bg-[var(--tmd-primary-soft)]', 'text-[var(--tmd-primary)]'],
  ['bg-[var(--tmd-primary-tint)]', 'text-[var(--tmd-rose)]'],
  ['bg-[var(--tmd-accent-soft)]', 'text-[var(--tmd-accent)]'],
  ['bg-[var(--tmd-rose-soft)]', 'text-[var(--tmd-brick)]'],
  ['bg-[var(--tmd-warm-red-soft)]', 'text-[var(--tmd-warm-red)]'],
  ['bg-[var(--tmd-brick-soft)]', 'text-[var(--tmd-wine)]'],
]

function CorridorScroller() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-[var(--tmd-text)]">
          Koridor Trans Metro
        </h2>

        <Link
          to="/rute"
          className="flex items-center gap-1 text-xs font-semibold text-[var(--tmd-primary)]"
        >
          Semua
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
        {corridors.map((corridor, index) => {
          const [cardBackground, iconColor] =
            corridorStyles[index % corridorStyles.length]

          return (
            <Link
              key={corridor.id}
              to={`/pesan?koridor=${corridor.id}`}
              className={`group flex w-[112px] shrink-0 snap-start flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(206,14,45,0.12)] active:scale-95 ${cardBackground}`}
            >
              <span className={`grid size-[48px] place-items-center rounded-full bg-white/70 ${iconColor}`}>
                <Bus size={25} strokeWidth={1.8} aria-hidden="true" />
              </span>

              <span className="line-clamp-2 min-h-[28px] w-full text-[11px] font-semibold leading-[14px] text-[var(--tmd-text)]">
                {corridor.to}
              </span>

              <span className="text-[10px] text-[var(--tmd-muted)]">
                Koridor {corridor.id}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default CorridorScroller