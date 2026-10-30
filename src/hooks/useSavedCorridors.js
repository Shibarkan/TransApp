import { useEffect, useState } from 'react'

const STORAGE_KEY = 'trans-metro-saved-corridors'

function readSavedCorridors() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(stored) ? stored.filter(Number.isInteger) : []
  } catch {
    return []
  }
}

export function useSavedCorridors() {
  const [savedCorridors, setSavedCorridors] = useState(readSavedCorridors)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCorridors))
    } catch {
      return
    }
  }, [savedCorridors])

  function toggleSavedCorridor(corridorId) {
    setSavedCorridors((current) => current.includes(corridorId)
      ? current.filter((savedId) => savedId !== corridorId)
      : [...current, corridorId])
  }

  return { savedCorridors, toggleSavedCorridor }
}
