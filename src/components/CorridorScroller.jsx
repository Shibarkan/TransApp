import { ArrowRight, BusFront } from 'lucide-react'
import { Link } from 'react-router-dom'
import { corridors } from '../data/routes.js'

const colorClasses = [
  'from-blue-600 to-indigo-700',
  'from-amber-400 to-orange-500',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-600 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-red-600',
]

function CorridorScroller() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold">Koridor Trans Metro</h2>
        <Link to="/rute" className="flex items-center gap-1 text-xs font-semibold text-blue-700">Semua <ArrowRight size={14} /></Link>
      </div>
      <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
        {corridors.map((corridor, index) => (
          <Link key={corridor.id} to={`/pesan?koridor=${corridor.id}`} className="flex w-[92px] shrink-0 snap-start flex-col items-center gap-2 text-center">
            <span className={`grid size-[58px] place-items-center rounded-full bg-gradient-to-br ${colorClasses[index]} text-white shadow-sm`}><BusFront size={25} /></span>
            <span className="text-xs font-semibold text-slate-800">Koridor {corridor.id}</span>
            <span className="line-clamp-1 w-full text-[10px] text-slate-500">{corridor.to}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CorridorScroller
