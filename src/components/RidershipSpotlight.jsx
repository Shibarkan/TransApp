import { ArrowUpRight, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { corridors, ridershipPeriod } from '../data/routes.js'

const busiestCorridor = corridors.reduce((busiest, corridor) =>
  corridor.passengersPerDay > busiest.passengersPerDay ? corridor : busiest,
)

function RidershipSpotlight() {
  return (
    <section className="rounded-lg border border-sky-100 bg-gradient-to-br from-sky-50 via-cyan-50 to-white p-4 text-slate-900 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-blue-700">DATA LAYANAN · {ridershipPeriod.toUpperCase()}</p>
          <h2 className="mt-2 text-lg font-bold">Koridor paling ramai</h2>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cyan-100 text-blue-700"><UsersRound size={20} /></span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-bold tabular-nums text-blue-800">{busiestCorridor.passengersPerDay.toLocaleString('id-ID')}</p>
          <p className="mt-1 text-xs text-slate-600">penumpang rata-rata per hari · Koridor {busiestCorridor.id}</p>
        </div>
        <Link to="/rute" aria-label="Lihat analisis koridor" className="mb-1 grid size-9 place-items-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"><ArrowUpRight size={18} /></Link>
      </div>
      <p className="mt-3 border-t border-sky-100 pt-3 text-[10px] leading-4 text-slate-500">Sumber: data penumpang harian Trans Metro Dewata, Dishub Provinsi Bali, Juni 2026.</p>
    </section>
  )
}

export default RidershipSpotlight
