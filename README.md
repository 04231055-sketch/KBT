# MEBELIZE - Website Jasa Desain 3D AutoCAD Kusen & Mebel Aluminium

Website modern, responsif, dan interaktif khusus untuk penyedia **Jasa Desain 3D AutoCAD Mebel & Kusen Aluminium**. Dirancang dengan estetika blueprint teknik profesional, dilengkapi **Simulasi 3D Interaktif (Three.js)** dan **Kalkulator / Formulir Pemesanan Desain Terintegrasi WhatsApp**.

---

## 🌟 Fitur Utama Website

1. **Header & Navigasi Responsif**:
   - Logo vektor MEBELIZE dengan aksen profil aluminium 3D.
   - Menu navigasi cepat ke seluruh bagian halaman dan tombol CTA pemesanan.
   - Menu hamburger fleksibel untuk perangkat smartphone/tablet.

2. **Hero Section (Blueprint Theme)**:
   - Headline memikat berfokus pada **Presisi Milimeter & Zero Error Fabrikasi**.
   - Indikator spesifikasi teknis (toleransi 0.1 mm, format DWG/DXF/PDF, cutting list, dsb.).
   - Kartu pratinjau shop drawing CAD dengan animasi scanline.

3. **Latar Belakang & Profil Toko (Sesuai Permintaan)**:
   - Menjelaskan latar belakang bengkel/toko mebel aluminium.
   - Masalah umum di lapangan (salah potong bahan, limbah profil terbuang) dan solusi yang dihadirkan melalui desain AutoCAD.
   - 4 Pilar Keunggulan: *Zero Error Potong, Optimasi Cutting List Batang 6 Meter, Visual 3D Realistis, dan File Master Komplit*.

4. **Simulasi 3D CAD Interaktif (Three.js WebGL)**:
   - Pengunjung dapat memutar model 360°, melakukan zoom in/out, dan pan langsung di browser tanpa install software.
   - **Pilihan 3 Model 3D Realistis**:
     1. Kusen Jendela Casement 2 Daun Aluminium
     2. Pintu Sliding Modern
     3. Kitchen Set Aluminium Modular
   - **Mode Tampilan**: *Solid Realistis, Wireframe CAD Blueprint, dan X-Ray*.
   - **Pilihan Finishing Warna Profil**: *Anodize Silver, Hitam Doff, Putih Coating, dan Urat Kayu (Woodgrain)*.
   - Toggle garis dimensi ukuran (milimeter) dan auto-rotate.

5. **Katalog Layanan Spesialis**:
   - Kusen & Jendela Casement / Sliding
   - Pintu Sliding & Pintu Lipat (Bi-fold)
   - Kitchen Set Aluminium Anti Rayap & Lembab (ACP)
   - Partisi Ruangan & Sekat Kantor Kaca
   - Kanopi Kaca & Louver Fasad
   - Shop Drawing Fabrikasi & Analisa RAB

6. **Portofolio Desain & Tombol "Pesan Desain Serupa"**:
   - Filter kategori dinamis (Semua, Kusen, Pintu, Kitchen Set, Partisi).
   - Setiap kartu portofolio memiliki tombol yang otomatis mengisi form pemesanan jika diklik!

7. **Tabel Paket Harga Jasa Desain**:
   - Paket 2D CAD Shop Drawing (Rp 150.000/unit)
   - Paket 3D CAD Visual Render (Rp 250.000/unit - Best Seller)
   - Paket Komplit Fabrikasi + Cutting List + RAB (Rp 400.000/unit)

