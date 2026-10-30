import { BusFront, CircleUserRound, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

function WelcomeHeader() {
  return (
    <header className="bg-gradient-to-br from-sky-300 via-cyan-200 to-emerald-200 px-5 pb-16 pt-8 text-slate-950">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Trans Metro Dewata beranda">
          <span className="grid size-10 place-items-center rounded-full bg-white/70 text-blue-700"><BusFront size={22} /></span>
          <span className="text-sm font-bold">TRANS METRO<br />DEWATA</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/tiket" title="Tiket saya" aria-label="Tiket saya" className="grid size-10 place-items-center rounded-full border border-white/70 bg-white/70 text-blue-800 transition hover:bg-white"><Mail size={19} /></Link>
          <Link to="/akun" title="Akun" aria-label="Akun" className="grid size-10 place-items-center rounded-full border border-white/70 bg-white/70 text-blue-800 transition hover:bg-white"><CircleUserRound size={20} /></Link>
        </div>
      </div>
      <p className="mt-7 text-sm text-slate-700">Selamat datang, jelajahi Bali</p>
      <h1 className="mt-1 text-[25px] font-bold leading-tight">Perjalanan lebih dekat.</h1>
      <p className="mt-2 max-w-xs text-sm leading-5 text-slate-700">Cari koridor, cek jam layanan, dan rencanakan perjalananmu.</p>
    </header>
  )
}

export default WelcomeHeader
