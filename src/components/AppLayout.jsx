import { Outlet } from 'react-router-dom'
import BottomNavigation from './BottomNavigation.jsx'

function AppLayout() {
  return (
    <div className="min-h-dvh bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-white shadow-sm">
        <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))]">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </div>
  )
}

export default AppLayout
