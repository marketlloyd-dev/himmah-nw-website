# Website HIMMAH NW Komisariat STMIK Syaikh Zainuddin NW Anjani

Stack: React + Vite + Tailwind CSS + Supabase (gratis/free tier).

## Fitur
- **Beranda**: kata sambutan ketua + berita terbaru & paling banyak dibaca
- **Informasi**: struktur pengurus (ketua/sekretaris/bendahara/divisi) + program kerja per divisi, foto dari Supabase
- **Seputar HIMMAH**: daftar berita yang ditulis lewat `/admin`
- **Galeri Kegiatan**: grid foto + lightbox
- **/admin**: login (Supabase Auth) → dashboard kelola berita, pengurus, galeri
  - Upload foto dengan crop/resize (react-easy-crop)
  - Editor redaksi mirip Word: bold, italic, Heading 1/2, UPPERCASE, list, align, quote, link, gambar (react-quill)

## Palet Warna
Diselaraskan dari moodboard "Emerald & Gold": emerald tua `#0B3D2E`, gold `#D4AF37`, krem `#F6F4EE`, ink gelap `#12211E`. Diatur di `tailwind.config.js`.

## Setup

1. Install dependency:
   ```
   npm install
   ```

2. Buat project di https://supabase.com (gratis), lalu:
   - Buka **SQL Editor** → jalankan isi `supabase/schema.sql`
   - Buka **Storage** → buat 3 bucket **public**: `berita`, `pengurus`, `galeri`
   - Buka **Authentication > Users** → tambah 1 user admin (email + password) manual
   - Salin **Project URL** dan **anon public key** dari Settings > API

3. Salin `.env.example` jadi `.env`, isi dengan URL & anon key Supabase.

4. Jalankan:
   ```
   npm run dev
   ```

5. Login admin di `/admin` pakai user yang dibuat di langkah 2.

## Struktur folder
```
src/
  pages/          halaman publik (Beranda, Informasi, SeputarHimmah, Galeri)
  pages/admin/    login + dashboard admin
  components/     Navbar, Footer, NewsCard, RichTextEditor, ImageUploader, dll
  lib/            supabase client, auth context, util crop gambar
supabase/schema.sql   skema tabel + RLS policy
```

## Deploy gratis
Rekomendasi: **Vercel** atau **Netlify** (hubungkan repo GitHub, build command `npm run build`, output `dist`). Jangan lupa isi environment variable `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di dashboard hosting.
