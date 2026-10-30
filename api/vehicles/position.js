import { timingSafeEqual } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

function authorized(request) {
  const expectedToken = process.env.GPS_INGEST_TOKEN
  const suppliedToken = request.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!expectedToken || !suppliedToken) return false

  const expected = Buffer.from(expectedToken)
  const supplied = Buffer.from(suppliedToken)
  return expected.length === supplied.length && timingSafeEqual(expected, supplied)
}

function validOptionalNumber(value, minimum, maximum) {
  return value == null || (Number.isFinite(value) && value >= minimum && value <= maximum)
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store')

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.GPS_INGEST_TOKEN) {
    return response.status(503).json({ error: 'GPS ingestion is not configured' })
  }

  if (!authorized(request)) {
    return response.status(401).json({ error: 'Unauthorized' })
  }

  const payload = typeof request.body === 'string'
    ? (() => { try { return JSON.parse(request.body) } catch { return null } })()
    : request.body

  const vehicleId = typeof payload?.vehicle_id === 'string' ? payload.vehicle_id.trim() : ''
  const corridorId = payload?.corridor_id
  const latitude = payload?.latitude
  const longitude = payload?.longitude
  const heading = payload?.heading
  const speedKmh = payload?.speed_kmh
  const isActive = payload?.is_active ?? true

  if (
    !vehicleId || vehicleId.length > 40 ||
    !Number.isInteger(corridorId) || corridorId < 1 || corridorId > 6 ||
    !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
    !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
    !validOptionalNumber(heading, 0, 359) ||
    !validOptionalNumber(speedKmh, 0, 200) ||
    typeof isActive !== 'boolean'
  ) {
    return response.status(400).json({ error: 'Invalid vehicle position payload' })
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { error } = await supabase.from('vehicle_positions').upsert({
    vehicle_id: vehicleId,
    corridor_id: corridorId,
    latitude,
    longitude,
    heading: heading ?? null,
    speed_kmh: speedKmh ?? null,
    is_active: isActive,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'vehicle_id' })

  if (error) {
    console.error('Vehicle position upsert failed:', error.message)
    return response.status(502).json({ error: 'Could not save vehicle position' })
  }

  return response.status(200).json({ ok: true, vehicle_id: vehicleId })
}
