import { useEffect, useState } from 'react'
import { corridorPaths } from '../data/terminals.js'
import { fetchRoadRoute } from '../lib/roadRouting.js'

export function useRoadRoutes(corridorId) {
  const [roadRoutes, setRoadRoutes] = useState({})
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const controller = new AbortController()
    const paths = corridorId === 'all'
      ? corridorPaths
      : corridorPaths.filter((path) => path.corridorId === Number(corridorId))

    async function loadRoutes() {
      setStatus('loading')
      const results = await Promise.allSettled(paths.map((path) => fetchRoadRoute(path, controller.signal)))
      if (controller.signal.aborted) return

      const successfulRoutes = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)
      setRoadRoutes((currentRoutes) => ({
        ...currentRoutes,
        ...Object.fromEntries(successfulRoutes.map((route) => [route.corridorId, route])),
      }))
      const failedCount = results.filter((result) => result.status === 'rejected').length
      setStatus(successfulRoutes.length === 0 ? 'error' : failedCount > 0 ? 'partial' : 'ready')
    }

    void loadRoutes()
    return () => controller.abort()
  }, [corridorId])

  return { roadRoutes, status }
}
