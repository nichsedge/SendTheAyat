# KirimAyat (Inspired by SendTheSong.xyz)

> **Sampaikan pesan personal, doa tulus, dan curahan hati yang disematkan bersama ayat Al-Qur'an penyejuk jiwa.**

Platform web modern yang mengadaptasi konsep viral **SendTheSong.xyz**, di mana pesan personal disematkan bersama lantunan ayat suci Al-Qur'an (lengkap dengan teks mushaf Utsmani, terjemahan resmi Kemenag RI, serta audio tilawah jernih).

---

## 🌟 Fitur Utama (SendTheSong Experience)

1. **Search by Recipient Name ("Cari Nama Penerima")**:
   - Cari pesan yang ditulis untuk namamu (misal: *Dinda, Ibu, Fajar, Zahra, Diriku Sendiri, Sahabatku*).
   - Filter cepat dengan tag nama populer langsung dari hero section.

2. **Community & Anonymous Letters Feed**:
   - Jelajahi pesan-pesan personal tulus dari komunitas yang terhubung dengan ayat-ayat Al-Qur'an.
   - Filter urutan: *Terkini* atau *Paling Tersentuh* (reaksi terbanyak).
   - Dengarkan cuplikan tilawah langsung pada kartu pesan di feed.

3. **Al-Qur'an Verse Integration (114 Surah & Curated Feelings)**:
   - Jelajahi ayat berdasarkan situasi batin: *Ketenangan Jiwa, Saat Berjuang/Ujian, Harapan & Rezeki, Rasa Syukur, Cinta & Pasangan, Doa & Perlindungan*.
   - Jelajah lengkap 114 surah dengan referensi akurat & terverifikasi.

4. **Personal Gift Card Studio**:
   - Tentukan penerima (*To: ...*), tulis pesan/curahan hati (*Message*), sematkan ayat (*Attached Verse*), dan tentukan nama pengirim (*From: ...* / Anonim).
   - 5 pilihan palet estetika: *Hening Zaitun, Mushaf Klasik, Putih Tenang, Senja Teduh, Malam Hening*.
   - Live synchronization preview saat mengetik.

5. **Direct Sharing, Story Export & Interaction**:
   - **Ekspor Story 9:16 (Instagram & WhatsApp Status)**: Format vertikal khusus layar HP (1080 × 1920) dengan kaligrafi Arab menawan dan tipografi elegan.
   - **Ekspor Format Feed (1:1)**: Format kartu klasik untuk arsip dan galeri.
   - **Surat Privat / Rahasia (Unlisted)**: Pilihan untuk menyembunyikan surat dari feed komunitas publik (hanya bisa dibuka oleh yang memiliki tautan).
   - **Dynamic Social Preview (OpenGraph / Twitter Cards)**: Cloudflare Pages Function `/v/[id]` yang menyajikan preview WhatsApp/Twitter dengan nama penerima dan kutipan ayat.
   - URL-safe encoded share links (`/?p=...` dan `/v/[id]`).
   - Salin tautan satu klik & share WhatsApp otomatis dengan teks rapi.
   - Unduh kartu dalam format gambar PNG resolusi tinggi (`html-to-image`).
   - Tanggapan spiritual interaktif: *🤲 Aamiin*, *🤍 Tersentuh*, *✨ Menenangkan* dengan efek konfeti lembut.
   - Simpan pesan ke arsip lokal (*LocalStorage Bookmarks & Sent History*).

---

## 🛠️ Tech Stack & Standar
 
- **Framework**: Next.js 15 (App Router, Static Export SSG) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Typography + Lucide Icons + Google Fonts (Amiri, Scheherazade New, Newsreader, Plus Jakarta Sans)
- **Audio Recitation**: Mishary Rashid Alafasy High-Quality Recitations (EQuran API / Kemenag Dataset Mirror)
- **Export & Effects**: `html-to-image`, `canvas-confetti`
- **Deployment**: Cloudflare Pages (`out/` build output) + Cloudflare D1 + Pages Functions

---

## 🚀 Menjalankan & Deployment

### Pengembangan Lokal

```bash
# Install dependensi (Bun direkomendasikan)
bun install # atau npm install

# Jalankan server pengembangan
bun run dev # atau npm run dev

# Jalankan linter
bun run lint # atau npm run lint
```

### Deployment ke Cloudflare Pages

1. **Via Cloudflare Pages Git Integration (CI/CD)**:
   - **Framework preset**: `None` / `Next.js (Static HTML Export)`
   - **Build command**: `bun run build` (atau `npm run build`)
   - **Build output directory**: `out`
   - Node 22 dideteksi otomatis melalui `.node-version`.

2. **Via Wrangler CLI Direct Upload**:
   ```bash
   bun run deploy
   ```
