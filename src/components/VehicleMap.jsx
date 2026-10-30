import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import MapViewport from './MapViewport.jsx'
import { isVehicleFresh } from '../lib/vehicleFreshness.js'

const denpasarCenter = [-8.65, 115.216]

function VehicleMap({ vehicles, now, userLocation }) {
  const center = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : denpasarCenter

  return (
    <MapContainer center={denpasarCenter} zoom={12} scrollWheelZoom={false} className="h-full w-full rounded-lg">
      <MapViewport center={center} zoom={userLocation ? 14 : 12} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {vehicles.map((vehicle) => {
        const isLive = isVehicleFresh(vehicle.updated_at, now)
        return (
          <CircleMarker
            key={vehicle.vehicle_id}
            center={[vehicle.latitude, vehicle.longitude]}
            radius={isLive ? 9 : 7}
            pathOptions={{ color: isLive ? '#be123c' : '#94a3b8', fillColor: isLive ? '#fb7185' : '#cbd5e1', fillOpacity: 0.95, weight: 3 }}
          >
            <Popup>
              <div className="min-w-36 text-sm">
                <strong>Bus {vehicle.vehicle_id}</strong>
                <p>Koridor {vehicle.corridor_id}</p>
                <p>{isLive ? 'Posisi diperbarui' : 'Posisi terakhir'}</p>
                <time dateTime={vehicle.updated_at}>{new Date(vehicle.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</time>
                {vehicle.speed_kmh != null && <p>Kecepatan {Number(vehicle.speed_kmh).toFixed(0)} km/jam</p>}
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
      {userLocation && (
        <CircleMarker
          center={[userLocation.latitude, userLocation.longitude]}
          radius={8}
          pathOptions={{ color: '#1d4ed8', fillColor: '#60a5fa', fillOpacity: 1, weight: 3 }}
        >
          <Popup>Lokasi kamu</Popup>
        </CircleMarker>
      )}
    </MapContainer>
  )
}

export default VehicleMap
