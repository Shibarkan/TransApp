import { ArrowRight, Bookmark, BusFront, LocateFixed, MapPinned } from 'lucide-react'
import { Link } from 'react-router-dom'

const actions = [
  { label: 'Rute & jadwal', detail: 'Pilih koridor', to: '/pesan', Icon: BusFront, color: 'bg-blue-50 text-blue-700' },
  { label: 'Bus live', detail: 'Posisi armada', to: '/tracking', Icon: LocateFixed, color: 'bg-emerald-50 text-emerald-700' },
  { label: 'Peta koridor', detail: 'Lihat jaringan', to: '/rute', Icon: MapPinned, color: 'bg-cyan-50 text-cyan-700' },
  { label: 'Rute favorit', detail: 'Tersimpan di sini', to: '/tiket', Icon: Bookmark, color: 'bg-amber-50 text-amber-700' },
]

function QuickActions() {
  return (
    <section className="relative -mt-9 mx-4 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
      <div className="grid grid-cols-4 divide-x divide-slate-100">
        {actions.map(({ label, detail, to, Icon, color }) => (
          <Link key={to} to={to} className="flex flex-col items-center gap-2 px-2 text-center">
            <span className={`grid size-11 place-items-center rounded-full ${color}`}><Icon size={21} /></span>
            <span className="text-xs font-semibold text-slate-800">{label}</span>
            <span className="text-[10px] text-slate-500">{detail}</span>
          </Link>
        ))}
      </div>
      <Link to="/info" className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
        <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500" /><span className="text-slate-500">Tarif reguler</span><strong className="text-slate-800">Rp4.400</strong></span>
        <span className="flex items-center gap-1 font-semibold text-blue-700">Info <ArrowRight size={15} /></span>
      </Link>
    </section>
  )
}

export default QuickActions
