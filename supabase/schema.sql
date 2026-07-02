-- ============================================================
-- Skema database HIMMAH NW Komisariat STMIK Syaikh Zainuddin NW Anjani
-- Jalankan di Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- Pengaturan umum (kata sambutan ketua, dll) — key/value sederhana
create table if not exists pengaturan (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  nama_ketua text,
  updated_at timestamptz default now()
);

-- Berita / "Seputar HIMMAH"
create table if not exists berita (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  slug text unique not null,
  ringkasan text,
  konten text,          -- HTML dari editor redaksi
  cover_url text,
  terbit boolean default true,
  views integer default 0,
  created_at timestamptz default now()
);

-- Divisi organisasi
create table if not exists divisi (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  deskripsi text,
  urutan integer default 0
);

-- Program kerja per divisi
create table if not exists program_kerja (
  id uuid primary key default gen_random_uuid(),
  divisi_id uuid references divisi(id) on delete cascade,
  nama text not null,
  urutan integer default 0
);

-- Pengurus (ketua/sekretaris/bendahara = tipe 'inti', anggota divisi = tipe 'divisi')
create table if not exists pengurus (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jabatan text not null,
  tipe text not null default 'inti' check (tipe in ('inti','divisi')),
  divisi text,           -- nama divisi (cocokkan dgn kolom "nama" pada tabel divisi)
  foto_url text,
  urutan integer default 0
);

-- Galeri kegiatan
create table if not exists galeri (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  judul text,
  unggulan boolean default false,   -- tandai foto kegiatan unggulan utk hero 3D di Beranda
  urutan integer default 0,
  created_at timestamptz default now()
);

-- Kalau tabel galeri sudah pernah dibuat sebelumnya (versi lama), jalankan 2 baris ini saja:
alter table galeri add column if not exists unggulan boolean default false;
alter table galeri add column if not exists urutan integer default 0;

-- Agenda / kegiatan mendatang
create table if not exists agenda (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi text,
  lokasi text,
  tanggal_mulai timestamptz not null,
  tanggal_selesai timestamptz,
  cover_url text,
  created_at timestamptz default now()
);

-- Pengaturan situs (satu baris saja, id selalu 1) — logo, sambutan, kontak, sosmed dll,
-- semua yang dulu hardcode di Navbar/Footer/Beranda sekarang bisa diedit dari admin.
create table if not exists pengaturan_situs (
  id integer primary key default 1,
  nama_situs text default 'HIMMAH NW',
  tagline text default 'Himpunan Mahasiswa Nahdlatul Wathan',
  logo_url text,
  hero_image_url text,   -- gambar latar hero Beranda kalau belum ada berita
  sambutan_ketua text,
  nama_ketua text,
  alamat text default 'STMIK Syaikh Zainuddin NW Anjani, Lombok Timur, NTB',
  email text default 'himmah.stmikszn@gmail.com',
  whatsapp text,
  instagram text,
  facebook text,
  youtube text,
  footer_deskripsi text default 'Komisariat STMIK Syaikh Zainuddin NW Anjani. Wadah perjuangan, dakwah, dan pengembangan diri mahasiswa Nahdlatul Wathan.',
  -- Judul & deskripsi tiap halaman (kosong = pakai default bawaan komponen)
  informasi_judul text,
  informasi_deskripsi text,
  seputar_judul text,
  seputar_deskripsi text,
  galeri_judul text,
  galeri_deskripsi text,
  agenda_judul text,
  agenda_deskripsi text,
  -- Tema warna (hex), diterapkan realtime lewat CSS variable, tanpa perlu rebuild
  warna_primer text default '#0B3D2E',
  warna_primer_gelap text default '#082B20',
  warna_primer_terang text default '#145C46',
  warna_aksen text default '#D4AF37',
  warna_aksen_terang text default '#E8CA6B',
  warna_aksen_gelap text default '#A9861F',
  warna_latar text default '#F6F4EE',
  warna_teks text default '#12211E',
  updated_at timestamptz default now(),
  constraint pengaturan_situs_singleton check (id = 1)
);
insert into pengaturan_situs (id) values (1) on conflict (id) do nothing;

