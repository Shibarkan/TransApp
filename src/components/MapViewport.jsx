import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

function MapViewport({ center, zoom }) {
  const map = useMap()
  const latitude = center[0]
  const longitude = center[1]

  useEffect(() => {
    map.flyTo([latitude, longitude], zoom, { duration: 0.6 })
  }, [latitude, longitude, map, zoom])

  return null
}

export default MapViewport
