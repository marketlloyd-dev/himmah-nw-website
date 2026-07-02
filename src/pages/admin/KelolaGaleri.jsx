import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ImageUploader from '../../components/ImageUploader'

export default function KelolaGaleri() {
  const [daftar, setDaftar] = useState([])
  const [judul, setJudul] = useState('')
  const [unggulan, setUnggulan] = useState(false)

  const muat = () =>
    supabase.from('galeri').select('*').order('created_at', { ascending: false }).then(({ data }) => setDaftar(data || []))
  useEffect(() => { muat() }, [])

  const tambah = async (url) => {
    const { error } = await supabase.from('galeri').insert({ url, judul, unggulan })
    if (error) return alert('Gagal menyimpan: ' + error.message)
    setJudul('')
    setUnggulan(false)
    muat()
  }

  const toggleUnggulan = async (f) => {
    await supabase.from('galeri').update({ unggulan: !f.unggulan }).eq('id', f.id)
    muat()
  }

  const hapus = async (id) => {
    if (!confirm('Hapus foto ini?')) return
    await supabase.from('galeri').delete().eq('id', id)
    muat()
  }

  const jumlahUnggulan = daftar.filter((f) => f.unggulan).length

  return (
    <div className="space-y-10">
      <div className="bg-white border border-emerald/10 rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-emerald">Tambah Foto Kegiatan</h2>
        <div>
          <label className="text-sm font-medium text-ink/70">Judul / Keterangan (opsional)</label>
          <input value={judul} onChange={(e) => setJudul(e.target.value)}
            className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={unggulan} onChange={(e) => setUnggulan(e.target.checked)} />
          Jadikan Kegiatan Unggulan (tampil di hero 3D Beranda)
        </label>
        <ImageUploader bucket="galeri" aspect={3 / 4} onUploaded={tambah} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg text-emerald">Semua Foto</h2>
          <p className="text-xs text-ink/50">{jumlahUnggulan} foto ditandai unggulan</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {daftar.map((f) => (
            <div key={f.id} className="relative group rounded-lg overflow-hidden border border-emerald/10">
              <img src={f.url} alt={f.judul} className="w-full aspect-[3/4] object-cover" />
              {f.unggulan && (
                <span className="absolute top-2 left-2 text-[10px] font-bold uppercase bg-gold text-emerald-dark rounded-full px-2 py-0.5">
                  Unggulan
                </span>
              )}
              <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <button onClick={() => toggleUnggulan(f)} className="text-xs font-semibold text-cream bg-emerald rounded-full px-3 py-1">
                  {f.unggulan ? 'Batalkan Unggulan' : 'Jadikan Unggulan'}
                </button>
                <button onClick={() => hapus(f.id)} className="text-xs font-semibold text-cream bg-red-600 rounded-full px-3 py-1">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
