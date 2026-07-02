import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function BeritaDetail() {
  const { slug } = useParams()
  const [berita, setBerita] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    supabase
      .from('berita')
      .select('*')
      .eq('slug', slug)
      .eq('terbit', true)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return setNotFound(true)
        setBerita(data)
        // tambah 1 view (best-effort, tanpa menunggu)
        supabase.from('berita').update({ views: (data.views || 0) + 1 }).eq('id', data.id)
      })
  }, [slug])

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-ink/60">Berita tidak ditemukan.</p>
        <Link to="/seputar-himmah" className="text-gold-dark font-semibold hover:underline">← Kembali ke berita</Link>
      </div>
    )
  }

  if (!berita) return <div className="p-14 text-center text-ink/40">Memuat...</div>

  const tanggal = new Date(berita.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <article className="max-w-3xl mx-auto px-4 py-14">
      <Link to="/seputar-himmah" className="text-sm text-gold-dark font-semibold hover:underline">← Semua berita</Link>
      <p className="text-xs uppercase tracking-wide text-gold-dark font-semibold mt-4">{tanggal}</p>
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-emerald mt-2">{berita.judul}</h1>
      {berita.cover_url && (
        <img src={berita.cover_url} alt={berita.judul} className="w-full h-80 object-cover rounded-2xl mt-6" />
      )}
      <div className="prose-himmah mt-8" dangerouslySetInnerHTML={{ __html: berita.konten }} />
    </article>
  )
}
