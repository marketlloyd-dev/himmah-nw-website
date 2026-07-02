import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import NewsCard from '../components/NewsCard'
import HeroCoverflow from '../components/HeroCoverflow'

export default function Beranda() {
  const [sambutan, setSambutan] = useState(null)
  const [beritaTerbaru, setBeritaTerbaru] = useState([])
  const [beritaPopuler, setBeritaPopuler] = useState([])
  const [kegiatanUnggulan, setKegiatanUnggulan] = useState([])

  useEffect(() => {
    // Kata sambutan ketua diambil dari tabel "pengaturan" (key = 'sambutan_ketua')
    supabase
      .from('pengaturan')
      .select('*')
      .eq('key', 'sambutan_ketua')
      .maybeSingle()
      .then(({ data }) => setSambutan(data))

    supabase
      .from('berita')
      .select('*')
      .eq('terbit', true)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setBeritaTerbaru(data || []))

    supabase
      .from('berita')
      .select('*')
      .eq('terbit', true)
      .order('views', { ascending: false })
      .limit(3)
      .then(({ data }) => setBeritaPopuler(data || []))

    // Foto kegiatan yang ditandai admin sbg "unggulan" (lihat KelolaGaleri)
    supabase
      .from('galeri')
      .select('*')
      .eq('unggulan', true)
      .order('urutan', { ascending: true })
      .limit(6)
      .then(({ data }) => setKegiatanUnggulan(data || []))
  }, [])

  const heroSlides = beritaTerbaru.map((b) => ({
    judul: b.judul,
    ringkasan: b.ringkasan,
    cover_url: b.cover_url,
    tag: 'Terbaru',
  }))

  const kegiatanSlides = kegiatanUnggulan.map((f) => ({
    judul: f.judul || 'Kegiatan HIMMAH NW',
    ringkasan: '',
    cover_url: f.url,
    tag: 'Kegiatan Unggulan',
  }))

  return (
    <div>
      {/* Hero coverflow — berita terbaru sbg slide */}
      {heroSlides.length > 0 ? (
        <HeroCoverflow slides={heroSlides} />
      ) : (
        <section className="bg-emerald-dark text-cream text-center py-20 px-4">
          <p className="text-gold font-semibold tracking-wide text-sm uppercase mb-3">
            Himpunan Mahasiswa Nahdlatul Wathan
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-black">
            HIMMAH NW Komisariat STMIK Syaikh Zainuddin NW Anjani
          </h1>
        </section>
      )}

      {/* Kata sambutan ketua */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-center">
        <p className="text-xs uppercase tracking-widest text-gold-dark font-semibold mb-2">Kata Sambutan Ketua</p>
        {sambutan ? (
          <div>
            <p className="text-ink/80 leading-relaxed italic text-lg">"{sambutan.value}"</p>
            {sambutan.nama_ketua && (
              <p className="mt-4 text-sm font-semibold text-emerald">— {sambutan.nama_ketua}, Ketua Komisariat</p>
            )}
          </div>
        ) : (
          <p className="text-ink/40 text-sm">Kata sambutan belum tersedia.</p>
        )}
      </section>

      {/* Foto kegiatan unggulan — hero 3D kedua */}
      {kegiatanSlides.length > 0 && (
        <section>
          <div className="max-w-6xl mx-auto px-4 pt-2">
            <h2 className="font-display text-2xl font-bold text-emerald text-center">Kegiatan Unggulan</h2>
            <p className="text-ink/50 text-sm text-center mt-1">Dokumentasi momen terbaik HIMMAH NW</p>
          </div>
          <HeroCoverflow slides={kegiatanSlides} />
        </section>
      )}

      {/* Berita terbaru */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-emerald">Berita Terbaru</h2>
          <a href="/seputar-himmah" className="text-sm font-semibold text-gold-dark hover:underline">Lihat semua →</a>
        </div>
        {beritaTerbaru.length === 0 ? (
          <p className="text-ink/50">Belum ada berita.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {beritaTerbaru.slice(0, 4).map((b, i) => (
              <NewsCard key={b.id} berita={b} featured={i === 0} />
            ))}
          </div>
        )}
      </section>

      {/* Paling banyak dibaca */}
      {beritaPopuler.length > 0 && (
        <section className="bg-emerald/5 py-14">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-emerald mb-6">Paling Banyak Dibaca</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {beritaPopuler.map((b) => <NewsCard key={b.id} berita={b} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
