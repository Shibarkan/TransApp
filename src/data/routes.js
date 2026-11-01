export const standardFare = 4400
export const specialFare = 2000

export const paymentMethods = [
  {
    id: 'cash',
    label: 'Tunai',
    detail: 'Bayar langsung kepada petugas.',
  },
  {
    id: 'qris',
    label: 'QRIS',
    detail: 'Pindai QRIS (MPM) saat transaksi.',
  },
  {
    id: 'emoney',
    label: 'Kartu uang elektronik',
    detail: 'Gunakan kartu yang didukung operator.',
  },
  {
    id: 'lait',
    label: 'LAIT / TMD Pass',
    detail: 'Tiket digital dan pilihan masa transit.',
  },
]

export const corridors = [
  {
    id: 1,
    shortName: 'K1',
    color: '#e11d48',
    from: 'Sentral Parkir Kuta',
    to: 'Terminal Pesiapan',
    operatingHours: '04.30-18.53',
    headway: '14-25 menit',
    passengersPerDay: 1160,
    loadFactor: 38.47,
  },
  {
    id: 2,
    shortName: 'K2',
    color: '#2563eb',
    from: 'Terminal Ubung',
    to: 'Bandara Ngurah Rai',
    operatingHours: '05.00-19.00',
    passengersPerDay: 217,
    loadFactor: 35.34,
  },
  {
    id: 3,
    shortName: 'K3',
    color: '#0891b2',
    from: 'Terminal Ubung',
    to: 'Sanur',
    via: 'Dalung / Icon Bali Mall',
    operatingHours: '05.00-18.35',
    passengersPerDay: 527,
    loadFactor: 20.19,
  },
  {
    id: 4,
    shortName: 'K4',
    color: '#7c3aed',
    from: 'Terminal Ubung',
    to: 'Monkey Forest',
    operatingHours: '05.00-18.20',
    passengersPerDay: 797,
    loadFactor: 28.63,
  },
  {
    id: 5,
    shortName: 'K5',
    color: '#d97706',
    from: 'Sentral Parkir Kuta',
    to: 'Politeknik Negeri Bali',
    via: 'Titi Banda',
    operatingHours: '05.00-18.30',
    headway: '15-22 menit',
    passengersPerDay: 505,
    loadFactor: 31.41,
  },
  {
    id: 6,
    shortName: 'K6',
    color: '#059669',
    from: 'Sentral Parkir Kuta',
    to: 'ITDC The Nusa Dua',
    via: 'Bandara Ngurah Rai',
    operatingHours: '05.00-18.32',
    headway: '20-36 menit',
    passengersPerDay: 391,
    loadFactor: 14.99,
  },
]

export const ridershipPeriod = 'Juni 2026'
export const fareNote = 'Transit antarkoridor gratis, kecuali menggunakan QRIS Scan (MPM).'
