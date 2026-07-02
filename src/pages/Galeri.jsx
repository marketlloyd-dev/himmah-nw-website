import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Galeri() {
  const [foto, setFoto] = useState([])
  const [aktif, setAktif] = useState(null)

  useEffect(() => {
    supabase
      .from('galeri')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setFoto(data || []))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-emerald">Galeri Kegiatan</h1>
      <p className="text-ink/60 mt-2">Dokumentasi kegiatan-kegiatan HIMMAH NW Komisariat STMIK Syaikh Zainuddin NW Anjani.</p>

      {foto.length === 0 ? (
        <p className="text-ink/50 mt-8">Belum ada foto kegiatan.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
          {foto.map((f) => (
            <button key={f.id} onClick={() => setAktif(f)} className="group rounded-xl overflow-hidden aspect-square">
              <img src={f.url} alt={f.judul || 'Kegiatan'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </button>
          ))}
        </div>
      )}

      {aktif && (
        <div
          className="fixed inset-0 bg-ink/90 z-50 flex items-center justify-center p-4"
          onClick={() => setAktif(null)}
        >
          <div className="max-w-3xl w-full">
            <img src={aktif.url} alt={aktif.judul} className="w-full rounded-2xl max-h-[80vh] object-contain" />
            {aktif.judul && <p className="text-cream text-center mt-3">{aktif.judul}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
