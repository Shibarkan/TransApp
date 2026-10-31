
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'trans-metro-saved-corridors'
const CHANGE_EVENT = 'tmd-favorites-changed'

// Membaca data favorit
function readSavedCorridors() {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? '[]'
    )

    if (!Array.isArray(stored)) return []

    return [...new Set(
      stored.filter(
        (id) =>
          Number.isInteger(id) &&
          id >= 1 &&
          id <= 6
      )
    )]
  } catch {
    return []
  }
}

// Menyimpan data favorit
function writeSavedCorridors(corridors) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(corridors)
    )

    window.dispatchEvent(new Event(CHANGE_EVENT))

    return true
  } catch {
    return false
  }
}

export function useSavedCorridors() {
  const [savedCorridors, setSavedCorridors] = useState(
    readSavedCorridors
  )

  useEffect(() => {
    function syncFavorites() {
      setSavedCorridors(readSavedCorridors())
    }

    window.addEventListener(
      CHANGE_EVENT,
      syncFavorites
    )

    window.addEventListener(
      'storage',
      syncFavorites
    )

    return () => {
      window.removeEventListener(
        CHANGE_EVENT,
        syncFavorites
      )

      window.removeEventListener(
        'storage',
        syncFavorites
      )
    }
  }, [])

  function toggleSavedCorridor(corridorId) {
    const current = readSavedCorridors()

    const next = current.includes(corridorId)
      ? current.filter((id) => id !== corridorId)
      : [...current, corridorId]

    if (writeSavedCorridors(next)) {
      setSavedCorridors(next)
    }
  }

  function isCorridorSaved(corridorId) {
    return savedCorridors.includes(corridorId)
  }

  return {
    savedCorridors,
    toggleSavedCorridor,
    isCorridorSaved,
  }
}
