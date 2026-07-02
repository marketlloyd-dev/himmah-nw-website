import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ImageUploader from '../../components/ImageUploader'

const kosong = { id: null, nama: '', jabatan: '', tipe: 'inti', divisi: '', foto_url: '', urutan: 0 }

export default function KelolaPengurus() {
  const [daftar, setDaftar] = useState([])
  const [divisiList, setDivisiList] = useState([])
  const [form, setForm] = useState(kosong)

  const muat = () => {
    supabase.from('pengurus').select('*').order('urutan').then(({ data }) => setDaftar(data || []))
    supabase.from('divisi').select('*').order('urutan').then(({ data }) => setDivisiList(data || []))
  }
  useEffect(() => { muat() }, [])

  const simpan = async (e) => {
    e.preventDefault()
    const payload = { ...form }
    delete payload.id
    const res = form.id
      ? await supabase.from('pengurus').update(payload).eq('id', form.id)
      : await supabase.from('pengurus').insert(payload)
    if (res.error) return alert('Gagal menyimpan: ' + res.error.message)
    setForm(kosong)
    muat()
  }

  const hapus = async (id) => {
    if (!confirm('Hapus pengurus ini?')) return
    await supabase.from('pengurus').delete().eq('id', id)
    muat()
  }

  return (
    <div className="space-y-10">
      <form onSubmit={simpan} className="bg-white border border-emerald/10 rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-emerald">{form.id ? 'Ubah Pengurus' : 'Tambah Pengurus'}</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Nama</label>
            <input required value={form.nama} onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Jabatan</label>
            <input required value={form.jabatan} onChange={(e) => setForm((f) => ({ ...f, jabatan: e.target.value }))}
              placeholder="Ketua / Sekretaris / Bendahara / Anggota"
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Tipe</label>
            <select value={form.tipe} onChange={(e) => setForm((f) => ({ ...f, tipe: e.target.value }))}
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2">
              <option value="inti">Pengurus Inti (Ketua/Sekretaris/Bendahara)</option>
              <option value="divisi">Anggota Divisi</option>
            </select>
          </div>
          {form.tipe === 'divisi' && (
            <div>
              <label className="text-sm font-medium text-ink/70">Divisi</label>
              <select value={form.divisi} onChange={(e) => setForm((f) => ({ ...f, divisi: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2">
                <option value="">Pilih divisi</option>
                {divisiList.map((d) => <option key={d.id} value={d.nama}>{d.nama}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-ink/70">Urutan tampil</label>
            <input type="number" value={form.urutan} onChange={(e) => setForm((f) => ({ ...f, urutan: Number(e.target.value) }))}
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70 block mb-1">Foto (rasio 1:1)</label>
          <ImageUploader bucket="pengurus" aspect={1} onUploaded={(url) => setForm((f) => ({ ...f, foto_url: url }))} />
          {form.foto_url && <img src={form.foto_url} alt="" className="mt-3 h-24 w-24 rounded-full object-cover" />}
        </div>

        <div className="flex gap-3">
          <button className="rounded-full bg-emerald text-cream font-semibold px-5 py-2">
            {form.id ? 'Simpan Perubahan' : 'Tambah'}
          </button>
          {form.id && (
            <button type="button" onClick={() => setForm(kosong)} className="rounded-full border border-emerald/30 px-5 py-2 text-emerald">
              Batal
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="font-display font-bold text-lg text-emerald mb-3">Semua Pengurus</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {daftar.map((p) => (
            <div key={p.id} className="bg-white border border-emerald/10 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={p.foto_url || 'https://placehold.co/60x60/0B3D2E/F6F4EE?text=?'} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-ink">{p.nama}</p>
                  <p className="text-xs text-ink/50">{p.jabatan}{p.divisi ? ` · ${p.divisi}` : ''}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setForm(p)} className="text-sm text-gold-dark font-semibold">Ubah</button>
                <button onClick={() => hapus(p.id)} className="text-sm text-red-600 font-semibold">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
