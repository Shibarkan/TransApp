
import { useEffect, useState } from 'react'

function AppInteractionLoader() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let timer

    function handleClick(event) {
      const target = event.target instanceof Element
        ? event.target.closest('button, [role="button"]')
        : null

      if (!target) return
      if (target.disabled) return
      if (target.getAttribute('aria-disabled') === 'true') return
      if (target.hasAttribute('data-no-loading')) return
      if (target.closest('a')) return

      setLoading(true)

      window.clearTimeout(timer)

      timer = window.setTimeout(() => {
        setLoading(false)
      }, 450)
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
      window.clearTimeout(timer)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="
      pointer-events-none fixed inset-x-0 top-0
      z-[90] flex justify-center
    ">
      <div className="
        h-[3px] w-full max-w-[480px]
        overflow-hidden bg-[var(--tmd-border,#DCE5E0)]
      ">
        <div className="tmd-action-progress h-full w-1/3 bg-[var(--tmd-primary,#1769AA)]" />
      </div>

      <style>{`
        .tmd-action-progress {
          animation: tmd-action 0.45s ease-in-out forwards;
        }

        @keyframes tmd-action {
          from { transform: translateX(-110%); }
          to { transform: translateX(310%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .tmd-action-progress {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default AppInteractionLoader
