import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ImageUploader from '../../components/ImageUploader'

const kosong = {
  id: null, judul: '', deskripsi: '', lokasi: '',
  tanggal_mulai: '', tanggal_selesai: '', cover_url: '',
}

export default function KelolaAgenda() {
  const [daftar, setDaftar] = useState([])
  const [form, setForm] = useState(kosong)
  const [saving, setSaving] = useState(false)

  const muat = () =>
    supabase.from('agenda').select('*').order('tanggal_mulai', { ascending: false }).then(({ data }) => setDaftar(data || []))

  useEffect(() => { muat() }, [])

  const simpan = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      tanggal_selesai: form.tanggal_selesai || null,
    }
    delete payload.id
    let res
    if (form.id) res = await supabase.from('agenda').update(payload).eq('id', form.id)
    else res = await supabase.from('agenda').insert(payload)
    setSaving(false)
    if (res.error) return alert('Gagal menyimpan: ' + res.error.message)
    setForm(kosong)
    muat()
  }

  const ubah = (a) => setForm({
    ...a,
    tanggal_mulai: a.tanggal_mulai ? a.tanggal_mulai.slice(0, 16) : '',
    tanggal_selesai: a.tanggal_selesai ? a.tanggal_selesai.slice(0, 16) : '',
  })

  const hapus = async (id) => {
    if (!confirm('Hapus agenda ini?')) return
    await supabase.from('agenda').delete().eq('id', id)
    muat()
  }

  return (
    <div className="space-y-10">
      <form onSubmit={simpan} className="bg-white border border-emerald/10 rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-emerald">
          {form.id ? 'Ubah Agenda' : 'Tambah Agenda Baru'}
        </h2>

        <div>
          <label className="text-sm font-medium text-ink/70">Judul Kegiatan</label>
          <input
            required value={form.judul}
            onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))}
            className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Mulai</label>
            <input
              required type="datetime-local" value={form.tanggal_mulai}
              onChange={(e) => setForm((f) => ({ ...f, tanggal_mulai: e.target.value }))}
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Selesai (opsional)</label>
            <input
              type="datetime-local" value={form.tanggal_selesai}
              onChange={(e) => setForm((f) => ({ ...f, tanggal_selesai: e.target.value }))}
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Lokasi</label>
          <input
            value={form.lokasi}
            onChange={(e) => setForm((f) => ({ ...f, lokasi: e.target.value }))}
            className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Deskripsi</label>
          <textarea
            rows={3} value={form.deskripsi}
            onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))}
            className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70 block mb-1">Foto/Poster (opsional)</label>
          <ImageUploader bucket="agenda" aspect={16 / 9} onUploaded={(url) => setForm((f) => ({ ...f, cover_url: url }))} />
          {form.cover_url && <img src={form.cover_url} alt="Sampul" className="mt-3 h-32 rounded-lg object-cover" />}
        </div>

        <div className="flex gap-3">
          <button disabled={saving} className="rounded-full bg-emerald text-cream font-semibold px-5 py-2 disabled:opacity-50">
            {saving ? 'Menyimpan...' : form.id ? 'Simpan Perubahan' : 'Tambah Agenda'}
          </button>
          {form.id && (
            <button type="button" onClick={() => setForm(kosong)} className="rounded-full border border-emerald/30 px-5 py-2 text-emerald">
              Batal
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="font-display font-bold text-lg text-emerald mb-3">Semua Agenda</h2>
        <div className="space-y-2">
          {daftar.map((a) => (
            <div key={a.id} className="bg-white border border-emerald/10 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{a.judul}</p>
                <p className="text-xs text-ink/50">
                  {new Date(a.tanggal_mulai).toLocaleString('id-ID')}{a.lokasi ? ` · ${a.lokasi}` : ''}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => ubah(a)} className="text-sm text-gold-dark font-semibold">Ubah</button>
                <button onClick={() => hapus(a.id)} className="text-sm text-red-600 font-semibold">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
