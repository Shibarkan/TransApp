const LIVE_WINDOW_MS = 120_000

export function isVehicleFresh(updatedAt, now = Date.now()) {
  const timestamp = Date.parse(updatedAt)
  return Number.isFinite(timestamp) && timestamp <= now + 30_000 && now - timestamp <= LIVE_WINDOW_MS
}
