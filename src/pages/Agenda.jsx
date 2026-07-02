import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSettings } from '../lib/SettingsContext'

function formatTanggal(iso) {
  return new Date(iso).toLocaleString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function Agenda() {
  const { settings } = useSettings()
  const [semua, setSemua] = useState([])

  useEffect(() => {
    supabase
      .from('agenda')
      .select('*')
      .order('tanggal_mulai', { ascending: true })
      .then(({ data }) => setSemua(data || []))
  }, [])

  const now = new Date()
  const mendatang = semua.filter((a) => new Date(a.tanggal_selesai || a.tanggal_mulai) >= now)
  const selesai = semua.filter((a) => new Date(a.tanggal_selesai || a.tanggal_mulai) < now)

  return (
    <div className="max-w-4xl mx-auto px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-emerald">{settings.agenda_judul || 'Agenda Kegiatan'}</h1>
      <p className="text-ink/60 mt-2">{settings.agenda_deskripsi || 'Jadwal kegiatan HIMMAH NW Komisariat STMIK Syaikh Zainuddin NW Anjani.'}</p>

      {mendatang.length === 0 ? (
        <p className="text-ink/50 mt-8">Belum ada agenda mendatang.</p>
      ) : (
        <div className="space-y-4 mt-8">
          {mendatang.map((a) => (
            <div key={a.id} className="bg-white border border-emerald/10 rounded-2xl overflow-hidden flex flex-col sm:flex-row">
              {a.cover_url && (
                <img src={a.cover_url} alt={a.judul} className="sm:w-56 h-40 sm:h-auto object-cover" />
              )}
              <div className="p-5 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-dark">{formatTanggal(a.tanggal_mulai)}</p>
                <h2 className="font-display font-bold text-lg text-emerald">{a.judul}</h2>
                {a.lokasi && <p className="text-sm text-ink/60">📍 {a.lokasi}</p>}
                {a.deskripsi && <p className="text-sm text-ink/70 mt-2 whitespace-pre-line">{a.deskripsi}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {selesai.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display font-bold text-lg text-ink/50 mb-3">Agenda Selesai</h2>
          <div className="space-y-2">
            {selesai.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-4 border-b border-ink/10 py-3">
                <div>
                  <p className="font-medium text-ink/70">{a.judul}</p>
                  {a.lokasi && <p className="text-xs text-ink/40">{a.lokasi}</p>}
                </div>
                <p className="text-xs text-ink/40 shrink-0">{formatTanggal(a.tanggal_mulai)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}