
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Banknote, ChevronLeft, ChevronRight, CreditCard, QrCode, Ticket } from 'lucide-react'

import PageHeader from '../components/PageHeader.jsx'
import {
  corridors,
  paymentMethods,
  standardFare,
  specialFare,
  fareNote,
} from '../data/routes.js'

// ==========================================
// TRANS METRO DEWATA
// PASSENGER INFORMATION CENTER
// ==========================================

const rupiah = (value) =>
  `Rp${Number(value).toLocaleString('id-ID')}`

const paymentIcons = {
  cash: Banknote,
  qris: QrCode,
  emoney: CreditCard,
  lait: Ticket,
}

// ==========================================
// PANDUAN PERJALANAN
// ==========================================

const guideSteps = [
  {
    label: 'Cari rute',
    title: 'Tentukan tujuan perjalanan',
    description:
      'Pilih titik asal dan tujuan untuk menemukan koridor yang sesuai dengan perjalananmu.',
    link: '/pesan',
    action: 'Cari perjalanan',
  },
  {
    label: 'Lihat koridor',
    title: 'Kenali jalur perjalanan',
    description:
      'Periksa jaringan koridor, lokasi transit, dan jam operasional sebelum berangkat.',
    link: '/rute',
    action: 'Lihat jaringan koridor',
  },
  {
    label: 'Pembayaran',
    title: 'Siapkan pembayaran',
    description:
      'Pastikan metode pembayaran dan tarif yang berlaku sebelum menaiki bus.',
    link: '#tarif',
    action: 'Lihat informasi tarif',
  },
]

// ==========================================
// FREQUENTLY ASKED QUESTIONS
// ==========================================

const faqItems = [
  {
    question: 'Berapa tarif Trans Metro Dewata?',
    answer:
      `Tarif reguler berdasarkan data aplikasi adalah ${rupiah(standardFare)} per orang. Tarif khusus sebesar ${rupiah(specialFare)} berlaku sesuai ketentuan.`,
  },
  {
    question: 'Siapa yang mendapat tarif khusus?',
    answer:
      'Tarif khusus diperuntukkan bagi pelajar, mahasiswa S1, lansia, dan penyandang disabilitas sesuai persyaratan yang berlaku.',
  },
  {
    question: 'Apakah transit dikenakan biaya tambahan?',
    answer: fareNote,
  },
  {
    question: 'Bagaimana cara mengetahui posisi bus?',
    answer:
      'Gunakan fitur Bus Live pada aplikasi. Posisi kendaraan dapat ditampilkan apabila data GPS armada tersedia dan koneksi layanan aktif.',
  },
  {
    question: 'Apakah seluruh halte tersedia di aplikasi?',
    answer:
      'Belum. Saat ini aplikasi menampilkan sejumlah terminal dan titik koridor. Beberapa koordinat merupakan perkiraan lokasi.',
  },
  {
    question: 'Apakah bisa melakukan reservasi kursi?',
    answer:
      'Belum. Fitur Cari Rute hanya digunakan untuk merencanakan perjalanan dan mencari pilihan koridor.',
  },
  {
    question: 'Bagaimana jika barang tertinggal?',
    answer:
      'Hubungi petugas atau kanal resmi operator. Siapkan informasi koridor, waktu perjalanan, dan ciri barang yang tertinggal.',
  },
]

// ==========================================
// SECTION HEADING
// ==========================================

