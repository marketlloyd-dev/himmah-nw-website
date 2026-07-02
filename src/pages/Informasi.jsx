import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSettings } from '../lib/SettingsContext'
import MemberCoverflow from '../components/MemberCoverflow'
import ProgramKerjaAccordion from '../components/ProgramKerjaAccordion'

export default function Informasi() {
  const { settings } = useSettings()
  const [pengurus, setPengurus] = useState([])
  const [divisi, setDivisi] = useState([])

  useEffect(() => {
    supabase.from('pengurus').select('*').order('urutan').then(({ data }) => setPengurus(data || []))
    supabase
      .from('divisi')
      .select('*, program_kerja(*)')
      .order('urutan')
      .then(({ data }) => setDivisi(data || []))
  }, [])

  const inti = pengurus.filter((p) => p.tipe === 'inti')
  const anggotaDivisi = (namaDivisi) => pengurus.filter((p) => p.divisi === namaDivisi)

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-emerald">{settings.informasi_judul || 'Informasi Kepengurusan'}</h1>
      <p className="text-ink/60 mt-2 max-w-2xl">
        {settings.informasi_deskripsi || 'Susunan pengurus dan program kerja Komisariat HIMMAH NW STMIK Syaikh Zainuddin NW Anjani.'}
      </p>

      {/* Pengurus inti */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-emerald mb-4">Pengurus Inti</h2>
        {inti.length ? (
          <MemberCoverflow members={inti} accent="Jabatan Inti" />
        ) : (
          <p className="text-ink/50">Data pengurus inti belum tersedia.</p>
        )}
      </section>

      {/* Divisi + program kerja */}
      <section className="mt-16 space-y-14">
        <h2 className="font-display text-xl font-bold text-emerald">Divisi & Program Kerja</h2>
        {divisi.length === 0 && <p className="text-ink/50">Data divisi belum tersedia.</p>}
        {divisi.map((d) => {
          const anggota = anggotaDivisi(d.nama)
          return (
            <div key={d.id} className="bg-white rounded-2xl border border-emerald/10 p-6">
              <h3 className="font-display font-bold text-lg text-emerald">{d.nama}</h3>
              {d.deskripsi && <p className="text-sm text-ink/60 mt-1">{d.deskripsi}</p>}

              <div className="mt-6">
                {anggota.length ? (
                  <MemberCoverflow members={anggota} accent="Divisi" />
                ) : (
                  <p className="text-sm text-ink/40">Belum ada anggota terdaftar di divisi ini.</p>
                )}
              </div>

              {d.program_kerja?.length > 0 && (
                <ProgramKerjaAccordion programKerja={d.program_kerja} />
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}