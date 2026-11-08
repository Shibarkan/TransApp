import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import CorridorCard from '../components/CorridorCard.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { corridors, ridershipPeriod } from '../data/routes.js'
import TransitNetworkMap from '../components/TransitNetworkMap.jsx'
import networkMap from '../soal/[ITEC-U] TMD-Transit Network Map of Denpasar Metro.pdf'
import cityMap from '../soal/[ITEC-U] Peta Tata Ruang Kota Denpasar.png'
import landUseMap from '../soal/[ITEC-U] Rencana Pola Ruang Kota Denpasar.jpg'
import { corridorSource, networkMapSource } from '../data/mobility.js'
import { transitPointsSource } from '../data/terminals.js'
import { corridorPaths, transitPoints } from '../data/terminals.js'
import { useRoadRoutes } from '../hooks/useRoadRoutes.js'

const mapTabs = [
  { id: 'network', label: 'Jaringan koridor' },
  { id: 'official', label: 'Peta resmi' },
  { id: 'city', label: 'Tata ruang' },
  { id: 'land', label: 'Pola ruang' },
]

function RoutesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('map') || 'network'
  const [activeTab, setActiveTab] = useState(mapTabs.some((tab) => tab.id === initialTab) ? initialTab : 'network')
  const selectedCorridorId = Number(searchParams.get('koridor'))
  const [mapCorridorFilter, setMapCorridorFilter] = useState(searchParams.get('koridor') || 'all')
  const { roadRoutes, status: roadRouteStatus } = useRoadRoutes(mapCorridorFilter)
  const visibleCorridors = selectedCorridorId
    ? corridors.filter((corridor) => corridor.id === selectedCorridorId)
    : corridors
  const visiblePaths = mapCorridorFilter === 'all'
    ? corridorPaths
    : corridorPaths.filter((path) => path.corridorId === Number(mapCorridorFilter))
  const transitPointById = Object.fromEntries(transitPoints.map((point) => [point.id, point]))

  function selectTab(tabId) {
    setActiveTab(tabId)
    setSearchParams({ ...(mapCorridorFilter === 'all' ? {} : { koridor: mapCorridorFilter }), ...(tabId === 'network' ? {} : { map: tabId }) })
  }

  function selectMapCorridor(value) {
    setMapCorridorFilter(value)
    setSearchParams({ ...(value === 'all' ? {} : { koridor: value }), ...(activeTab === 'network' ? {} : { map: activeTab }) })
  }

  return (
    <div>
      <PageHeader title="Peta & Koridor" subtitle="Jaringan Trans Metro Dewata" />
      <div className="space-y-6 px-5 py-5">
        <section>
          <div className="mb-3 flex items-end justify-between gap-2">
            <div><h2 className="text-base font-bold">Peta layanan</h2><p className="mt-1 text-xs text-slate-500">Pilih layer untuk melihat kawasan dan jaringan.</p></div>
          </div>
          <div className="-mx-5 flex snap-x gap-1 overflow-x-auto px-5 pb-1 [scrollbar-width:none]" role="tablist" aria-label="Jenis peta">
            {mapTabs.map((tab) => (
              <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => selectTab(tab.id)} className={`min-h-9 shrink-0 snap-start rounded-full border px-3 text-[11px] font-semibold transition-colors ${activeTab === tab.id ? 'border-[var(--tmd-border)] bg-[var(--tmd-primary-soft)] text-[var(--tmd-primary)]' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab === 'network' ? (
            <>
              <label className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
                <span className="shrink-0 font-semibold text-slate-600">Tampilkan</span>
                <select value={mapCorridorFilter} onChange={(event) => selectMapCorridor(event.target.value)} className="min-w-0 flex-1 bg-transparent py-1 font-semibold text-slate-800 outline-none">
                  <option value="all">Semua koridor</option>
                  {corridors.map((corridor) => <option key={corridor.id} value={corridor.id}>Koridor {corridor.id} · {corridor.from} - {corridor.to}</option>)}
                </select>
              </label>
              <div className="mt-3 h-[54vh] min-h-80 overflow-hidden rounded-lg border border-slate-200 bg-[var(--tmd-primary-soft)]">
                <TransitNetworkMap corridorId={mapCorridorFilter} onSelectCorridor={selectMapCorridor} roadRoutes={roadRoutes} />
              </div>
              <div aria-live="polite" className={`mt-2 text-[11px] ${roadRouteStatus === 'error' || roadRouteStatus === 'partial' ? 'text-amber-700' : 'text-slate-500'}`}>
                {roadRouteStatus === 'loading' && 'Memuat jalur jalan dari OpenStreetMap...'}
                {roadRouteStatus === 'ready' && 'Jalur jalan dimuat dari OpenStreetMap Routing.'}
                {roadRouteStatus === 'partial' && 'Sebagian jalur jalan belum tersedia; garis putus-putus adalah koneksi terminal skematik.'}
                {roadRouteStatus === 'error' && 'Layanan routing tidak tersedia; garis putus-putus menunjukkan koneksi terminal, bukan jalur jalan.'}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
                {corridors.map((corridor) => (
                  <button key={corridor.id} type="button" onClick={() => selectMapCorridor(String(corridor.id))} className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] ${mapCorridorFilter === String(corridor.id) ? 'bg-[var(--tmd-primary-soft)] font-semibold text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <span className="h-1 w-4 rounded-full" style={{ backgroundColor: corridor.color }} />K{corridor.id}
                  </button>
                ))}
              </div>
              <div className="mt-3 space-y-2">
                {visiblePaths.map((path) => {
                  const route = corridors.find((corridor) => corridor.id === path.corridorId)
                  const roadRoute = roadRoutes[path.corridorId]
                  const terminalNames = path.pointIds.map((pointId) => transitPointById[pointId].name)
                  return (
                    <details key={path.corridorId} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <summary className="cursor-pointer list-none text-xs font-semibold text-slate-800">
                        <span className="mr-2 inline-block h-1 w-5 rounded-full align-middle" style={{ backgroundColor: route.color }} />
                        Koridor {route.id}{' '}
                        {roadRoute && <span className="ml-2 font-normal text-slate-500">{(roadRoute.distanceMeters / 1000).toFixed(1)} km jalur jalan</span>}
                      </summary>
                      {roadRoute?.roadNames.length > 0 ? (
                        <ol className="ml-5 mt-2 list-decimal space-y-1 text-[11px] leading-4 text-slate-600">
                          {roadRoute.roadNames.map((roadName, index) => <li key={`${roadName}-${index}`}>{roadName}</li>)}
                        </ol>
                      ) : (
                        <p className="mt-2 text-[11px] leading-4 text-slate-500">Titik: {terminalNames.join(' → ')}{roadRoute ? ' · Nama jalan tidak tersedia dari data peta.' : ' · Urutan titik terminal, bukan ruas jalan.'}</p>
                      )}
                    </details>
                  )
                })}
              </div>
            </>
          ) : activeTab === 'official' ? (
            <iframe title="Peta jaringan resmi Trans Metro Dewata" src={`${networkMap}#view=FitH`} className="mt-3 h-[58vh] min-h-80 w-full rounded-lg border border-slate-200 bg-white" />
          ) : (
            <div className="mt-3 flex min-h-80 items-center justify-center overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
              <img src={activeTab === 'city' ? cityMap : landUseMap} alt={activeTab === 'city' ? 'Peta tata ruang Kota Denpasar' : 'Peta rencana pola ruang Kota Denpasar'} className="max-h-[58vh] max-w-full object-contain" />
            </div>
          )}
          <p className="mt-2 text-[10px] leading-4 text-slate-500">{activeTab === 'network' ? `${transitPointsSource} Garis solid mengikuti jaringan jalan hasil routing mobil OSM; ini bukan trase bus resmi atau panduan perjalanan TMD.` : activeTab === 'official' ? networkMapSource : 'Sumber peta: dokumen tata ruang Kota Denpasar yang disertakan. Peta wilayah bukan peta jalan operasional bus.'}</p>
        </section>

        <section>
          <SectionTitle title={selectedCorridorId ? `Koridor ${selectedCorridorId}` : 'Semua koridor'} action={<span className="text-[10px] text-slate-500">Data penumpang {ridershipPeriod}</span>} />
          <div className="space-y-3">
            {visibleCorridors.map((corridor) => <CorridorCard key={corridor.id} corridor={corridor} />)}
          </div>
          <p className="mt-3 text-[10px] leading-4 text-slate-500">Sumber: {corridorSource}</p>
        </section>
      </div>
    </div>
  )
}

export default RoutesPage
