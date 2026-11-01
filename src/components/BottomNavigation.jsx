
import { Link, useLocation } from 'react-router-dom'
import { navItems } from '../data/navItems.js'

function BottomNavigation() {
  const { pathname } = useLocation()

  // Halaman operasional tetap menandai Beranda saat tidak punya tab khusus.
  const relatedRoutes = ['/pesan', '/tracking', '/rute']

  const normalizedPath =
    relatedRoutes.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`)
    )
      ? '/rute'
      : pathname

  const foundIndex = navItems.findIndex(({ path }) => {
    if (path === '/') {
      return normalizedPath === '/'
    }

    return (
      normalizedPath === path ||
      normalizedPath.startsWith(`${path}/`)
    )
  })

  const activeIndex = foundIndex >= 0 ? foundIndex : 0
  const ActiveIcon = navItems[activeIndex]?.Icon

  const count = navItems.length
  const tabWidth = 100 / count

  return (
    <nav
      aria-label="Navigasi utama"
      className="
        fixed bottom-0 left-1/2 z-50
        w-full max-w-[480px]
        -translate-x-1/2
        overflow-visible
      "
      style={{
        height: 'calc(82px + env(safe-area-inset-bottom))',
      }}
    >
      {/* BACKGROUND NAVIGATION */}
      <div
        className="
          absolute inset-x-0 bottom-0 top-[23px]
          border-t border-[var(--tmd-border,#E1EAE5)]
          bg-white
          shadow-[0_-4px_20px_rgba(11,21,51,0.05)]
        "
      />

      {/* CURVED INDICATOR */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute top-0 z-10
          h-[66px]
          motion-safe:transition-[left]
          motion-safe:duration-500
          motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]
        "
        style={{
          left: `${activeIndex * tabWidth}%`,
          width: `${tabWidth}%`,
        }}
      >
        {/* LEKUKAN PUTIH */}
        <svg
          viewBox="0 0 100 66"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            d="
              M0 23
              L13 23
              C23 23 25 3 50 3
              C75 3 77 23 87 23
              L100 23
              L100 66
              L0 66
              Z
            "
            fill="white"
          />
        </svg>

        {/* LINGKARAN AKTIF */}
        <div
          className="
            absolute left-1/2 top-0
            flex size-[46px]
            -translate-x-1/2
            items-center justify-center
            rounded-full
            border-[4px] border-white
            bg-[var(--tmd-primary,#0B1533)]
            text-white
            shadow-[0_5px_14px_rgba(11,21,51,0.16)]
          "
        >
          {ActiveIcon && (
            <ActiveIcon
              size={21}
              strokeWidth={2.1}
            />
          )}
        </div>
      </div>

      {/* NAVIGATION ITEMS */}
      <div
        className="
          absolute inset-x-0 top-[29px] z-20
          grid h-[49px] px-0
        "
        style={{
          gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        }}
      >
        {navItems.map(({ label, path, Icon }, index) => {
          const active = index === activeIndex

          return (
            <Link
              key={path}
              to={path}
              aria-current={active ? 'page' : undefined}
              className="
                group flex min-w-0 flex-col
                items-center justify-end
                gap-1 rounded-lg pb-2
                text-center
                outline-none
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--tmd-primary,#0B1533)]
                focus-visible:ring-inset
              "
            >
              <span
                className={`
                  flex h-[20px] items-center justify-center
                  transition-colors duration-200
                  ${
                    active
                      ? 'invisible'
                      : 'text-[var(--tmd-muted,#64756F)] group-hover:text-[var(--tmd-primary,#0B1533)]'
                  }
                `}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>

              <span
                className={`
                  text-[10px] leading-tight
                  transition-colors duration-200
                  ${
                    active
                      ? 'font-bold text-[var(--tmd-primary,#0B1533)]'
                      : 'font-medium text-[var(--tmd-muted,#64756F)]'
                  }
                `}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* SAFE AREA */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-x-0 bottom-0
          bg-white
        "
        style={{
          height: 'env(safe-area-inset-bottom)',
        }}
      />
    </nav>
  )
}

export default BottomNavigation