-- Kalau tabel pengaturan_situs sudah pernah dibuat sebelumnya (versi lama tanpa kolom di atas),
-- jalankan blok ini saja supaya kolom baru nambah tanpa hapus data yang sudah ada:
alter table pengaturan_situs add column if not exists hero_image_url text;
alter table pengaturan_situs add column if not exists informasi_judul text;
alter table pengaturan_situs add column if not exists informasi_deskripsi text;
alter table pengaturan_situs add column if not exists seputar_judul text;
alter table pengaturan_situs add column if not exists seputar_deskripsi text;
alter table pengaturan_situs add column if not exists galeri_judul text;
alter table pengaturan_situs add column if not exists galeri_deskripsi text;
alter table pengaturan_situs add column if not exists agenda_judul text;
alter table pengaturan_situs add column if not exists agenda_deskripsi text;
alter table pengaturan_situs add column if not exists warna_primer text default '#0B3D2E';
alter table pengaturan_situs add column if not exists warna_primer_gelap text default '#082B20';
alter table pengaturan_situs add column if not exists warna_primer_terang text default '#145C46';
alter table pengaturan_situs add column if not exists warna_aksen text default '#D4AF37';
alter table pengaturan_situs add column if not exists warna_aksen_terang text default '#E8CA6B';
alter table pengaturan_situs add column if not exists warna_aksen_gelap text default '#A9861F';
alter table pengaturan_situs add column if not exists warna_latar text default '#F6F4EE';
alter table pengaturan_situs add column if not exists warna_teks text default '#12211E';

-- ============================================================
-- Row Level Security: publik boleh BACA, hanya admin (login) boleh TULIS
-- ============================================================
alter table pengaturan enable row level security;
alter table berita enable row level security;
alter table divisi enable row level security;
alter table program_kerja enable row level security;
alter table pengurus enable row level security;
alter table galeri enable row level security;
alter table agenda enable row level security;

create policy "publik baca pengaturan" on pengaturan for select using (true);
create policy "admin kelola pengaturan" on pengaturan for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "publik baca berita" on berita for select using (true);
create policy "admin kelola berita" on berita for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "publik baca divisi" on divisi for select using (true);
create policy "admin kelola divisi" on divisi for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "publik baca program_kerja" on program_kerja for select using (true);
create policy "admin kelola program_kerja" on program_kerja for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "publik baca pengurus" on pengurus for select using (true);
create policy "admin kelola pengurus" on pengurus for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "publik baca galeri" on galeri for select using (true);
create policy "admin kelola galeri" on galeri for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "publik baca agenda" on agenda for select using (true);
create policy "admin kelola agenda" on agenda for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter table pengaturan_situs enable row level security;
create policy "publik baca pengaturan_situs" on pengaturan_situs for select using (true);
create policy "admin kelola pengaturan_situs" on pengaturan_situs for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- Storage buckets: buat lewat dashboard Supabase (Storage > New bucket),
-- set PUBLIC = true, dengan nama persis: "berita", "pengurus", "galeri", "agenda", "pengaturan"
-- Lalu tambahkan policy upload utk authenticated user pada masing-masing bucket:
-- ============================================================
-- (Jalankan setelah bucket dibuat)
-- create policy "admin upload berita" on storage.objects for insert
--   with check (bucket_id = 'berita' and auth.role() = 'authenticated');
-- create policy "publik lihat berita" on storage.objects for select
--   using (bucket_id = 'berita');
-- (ulangi pola sama utk bucket 'pengurus' dan 'galeri')

-- ============================================================
-- Data contoh (opsional, hapus jika tidak perlu)
-- ============================================================
insert into pengaturan (key, value, nama_ketua) values
  ('sambutan_ketua', 'Assalamu''alaikum warahmatullahi wabarakatuh. Selamat datang di website HIMMAH NW Komisariat STMIK Syaikh Zainuddin NW Anjani...', 'Nama Ketua')
  on conflict (key) do nothing;

insert into divisi (nama, deskripsi, urutan) values
  ('Divisi Kaderisasi', 'Membina dan mengembangkan kader HIMMAH', 1),
  ('Divisi Dakwah', 'Menyelenggarakan kegiatan keagamaan', 2),
  ('Divisi Humas & Media', 'Mengelola informasi dan hubungan eksternal', 3)
  on conflict do nothing;