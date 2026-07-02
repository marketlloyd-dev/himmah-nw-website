import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const SettingsContext = createContext(null)

const kosong = {
  nama_situs: 'HIMMAH NW',
  tagline: 'Himpunan Mahasiswa Nahdlatul Wathan',
  logo_url: '',
  hero_image_url: '',
  sambutan_ketua: '',
  nama_ketua: '',
  alamat: '',
  email: '',
  whatsapp: '',
  instagram: '',
  facebook: '',
  youtube: '',
  footer_deskripsi: '',
  informasi_judul: '',
  informasi_deskripsi: '',
  seputar_judul: '',
  seputar_deskripsi: '',
  galeri_judul: '',
  galeri_deskripsi: '',
  agenda_judul: '',
  agenda_deskripsi: '',
  warna_primer: '#0B3D2E',
  warna_primer_gelap: '#082B20',
  warna_primer_terang: '#145C46',
  warna_aksen: '#D4AF37',
  warna_aksen_terang: '#E8CA6B',
  warna_aksen_gelap: '#A9861F',
  warna_latar: '#F6F4EE',
  warna_teks: '#12211E',
}

// Peta field pengaturan warna -> nama CSS variable yang dipakai tailwind.config.js
const PETA_WARNA = {
  warna_primer: '--color-emerald',
  warna_primer_gelap: '--color-emerald-dark',
  warna_primer_terang: '--color-emerald-light',
  warna_aksen: '--color-gold',
  warna_aksen_terang: '--color-gold-light',
  warna_aksen_gelap: '--color-gold-dark',
  warna_latar: '--color-cream',
  warna_teks: '--color-ink',
}

function hexKeRgb(hex) {
  const bersih = (hex || '').replace('#', '')
  if (bersih.length !== 6) return null
  const r = parseInt(bersih.slice(0, 2), 16)
  const g = parseInt(bersih.slice(2, 4), 16)
  const b = parseInt(bersih.slice(4, 6), 16)
  if ([r, g, b].some(Number.isNaN)) return null
  return `${r} ${g} ${b}`
}

export function terapkanWarna(settings) {
  const root = document.documentElement
  for (const [field, cssVar] of Object.entries(PETA_WARNA)) {
    const rgb = hexKeRgb(settings[field])
    if (rgb) root.style.setProperty(cssVar, rgb)
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(kosong)
  const [loading, setLoading] = useState(true)

  const muat = () =>
    supabase
      .from('pengaturan_situs')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        const gabungan = data ? { ...kosong, ...data } : kosong
        setSettings(gabungan)
        terapkanWarna(gabungan)
        setLoading(false)
      })

  useEffect(() => { muat() }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, reload: muat }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)