import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, MapPin, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionTitle from './SectionTitle.jsx'
import { corridors, fareNote, ridershipPeriod, specialFare, standardFare } from '../data/routes.js'

function HomeServiceInfo() {
  return (
    <>
      <section>
        <SectionTitle title="Jam layanan koridor" action={<Link to="/rute" className="text-xs font-semibold text-rose-700">Peta koridor</Link>} />
        <div className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white">
          {corridors.map((corridor) => (
            <details key={corridor.id} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-3 py-2.5 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                <span className="grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: corridor.color }}>K{corridor.id}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-slate-800">{corridor.from} → {corridor.to}</span>
                  <span className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500"><Clock3 size={11} />{corridor.operatingHours}</span>
                </span>
                <ArrowDown size={16} className="shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 pl-14">
                {corridor.via && <p className="text-xs text-slate-600">Via {corridor.via}</p>}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">
                  {corridor.headway && <span>Selang bus {corridor.headway}</span>}
                  <span>{corridor.passengersPerDay.toLocaleString('id-ID')} penumpang/hari</span>
                  <span>Load factor {corridor.loadFactor.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%</span>
                </div>
                <Link to={`/rute?koridor=${corridor.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-rose-700">Lihat peta & jalur <ArrowUpRight size={13} /></Link>
              </div>
            </details>
          ))}
        </div>
        <p className="mt-2 text-[10px] leading-4 text-slate-500">Ringkasan penumpang memakai data Dishub Provinsi Bali, {ridershipPeriod}. Jam dan selang dapat berubah mengikuti operasional.</p>
      </section>

      <section className="overflow-hidden rounded-lg border border-rose-100 bg-gradient-to-br from-rose-50 via-orange-50 to-white">
        <div className="flex items-center justify-between gap-3 border-b border-rose-100 px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-bold"><WalletCards size={18} className="text-rose-600" />Tarif & cara naik</span>
          <Link to="/info" aria-label="Lihat info tarif" className="grid size-8 place-items-center rounded-full bg-white text-rose-700"><ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 divide-x divide-rose-100 px-4 py-3">
          <div><p className="text-[10px] text-slate-500">Reguler / orang</p><p className="mt-0.5 text-lg font-bold text-rose-700">Rp{standardFare.toLocaleString('id-ID')}</p></div>
          <div className="pl-4"><p className="text-[10px] text-slate-500">Tarif khusus</p><p className="mt-0.5 text-lg font-bold text-slate-800">Rp{specialFare.toLocaleString('id-ID')}</p></div>
        </div>
        <div className="space-y-2 px-4 pb-4 text-xs leading-5 text-slate-600">
          <p className="flex gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-rose-600" />Siapkan tiket LAIT atau metode pembayaran yang berlaku sebelum naik.</p>
          <p>{fareNote}</p>
          <Link to="/info" className="inline-flex items-center gap-1 font-semibold text-rose-700">Syarat tarif khusus & TMD Pass <ArrowRight size={13} /></Link>
        </div>
      </section>
    </>
  )
}

export default HomeServiceInfo
