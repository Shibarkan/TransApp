import { corridorPaths, transitPoints } from '../data/terminals.js'

const pointById = Object.fromEntries(transitPoints.map((point) => [point.id, point]))
const routingBaseUrl = import.meta.env.VITE_OSRM_BASE_URL || 'https://router.project-osrm.org'

export async function fetchRoadRoute(path, signal) {
  const coordinates = path.pointIds
    .map((pointId) => {
      const [latitude, longitude] = pointById[pointId].position
      return `${longitude},${latitude}`
    })
    .join(';')
  const response = await fetch(`${routingBaseUrl}/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true`, { signal })
  if (!response.ok) throw new Error(`Routing service returned ${response.status}`)

  const data = await response.json()
  if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error(data.message || 'Road route unavailable')

  const route = data.routes[0]
  if (!Array.isArray(route.geometry?.coordinates) || route.geometry.coordinates.length < 2) {
    throw new Error('Routing service returned invalid geometry')
  }

  const roadNames = []
  for (const step of route.legs.flatMap((leg) => leg.steps ?? [])) {
    const name = step.name?.trim()
    const normalizedName = name?.toLocaleLowerCase('id-ID').replace(/[.,]/g, '')
    const previousName = roadNames.at(-1)?.toLocaleLowerCase('id-ID').replace(/[.,]/g, '')
    if (name && normalizedName !== previousName) roadNames.push(name)
  }

  const positions = route.geometry.coordinates
    .filter((coordinate) => Array.isArray(coordinate) && coordinate.length >= 2 && coordinate.every(Number.isFinite))
    .map(([longitude, latitude]) => [latitude, longitude])
  if (positions.length < 2) throw new Error('Routing service returned invalid coordinates')

  return {
    corridorId: path.corridorId,
    positions,
    roadNames,
    distanceMeters: route.distance,
  }
}

export { corridorPaths }
