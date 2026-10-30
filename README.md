# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

# Trans Metro Dewata

Frontend React + Vite untuk eksplorasi koridor dan pemesanan Trans Metro Dewata.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

## Mengaktifkan live tracking

1. Buat project Supabase dan jalankan `supabase/vehicle_positions.sql` di SQL Editor.
2. Salin `.env.example` menjadi `.env`. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` untuk browser; isi `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, dan `GPS_INGEST_TOKEN` hanya di environment server.
3. Restart server Vite. Untuk menguji endpoint serverless lokal gunakan Vercel CLI (`vercel dev`); atur variabel server yang sama di environment deployment Vercel.
4. Konfigurasikan perangkat/gateway GPS operator untuk mengirim posisi ke `POST /api/vehicles/position` dengan header `Authorization: Bearer <GPS_INGEST_TOKEN>`.

## Jalur jalan di peta

Tab jaringan meminta geometri jalan dan nama ruas ke OSRM (`VITE_OSRM_BASE_URL`). Default `router.project-osrm.org` adalah layanan demo publik untuk prototipe; untuk produksi, gunakan instance routing sendiri atau penyedia dengan SLA. Hasilnya rute jalan mobil berdasarkan OpenStreetMap, bukan trase operasional resmi atau estimasi waktu bus TMD. Garis skematik ditampilkan jika routing gagal.

Kolom minimum feed: `vehicle_id`, `corridor_id`, `latitude`, `longitude`, dan `updated_at`. `heading`, `speed_kmh`, serta `is_active` bersifat tambahan. Posisi dianggap live selama diperbarui dalam dua menit terakhir.

Endpoint menerima JSON `vehicle_id`, `corridor_id`, `latitude`, dan `longitude`; `heading`, `speed_kmh`, serta `is_active` bersifat tambahan. Browser hanya membaca posisi melalui Supabase Realtime. Jangan pernah memberi `SUPABASE_SERVICE_ROLE_KEY` ke perangkat klien atau menaruhnya pada variabel `VITE_*`. Tanpa feed GPS operator, peta tetap tampil tanpa marker simulasi dan status tracking menjelaskan bahwa data belum tersedia.
