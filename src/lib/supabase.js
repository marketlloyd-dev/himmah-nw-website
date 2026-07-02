import { createClient } from '@supabase/supabase-js'

const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseReady = Boolean(envUrl && envKey)

if (!supabaseReady) {
  console.warn(
    'Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env (lihat .env.example). ' +
    'Website tetap jalan tapi semua data (berita/pengurus/galeri) kosong sampai .env diisi.'
  )
}

// Pakai URL format valid sbg fallback biar createClient tidak throw & app tidak blank putih
// saat .env belum diisi. Semua query akan gagal senyap dan halaman render kosong (bukan crash).
export const supabase = createClient(
  envUrl || 'https://placeholder.supabase.co',
  envKey || 'public-anon-placeholder-key'
)
