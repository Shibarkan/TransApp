import { ArrowRight, BusFront, Clock3, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'

function CorridorCard({ corridor }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700"><BusFront size={19} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-blue-700">Koridor {corridor.id}</span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500"><Clock3 size={13} />{corridor.operatingHours}</span>
          </div>
          <h3 className="mt-1 text-sm font-bold leading-5">{corridor.from}</h3>
          <p className="mt-0.5 text-sm text-slate-600">ke {corridor.to}</p>
          {corridor.via && <p className="mt-1 text-xs text-slate-500">via {corridor.via}</p>}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5"><UsersRound size={13} />{corridor.passengersPerDay.toLocaleString('id-ID')} /hari</span>
          <span>LF {corridor.loadFactor.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</span>
          {corridor.headway && <span>Headway {corridor.headway}</span>}
        </div>
        <Link to={`/pesan?koridor=${corridor.id}`} aria-label={`Pilih Koridor ${corridor.id}`} className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-600 text-white transition-colors hover:bg-sky-500"><ArrowRight size={16} /></Link>
      </div>
    </article>
  )
}

export default CorridorCard
