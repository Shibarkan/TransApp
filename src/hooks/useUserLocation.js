import { useEffect, useRef, useState } from 'react'

export function useUserLocation() {
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState('idle')
  const watchId = useRef(null)

  function startWatching() {
    if (!navigator.geolocation) {
      setStatus('unsupported')
      return
    }

    if (watchId.current !== null) return
    setStatus('locating')
    watchId.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude })
        setStatus('located')
      },
      (error) => {
        setStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'error')
        if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current)
        watchId.current = null
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 20_000 },
    )
  }

  useEffect(() => () => {
    if (watchId.current !== null) navigator.geolocation?.clearWatch(watchId.current)
  }, [])

  return { location, status, startWatching }
}
