import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import NewsCard from '../components/NewsCard'

export default function SeputarHimmah() {
  const [berita, setBerita] = useState([])
  const [q, setQ] = useState('')

  useEffect(() => {
    supabase
      .from('berita')
      .select('*')
      .eq('terbit', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setBerita(data || []))
  }, [])

  const filtered = berita.filter((b) => b.judul.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald">Seputar HIMMAH</h1>
          <p className="text-ink/60 mt-1">Kabar dan kegiatan terbaru dari komisariat.</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari berita..."
          className="rounded-full border border-emerald/20 px-4 py-2 text-sm w-full sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink/50">Belum ada berita yang cocok.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {filtered.map((b, i) => <NewsCard key={b.id} berita={b} featured={i === 0} />)}
        </div>
      )}
    </div>
  )
}
