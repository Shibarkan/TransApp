
import { useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Polyline,
  Popup,
  useMap,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

import PageHeader from '../components/PageHeader.jsx'
import { corridors } from '../data/routes.js'
import {
  corridorPaths,
  transitPoints,
} from '../data/terminals.js'
import { useRoadRoutes } from '../hooks/useRoadRoutes.js'

// ==========================================
// CONFIGURATION
// ==========================================

const DEFAULT_CENTER = [-8.65, 115.21]
const BUS_COUNT = 3
const UPDATE_MS = 180

// Percepatan animasi agar gerakan terlihat
// ketika aplikasi dipresentasikan.
const MOVEMENT_FACTOR = 6

const pointById = Object.fromEntries(
  transitPoints.map((point) => [point.id, point])
)

// ==========================================
// BUS ICON
// ==========================================

const busIcon = L.divIcon({
  className: 'tmd-live-pin',
  html: `
    <div class="tmd-live-bus">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="5" y="3" width="14" height="15" rx="3"/>
        <path d="M5 10h14"/>
        <path d="M8 18v3M16 18v3"/>
        <path d="M8 14h.01M16 14h.01"/>
      </svg>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
})

// ==========================================
// DISTANCE
// ==========================================

function distanceMeters(a, b) {
  const toRad = Math.PI / 180

  const lat1 = a[0] * toRad
  const lat2 = b[0] * toRad

  const dLat = (b[0] - a[0]) * toRad
  const dLon = (b[1] - a[1]) * toRad

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2

  return (
    6371000 *
    2 *
    Math.atan2(
      Math.sqrt(h),
      Math.sqrt(Math.max(0, 1 - h))
    )
  )
}

// ==========================================
// BUILD ROUTE
// ==========================================

function buildTrack(positions) {
  if (!positions || positions.length < 2) {
    return null
  }

  const cumulative = [0]

  for (let i = 1; i < positions.length; i++) {
    const distance = distanceMeters(
      positions[i - 1],
      positions[i]
    )

    cumulative.push(
      cumulative[i - 1] + distance
    )
  }

  return {
    positions,
    cumulative,
    total: cumulative[cumulative.length - 1],
  }
}

// ==========================================
// POSITION INTERPOLATION
// ==========================================

function positionAt(track, distance) {
  if (!track) return DEFAULT_CENTER

  if (track.total <= 0) {
    return track.positions[0]
  }

  const target = Math.max(
    0,
    Math.min(distance, track.total)
  )

  let low = 0
  let high = track.cumulative.length - 1

  while (low < high) {
    const mid = Math.floor((low + high) / 2)

    if (track.cumulative[mid] < target) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  const index = Math.max(1, low)

  const startDistance = track.cumulative[index - 1]
  const endDistance = track.cumulative[index]

  const segmentLength = endDistance - startDistance

  const ratio =
    segmentLength > 0
      ? (target - startDistance) / segmentLength
      : 0

  const a = track.positions[index - 1]
  const b = track.positions[index]

  return [
    a[0] + (b[0] - a[0]) * ratio,
    a[1] + (b[1] - a[1]) * ratio,
  ]
}

// ==========================================
// PROJECT STOP ON ROUTE
// ==========================================

function locateStop(track, position) {
  if (!track || !position) return 0

  const latScale = 111320
  const lngScale =
    111320 * Math.cos(position[0] * Math.PI / 180)

  let bestDistance = Infinity
  let result = 0

  for (let i = 1; i < track.positions.length; i++) {
    const a = track.positions[i - 1]
    const b = track.positions[i]

    const ax = a[1] * lngScale
    const ay = a[0] * latScale

    const bx = b[1] * lngScale
    const by = b[0] * latScale

    const px = position[1] * lngScale
    const py = position[0] * latScale

    const dx = bx - ax
    const dy = by - ay

    const lengthSquared = dx * dx + dy * dy

    const ratio = lengthSquared
      ? Math.max(
          0,
          Math.min(
            1,
            ((px - ax) * dx + (py - ay) * dy) /
              lengthSquared
          )
        )
      : 0

    const x = ax + ratio * dx
    const y = ay + ratio * dy

    const squared =
      (px - x) ** 2 + (py - y) ** 2

    if (squared < bestDistance) {
      bestDistance = squared

      result =
        track.cumulative[i - 1] +
        ratio *
          (
            track.cumulative[i] -
            track.cumulative[i - 1]
          )
    }
  }

  return result
}

// ==========================================
// RANDOM INITIAL BUS POSITIONS
// ==========================================

function createVehicles() {
  return Array.from(
    { length: BUS_COUNT },
    (_, index) => ({
      id: index + 1,

      // Berbeda untuk setiap bus.
      // Posisi awal acak sepanjang jalur.
      phase: 0.12 + Math.random() * 1.7,

      // Kecepatan asumsi masing-masing bus.
      speedKmh: 19 + Math.random() * 9,
    })
  )
}

// ==========================================
// BUS MOVEMENT
// ==========================================

function calculateVehicle(
  vehicle,
  track,
  elapsedSeconds
) {
  if (!track || track.total <= 0) return null

  const speedMps = vehicle.speedKmh / 3.6

  const movement =
    (
      elapsedSeconds *
      speedMps *
      MOVEMENT_FACTOR
    ) / track.total

  // Bus bergerak sampai terminal,
  // lalu bergerak ke arah sebaliknya.
  const cycle = (
    vehicle.phase + movement
  ) % 2

  const forward = cycle <= 1

  const fraction = forward
    ? cycle
    : 2 - cycle

  const currentDistance = fraction * track.total

  return {
    ...vehicle,
    forward,
    currentDistance,
    position: positionAt(
      track,
      currentDistance
    ),
  }
}

// ==========================================
// ESTIMATE ARRIVAL
// ==========================================

function getRemainingDistance(
  vehicle,
  destinationDistance,
  total
) {
  const current = vehicle.currentDistance

  if (vehicle.forward) {
    if (destinationDistance >= current) {
      return destinationDistance - current
    }

    return (
      (total - current) +
      (total - destinationDistance)
    )
  }

  if (destinationDistance <= current) {
    return current - destinationDistance
  }

  return current + destinationDistance
}

// ==========================================
// MAP CAMERA
// ==========================================

function FitRoute({ positions }) {
  const map = useMap()

  useEffect(() => {
    if (positions.length < 2) return

    map.fitBounds(positions, {
      padding: [30, 30],
      animate: false,
    })
  }, [map, positions])

  return null
}

// ==========================================
// MAIN PAGE
// ==========================================

function LiveTrackingPage() {
  const initialCorridor = Number(corridors[0]?.id || 1)

  const [corridorId, setCorridorId] = useState(
    initialCorridor
  )

  const [targetId, setTargetId] = useState('')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const [vehicleSeeds, setVehicleSeeds] = useState(
    createVehicles
  )

  const routing = useRoadRoutes(
    String(corridorId)
  ) || {}

  const roadRoutes = routing.roadRoutes || {}
  const status = routing.status || 'idle'

  const corridor = corridors.find(
    (item) => Number(item.id) === corridorId
  )

  const selectedPath = corridorPaths.find(
    (path) => Number(path.corridorId) === corridorId
  )

  const pointIds = selectedPath?.pointIds || []

  const roadRoute =
    roadRoutes[corridorId] ||
    roadRoutes[String(corridorId)]

  // ==========================================
  // ROUTE GEOMETRY
  // ==========================================

  const hasRoadRoute = Boolean(
    roadRoute?.positions?.length >= 2
  )

  const routePositions = useMemo(() => {
    if (roadRoute?.positions?.length >= 2) {
      return roadRoute.positions
    }

    return (selectedPath?.pointIds || [])
      .map((id) => pointById[id]?.position)
      .filter(
        (position) =>
          Array.isArray(position) &&
          position.length === 2 &&
          position.every(Number.isFinite)
      )
  }, [roadRoute, selectedPath])

  const track = useMemo(
    () => buildTrack(routePositions),
    [routePositions]
  )

  // ==========================================
  // STOPS
  // ==========================================

  const stops = useMemo(() => {
    if (!track || !selectedPath) return []

    return selectedPath.pointIds
      .map((id) => pointById[id])
      .filter(
        (point) =>
          point &&
          Array.isArray(point.position)
      )
      .map((point) => ({
        ...point,
        routeDistance: locateStop(
          track,
          point.position
        ),
      }))
      .sort(
        (a, b) =>
          a.routeDistance - b.routeDistance
      )
  }, [track, selectedPath])

  // ==========================================
  // AUTOMATIC MOVEMENT
  // ==========================================

  useEffect(() => {
    let previous = performance.now()

    const interval = window.setInterval(() => {
      const now = performance.now()

      const delta = Math.min(
        (now - previous) / 1000,
        0.4
      )

      previous = now

      // Tidak mempercepat perjalanan secara
      // tiba-tiba saat tab tidak aktif.
      if (document.hidden) return

      setElapsedSeconds(
        (seconds) => seconds + delta
      )
    }, UPDATE_MS)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  // ==========================================
  // ALL BUS POSITIONS
  // ==========================================

  const vehicles = useMemo(() => {
    if (!track) return []

    return vehicleSeeds
      .map((vehicle) =>
        calculateVehicle(
          vehicle,
          track,
          elapsedSeconds
        )
      )
      .filter(Boolean)
  }, [track, vehicleSeeds, elapsedSeconds])

  // ==========================================
  // SELECTED STOP
  // ==========================================

  const selectedStop =
    stops.find((stop) => stop.id === targetId) ||
    stops[stops.length - 1]

  // ==========================================
  // NEAREST ARRIVING BUS
  // ==========================================

  const arrivalOptions =
    track && selectedStop
      ? vehicles.map((vehicle) => {
          const remaining = getRemainingDistance(
            vehicle,
            selectedStop.routeDistance,
            track.total
          )

          const etaSeconds =
            remaining / (vehicle.speedKmh / 3.6)

          return {
            ...vehicle,
            remaining,
            etaSeconds,
          }
        })
      : []

  const nearestBus = [...arrivalOptions].sort(
    (a, b) => a.etaSeconds - b.etaSeconds
  )[0]

  const etaMinutes = nearestBus
    ? Math.ceil(nearestBus.etaSeconds / 60)
    : null

  const etaText =
    etaMinutes === null
      ? '—'
      : etaMinutes < 1
        ? 'Segera tiba'
        : `± ${etaMinutes} menit`

  // ==========================================
  // CORRIDOR CHANGE
  // ==========================================

  function changeCorridor(event) {
    const id = Number(event.target.value)

    setCorridorId(id)
    setTargetId('')
    setVehicleSeeds(createVehicles())
    setElapsedSeconds(0)
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-dvh bg-[var(--tmd-background,#F3F7F5)] text-[var(--tmd-text,#101827)]">

      <PageHeader
        title="Bus Live"
        subtitle="Posisi armada dan estimasi kedatangan"
      />

      <div className="space-y-4 px-5 pb-10 pt-5">

        {/* HEADER */}
        <div>
          <h2 className="text-[17px] font-bold">
            Pantau Bus
          </h2>

          <p className="mt-1 text-[11px] text-[var(--tmd-muted,#64756F)]">
            Lihat posisi bus di sepanjang koridor
          </p>
        </div>

        {/* CORRIDOR SELECT */}
        <section className="rounded-xl border border-[var(--tmd-border,#E1EAE5)] bg-white px-4 py-3">

          <label
            htmlFor="corridor-select"
            className="block text-[10px] text-[var(--tmd-muted,#64756F)]"
          >
            Koridor
          </label>

          <select
            id="corridor-select"
            value={corridorId}
            onChange={changeCorridor}
            className="mt-1 w-full bg-transparent text-[13px] font-semibold outline-none"
          >
            {corridors.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                Koridor {item.id} · {item.from} – {item.to}
              </option>
            ))}
          </select>
        </section>

        {/* MAP */}
        <section className="relative isolate z-0 h-[49vh] min-h-[350px] overflow-hidden rounded-2xl border border-[var(--tmd-border,#E1EAE5)] bg-[var(--tmd-surface-alt,#EDF3F0)]">

          <MapContainer
            center={
              routePositions[0] ||
              DEFAULT_CENTER
            }
            zoom={12}
            zoomControl
            scrollWheelZoom={false}
            className="h-full w-full"
          >

            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
              maxZoom={19}
            />

            <FitRoute
              positions={routePositions}
            />

            {/* ROUTE */}
            {routePositions.length >= 2 && (
              <Polyline
                positions={routePositions}
                pathOptions={{
                  color: '#0B1533',
                  weight: 5,
                  opacity: 0.85,
                  dashArray: hasRoadRoute
                    ? undefined
                    : '7 8',
                }}
              />
            )}

            {/* STOPS */}
            {stops.map((stop) => (
              <CircleMarker
                key={stop.id}
                center={stop.position}
                radius={
                  selectedStop?.id === stop.id
                    ? 8
                    : 5
                }
                pathOptions={{
                  color: '#0B1533',
                  fillColor:
                    selectedStop?.id === stop.id
                      ? '#48D5B0'
                      : '#FFFFFF',
                  fillOpacity: 1,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => setTargetId(stop.id),
                }}
              >
                <Popup>
                  <strong>{stop.name}</strong>

                  <p>
                    Pilih sebagai titik kedatangan
                  </p>
                </Popup>
              </CircleMarker>
            ))}

            {/* ALL MOVING BUSES */}
            {vehicles.map((vehicle) => (
              <Marker
                key={`${corridorId}-${vehicle.id}`}
                position={vehicle.position}
                icon={busIcon}
                zIndexOffset={1000}
              >
                <Popup>
                  <strong>
                    Trans Metro Dewata
                  </strong>

                  <p>
                    Koridor {corridorId} · Armada {vehicle.id}
                  </p>

                  <p>
                    Arah:{' '}
                    {vehicle.forward
                      ? stops.at(-1)?.name
                      : stops[0]?.name}
                  </p>
                </Popup>
              </Marker>
            ))}

          </MapContainer>

          {/* CORRIDOR OVERLAY */}
          <div className="pointer-events-none absolute left-3 top-3 z-[500]">

            <div className="rounded-lg bg-white px-3 py-2 shadow-sm">

              <p className="text-[11px] font-bold text-[var(--tmd-primary,#0B1533)]">
                Koridor {corridorId}
              </p>

              <p className="mt-0.5 text-[10px] text-[var(--tmd-muted,#64756F)]">
                {vehicles.length} bus pada peta
              </p>
            </div>
          </div>
        </section>

        {/* ROUTE STATUS */}
        <p className="text-[10px] leading-4 text-[var(--tmd-muted,#64756F)]">
          {hasRoadRoute
            ? 'Jalur mengikuti jaringan jalan berdasarkan titik referensi koridor.'
            : status === 'loading'
              ? 'Memuat jaringan jalan...'
              : 'Jalur berdasarkan titik referensi koridor yang tersedia.'}
        </p>

        {/* ARRIVAL CARD */}
        <section className="overflow-hidden rounded-2xl border border-[var(--tmd-border,#E1EAE5)] bg-white">

          <div className="p-4">

            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[15px] font-bold">
                Estimasi Kedatangan
              </h3>

              <span className="rounded-md bg-[var(--tmd-primary-soft,#E9F0ED)] px-2.5 py-1 text-[10px] font-semibold text-[var(--tmd-primary,#0B1533)]">
                Koridor {corridorId}
              </span>
            </div>

            <label
              htmlFor="arrival-stop"
              className="mt-4 block text-[11px] text-[var(--tmd-muted,#64756F)]"
            >
              Pilih titik pemberhentian
            </label>

            <select
              id="arrival-stop"
              value={selectedStop?.id || ''}
              onChange={(event) =>
                setTargetId(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-[var(--tmd-border,#E1EAE5)] bg-[var(--tmd-background,#F3F7F5)] px-3 py-3 text-[12px] font-semibold outline-none"
            >
              {stops.map((stop) => (
                <option
                  key={stop.id}
                  value={stop.id}
                >
                  {stop.name}
                </option>
              ))}
            </select>

            {/* ETA */}
            <div className="mt-5 border-t border-[var(--tmd-border,#E1EAE5)] pt-4">

              <p className="text-[11px] text-[var(--tmd-muted,#64756F)]">
                Perkiraan bus terdekat
              </p>

              <p className="mt-2 text-[30px] font-bold leading-none tracking-tight tabular-nums text-[var(--tmd-primary,#0B1533)]">
                {etaText}
              </p>

              <p className="mt-2 text-[11px] text-[var(--tmd-muted,#64756F)]">
                Menuju {selectedStop?.name || '-'}
              </p>

            </div>
          </div>
        </section>

        {/* CORRIDOR DETAILS */}
        <section className="rounded-2xl border border-[var(--tmd-border,#E1EAE5)] bg-white p-4">

          <p className="text-[11px] text-[var(--tmd-muted,#64756F)]">
            Informasi rute
          </p>

          <h3 className="mt-1 text-[14px] font-bold">
            Koridor {corridorId}
          </h3>

          <p className="mt-2 text-[12px] leading-5 text-[var(--tmd-muted,#64756F)]">
            {corridor?.from} – {corridor?.to}
          </p>

          <div className="mt-4 flex justify-between gap-3 border-t border-[var(--tmd-border,#E1EAE5)] pt-3">

            <span className="text-[11px] text-[var(--tmd-muted,#64756F)]">
              Jam operasional
            </span>

            <span className="text-[11px] font-semibold">
              {corridor?.operatingHours || '-'}
            </span>
          </div>
        </section>

        {/* DATA DISCLOSURE */}
        <p className="pb-3 text-[10px] leading-4 text-[var(--tmd-muted,#64756F)]">
          Posisi armada dan ETA adalah visualisasi
          ilustratif berdasarkan model jalur dan asumsi
          kecepatan, bukan informasi GPS aktual.
        </p>
      </div>

      {/* CUSTOM MAP STYLE */}
      <style>{`
        .tmd-live-pin {
          background: transparent;
          border: none;
          transition: transform 170ms linear;
        }

        .tmd-live-bus {
          display: flex;
          justify-content: center;
          align-items: center;

          width: 42px;
          height: 42px;

          border: 4px solid #FFFFFF;
          border-radius: 50%;

          background: var(--tmd-primary, #0B1533);
          color: white;

          box-shadow:
            0 4px 15px rgba(11, 21, 51, 0.20);
        }

        .tmd-live-pin:hover .tmd-live-bus {
          background: var(--tmd-primary-hover, #172748);
        }

        .leaflet-container {
          font-family: inherit;
          z-index: 0;
        }

        .leaflet-control-zoom {
          border: none !important;
          box-shadow:
            0 3px 12px rgba(11,21,51,0.12) !important;
        }

        .leaflet-control-zoom a {
          color: var(--tmd-primary, #0B1533) !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .tmd-live-pin {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default LiveTrackingPage
