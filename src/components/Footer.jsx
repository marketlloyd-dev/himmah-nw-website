export default function Footer() {
  return (
    <footer className="bg-emerald-dark text-cream/80 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-gold">HIMMAH NW</p>
          <p className="text-sm mt-2">
            Komisariat STMIK Syaikh Zainuddin NW Anjani. Wadah perjuangan, dakwah, dan pengembangan
            diri mahasiswa Nahdlatul Wathan.
          </p>
        </div>
        <div>
          <p className="font-semibold text-cream mb-2">Tautan</p>
          <ul className="space-y-1 text-sm">
            <li><a href="/informasi" className="hover:text-gold">Struktur Kepengurusan</a></li>
            <li><a href="/seputar-himmah" className="hover:text-gold">Berita</a></li>
            <li><a href="/galeri" className="hover:text-gold">Galeri Kegiatan</a></li>
            <li><a href="/admin" className="hover:text-gold">Admin</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-cream mb-2">Kontak</p>
          <p className="text-sm">STMIK Syaikh Zainuddin NW Anjani, Lombok Timur, NTB</p>
          <p className="text-sm mt-1">himmah.stmikszn@gmail.com</p>
        </div>
      </div>
      <div className="border-t border-gold/20 text-center text-xs py-4">
        © {new Date().getFullYear()} HIMMAH NW Komisariat STMIK Syaikh Zainuddin NW Anjani
      </div>
    </footer>
  )
}
