import { ChevronRight, CircleHelp, FileText, LogIn, ShieldCheck, UserRound } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'

const accountLinks = [
  { label: 'Data diri', Icon: UserRound },
  { label: 'Riwayat transaksi', Icon: FileText },
  { label: 'Pusat bantuan', Icon: CircleHelp },
  { label: 'Kebijakan privasi', Icon: ShieldCheck },
]

function AccountPage() {
  return (
    <div>
      <PageHeader title="Akun" subtitle="Kelola informasi akunmu" />
      <div className="space-y-6 px-5 py-6">
        <section className="flex items-center gap-4 rounded-2xl bg-blue-50 p-5">
          <span className="grid size-14 place-items-center rounded-full bg-blue-700 text-white"><UserRound size={25} /></span>
          <div><h2 className="font-bold">Pengguna Trans Metro</h2><p className="mt-1 text-sm text-slate-500">Masuk untuk mengelola akun</p></div>
        </section>
        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 px-4">
          {accountLinks.map(({ label, Icon }) => (
            <button key={label} type="button" className="flex w-full items-center gap-3 py-4 text-left text-sm font-medium text-slate-700">
              <Icon size={19} className="text-blue-700" /><span className="flex-1">{label}</span><ChevronRight size={17} className="text-slate-400" />
            </button>
          ))}
        </div>
        <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 py-3 text-sm font-semibold text-blue-700"><LogIn size={18} />Masuk atau daftar</button>
      </div>
    </div>
  )
}

export default AccountPage
