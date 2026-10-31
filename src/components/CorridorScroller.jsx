import { ArrowRight, BusFront } from 'lucide-react'
import { Link } from 'react-router-dom'
import { corridors } from '../data/routes.js'

const corridorStyles = [
  {
    bg: 'bg-sky-100',
    text: 'text-sky-700',
  },
  {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
  },
  {
    bg: 'bg-cyan-100',
    text: 'text-cyan-700',
  },
  {
    bg: 'bg-fuchsia-100',
    text: 'text-fuchsia-700',
  },
  {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
  },
  {
    bg: 'bg-violet-100',
    text: 'text-violet-700',
  },
]

function CorridorScroller() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-[var(--tmd-text,#0F172A)]">
          Koridor Trans Metro
        </h2>

        <Link
          to="/rute"
          className="flex items-center gap-1 text-xs font-semibold text-[var(--tmd-primary,#1769AA)]"
        >
          Semua
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
        {corridors.map((corridor, index) => {
          const style =
            corridorStyles[index % corridorStyles.length]

          return (
            <Link
              key={corridor.id}
              to={`/pesan?koridor=${corridor.id}`}
              className="group flex w-[92px] shrink-0 snap-start flex-col items-center gap-2 text-center"
            >
              <span
                className={`grid size-[58px] place-items-center rounded-full ${style.bg} ${style.text} transition-all duration-200 group-hover:scale-[1.04] group-active:scale-95`}
              >
                <BusFront size={24} strokeWidth={1.9} />
              </span>

              <span className="text-xs font-semibold text-[var(--tmd-text,#0F172A)]">
                Koridor {corridor.id}
              </span>

              <span className="line-clamp-1 w-full text-[10px] text-[var(--tmd-muted,#64748B)]">
                {corridor.to}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default CorridorScroller