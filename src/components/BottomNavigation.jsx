import { NavLink } from 'react-router-dom'
import { navItems } from '../data/navItems.js'

function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto grid max-w-[480px] grid-cols-5 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur" aria-label="Navigasi utama">
      {navItems.map(({ label, path, Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) =>
            `flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] transition-colors ${isActive ? 'font-semibold text-blue-700' : 'text-slate-500 hover:text-blue-700'}`
          }
        >
          <Icon aria-hidden="true" size={21} strokeWidth={2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNavigation
