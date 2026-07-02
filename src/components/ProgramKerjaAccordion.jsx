import { useState } from 'react'

/**
 * Dropdown/accordion program kerja per divisi.
 * Klik header buka/tutup daftar program kerja dgn animasi halus.
 */
export default function ProgramKerjaAccordion({ programKerja }) {
  const [open, setOpen] = useState(false)

  if (!programKerja?.length) return null

  return (
    <div className="mt-6 rounded-xl border border-emerald/15 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-emerald/5 hover:bg-emerald/10 transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold text-sm text-emerald">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          Program Kerja
          <span className="text-xs font-normal text-ink/40">({programKerja.length})</span>
        </span>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-gold-dark transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <ul className="px-5 py-4 space-y-2.5 bg-white">
            {programKerja.map((pk, i) => (
              <li key={pk.id} className="flex items-start gap-3 text-sm text-ink/80">
                <span className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-gold/15 text-gold-dark text-[11px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {pk.nama}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
