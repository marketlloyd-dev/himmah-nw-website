import { useState } from 'react'

/**
 * Coverflow kartu putih utk menampilkan anggota (pengurus inti / per divisi),
 * terinspirasi referensi kartu destinasi "Azure Coast" — struktur konten
 * disesuaikan: foto, nama, jabatan, dan badge divisi (bukan data wisata).
 *
 * members: [{ id, nama, jabatan, divisi, foto_url }]
 */
export default function MemberCoverflow({ members, accent = 'Divisi' }) {
  const [current, setCurrent] = useState(0)
  const n = members.length
  if (n === 0) return null

  const prev = () => setCurrent((c) => (c - 1 + n) % n)
  const next = () => setCurrent((c) => (c + 1) % n)

  const initials = (nama) =>
    nama.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()

  return (
    <div className="relative" style={{ perspective: '1400px' }}>
      <div className="relative h-[340px] sm:h-[400px] flex items-center justify-center">
        {members.map((m, i) => {
          let offset = i - current
          if (offset > n / 2) offset -= n
          if (offset < -n / 2) offset += n
          const abs = Math.abs(offset)
          if (abs > 2) return null

          const isCenter = offset === 0
          const translateX = offset * 160
          const rotateY = offset * -26
          const scale = isCenter ? 1 : 0.82
          const opacity = 1 - abs * 0.3
          const z = 30 - abs

          return (
            <div
              key={m.id}
              onClick={() => !isCenter && setCurrent(i)}
              className="absolute rounded-2xl overflow-hidden bg-white shadow-xl border border-emerald/10 transition-all duration-700 ease-out cursor-pointer"
              style={{
                width: isCenter ? '230px' : '200px',
                height: isCenter ? '320px' : '290px',
                transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity,
                zIndex: z,
              }}
            >
              <div className="h-[55%] w-full overflow-hidden">
                <img
                  src={m.foto_url || 'https://placehold.co/300x300/0B3D2E/F6F4EE?text=' + initials(m.nama)}
                  alt={m.nama}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 relative">
                <p className="font-display font-bold text-emerald text-sm leading-tight truncate">{m.nama}</p>
                <p className="text-xs text-ink/60 mt-0.5 truncate">{m.jabatan}</p>
                {m.divisi && (
                  <span className="inline-block mt-2 text-[10px] uppercase tracking-wide font-semibold text-gold-dark bg-gold/10 rounded-full px-2 py-0.5">
                    {accent}: {m.divisi}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 h-7 w-7 rounded-full bg-emerald text-cream text-[10px] font-bold flex items-center justify-center">
                  {initials(m.nama)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {n > 1 && (
        <>
          <button
            onClick={prev} aria-label="Sebelumnya"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 h-9 w-9 rounded-full bg-emerald text-cream flex items-center justify-center hover:bg-emerald-light"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button
            onClick={next} aria-label="Berikutnya"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 h-9 w-9 rounded-full bg-emerald text-cream flex items-center justify-center hover:bg-emerald-light"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </>
      )}
    </div>
  )
}
