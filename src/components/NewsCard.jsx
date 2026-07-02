import { Link } from 'react-router-dom'

export default function NewsCard({ berita, featured = false }) {
  const tanggal = new Date(berita.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <Link
      to={`/seputar-himmah/${berita.slug}`}
      className={`group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow border border-emerald/10 ${
        featured ? 'sm:col-span-2 sm:grid sm:grid-cols-2' : ''
      }`}
    >
      <div className={`overflow-hidden ${featured ? 'h-64 sm:h-full' : 'h-44'}`}>
        <img
          src={berita.cover_url || 'https://placehold.co/600x400/0B3D2E/F6F4EE?text=HIMMAH+NW'}
          alt={berita.judul}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold text-gold-dark uppercase tracking-wide">{tanggal}</p>
        <h3 className={`font-display font-bold text-emerald mt-1 ${featured ? 'text-2xl' : 'text-lg'}`}>
          {berita.judul}
        </h3>
        <p className="text-sm text-ink/70 mt-2 line-clamp-3">{berita.ringkasan}</p>
        <p className="text-xs text-ink/50 mt-3">{berita.views ?? 0} kali dibaca</p>
      </div>
    </Link>
  )
}
