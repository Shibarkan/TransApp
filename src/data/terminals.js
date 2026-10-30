export const transitPoints = [
  { id: 'ubung', name: 'Terminal Ubung', detail: 'Terminal utama', position: [-8.635227, 115.205919], corridorIds: [2, 3, 4] },
  { id: 'sentral-kuta', name: 'Sentral Parkir Kuta', detail: 'Terminal utama', position: [-8.713143, 115.180801], corridorIds: [1, 5, 6] },
  { id: 'pesiapan', name: 'Terminal Pesiapan', detail: 'Terminal tujuan', position: [-8.535145, 115.113131], corridorIds: [1] },
  { id: 'ngurah-rai', name: 'Bandara Ngurah Rai', detail: 'Terminal tujuan / transit', position: [-8.746515, 115.167370], corridorIds: [2, 6] },
  { id: 'sanur-intersection', name: 'Simpang Sanur', detail: 'Halte / titik koridor', position: [-8.673773, 115.259156], corridorIds: [3] },
  { id: 'monkey-forest', name: 'Monkey Forest', detail: 'Titik tujuan Ubud', position: [-8.518735, 115.258320], corridorIds: [4] },
  { id: 'dalung', name: 'Dalung', detail: 'Area koridor', position: [-8.618425, 115.168572], corridorIds: [3], approximate: true },
  { id: 'titi-banda', name: 'Titi Banda', detail: 'Titik transit koridor', position: [-8.649301, 115.255042], corridorIds: [5] },
  { id: 'pnb', name: 'Politeknik Negeri Bali', detail: 'Terminal tujuan Jimbaran', position: [-8.799197, 115.161818], corridorIds: [5] },
  { id: 'itdc-nusa-dua', name: 'ITDC The Nusa Dua', detail: 'Area tujuan', position: [-8.801678, 115.223931], corridorIds: [6], approximate: true },
]

export const corridorPaths = [
  { corridorId: 1, pointIds: ['sentral-kuta', 'pesiapan'] },
  { corridorId: 2, pointIds: ['ubung', 'ngurah-rai'] },
  { corridorId: 3, pointIds: ['ubung', 'dalung', 'sanur-intersection'] },
  { corridorId: 4, pointIds: ['ubung', 'monkey-forest'] },
  { corridorId: 5, pointIds: ['sentral-kuta', 'titi-banda', 'pnb'] },
  { corridorId: 6, pointIds: ['sentral-kuta', 'ngurah-rai', 'itdc-nusa-dua'] },
]

export const transitPointsSource = 'Koordinat terminal dan titik koridor: OpenStreetMap contributors (ODbL). Dalung dan kawasan ITDC ditandai perkiraan.'