function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-3">
      <h2 className="text-[15px] font-bold tracking-tight text-[var(--tmd-text,#0F172A)]">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-[11px] leading-5 text-[var(--tmd-muted,#64748B)]">
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ==========================================
// MINIMAL ACCORDION
// ==========================================

function Accordion({ title, children }) {
  return (
    <details className="group border-b border-slate-100 last:border-b-0">
      <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between gap-4 py-3.5 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1 text-[12px] font-medium leading-5 text-slate-800">
          {title}
        </span>

        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-50 text-[16px] font-light text-slate-500"
        >
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>

      <div className="tmd-info-fade pb-4 text-[12px] leading-5 text-slate-600">
        {children}
      </div>
    </details>
  )
}

// ==========================================
// MAIN PAGE
// ==========================================

function InfoPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [activePaymentIndex, setActivePaymentIndex] = useState(0)
  const paymentRailRef = useRef(null)

  const selectedGuide = guideSteps[activeStep]
  const activePayment = paymentMethods[activePaymentIndex]

  function selectPayment(index) {
    const rail = paymentRailRef.current
    if (!rail) return

    rail.scrollTo({
      left: index * rail.clientWidth,
      behavior: 'smooth',
    })
    setActivePaymentIndex(index)
  }

  return (
    <div className="min-h-dvh bg-[var(--tmd-background,#F8FAFC)] text-[var(--tmd-text,#0F172A)]">

      {/* LIGHT ANIMATION */}
      <style>
        {`
          @keyframes tmdInfoFade {
            from {
              opacity: 0;
              transform: translateY(5px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .tmd-info-fade {
            animation: tmdInfoFade 250ms ease-out both;
          }

          @media (prefers-reduced-motion: reduce) {
            .tmd-info-fade {
              animation: none;
            }
          }
        `}
      </style>

      {/* HEADER */}
      <PageHeader
        title="Informasi Layanan"
        subtitle="Panduan penumpang Trans Metro Dewata"
      />

      <div className="space-y-7 px-5 pb-12 pt-6">

        {/* ==================================
            INTRO
        ================================== */}

        <section>
          <h1 className="text-[20px] font-bold leading-snug tracking-tight text-slate-900">
            Informasi perjalanan
          </h1>

          <p className="mt-1.5 text-[12px] leading-5 text-slate-500">
            Semua hal penting yang perlu kamu tahu
            sebelum naik bus.
          </p>
        </section>

        {/* ==================================
            TARIF PERJALANAN
        ================================== */}

        <section id="tarif" className="scroll-mt-5">
          <SectionHeading title="Tarif perjalanan" />

          <div className="overflow-hidden rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white">

            {/* TARIF REGULER */}
            <div className="bg-[var(--tmd-primary-soft,#EAF4FF)] px-5 py-5">
              <p className="text-[11px] font-medium text-slate-600">
                Tarif reguler
              </p>

              <p className="mt-1 text-[28px] font-extrabold tracking-tight text-[var(--tmd-primary,#1769AA)]">
                {rupiah(standardFare)}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Per orang
              </p>
            </div>

            {/* TARIF KHUSUS */}
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-[11px] text-slate-500">
                  Tarif khusus
                </p>

                <p className="mt-1 text-[19px] font-bold text-slate-900">
                  {rupiah(specialFare)}
                </p>
              </div>

              <span className="rounded-md bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-500">
                Sesuai ketentuan
              </span>
            </div>

            {/* DETAIL TARIF */}
            <div className="border-t border-slate-100 px-5">
              <Accordion title="Ketentuan tarif dan pembayaran">
                <div className="space-y-3">
                  <p>
                    Tarif khusus berlaku bagi pelajar,
                    mahasiswa S1, lansia, dan penyandang
                    disabilitas sesuai persyaratan.
                  </p>

                  <p>{fareNote}</p>

                  <p>
                    Berdasarkan informasi aplikasi,
                    tiket LAIT mendukung TMD Pass
                    dengan pilihan masa transit
                    1, 3, 7, atau 14 hari.
                  </p>
                </div>
              </Accordion>
            </div>
          </div>

          <p className="mt-2 text-[10px] leading-4 text-slate-400">
            Referensi tarif: peta jaringan TMD,
            1 Mei 2026. Tarif dapat berubah sesuai
            ketentuan operator.
          </p>

          <div id="metode-pembayaran" className="mt-5 scroll-mt-5">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-bold tracking-tight text-[var(--tmd-text,#0F172A)]">
                  Metode pembayaran
                </h2>
                <p className="mt-1 text-[11px] leading-5 text-[var(--tmd-muted,#64748B)]">
                  Geser untuk melihat 4 pilihan pembayaran.
                </p>
              </div>

              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => selectPayment(Math.max(0, activePaymentIndex - 1))}
                  disabled={activePaymentIndex === 0}
                  aria-label="Metode pembayaran sebelumnya"
                  className="grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => selectPayment(Math.min(paymentMethods.length - 1, activePaymentIndex + 1))}
                  disabled={activePaymentIndex === paymentMethods.length - 1}
                  aria-label="Metode pembayaran berikutnya"
                  className="grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight size={17} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              ref={paymentRailRef}
              onScroll={(event) => {
                const rail = event.currentTarget
                const nextIndex = Math.round(rail.scrollLeft / rail.clientWidth)
                setActivePaymentIndex((current) => current === nextIndex ? current : nextIndex)
              }}
              className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth rounded-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="region"
              aria-label="Pilihan metode pembayaran"
            >
              {paymentMethods.map((method) => {
                const Icon = paymentIcons[method.id]

                return (
                  <article
                    key={method.id}
                    className="min-w-full snap-center rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white p-4"
                    aria-label={method.label}
                  >
                    <div className="flex min-h-[116px] items-center gap-4">
                      <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-[var(--tmd-primary-soft,#EAF4FF)] text-[var(--tmd-primary,#1769AA)]">
                        <Icon size={25} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--tmd-primary,#1769AA)]">
                          Metode {paymentMethods.indexOf(method) + 1}
                        </p>
                        <h3 className="mt-1 text-sm font-bold text-slate-900">
                          {method.label}
                        </h3>
                        <p className="mt-1.5 text-[11px] leading-5 text-slate-600">
                          {method.detail}
                        </p>
                      </div>
                    </div>
                    {method.id === 'qris' && (
                      <p className="mt-3 border-t border-slate-100 pt-3 text-[10px] leading-4 text-slate-500">
                        Transit antarkoridor gratis, kecuali menggunakan QRIS Scan (MPM).
                      </p>
                    )}
                  </article>
                )
              })}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1.5" role="group" aria-label="Pilih metode pembayaran">
                {paymentMethods.map((method, index) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => selectPayment(index)}
                    aria-label={`Lihat ${method.label}`}
                    aria-current={activePaymentIndex === index ? 'true' : undefined}
                    className={`h-1.5 rounded-full transition-all ${activePaymentIndex === index ? 'w-6 bg-[var(--tmd-primary,#1769AA)]' : 'w-1.5 bg-slate-300'}`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-medium tabular-nums text-slate-500" aria-live="polite">
                {activePaymentIndex + 1} / {paymentMethods.length} · {activePayment.label}
              </span>
            </div>
          </div>
        </section>

        {/* ==================================
            PANDUAN NAIK BUS
        ================================== */}

        <section>
          <SectionHeading
            title="Cara naik bus"
            subtitle="Panduan singkat sebelum berangkat"
          />

          <div className="rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white p-4">

            {/* TABS */}
            <div
              className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1"
              role="group"
              aria-label="Panduan naik bus"
            >
              {guideSteps.map((step, index) => {
                const active = activeStep === index

                return (
                  <button
                    key={step.label}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    aria-pressed={active}
                    className={`
                      min-h-10 rounded-md px-1.5
                      text-[11px] font-semibold
                      transition-all duration-200
                      ${
                        active
                          ? 'bg-white text-[var(--tmd-primary,#1769AA)] shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }
                    `}
                  >
                    {step.label}
                  </button>
                )
              })}
            </div>

            {/* GUIDE CONTENT */}
            <div
              key={activeStep}
              className="tmd-info-fade px-1 pb-1 pt-5"
              aria-live="polite"
            >
              <h3 className="text-[15px] font-bold text-slate-900">
                {selectedGuide.title}
              </h3>

              <p className="mt-2 min-h-[50px] text-[12px] leading-5 text-slate-600">
                {selectedGuide.description}
              </p>

              {selectedGuide.link.startsWith('#') ? (
                <a
                  href={selectedGuide.link}
                  className="mt-3 inline-flex min-h-9 items-center rounded-lg bg-[var(--tmd-primary,#1769AA)] px-4 text-[11px] font-semibold text-white transition hover:brightness-90"
                >
                  {selectedGuide.action}
                </a>
              ) : (
                <Link
                  to={selectedGuide.link}
                  className="mt-3 inline-flex min-h-9 items-center rounded-lg bg-[var(--tmd-primary,#1769AA)] px-4 text-[11px] font-semibold text-white transition hover:brightness-90"
                >
                  {selectedGuide.action}
                </Link>
              )}
            </div>

            {/* PROGRESS */}
            <div className="mt-4 flex gap-1.5">
              {guideSteps.map((step, index) => (
                <span
                  key={step.label}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    index <= activeStep
                      ? 'bg-[var(--tmd-primary,#1769AA)]'
                      : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ==================================
            INFORMASI OPERASIONAL
        ================================== */}

        <section>
          <SectionHeading
            title="Jam operasional"
            subtitle="Jam layanan setiap koridor"
          />

          <div className="rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white px-4">

            <Accordion title="Lihat jam operasional koridor">
              <div className="divide-y divide-slate-100">
                {corridors.map((corridor) => (
                  <div
                    key={corridor.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-slate-800">
                        Koridor {corridor.id}
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-slate-500">
                        {corridor.from} – {corridor.to}
                      </p>
                    </div>

                    <p className="shrink-0 text-[11px] font-semibold tabular-nums text-[var(--tmd-primary,#1769AA)]">
                      {corridor.operatingHours}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-2 text-[10px] text-slate-400">
                Jadwal mengikuti data aplikasi
                dan dapat berubah sewaktu-waktu.
              </p>
            </Accordion>

            <Link
              to="/rute"
              className="block border-b border-slate-100 py-4 text-[12px] font-medium text-[var(--tmd-primary,#1769AA)]"
            >
              Lihat peta dan jalur koridor
            </Link>

            <Link
              to="/tracking"
              className="block py-4 text-[12px] font-medium text-[var(--tmd-primary,#1769AA)]"
            >
              Pantau posisi bus
            </Link>

          </div>
        </section>

        {/* ==================================
            PENGUMUMAN LAYANAN
        ================================== */}

        <section>
          <SectionHeading title="Pengumuman layanan" />

          <div className="rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white px-4 py-4">

            <p className="text-[12px] font-semibold text-slate-800">
              Informasi operasional
            </p>

            <p className="mt-2 text-[12px] leading-5 text-slate-500">
              Pengumuman resmi belum terhubung
              dengan aplikasi. Perubahan jadwal,
              rute, atau gangguan operasional
              belum dapat ditampilkan secara otomatis.
            </p>

          </div>
        </section>

        {/* ==================================
            AKSESIBILITAS
        ================================== */}

        <section>
          <SectionHeading title="Aksesibilitas" />

          <div className="rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white p-4">

            <p className="text-[12px] font-semibold text-slate-800">
              Informasi kebutuhan khusus
            </p>

            <p className="mt-2 text-[12px] leading-5 text-slate-600">
              Informasi fasilitas aksesibilitas
              pada masing-masing armada dan halte
              belum diverifikasi di aplikasi.
              Konfirmasi kepada operator sebelum
              melakukan perjalanan.
            </p>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="text-[11px] font-medium text-[var(--tmd-primary,#1769AA)]">
                Tarif khusus {rupiah(specialFare)}
                {' '}sesuai ketentuan.
              </p>
            </div>

          </div>
        </section>

        {/* ==================================
            PERTANYAAN UMUM
        ================================== */}

        <section>
          <SectionHeading
            title="Pertanyaan umum"
            subtitle="Informasi yang sering ditanyakan penumpang"
          />

          <div className="rounded-xl border border-[var(--tmd-border,#E2E8F0)] bg-white px-4">

            {faqItems.map((faq) => (
              <Accordion
                key={faq.question}
                title={faq.question}
              >
                <p>{faq.answer}</p>
              </Accordion>
            ))}

          </div>
        </section>

        {/* ==================================
            FOOTER
        ================================== */}

        <footer className="border-t border-slate-200 pt-5 text-center">
          <p className="text-[11px] font-semibold text-slate-600">
            Trans Metro Dewata
          </p>

          <p className="mt-1 text-[10px] leading-4 text-slate-400">
            Informasi layanan dapat berubah
            mengikuti kebijakan operator.
          </p>
        </footer>

      </div>
    </div>
  )
}

export default InfoPage
