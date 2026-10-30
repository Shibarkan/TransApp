import { useEffect } from 'react'
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import { corridors } from '../data/routes.js'
import { corridorPaths, transitPoints } from '../data/terminals.js'

const pointById = Object.fromEntries(transitPoints.map((point) => [point.id, point]))
const corridorById = Object.fromEntries(corridors.map((corridor) => [corridor.id, corridor]))

function FitNetwork({ corridorId }) {
  const map = useMap()

  useEffect(() => {
    const activePaths = corridorId === 'all'
      ? corridorPaths
      : corridorPaths.filter((path) => path.corridorId === Number(corridorId))
    const positions = activePaths.flatMap((path) => path.pointIds.map((pointId) => pointById[pointId].position))

    if (positions.length === 1) map.flyTo(positions[0], 13, { duration: 0.6 })
    else if (positions.length > 1) map.fitBounds(positions, { padding: [28, 28], maxZoom: 11, animate: true })
  }, [corridorId, map])

  return null
}

function TransitNetworkMap({ corridorId, onSelectCorridor, roadRoutes }) {
  const visiblePaths = corridorId === 'all'
    ? corridorPaths
    : corridorPaths.filter((path) => path.corridorId === Number(corridorId))
  const visiblePointIds = new Set(visiblePaths.flatMap((path) => path.pointIds))
  const visiblePoints = transitPoints.filter((point) => visiblePointIds.has(point.id))

  return (
    <MapContainer center={[-8.65, 115.216]} zoom={10} scrollWheelZoom className="h-full w-full rounded-lg">
      <FitNetwork corridorId={corridorId} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {visiblePaths.map((path) => {
        const route = corridorById[path.corridorId]
        const color = route.color
        const roadRoute = roadRoutes[path.corridorId]
        const positions = roadRoute?.positions ?? path.pointIds.map((pointId) => pointById[pointId].position)
        return (
          <Polyline
            key={path.corridorId}
            positions={positions}
            pathOptions={{ color, weight: corridorId === 'all' ? 5 : 7, opacity: 0.86, dashArray: roadRoute ? undefined : '7 8', lineCap: 'round', lineJoin: 'round' }}
            eventHandlers={{ click: () => onSelectCorridor(String(path.corridorId)) }}
          >
            <Popup>
              <strong>Koridor {route.id}</strong>
              <p>{route.from} ke {route.to}</p>
              {route.via && <p>via {route.via}</p>}
              <p>{roadRoute ? 'Jalur jalan perkiraan dari OpenStreetMap.' : 'Garis terminal skematik; jalur jalan belum dimuat.'}</p>
            </Popup>
          </Polyline>
        )
      })}
      {visiblePoints.map((point) => {
        const color = corridorById[point.corridorIds[0] ?? 1].color
        return (
          <CircleMarker
            key={point.id}
            center={point.position}
            radius={point.detail.includes('Terminal') ? 8 : 6}
            pathOptions={{ color, fillColor: '#ffffff', fillOpacity: 1, weight: 3 }}
          >
            <Popup>
              <strong>{point.name}</strong>
              <p>{point.detail}{point.approximate ? ' · perkiraan area' : ''}</p>
              <p className="mb-1">Pilih koridor:</p>
              <div className="flex gap-1">
                {point.corridorIds.map((id) => (
                  <button key={id} type="button" onClick={() => onSelectCorridor(String(id))} className="rounded border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700">
                    K{id}
                  </button>
                ))}
              </div>
              <a href={`https://www.openstreetmap.org/?mlat=${point.position[0]}&mlon=${point.position[1]}#map=16/${point.position[0]}/${point.position[1]}`} target="_blank" rel="noreferrer">Buka di OpenStreetMap</a>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}

export default TransitNetworkMap
