import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useSettings, terapkanWarna } from '../../lib/SettingsContext'
import ImageUploader from '../../components/ImageUploader'

const TABS = [
  { id: 'identitas', label: 'Identitas & Kontak' },
  { id: 'teks', label: 'Teks Halaman' },
  { id: 'warna', label: 'Warna & Tema' },
]

function InputWarna({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink/70 block mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value || '#000000'} onChange={onChange}
          className="h-10 w-14 rounded-lg border border-emerald/20 cursor-pointer" />
        <input value={value || ''} onChange={onChange}
          className="flex-1 rounded-lg border border-emerald/20 px-3 py-2 text-sm font-mono" />
      </div>
    </div>
  )
}

export default function KelolaPengaturan() {
  const { settings, loading, reload } = useSettings()
  const [form, setForm] = useState(settings)
  const [tab, setTab] = useState('identitas')
  const [saving, setSaving] = useState(false)
  const [sukses, setSukses] = useState(false)

  useEffect(() => { if (!loading) setForm(settings) }, [loading, settings])

  // Preview warna realtime pas admin ganti color picker, sebelum disimpan.
  // Kalau keluar halaman tanpa simpan, warna balik ke settings tersimpan (reload di useSettings gak berubah).
  useEffect(() => { terapkanWarna(form) }, [
    form.warna_primer, form.warna_primer_gelap, form.warna_primer_terang,
    form.warna_aksen, form.warna_aksen_terang, form.warna_aksen_gelap,
    form.warna_latar, form.warna_teks,
  ])
  useEffect(() => () => terapkanWarna(settings), []) // eslint-disable-line react-hooks/exhaustive-deps

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
    reload() // reload juga langsung nge-apply ulang warna ke seluruh situs
  }

  const resetWarna = () => setForm((f) => ({
    ...f,
    warna_primer: '#0B3D2E',
    warna_primer_gelap: '#082B20',
    warna_primer_terang: '#145C46',
    warna_aksen: '#D4AF37',
    warna_aksen_terang: '#E8CA6B',
    warna_aksen_gelap: '#A9861F',
    warna_latar: '#F6F4EE',
    warna_teks: '#12211E',
  }))

  if (loading) return <p className="text-ink/50">Memuat pengaturan...</p>

  return (
    <form onSubmit={simpan} className="space-y-6">
      <div className="flex gap-2 border-b border-emerald/10 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id} type="button" onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-t-lg ${
              tab === t.id ? 'bg-emerald text-cream' : 'text-ink/60 hover:bg-emerald/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ==================== IDENTITAS & KONTAK ==================== */}
      {tab === 'identitas' && (
        <div className="space-y-8">
          <div className="bg-white border border-emerald/10 rounded-2xl p-6 space-y-4">
            <h2 className="font-display font-bold text-lg text-emerald">Identitas Situs</h2>

            <div>
              <label className="text-sm font-medium text-ink/70 block mb-1">Logo</label>
              <ImageUploader bucket="pengaturan" aspect={1} onUploaded={(url) => setForm((f) => ({ ...f, logo_url: url }))} />
              {form.logo_url && <img src={form.logo_url} alt="Logo" className="mt-3 h-16 w-16 rounded-full object-cover border border-emerald/20" />}
            </div>

            <div>
              <label className="text-sm font-medium text-ink/70 block mb-1">Gambar Latar Hero (dipakai kalau belum ada berita)</label>
              <ImageUploader bucket="pengaturan" aspect={16 / 9} onUploaded={(url) => setForm((f) => ({ ...f, hero_image_url: url }))} />
              {form.hero_image_url && <img src={form.hero_image_url} alt="Hero" className="mt-3 h-24 rounded-lg object-cover" />}
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
        </div>
      )}

      {/* ==================== TEKS HALAMAN ==================== */}
      {tab === 'teks' && (
        <div className="space-y-8">
          <p className="text-sm text-ink/50">Kosongkan field kalau mau pakai teks bawaan.</p>

          {[
            { prefix: 'informasi', label: 'Halaman Informasi Kepengurusan' },
            { prefix: 'seputar', label: 'Halaman Seputar HIMMAH (Berita)' },
            { prefix: 'galeri', label: 'Halaman Galeri' },
            { prefix: 'agenda', label: 'Halaman Agenda' },
          ].map(({ prefix, label }) => (
            <div key={prefix} className="bg-white border border-emerald/10 rounded-2xl p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-emerald">{label}</h2>
              <div>
                <label className="text-sm font-medium text-ink/70">Judul</label>
                <input value={form[`${prefix}_judul`] || ''} onChange={ubah(`${prefix}_judul`)}
                  className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink/70">Deskripsi</label>
                <textarea rows={2} value={form[`${prefix}_deskripsi`] || ''} onChange={ubah(`${prefix}_deskripsi`)}
                  className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================== WARNA & TEMA ==================== */}
      {tab === 'warna' && (
        <div className="space-y-6">
          <div className="bg-white border border-emerald/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-emerald">Warna Utama</h2>
              <button type="button" onClick={resetWarna} className="text-xs font-semibold text-gold-dark hover:underline">
                Kembalikan default
              </button>
            </div>
            <p className="text-xs text-ink/50">Perubahan langsung kelihatan di seluruh situs setelah disimpan — gak perlu deploy ulang.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <InputWarna label="Primer (navbar, judul, tombol utama)" value={form.warna_primer} onChange={ubah('warna_primer')} />
              <InputWarna label="Primer Gelap (footer, hover)" value={form.warna_primer_gelap} onChange={ubah('warna_primer_gelap')} />
              <InputWarna label="Primer Terang (hover tombol)" value={form.warna_primer_terang} onChange={ubah('warna_primer_terang')} />
              <InputWarna label="Aksen (tombol CTA, highlight)" value={form.warna_aksen} onChange={ubah('warna_aksen')} />
              <InputWarna label="Aksen Terang" value={form.warna_aksen_terang} onChange={ubah('warna_aksen_terang')} />
              <InputWarna label="Aksen Gelap" value={form.warna_aksen_gelap} onChange={ubah('warna_aksen_gelap')} />
              <InputWarna label="Latar Belakang" value={form.warna_latar} onChange={ubah('warna_latar')} />
              <InputWarna label="Teks Utama" value={form.warna_teks} onChange={ubah('warna_teks')} />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 sticky bottom-4">
        <button disabled={saving} className="rounded-full bg-emerald text-cream font-semibold px-5 py-2 shadow-lg disabled:opacity-50">
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
        {sukses && <p className="text-sm text-emerald font-medium">Tersimpan ✓</p>}
      </div>
    </form>
  )
}