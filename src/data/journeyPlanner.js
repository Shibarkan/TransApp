import { corridorPaths, transitPoints } from './terminals.js'

const transitPointById = Object.fromEntries(transitPoints.map((point) => [point.id, point]))

export function findJourneyOptions(fromPointId, toPointId) {
  if (!fromPointId || !toPointId || fromPointId === toPointId) return []

  const queue = [{ pointId: fromPointId, segments: [], transferPointIds: [], visitedPointIds: new Set([fromPointId]) }]
  const journeys = []

  for (let queueIndex = 0; queueIndex < queue.length && journeys.length < 20; queueIndex += 1) {
    const state = queue[queueIndex]
    if (state.pointId === toPointId && state.segments.length > 0) {
      journeys.push({ segments: state.segments, transferPointIds: state.transferPointIds })
      continue
    }

    for (const path of corridorPaths) {
      const currentIndex = path.pointIds.indexOf(state.pointId)
      if (currentIndex === -1) continue

      const nextPointIds = [path.pointIds[currentIndex - 1], path.pointIds[currentIndex + 1]].filter(Boolean)
      for (const nextPointId of nextPointIds) {
        if (state.visitedPointIds.has(nextPointId)) continue

        const previousSegment = state.segments.at(-1)
        const isTransfer = previousSegment && previousSegment.corridorId !== path.corridorId
        if (isTransfer && state.segments.length >= 3) continue

        const segments = state.segments.map((segment) => ({ ...segment, pointIds: [...segment.pointIds] }))
        if (!isTransfer && previousSegment) {
          const currentSegment = segments.at(-1)
          currentSegment.toPointId = nextPointId
          currentSegment.pointIds.push(nextPointId)
        } else {
          segments.push({
            corridorId: path.corridorId,
            fromPointId: state.pointId,
            toPointId: nextPointId,
            pointIds: [state.pointId, nextPointId],
          })
        }

        queue.push({
          pointId: nextPointId,
          segments,
          transferPointIds: isTransfer ? [...state.transferPointIds, state.pointId] : state.transferPointIds,
          visitedPointIds: new Set([...state.visitedPointIds, nextPointId]),
        })
      }
    }
  }

  const uniqueJourneys = new Map()
  for (const journey of journeys) {
    const signature = journey.segments.map((segment) => segment.corridorId).join('|')
    uniqueJourneys.set(signature, journey)
  }

  return [...uniqueJourneys.values()]
    .sort((first, second) => first.segments.length - second.segments.length)
    .slice(0, 5)
    .map((journey) => ({
      ...journey,
      transferPoints: journey.transferPointIds.map((pointId) => transitPointById[pointId]),
    }))
}
