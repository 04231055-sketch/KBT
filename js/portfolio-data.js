// Data Portofolio, Katalog, dan Spesifikasi MEBELIZE
const PORTFOLIO_DATA = [
  {
    id: "ks-01",
    title: "Kusen Jendela Casement 2 Daun + Kaca Mati",
    category: "kusen",
    profile: "Alexindo 4 Inch",
    finish: "Black Matte Powder Coating",
    dimension: "150 x 180 cm",
    fileFormats: ["DWG (2D CAD)", "3D OBJ/FBX", "PDF Shop Drawing", "RAB Cutting List"],
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    description: "Desain presisi jendela casement ganda dengan ventilasi udara optimal dan kaca mati atas untuk pencahayaan alami maksimal.",
    specs: {
      ketebalanProfil: "1.3 mm",
      tipeKaca: "Tempered Glass 6mm Clear",
      hardware: "Friction Stay Stainless 304, Multi-point Lock"
    }
  },
  {
    id: "pt-01",
    title: "Pintu Sliding Aluminium 4 Daun (Teras Belakang)",
    category: "pintu",
    profile: "YKK AP Finish Good",
    finish: "Anodize Silver Gloss",
    dimension: "320 x 240 cm",
    fileFormats: ["DWG (2D CAD)", "3D Render Photoreal", "Cutting Plan"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    description: "Pintu geser bukaan lebar menyatukan ruang tamu dengan taman samping/belakang dengan peredam suara dan rel halus heavy-duty.",
    specs: {
      ketebalanProfil: "1.5 mm",
      tipeKaca: "Euro Grey Glass 8mm",
      hardware: "Heavy Duty Roller Wheel, Flush Lock Handle"
    }
  },
  {
    id: "pl-01",
    title: "Plafon PVC Drop Ceiling + Rangka Hollow Aluminium & LED Cove",
    category: "plafon",
    profile: "Hollow Aluminium 4x4 & Lis Wall Angle",
    finish: "Putih Matte & Urat Kayu Natural",
    dimension: "400 x 350 cm (14 m²)",
    fileFormats: ["DWG Denah Rangka", "3D Ceiling Render", "PDF Detail Potongan", "BoQ Material"],
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    description: "Gambar kerja lengkap denah pembagian rangka hollow anti karat, elevasi drop ceiling, jalur lampu LED strip tersembunyi, dan optimasi potongan papan plafon.",
    specs: {
      ketebalanProfil: "Hollow 0.8 mm + Panel PVC 8 mm",
      tipeKaca: "Jalur Hidden LED Strip Warm White",
      hardware: "Rod Penggantung Dak, Sekrup Roofing & Wall Angle"
    }
  },
  {
    id: "ks-02",
    title: "Jendela Pivot Vertikal Modern Minimalis",
    category: "kusen",
    profile: "Inkalum Custom",
    finish: "Woodgrain Urat Kayu Ebony",
    dimension: "90 x 200 cm",
    fileFormats: ["DWG 2D", "3D SketchUp/CAD", "PDF"],
    image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80",
    description: "Model jendela pivot sumbu putar tengah yang memberikan sirkulasi udara 100% dan estetika arsitektur kontemporer.",
    specs: {
      ketebalanProfil: "1.4 mm",
      tipeKaca: "Laminated Glass 5+5mm",
      hardware: "Center Pivot Hinge 360 Heavy Duty"
    }
  },
  {
    id: "kc-01",
    title: "Kitchen Set Aluminium Full Modular Anti-Rayap",
    category: "kitchen",
    profile: "Aluminium Hollow & ACP Board",
    finish: "Hitam Doff & Marmer Grey ACP",
    dimension: "360 x 60 x 220 cm",
    fileFormats: ["DWG Layout 2D", "3D Max/CAD Render", "RAB & Cutting List"],
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    description: "Desain kabinet dapur 100% tahan air, anti rayap, dan anti jamur seumur hidup dengan engsel soft-close hidrolik.",
    specs: {
      ketebalanProfil: "Aluminium Frame 1.2 mm + ACP 4mm",
      tipeKaca: "Backpainted Glass backsplash",
      hardware: "Soft-close Hinge Blum/TTC, Gas Spring Lift"
    }
  },
  {
    id: "pl-02",
    title: "Plafon Kisi-Kisi Baffle Aluminium (Linear Ceiling)",
    category: "plafon",
    profile: "Baffle Tube Aluminium 30x100 mm",
    finish: "Woodgrain Teak Powder Coating",
    dimension: "500 x 300 cm (15 m²)",
    fileFormats: ["DWG Shop Drawing", "3D Visual", "Cutting List Batang"],
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    description: "Desain plafon kisi aluminium modern untuk ruang keluarga, lobi, maupun teras dengan jarak antar bilah presisi serta akses mudah untuk perawatan instalasi MEP.",
    specs: {
      ketebalanProfil: "1.0 mm Extruded Aluminum",
      tipeKaca: "Integrasi Downlight & Linear Lamp",
      hardware: "Carrier Rail Galvanis & End Cap Aluminium"
    }
  },
  {
    id: "pt-02",
    title: "Pintu Lipat Folding Door 5 Daun (Café & Ruang Keluarga)",
    category: "pintu",
    profile: "Dacon Heavy Duty",
    finish: "White Snow Powder Coat",
    dimension: "400 x 250 cm",
    fileFormats: ["DWG Fabrikasi", "3D Exploded View", "BOM Material"],
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    description: "Sistem pintu lipat aluminium berpresisi tinggi dengan roda atas gantung untuk lintasan tanpa hambatan.",
    specs: {
      ketebalanProfil: "1.6 mm",
      tipeKaca: "Double Glazing Low-E",
      hardware: "Top-Hung Folding System, Flush Bolt Stainless"
    }
  },
  {
    id: "pr-01",
    title: "Partisi Kaca Sekat Kantor Frame Slim Aluminium",
    category: "partisi",
    profile: "Slimline 1.5 x 3 Inch",
    finish: "Anodize Black Matt",
    dimension: "600 x 300 cm",
    fileFormats: ["DWG As-Built", "3D Visual", "PDF Cutting Guide"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    description: "Sistem partisi sekat ruangan kantor akustik modern dengan kusen minimalis profil ramping dan kaca akustik kedap suara.",
    specs: {
      ketebalanProfil: "1.3 mm",
      tipeKaca: "Tempered Glass 10mm Clear",
      hardware: "Floor Hinge Dorma Style, Patch Fitting"
    }
  }
];

const PACKAGES_DATA = [
  {
    id: "pkg-basic",
    name: "Paket 2D CAD Shop Drawing",
    badge: "Cocok untuk Fabrikasi Bengkel",
    price: 150000,
    priceNote: "per opening / unit / ruangan",
    features: [
      "Gambar Kerja CAD 2D Lengkap (.DWG & .DXF)",
      "Gambar Denah & Tampak Depan / Samping",
      "Detail Potongan Profil Kusen, Rangka & Sambungan",
      "Dimensi Akurat Skala Milimeter",
      "Format Cetak PDF Skala 1:20 / 1:50",
      "Revisi Minor 2x"
    ],
    recommended: false
  },
  {
    id: "pkg-pro",
    name: "Paket 3D CAD Visual Render",
    badge: "Paling Populer untuk Presentasi",
    price: 250000,
    priceNote: "per opening / unit / ruangan",
    features: [
      "Semua Fitur Paket 2D Shop Drawing",
      "3D Modeling CAD (.DWG 3D / .OBJ / .SKP)",
      "3 Render Visual Realistis Resolusi Tinggi (4K)",
      "Pilihan Tekstur Finishing (Powder Coat / Woodgrain)",
      "Simulasi Pencahayaan, Kaca & LED Cove Realistis",
      "Revisi Desain 3x"
    ],
    recommended: true
  },
  {
    id: "pkg-master",
    name: "Paket Komplit Fabrikasi + Cutting List + RAB",
    badge: "Hemat Bahan & Langsung Produksi",
    price: 400000,
    priceNote: "per opening / unit / ruangan",
    features: [
      "Semua Fitur Paket 2D & 3D Render",
      "Daftar Potong Profil (Cutting List Optimization)",
      "Detail Sudut Potong 45° & 90° Sesuai Batang",
      "Estimasi Rencana Anggaran Biaya (RAB Bahan & Kaca)",
      "Rekomendasi Hardware / Aksesoris (Engsel, Kunci, Rangka)",
      "Konsultasi Teknis Langsung via WhatsApp",
      "Revisi Hingga Disetujui"
    ],
    recommended: false
  }
];

const ALUMINUM_BRANDS = [
  { name: "Alexindo", desc: "Ketebalan standar stabil, paling populer untuk proyek residensial & komersial", standardTebal: "1.15 mm - 1.35 mm" },
  { name: "YKK AP", desc: "Grade premium Jepang, presisi tinggi, finishing anodize & coating paling mulus", standardTebal: "1.35 mm - 1.60 mm" },
  { name: "Dacon / Inkalum", desc: "Ekonomis berkualitas, kokoh, sangat cocok untuk kusen rumah tinggal", standardTebal: "1.00 mm - 1.20 mm" },
  { name: "Forta / Alcomexindo", desc: "Pilihan fleksibel untuk kusen 3 inch maupun 4 inch tahan lama", standardTebal: "1.10 mm - 1.30 mm" }
];

const FAQ_DATA = [
  {
    q: "Apakah file desain AutoCAD (.DWG) bisa langsung diserahkan ke tukang bengkel aluminium?",
    a: "Ya, tentu saja! Desain kami dibuat oleh drafter berpengalaman fabrikasi aluminium. Gambar kerja 2D DWG dan PDF sudah dilengkapi detail potongan sambungan profil kusen, ukuran milimeter presisi, serta rekomendasi hardware/kaca sehingga tukang dapat langsung memotong dan merakit tanpa ragu."
  },
  {
    q: "Apakah desain plafon sudah mencakup gambar denah rangka hollow dan titik lampu?",
    a: "Ya. Untuk pemesanan desain plafon PVC maupun plafon kisi aluminium, gambar kerja mencakup denah pembagian jarak rangka hollow, detail elevasi drop ceiling, jalur lampu LED cove/downlight, serta rincian kebutuhan batang profil agar tidak banyak sisa bahan terbuang."
  },
  {
    q: "Bagaimana jika saya belum memiliki ukuran pasti dari lapangan?",
    a: "Anda bisa mengirimkan ukuran perkiraan atau denah kasar tulisan tangan terlebih dahulu. Tim kami akan memberikan saran ukuran standar proporsional kusen/pintu. Setelah tembok fisik selesai diplester, ukuran dapat disesuaikan (revisi final) sebelum diproduksi."
  },
  {
    q: "Apa saja format file yang akan saya terima setelah pemesanan selesai?",
    a: "Tergantung paket yang Anda pilih, Anda akan menerima file Master AutoCAD (.DWG versi kompatibel dari 2010 s/d terbaru), file siap cetak (.PDF), file render gambar realistis resolusi tinggi (.PNG/.JPG), dan file Excel/PDF untuk Cutting List & RAB bahan."
  },
  {
    q: "Berapa lama proses pengerjaan desain 3D & 2D CAD?",
    a: "Untuk 1 s/d 3 unit kusen/pintu standar biasanya selesai dalam 1x24 jam hingga 2 hari kerja. Untuk proyek satu rumah tinggal lengkap, plafon satu lantai, atau kitchen set modular, umumnya memakan waktu 2-4 hari kerja tergantung kompleksitas."
  },
  {
    q: "Apakah melayani pesanan pembuatan fisik aluminium juga selain desain?",
    a: "Fokus utama layanan digital ini adalah penyedia jasa desain CAD 2D/3D & engineering drawing untuk seluruh Indonesia. Namun jika lokasi proyek Anda berada di area jangkauan workshop kami, kami juga siap melayani paket fabrikasi dan pemasangan lengkap di tempat!"
  }
];

const TESTIMONIALS_DATA = [
  {
    name: "Bpk. Hendra Gunawan",
    role: "Kontraktor & Owner Rumah Tinggal (Bandung)",
    text: "Desain CAD kusen dari MEBELIZE sangat membantu bengkel aluminium saya. Cutting list-nya tepat sekali, potongan profil jadi tidak banyak terbuang (waste minim). Klien saya juga puas melihat visual 3D sebelum dipasang.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Ibu Maya Paramitha",
    role: "Interior Designer (Jakarta Selatan)",
    text: "Pesan desain kitchen set aluminium modular di sini hasilnya rapi banget. Detail sambungan hollow dan modul ACP-nya presisi. Timnya sangat komunikatif dan mengerti standar profil Alexindo & YKK.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Andi Prasetyo, ST",
    role: "Arsitek & Project Manager (Surabaya)",
    text: "Pintu lipat 5 daun bentang 4 meter awalnya bingung detail profil rel atas bawahnya. Setelah dibuatkan shop drawing AutoCAD di sini, tukang fabrikasi langsung paham. Eksekusi proyek jadi lancar tanpa revisi di lapangan.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  }
];