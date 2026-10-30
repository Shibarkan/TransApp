import { useEffect, useState } from 'react'
import { AlertCircle, BusFront, ExternalLink, LocateFixed, MapPin, Radio, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import VehicleMap from '../components/VehicleMap.jsx'
import { corridors } from '../data/routes.js'
import { useUserLocation } from '../hooks/useUserLocation.js'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { isVehicleFresh } from '../lib/vehicleFreshness.js'
import { distanceInMeters } from '../lib/distance.js'
import { useLiveVehicles } from '../hooks/useLiveVehicles.js'

const statusLabels = {
  connected: 'Terhubung',
  connecting: 'Menghubungkan',
  unconfigured: 'Belum dikonfigurasi',
  error: 'Koneksi bermasalah',
  closed: 'Koneksi terputus',
}

function LiveTrackingPage() {
  const { vehicles, connectionStatus } = useLiveVehicles()
  const { location, status: locationStatus, startWatching } = useUserLocation()
  const [corridorFilter, setCorridorFilter] = useState('all')
  const [now, setNow] = useState(0)
  const filteredVehicles = corridorFilter === 'all'
    ? vehicles
    : vehicles.filter((vehicle) => vehicle.corridor_id === Number(corridorFilter))
  const liveCount = filteredVehicles.filter((vehicle) => isVehicleFresh(vehicle.updated_at, now)).length
  const nearestVehicle = location
    ? filteredVehicles
      .map((vehicle) => ({ vehicle, distance: distanceInMeters(location, vehicle) }))
      .sort((first, second) => first.distance - second.distance)[0]
    : null

  useEffect(() => {
    const initialTimerId = window.setTimeout(() => setNow(Date.now()), 0)
    const timerId = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => {
      window.clearTimeout(initialTimerId)
      window.clearInterval(timerId)
    }
  }, [])

  const statusColor = connectionStatus === 'connected'
    ? 'bg-emerald-100 text-emerald-800'
    : connectionStatus === 'error' || connectionStatus === 'closed'
      ? 'bg-rose-100 text-rose-800'
      : 'bg-amber-100 text-amber-800'

  return (
    <div>
      <PageHeader title="Bus Terdekat" subtitle="Posisi armada Trans Metro Dewata" />
      <div className="space-y-4 px-5 py-5">
        <section className="flex items-center justify-between gap-3 rounded-lg border border-rose-100 bg-gradient-to-r from-rose-50 to-orange-50 p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-white text-rose-600"><BusFront size={20} /></span>
            <div>
              <p className="text-lg font-bold tabular-nums text-rose-700">{liveCount} <span className="text-sm font-medium text-slate-700">bus live</span></p>
              <p className="text-xs text-slate-600">{filteredVehicles.length} posisi diterima</p>
            </div>
          </div>
          <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusColor}`}>
            {connectionStatus === 'connected' ? <Wifi size={13} /> : connectionStatus === 'error' || connectionStatus === 'closed' ? <WifiOff size={13} /> : <RefreshCw size={13} className={connectionStatus === 'connecting' ? 'animate-spin' : ''} />}
            {statusLabels[connectionStatus]}
          </span>
        </section>

        <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
          <Radio size={17} className="shrink-0 text-blue-700" />
          <span className="sr-only">Filter koridor</span>
          <select value={corridorFilter} onChange={(event) => setCorridorFilter(event.target.value)} className="w-full bg-transparent font-medium outline-none">
            <option value="all">Semua koridor</option>
            {corridors.map((corridor) => <option key={corridor.id} value={corridor.id}>Koridor {corridor.id} · {corridor.from} - {corridor.to}</option>)}
          </select>
        </label>

        <div className="relative h-[55vh] min-h-80 overflow-hidden rounded-lg border border-slate-200 bg-sky-50">
          <VehicleMap vehicles={filteredVehicles} now={now} userLocation={location} />
          {filteredVehicles.length === 0 && (
            <div className="pointer-events-none absolute inset-x-4 top-4 z-[500] mx-auto max-w-sm rounded-lg border border-slate-200 bg-white/95 p-3 text-center shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-slate-800">Belum ada posisi bus untuk ditampilkan</p>
              <p className="mt-1 text-xs text-slate-500">{isSupabaseConfigured ? connectionStatus === 'connected' ? 'Menunggu koordinat GPS dari armada.' : 'Menyambungkan feed posisi armada.' : 'Feed GPS armada belum tersambung.'}</p>
            </div>
          )}
          <button type="button" onClick={startWatching} disabled={locationStatus === 'locating' || locationStatus === 'located'} className="absolute bottom-4 right-4 z-[500] flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-rose-700 shadow-md transition hover:bg-rose-50 disabled:cursor-default disabled:text-emerald-700">
            {locationStatus === 'located' ? <MapPin size={17} /> : <LocateFixed size={17} />}
            {locationStatus === 'located' ? 'Lokasi aktif' : locationStatus === 'locating' ? 'Mencari lokasi...' : 'Gunakan lokasi saya'}
          </button>
        </div>

        {locationStatus === 'denied' && <p role="status" className="flex items-center gap-2 text-xs text-rose-700"><AlertCircle size={15} />Izin lokasi ditolak. Aktifkan izin lokasi browser untuk mencari bus terdekat.</p>}
        {locationStatus === 'unsupported' && <p role="status" className="text-xs text-amber-800">Browser ini belum mendukung akses lokasi.</p>}
        {locationStatus === 'error' && <p role="status" className="text-xs text-amber-800">Lokasi belum berhasil didapatkan. Coba lagi di area dengan sinyal GPS yang lebih baik.</p>}

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600"><MapPin size={18} /></span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold">Bus terdekat</h2>
              {!location && <p className="mt-1 text-xs leading-5 text-slate-500">Izinkan lokasi untuk menghitung jarak ke armada aktif di sekitarmu.</p>}
              {location && !nearestVehicle && <p className="mt-1 text-xs leading-5 text-slate-500">Belum ada armada pada koridor yang dipilih.</p>}
              {nearestVehicle && (
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                  <strong className="text-slate-800">Bus {nearestVehicle.vehicle.vehicle_id}</strong>
                  <span>Koridor {nearestVehicle.vehicle.corridor_id}</span>
                  <span>{nearestVehicle.distance < 1000 ? `${Math.round(nearestVehicle.distance)} m` : `${(nearestVehicle.distance / 1000).toFixed(1)} km`}</span>
                  <span className={`font-semibold ${isVehicleFresh(nearestVehicle.vehicle.updated_at, now) ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {isVehicleFresh(nearestVehicle.vehicle.updated_at, now) ? 'Live' : 'Posisi terakhir'}
                  </span>
                </div>
              )}
            </div>
            <Radio className="shrink-0 text-rose-500" size={17} />
          </div>
        </section>

        {!isSupabaseConfigured && (
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-sm font-bold text-slate-900">Feed GPS belum tersambung</h2>
            <p className="mt-1 text-xs leading-5 text-slate-600">Posisi live memerlukan feed resmi dari operator. Untuk melihat tracking armada sekarang, gunakan aplikasi Trans Metro Dewata.</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              <a href="https://play.google.com/store/apps/details?id=ngi.muchi.bali" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-500">
                Google Play <ExternalLink size={13} />
              </a>
              <a href="https://apps.apple.com/id/app/trans-metro-dewata/id6744358191" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-500">
                App Store <ExternalLink size={13} />
              </a>
            </div>
          </section>
        )}

        {filteredVehicles.length > 0 && (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold">Armada terpantau</h2>
              <span className="text-[10px] text-slate-500">Live jika diperbarui &lt; 2 menit</span>
            </div>
            <div className="space-y-2">
              {filteredVehicles.map((vehicle) => {
                const isLive = isVehicleFresh(vehicle.updated_at, now)
                return (
                  <article key={vehicle.vehicle_id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-center gap-3">
                      <span className={`size-2.5 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <div><p className="text-sm font-semibold">Bus {vehicle.vehicle_id} · Koridor {vehicle.corridor_id}</p><p className="mt-0.5 text-[11px] text-slate-500">Pembaruan {new Date(vehicle.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p></div>
                    </div>
                    <span className={`text-xs font-semibold ${isLive ? 'text-emerald-700' : 'text-slate-500'}`}>{isLive ? 'Live' : 'Data lama'}</span>
                  </article>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default LiveTrackingPage
