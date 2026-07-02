import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const SettingsContext = createContext(null)

const kosong = {
  nama_situs: 'HIMMAH NW',
  tagline: 'Himpunan Mahasiswa Nahdlatul Wathan',
  logo_url: '',
  sambutan_ketua: '',
  nama_ketua: '',
  alamat: '',
  email: '',
  whatsapp: '',
  instagram: '',
  facebook: '',
  youtube: '',
  footer_deskripsi: '',
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
        if (data) setSettings({ ...kosong, ...data })
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
