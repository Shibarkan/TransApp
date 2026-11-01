const STORAGE_KEY = 'tmd-purchased-tickets-v1'

export function readPurchasedTickets() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export function savePurchasedTicket(ticket) {
  try {
    const tickets = readPurchasedTickets()
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([ticket, ...tickets.filter((item) => item.id !== ticket.id)])
    )
    return true
  } catch {
    return false
  }
}