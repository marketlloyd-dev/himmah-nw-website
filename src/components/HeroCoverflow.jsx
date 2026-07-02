import { useEffect, useState } from 'react'

/**
 * Hero carousel gaya coverflow (kartu miring 3D), terinspirasi referensi
 * desain travel-site "Voyage" — diadaptasi warna emerald & gold + konten
 * berita/kegiatan HIMMAH menggantikan destinasi wisata.
 *
 * slides: [{ judul, ringkasan, cover_url, tag }]
 */
export default function HeroCoverflow({ slides }) {
  const [current, setCurrent] = useState(0)
  const n = slides.length

  useEffect(() => {
    if (n < 2) return
    const t = setInterval(() => setCurrent((c) => (c + 1) % n), 6000)
    return () => clearInterval(t)
  }, [n])

  if (n === 0) return null

  const prev = () => setCurrent((c) => (c - 1 + n) % n)
  const next = () => setCurrent((c) => (c + 1) % n)

  return (
    <section className="relative bg-emerald-dark overflow-hidden">
      {/* glow ambient ala referensi */}
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-emerald-light/20 blur-3xl" />

      <div
        className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20"
        style={{ perspective: '1400px' }}
      >
        <div className="relative h-[420px] sm:h-[520px] flex items-center justify-center">
          {slides.map((s, i) => {
            let offset = i - current
            // supaya carousel "wrap" natural (kartu paling kiri/kanan lewat sisi terdekat)
            if (offset > n / 2) offset -= n
            if (offset < -n / 2) offset += n

            const abs = Math.abs(offset)
            if (abs > 2) return null

            const isCenter = offset === 0
            const translateX = offset * 190
            const rotateY = offset * -28
            const scale = isCenter ? 1 : 0.78
            const opacity = 1 - abs * 0.28
            const z = 30 - abs

            return (
              <div
                key={i}
                className="absolute rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ease-out cursor-pointer"
                style={{
                  width: isCenter ? '340px' : '260px',
                  height: isCenter ? '480px' : '420px',
                  transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                  opacity,
                  zIndex: z,
                }}
                onClick={() => !isCenter && setCurrent(i)}
              >
                <img
                  src={s.cover_url || 'https://placehold.co/700x950/0B3D2E/F6F4EE?text=HIMMAH+NW'}
                  alt={s.judul}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

                {s.tag && (
                  <span className="absolute top-4 right-4 rounded-full bg-cream/15 backdrop-blur px-3 py-1 text-xs text-cream border border-cream/30">
                    {s.tag}
                  </span>
                )}

                {isCenter && (
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="font-display text-2xl sm:text-3xl font-black text-cream uppercase leading-tight">
                      {s.judul}
                    </h2>
                    <div className="h-px w-10 bg-gold my-3" />
                    {s.ringkasan && <p className="text-cream/85 text-sm line-clamp-2">{s.ringkasan}</p>}
                  </div>
                )}
              </div>
            )
          })}

          {n > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Sebelumnya"
                className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 z-40 h-10 w-10 rounded-full bg-cream/10 hover:bg-cream/20 text-cream flex items-center justify-center backdrop-blur"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>
              </button>
              <button
                onClick={next}
                aria-label="Berikutnya"
                className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 z-40 h-10 w-10 rounded-full bg-cream/10 hover:bg-cream/20 text-cream flex items-center justify-center backdrop-blur"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
