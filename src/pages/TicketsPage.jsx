import { Bookmark, BookmarkX, MapPinned } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { corridors } from '../data/routes.js'
import { useSavedCorridors } from '../hooks/useSavedCorridors.js'

function TicketsPage() {
  const { savedCorridors, toggleSavedCorridor } = useSavedCorridors()
  const routes = corridors.filter((corridor) => savedCorridors.includes(corridor.id))

  return (
    <div>
      <PageHeader title="Rute Favorit" subtitle="Koridor yang kamu simpan" />
      <div className="space-y-4 px-5 py-6">
        {routes.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-6 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-amber-100 text-amber-700"><Bookmark size={24} /></span>
            <h2 className="mt-4 text-base font-bold">Belum ada rute favorit</h2>
            <p className="mt-2 max-w-xs text-sm leading-5 text-slate-500">Simpan koridor yang sering kamu gunakan agar mudah ditemukan lagi.</p>
            <Link to="/pesan" className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-rose-500">Jelajahi koridor</Link>
          </div>
        ) : (
          routes.map((corridor) => (
            <article key={corridor.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-rose-700">KORIDOR {corridor.id}</span>
                  <h2 className="mt-1 text-sm font-bold">{corridor.from}</h2>
                  {corridor.via && <p className="mt-1 text-xs text-slate-500">via {corridor.via}</p>}
                  <p className="mt-1 text-sm text-slate-600">ke {corridor.to}</p>
                </div>
                <button type="button" onClick={() => toggleSavedCorridor(corridor.id)} aria-label={`Hapus Koridor ${corridor.id} dari favorit`} className="grid size-9 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600 transition-colors hover:bg-rose-100"><BookmarkX size={17} /></button>
              </div>
              <Link to={`/rute?koridor=${corridor.id}`} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-rose-700"><MapPinned size={15} />Lihat peta dan jadwal</Link>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export default TicketsPage
