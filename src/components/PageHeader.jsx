import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function PageHeader({ title, subtitle, backTo = '/' }) {
  return (
    <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
      <Link to={backTo} aria-label="Kembali" className="rounded-full p-2 text-slate-600 hover:bg-slate-100">
        <ArrowLeft size={20} />
      </Link>
      <div>
        <h1 className="text-lg font-bold">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
    </header>
  )
}

export default PageHeader
