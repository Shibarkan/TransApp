import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export function useLiveVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [connectionStatus, setConnectionStatus] = useState(supabase ? 'connecting' : 'unconfigured')

  useEffect(() => {
    if (!supabase) return undefined

    let isMounted = true
    let hasSnapshot = false
    const pendingEvents = []

    function applyEvent(payload) {
      const changedVehicle = payload.eventType === 'DELETE' ? payload.old : payload.new
      if (!changedVehicle?.vehicle_id) return

      setVehicles((currentVehicles) => {
        const nextVehicles = new Map(currentVehicles.map((vehicle) => [vehicle.vehicle_id, vehicle]))
        if (payload.eventType === 'DELETE' || changedVehicle.is_active === false) {
          nextVehicles.delete(changedVehicle.vehicle_id)
        } else {
          nextVehicles.set(changedVehicle.vehicle_id, changedVehicle)
        }
        return [...nextVehicles.values()]
      })
    }

    async function loadSnapshot() {
      const { data, error } = await supabase
        .from('vehicle_positions')
        .select('vehicle_id, corridor_id, latitude, longitude, heading, speed_kmh, updated_at, is_active')
        .eq('is_active', true)

      if (!isMounted) return
      if (error) {
        setConnectionStatus('error')
        return
      }

      setVehicles(data ?? [])
      hasSnapshot = true
      pendingEvents.forEach(applyEvent)
      pendingEvents.length = 0
    }

    const channel = supabase
      .channel('public:vehicle_positions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'vehicle_positions',
      }, (payload) => {
        if (hasSnapshot) applyEvent(payload)
        else pendingEvents.push(payload)
      })
      .subscribe((status) => {
        if (!isMounted) return
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected')
          void loadSnapshot()
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setConnectionStatus('error')
        } else if (status === 'CLOSED') {
          setConnectionStatus('closed')
        }
      })

    return () => {
      isMounted = false
      void supabase.removeChannel(channel)
    }
  }, [])

  return { vehicles, connectionStatus }
}
