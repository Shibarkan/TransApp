import { useEffect, useRef } from 'react'
import { BusFront, Ticket } from 'lucide-react'
import JsBarcode from 'jsbarcode'

function TransitTicketCard({ ticket }) {
  const barcodeRef = useRef(null)

  useEffect(() => {
    if (!barcodeRef.current) return

    JsBarcode(barcodeRef.current, ticket.code, {
      format: 'CODE128',
      lineColor: '#111827',
      width: 2,
      height: 58,
      displayValue: false,
      margin: 0,
    })
  }, [ticket.code])

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white">
      <div className="flex items-center justify-between gap-3 bg-[var(--tmd-primary,#1769AA)] px-4 py-3 text-white">
        <span className="flex items-center gap-2 text-xs font-bold">
          <Ticket size={16} aria-hidden="true" />
          TRANS METRO DEWATA
        </span>
        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold">
          Aktif
        </span>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[15px] font-black text-[var(--tmd-primary,#1769AA)]">TMD</span>
          <div className="min-w-0 text-right">
            <p className="text-[10px] text-slate-500">Kode pemesanan</p>
            <p className="truncate font-mono text-sm font-bold tracking-wide text-slate-900">
              {ticket.code}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-300 bg-white px-2 py-2">
          <svg
            ref={barcodeRef}
            role="img"
            aria-label={`Barcode tiket ${ticket.code}`}
            className="block h-[66px] w-full"
          />
        </div>

        <div className="mt-4 flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--tmd-primary-soft,#EAF4FF)] text-[var(--tmd-primary,#1769AA)]">
            <BusFront size={18} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-5 text-slate-900">{ticket.origin}</p>
            <p className="mt-1 text-xs text-slate-500">ke {ticket.destination}</p>
            <p className="mt-2 text-[10px] font-medium text-slate-500">
              {ticket.segments.map((segment) => `Koridor ${segment.corridorId}`).join(' · ')}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
          <div>
            <p className="text-[9px] text-slate-500">Tanggal</p>
            <p className="mt-1 text-[10px] font-semibold text-slate-800">{ticket.travelDate}</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500">Penumpang</p>
            <p className="mt-1 text-[10px] font-semibold text-slate-800">{ticket.passengerCount} orang</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500">Total</p>
            <p className="mt-1 text-[10px] font-semibold text-slate-800">
              Rp{ticket.total.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default TransitTicketCard