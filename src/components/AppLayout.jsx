
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'motion/react'

import BottomNavigation from './BottomNavigation.jsx'
import AppSplash from './AppSplash.jsx'

const SPLASH_KEY = 'tmd-splash-shown'

function AppLayout() {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return sessionStorage.getItem(SPLASH_KEY) !== 'true'
    } catch {
      return true
    }
  })

  useEffect(() => {
    if (!showSplash) return

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SPLASH_KEY, 'true')
      } catch {
        // Tidak mengganggu aplikasi
      }

      setShowSplash(false)
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [showSplash])

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-dvh text-[var(--tmd-text,#231A1C)]">

        <div className="app-shell mx-auto flex min-h-dvh max-w-[480px] flex-col shadow-sm">

          <main className="min-w-0 flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))]">
            <Outlet />
          </main>

          <BottomNavigation />

        </div>

        {showSplash && <AppSplash />}
      </div>
    </LazyMotion>
  )
}

export default AppLayout
