import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import RichTextEditor from '../../components/RichTextEditor'
import ImageUploader from '../../components/ImageUploader'

const kosong = { id: null, judul: '', slug: '', ringkasan: '', konten: '', cover_url: '', terbit: true }

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function KelolaBerita() {
  const [daftar, setDaftar] = useState([])
  const [form, setForm] = useState(kosong)
  const [saving, setSaving] = useState(false)

  const muat = () =>
    supabase.from('berita').select('*').order('created_at', { ascending: false }).then(({ data }) => setDaftar(data || []))

  useEffect(() => { muat() }, [])

  const simpan = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.judul) }
    delete payload.id
    let res
    if (form.id) res = await supabase.from('berita').update(payload).eq('id', form.id)
    else res = await supabase.from('berita').insert(payload)
    setSaving(false)
    if (res.error) return alert('Gagal menyimpan: ' + res.error.message)
    setForm(kosong)
    muat()
  }

  const hapus = async (id) => {
    if (!confirm('Hapus berita ini?')) return
    await supabase.from('berita').delete().eq('id', id)
    muat()
  }

  return (
    <div className="space-y-10">
      <form onSubmit={simpan} className="bg-white border border-emerald/10 rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-emerald">
          {form.id ? 'Ubah Berita' : 'Tulis Berita Baru'}
        </h2>

        <div>
          <label className="text-sm font-medium text-ink/70">Judul</label>
          <input
            required value={form.judul}
            onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))}
            className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Ringkasan</label>
          <textarea
            rows={2} value={form.ringkasan}
            onChange={(e) => setForm((f) => ({ ...f, ringkasan: e.target.value }))}
            className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70 block mb-1">Foto Sampul</label>
          <ImageUploader bucket="berita" aspect={16 / 9} onUploaded={(url) => setForm((f) => ({ ...f, cover_url: url }))} />
          {form.cover_url && <img src={form.cover_url} alt="Sampul" className="mt-3 h-32 rounded-lg object-cover" />}
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70 block mb-1">Isi Berita</label>
          <RichTextEditor value={form.konten} onChange={(v) => setForm((f) => ({ ...f, konten: v }))} />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={form.terbit} onChange={(e) => setForm((f) => ({ ...f, terbit: e.target.checked }))} />
          Terbitkan sekarang
        </label>

        <div className="flex gap-3">
          <button disabled={saving} className="rounded-full bg-emerald text-cream font-semibold px-5 py-2 disabled:opacity-50">
            {saving ? 'Menyimpan...' : form.id ? 'Simpan Perubahan' : 'Terbitkan'}
          </button>
          {form.id && (
            <button type="button" onClick={() => setForm(kosong)} className="rounded-full border border-emerald/30 px-5 py-2 text-emerald">
              Batal
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="font-display font-bold text-lg text-emerald mb-3">Semua Berita</h2>
        <div className="space-y-2">
          {daftar.map((b) => (
            <div key={b.id} className="bg-white border border-emerald/10 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{b.judul}</p>
                <p className="text-xs text-ink/50">{b.terbit ? 'Terbit' : 'Draf'} · {b.views ?? 0} dibaca</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setForm(b)} className="text-sm text-gold-dark font-semibold">Ubah</button>
                <button onClick={() => hapus(b.id)} className="text-sm text-red-600 font-semibold">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
