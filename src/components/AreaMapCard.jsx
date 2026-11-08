import { ArrowUpRight, MapPinned } from 'lucide-react'
import { Link } from 'react-router-dom'
import landUseMap from '../soal/[ITEC-U] Rencana Pola Ruang Kota Denpasar.jpg'

function AreaMapCard() {
  return (
    <Link to="/rute?map=pola" className="group block overflow-hidden rounded-lg border border-slate-200">
      <div className="relative h-36 overflow-hidden bg-slate-100">
        <img src={landUseMap} alt="Peta rencana pola ruang Kota Denpasar" className="size-full object-cover object-[center_38%] transition-transform duration-300 group-hover:scale-[1.03]" />
        <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-white text-[var(--tmd-primary)] shadow-sm"><MapPinned size={18} /></span>
      </div>
      <div className="flex items-center justify-between gap-3 p-3">
        <span><span className="block text-sm font-bold">Peta kawasan Denpasar</span><span className="mt-0.5 block text-xs text-slate-500">Rencana pola ruang kota</span></span>
        <ArrowUpRight size={18} className="shrink-0 text-[var(--tmd-primary)]" />
      </div>
    </Link>
  )
}

export default AreaMapCard