8. **Formulir Pemesanan Desain Interaktif & Kalkulator Otomatis**:
   - **Langkah 1**: Pilih kategori mebel / kusen
   - **Langkah 2**: Pilih paket desain
   - **Langkah 3**: Pilih merk profil aluminium (Alexindo, YKK AP, Dacon, Inkalum, dll.) & warna finishing
   - **Langkah 4**: Masukkan ukuran (Panjang, Tinggi, Kedalaman profil) dan jumlah unit
   - **Langkah 5**: Tambahan opsi (Layanan Kilat 24 Jam, Analisa RAB Bahan)
   - **Langkah 6**: Masukkan data nama, nomor WhatsApp, alamat proyek, dan catatan khusus
   - **Kalkulasi Biaya Real-time**: Menghitung otomatis total harga dan diskon volume 10% jika pemesanan di atas 5 unit.
   - **Integrasi Kirim WhatsApp**: Sekali klik tombol hijau, teks pesanan langsung tersusun rapi dengan emoji dan poin-poin spesifikasi menuju nomor WhatsApp toko.
   - **Cetak / Simpan PDF**: Dapat mencetak surat pemesanan (SPK) atau menyimpannya sebagai file PDF.

9. **Testimoni Pelanggan & FAQ Accordion**:
   - Pertanyaan umum seputar format file DWG, cara mengukur lapangan, garansi revisi, dan waktu pengerjaan.

10. **Floating WhatsApp Chat**:
    - Tombol chat melayang di sudut kanan bawah untuk konsultasi langsung 24/7.

---

## 📁 Struktur Berkas

```
KBT/
├── index.html                 # Halaman utama website
├── css/
│   └── style.css              # Custom styling blueprint grid, 3D viewport, CAD borders, print styles
├── js/
│   ├── app.js                 # Logika form pemesanan, kalkulator, WhatsApp dispatch, UI toggle
│   ├── cad-viewer.js          # Engine 3D Three.js WebGL (Kusen, Pintu, Kitchen Set)
│   └── portfolio-data.js      # Data portofolio, spesifikasi merk aluminium, FAQ, testimoni
├── assets/
│   └── logo.svg               # Logo vektor MEBELIZE
└── README.md                  # Dokumentasi website
```

---

## 🚀 Cara Menjalankan & Membuka Website

Website ini dibuat dengan arsitektur **Clean Web Standards (HTML5, Tailwind CSS via CDN, Three.js)**, sehingga **sangat mudah dijalankan**:

### Opsi 1: Buka Langsung (Tanpa Server)
Cukup cari file `index.html` di folder `c:\Users\mfaja\OneDrive\Dokumen\Kuliah\KBT` lalu **klik dua kali (double-click)** untuk membukanya di browser Google Chrome, Microsoft Edge, Firefox, atau browser apa pun.

### Opsi 2: Jalankan Menggunakan Local Server (Node.js / Live Server)
Jika memiliki ekstensi *Live Server* di VS Code, klik kanan `index.html` &rarr; **Open with Live Server**.

Atau melalui terminal:
```bash
npx.cmd serve .
# atau
python -m http.server 3000
```

---

## ⚙️ Cara Mengubah Data Toko & Nomor WhatsApp

Untuk menyesuaikan nomor WhatsApp toko Anda:

1. Buka file [`js/app.js`](js/app.js) di editor teks.
2. Pada bagian atas (baris 18), cari konfigurasi `SHOP_CONFIG`:
```javascript
const SHOP_CONFIG = {
  name: "MEBELIZE",
  tagline: "Spesialis Desain 3D AutoCAD Kusen, Pintu & Mebel Aluminium",
  whatsappNumber: "6281234567890", // Ganti dengan nomor WhatsApp Anda (Gunakan format 62...)
  location: "Bandung & Jakarta, Melayani Seluruh Indonesia",
  workingHours: "Senin - Sabtu: 08.00 - 18.00 WIB"
};
```
3. Ubah `"6281234567890"` menjadi nomor WhatsApp pemilik toko (tanpa tanda `+` atau spasi, contoh: `6281398765432`).
4. Buka [`index.html`](index.html), cari teks `6281234567890` untuk mengubah tautan WhatsApp pada tombol floating dan banner footer.

Untuk menambah atau mengganti item portofolio, Anda cukup mengedit file [`js/portfolio-data.js`](js/portfolio-data.js).
Semua data harga, paket, deskripsi, dan FAQ terpusat di sana.

