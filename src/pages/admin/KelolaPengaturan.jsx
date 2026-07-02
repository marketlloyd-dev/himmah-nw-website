import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useSettings } from '../../lib/SettingsContext'
import ImageUploader from '../../components/ImageUploader'

export default function KelolaPengaturan() {
  const { settings, loading, reload } = useSettings()
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [sukses, setSukses] = useState(false)

  useEffect(() => { if (!loading) setForm(settings) }, [loading, settings])

  const ubah = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const simpan = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSukses(false)
    const { id, ...payload } = form
    const { error } = await supabase.from('pengaturan_situs').update(payload).eq('id', 1)
    setSaving(false)
    if (error) return alert('Gagal menyimpan: ' + error.message)
    setSukses(true)
    reload()
  }

  if (loading) return <p className="text-ink/50">Memuat pengaturan...</p>

  return (
    <form onSubmit={simpan} className="space-y-8">
      <div className="bg-white border border-emerald/10 rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-emerald">Identitas Situs</h2>

        <div>
          <label className="text-sm font-medium text-ink/70 block mb-1">Logo</label>
          <ImageUploader bucket="pengaturan" aspect={1} onUploaded={(url) => setForm((f) => ({ ...f, logo_url: url }))} />
          {form.logo_url && <img src={form.logo_url} alt="Logo" className="mt-3 h-16 w-16 rounded-full object-cover border border-emerald/20" />}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Nama Situs</label>
            <input value={form.nama_situs || ''} onChange={ubah('nama_situs')}
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Tagline</label>
            <input value={form.tagline || ''} onChange={ubah('tagline')}
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-emerald/10 rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-emerald">Kata Sambutan Ketua</h2>
        <div>
          <label className="text-sm font-medium text-ink/70">Isi Sambutan</label>
          <textarea rows={4} value={form.sambutan_ketua || ''} onChange={ubah('sambutan_ketua')}
            className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Nama Ketua</label>
          <input value={form.nama_ketua || ''} onChange={ubah('nama_ketua')}
            className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
        </div>
      </div>

      <div className="bg-white border border-emerald/10 rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-emerald">Kontak & Alamat</h2>
        <div>
          <label className="text-sm font-medium text-ink/70">Alamat</label>
          <input value={form.alamat || ''} onChange={ubah('alamat')}
            className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Email</label>
            <input value={form.email || ''} onChange={ubah('email')}
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">WhatsApp</label>
            <input value={form.whatsapp || ''} onChange={ubah('whatsapp')} placeholder="62812xxxxxxx"
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-emerald/10 rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-emerald">Media Sosial</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Instagram</label>
            <input value={form.instagram || ''} onChange={ubah('instagram')} placeholder="https://instagram.com/..."
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Facebook</label>
            <input value={form.facebook || ''} onChange={ubah('facebook')} placeholder="https://facebook.com/..."
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">YouTube</label>
            <input value={form.youtube || ''} onChange={ubah('youtube')} placeholder="https://youtube.com/..."
              className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-emerald/10 rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-emerald">Footer</h2>
        <div>
          <label className="text-sm font-medium text-ink/70">Deskripsi Singkat</label>
          <textarea rows={3} value={form.footer_deskripsi || ''} onChange={ubah('footer_deskripsi')}
            className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button disabled={saving} className="rounded-full bg-emerald text-cream font-semibold px-5 py-2 disabled:opacity-50">
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
        {sukses && <p className="text-sm text-emerald font-medium">Tersimpan ✓</p>}
      </div>
    </form>
  )
}
