import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import AccountPage from './pages/AccountPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import HomePage from './pages/HomePage.jsx'
import InfoPage from './pages/InfoPage.jsx'
import RoutesPage from './pages/RoutesPage.jsx'
import TicketsPage from './pages/TicketsPage.jsx'

const LiveTrackingPage = lazy(() => import('./pages/LiveTrackingPage.jsx'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="pesan" element={<BookingPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="rute" element={<RoutesPage />} />
          <Route path="tracking" element={<Suspense fallback={<p role="status" className="p-6 text-sm text-slate-600">Memuat peta armada...</p>}><LiveTrackingPage /></Suspense>} />
          <Route path="tiket" element={<TicketsPage />} />
          <Route path="info" element={<InfoPage />} />
          <Route path="akun" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
