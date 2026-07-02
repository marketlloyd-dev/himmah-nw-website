import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { SettingsProvider } from './lib/SettingsContext'
import { supabaseReady } from './lib/supabase'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Beranda from './pages/Beranda'
import Informasi from './pages/Informasi'
import SeputarHimmah from './pages/SeputarHimmah'
import BeritaDetail from './pages/BeritaDetail'
import Galeri from './pages/Galeri'
import Agenda from './pages/Agenda'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import KelolaBerita from './pages/admin/KelolaBerita'
import KelolaPengurus from './pages/admin/KelolaPengurus'
import KelolaGaleri from './pages/admin/KelolaGaleri'
import KelolaAgenda from './pages/admin/KelolaAgenda'
import KelolaPengaturan from './pages/admin/KelolaPengaturan'

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
      <div className="min-h-screen flex flex-col">
        {!supabaseReady && (
          <div className="bg-red-600 text-white text-sm text-center py-2 px-4">
            Supabase belum dikonfigurasi — isi <code>VITE_SUPABASE_URL</code> &amp; <code>VITE_SUPABASE_ANON_KEY</code> di file <code>.env</code>, lalu restart <code>npm run dev</code>. Lihat README.
          </div>
        )}
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Beranda />} />
            <Route path="/informasi" element={<Informasi />} />
            <Route path="/seputar-himmah" element={<SeputarHimmah />} />
            <Route path="/seputar-himmah/:slug" element={<BeritaDetail />} />
            <Route path="/galeri" element={<Galeri />} />
            <Route path="/agenda" element={<Agenda />} />

            <Route path="/admin" element={<Login />} />
            <Route
              path="/admin/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route path="berita" element={<KelolaBerita />} />
              <Route path="pengurus" element={<KelolaPengurus />} />
              <Route path="galeri" element={<KelolaGaleri />} />
              <Route path="agenda" element={<KelolaAgenda />} />
              <Route path="pengaturan" element={<KelolaPengaturan />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
      </SettingsProvider>
    </AuthProvider>
  )
}