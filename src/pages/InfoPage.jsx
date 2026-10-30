import { ArrowLeftRight, BadgeCheck, CreditCard, Info, TicketCheck } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { modeShare, modeShareSource } from '../data/mobility.js'
import { fareNote, specialFare, standardFare } from '../data/routes.js'

function InfoPage() {
  return (
    <div>
      <PageHeader title="Tarif & Informasi" subtitle="Panduan layanan Trans Metro Dewata" />
      <div className="space-y-7 px-5 py-6">
        <section>
          <SectionTitle title="Tarif perjalanan" />
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-sky-100 to-cyan-100 p-4 text-slate-900">
              <div><p className="text-xs text-slate-600">Tarif reguler</p><p className="mt-1 text-2xl font-bold text-blue-800">Rp{standardFare.toLocaleString('id-ID')}</p></div>
              <CreditCard size={26} className="text-blue-700" />
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-start gap-3"><BadgeCheck size={18} className="mt-0.5 shrink-0 text-emerald-600" /><p className="text-sm leading-5"><strong>Rp{specialFare.toLocaleString('id-ID')}</strong> tarif khusus bagi pelajar/mahasiswa S1, lansia, dan penyandang disabilitas.</p></div>
              <div className="flex items-start gap-3"><ArrowLeftRight size={18} className="mt-0.5 shrink-0 text-blue-700" /><p className="text-sm leading-5">{fareNote}</p></div>
              <div className="flex items-start gap-3"><TicketCheck size={18} className="mt-0.5 shrink-0 text-blue-700" /><p className="text-sm leading-5">Tiket LAIT dapat digunakan untuk TMD Pass dengan masa transit 1, 3, 7, atau 14 hari.</p></div>
            </div>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-slate-500">Tarif dan ketentuan mengikuti peta jaringan TMD edisi 1 Mei 2026. Pastikan informasi terbaru sebelum berangkat.</p>
        </section>

        <section>
          <SectionTitle title="Pangsa moda Bali" action={<span className="text-xs text-slate-500">2024</span>} />
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-4 flex h-3 overflow-hidden rounded-full" aria-label="Komposisi pangsa moda Bali">
              {modeShare.map((mode) => <span key={mode.label} title={`${mode.label}: ${mode.percent}%`} className={mode.color} style={{ width: `${mode.percent}%` }} />)}
              <span className="flex-1 bg-slate-100" />
            </div>
            <div className="space-y-3">
              {modeShare.map((mode) => (
                <div key={mode.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${mode.color}`} />{mode.label}</span>
                  <strong className="tabular-nums">{mode.percent.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</strong>
                </div>
              ))}
            </div>
            <p className="mt-4 flex gap-2 border-t border-slate-100 pt-3 text-[10px] leading-4 text-slate-500"><Info size={14} className="mt-0.5 shrink-0" />{modeShareSource} Angka merupakan pangsa moda tingkat Provinsi Bali, bukan khusus Kota Denpasar.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default InfoPage
