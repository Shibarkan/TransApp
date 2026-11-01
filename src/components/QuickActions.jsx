import {
  ArrowRight,
  BusFront,
  LocateFixed,
  MapPinned,
  Ticket,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { standardFare } from '../data/routes.js'

const actions = [
  {
    label: 'Rute & jadwal',
    detail: 'Pilih koridor',
    to: '/pesan',
    Icon: BusFront,
    iconBg: 'bg-[var(--tmd-primary-soft,#EAF4FF)]',
    iconText: 'text-[var(--tmd-primary,#1769AA)]',
  },
  {
    label: 'Bus live',
    detail: 'Posisi armada',
    to: '/tracking',
    Icon: LocateFixed,
    iconBg: 'bg-teal-50',
    iconText: 'text-teal-700',
  },
  {
    label: 'Peta koridor',
    detail: 'Lihat jaringan',
    to: '/rute',
    Icon: MapPinned,
    iconBg: 'bg-cyan-50',
    iconText: 'text-cyan-700',
  },
  {
    label: 'E-ticket',
    detail: 'Tiket perjalanan',
    to: '/tiket',
    Icon: Ticket,
    iconBg: 'bg-rose-50',
    iconText: 'text-rose-700',
  },
]

function QuickActions() {
  return (
    <section
      className="
        relative -mt-5 mx-4
        rounded-2xl border border-[var(--tmd-border,#E2E8F0)]
        bg-white/96 p-4
        shadow-[0_10px_24px_rgba(15,23,42,0.06)]
        backdrop-blur
      "
    >
      <div className="grid grid-cols-4 divide-x divide-slate-100">
        {actions.map(({ label, detail, to, Icon, iconBg, iconText }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col items-center gap-2 px-1 text-center"
          >
            <span
              className={`
                grid size-11 place-items-center rounded-full
                ${iconBg} ${iconText}
                transition-transform duration-200
                group-hover:scale-[1.03]
                group-active:scale-95
              `}
            >
              <Icon size={20} strokeWidth={1.9} />
            </span>

            <span className="text-[11px] font-semibold leading-4 text-slate-800">
              {label}
            </span>

            <span className="text-[10px] leading-4 text-slate-500">
              {detail}
            </span>
          </Link>
        ))}
      </div>

      <Link
        to="/info"
        className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">
            Tarif reguler
          </span>

          <strong className="text-xs text-slate-900">
            Rp{standardFare.toLocaleString('id-ID')}
          </strong>
        </div>

        <span className="flex items-center gap-1 text-xs font-semibold text-[var(--tmd-primary,#1769AA)]">
          Info
          <ArrowRight size={14} />
        </span>
      </Link>
    </section>
  )
}

export default QuickActions