import { ArrowDownUp, ArrowRight, Clock3, Search } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { corridors, fareNote, standardFare } from '../data/routes.js'
import { findJourneyOptions } from '../data/journeyPlanner.js'
import { corridorPaths, transitPoints } from '../data/terminals.js'

function BookingPage() {
  const [searchParams] = useSearchParams()
  const requestedCorridorId = Number(searchParams.get('koridor'))
  const requestedPath = corridorPaths.find((path) => path.corridorId === requestedCorridorId)
  const [fromPointId, setFromPointId] = useState(searchParams.get('asal') || requestedPath?.pointIds[0] || 'ubung')
  const [toPointId, setToPointId] = useState(searchParams.get('tujuan') || requestedPath?.pointIds.at(-1) || 'sanur-intersection')
  const [hasSearched, setHasSearched] = useState(Boolean(searchParams.get('asal') || searchParams.get('tujuan')))
  const journeys = hasSearched ? findJourneyOptions(fromPointId, toPointId) : []
  const origin = transitPoints.find((point) => point.id === fromPointId)
  const destination = transitPoints.find((point) => point.id === toPointId)

  function swapLocations() {
    setFromPointId(toPointId)
    setToPointId(fromPointId)
    setHasSearched(false)
  }

  return (
    <div>
      <PageHeader title="Cari Perjalanan" subtitle="Temukan koridor yang sesuai" />
      <div className="space-y-7 px-5 py-6">
        <section className="rounded-lg border border-sky-100 bg-gradient-to-br from-sky-100 via-cyan-100 to-emerald-50 p-5 text-slate-900 shadow-sm">
          <SectionTitle title="Dari mana ke mana?" />
          <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); setHasSearched(true) }}>
            <label className="block rounded-lg bg-white px-4 py-3 text-slate-800">
              <span className="mb-1 block text-[11px] font-medium text-slate-500">Lokasi asal</span>
              <select value={fromPointId} onChange={(event) => { setFromPointId(event.target.value); setHasSearched(false) }} className="w-full bg-transparent text-sm font-semibold outline-none">
                {transitPoints.map((point) => <option key={point.id} value={point.id}>{point.name}{point.approximate ? ' · area perkiraan' : ''}</option>)}
              </select>
            </label>
            <div className="flex justify-center">
              <button type="button" onClick={swapLocations} aria-label="Tukar lokasi asal dan tujuan" title="Tukar asal dan tujuan" className="grid size-9 place-items-center rounded-full border border-white bg-white text-rose-700 transition hover:bg-rose-50"><ArrowDownUp size={17} /></button>
            </div>
            <label className="block rounded-lg bg-white px-4 py-3 text-slate-800">
              <span className="mb-1 block text-[11px] font-medium text-slate-500">Lokasi tujuan</span>
              <select value={toPointId} onChange={(event) => { setToPointId(event.target.value); setHasSearched(false) }} className="w-full bg-transparent text-sm font-semibold outline-none">
                {transitPoints.map((point) => <option key={point.id} value={point.id}>{point.name}{point.approximate ? ' · area perkiraan' : ''}</option>)}
              </select>
            </label>
            <button type="submit" disabled={fromPointId === toPointId} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 text-sm font-bold text-white transition-colors hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-slate-300">
              <Search size={17} />Cari rute
            </button>
          </form>
        </section>

        {hasSearched && (
          <section aria-live="polite" className="space-y-3">
            <SectionTitle title="Pilihan perjalanan" action={<span className="text-[10px] text-slate-500">{journeys.length} rute</span>} />
            {journeys.length === 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700">
                Belum ada koneksi langsung atau satu kali transit dari {origin?.name} ke {destination?.name} berdasarkan titik koridor yang tersedia.
              </div>
            ) : journeys.map((journey, index) => (
              <article key={`${journey.segments.map((segment) => segment.corridorId).join('-')}-${index}`} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-700">{journey.segments.length === 1 ? 'LANGSUNG' : `${journey.segments.length - 1} KALI TRANSIT`}</span>
                  <span className="text-xs font-bold">Rp{standardFare.toLocaleString('id-ID')} / orang</span>
                </div>
                <div className="my-4 space-y-3">
                  {journey.segments.map((segment, segmentIndex) => {
                    const corridor = corridors.find((item) => item.id === segment.corridorId)
                    const segmentFrom = transitPoints.find((point) => point.id === segment.fromPointId)
                    const segmentTo = transitPoints.find((point) => point.id === segment.toPointId)
                    return (
                      <div key={`${segment.corridorId}-${segment.fromPointId}-${segment.toPointId}`} className="flex gap-3">
                        <div className="flex flex-col items-center pt-1"><span className="size-3 rounded-full" style={{ backgroundColor: corridor.color }} /><span className="my-1 h-8 border-l border-dashed border-slate-300" /><span className="size-3 rounded-full border-2 border-rose-500 bg-white" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-[11px] font-bold" style={{ color: corridor.color }}>Koridor {corridor.id}</span>
                            <span className="flex items-center gap-1 text-[10px] text-slate-500"><Clock3 size={11} />{corridor.operatingHours}</span>
                          </div>
                          <p className="mt-1 text-sm font-semibold">{segmentFrom.name}</p>
                          <p className="mt-1 text-sm text-slate-600">{segmentTo.name}</p>
                          {segmentIndex < journey.transferPointIds.length && <p className="mt-2 text-[10px] font-medium text-rose-700">Transit di {journey.transferPoints[segmentIndex]?.name}</p>}
                          <Link to={`/rute?koridor=${corridor.id}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">Lihat jalur <ArrowRight size={12} /></Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {journey.transferPointIds.length > 0 && <p className="border-t border-slate-100 pt-3 text-[10px] leading-4 text-slate-500">Transit di {journey.transferPoints.map((point) => point.name).join(' dan ')}. Transit gratis sesuai ketentuan LAIT; QRIS Scan (MPM) tidak termasuk.</p>}
              </article>
            ))}
          </section>
        )}

        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <SectionTitle title="Info perjalanan" />
          <p className="text-xs leading-5 text-slate-600">Hasil mencakup perjalanan langsung atau maksimal dua kali transit berdasarkan titik koridor yang tersedia, bukan semua halte. Tarif reguler Rp{standardFare.toLocaleString('id-ID')} per orang. Halaman ini tidak memesan kursi. {fareNote}</p>
          <Link to="/info" className="mt-3 inline-flex text-xs font-semibold text-rose-700">Lihat tarif & TMD Pass</Link>
        </section>
      </div>
    </div>
  )
}

export default BookingPage
