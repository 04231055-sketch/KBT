// Main Application Logic for MEBELIZE
// Handles UI, Light/Dark Theme Switcher, 3D Kitchen Studio, Dynamic Order Calculator & WhatsApp Integration

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  renderPortfolio('semua');
  renderPackages();
  renderFaq();
  renderTestimonials();
  initOrderForm();
  initCadViewerWrapper();
  initKitchenStudio();
  initSmoothScroll();
});

// Shop Configuration
const SHOP_CONFIG = {
  name: "MEBELIZE",
  tagline: "Spesialis Desain 3D AutoCAD Kusen, Plafon & Mebel Aluminium",
  whatsappNumber: "6281234567890",
  location: "Bandung & Jakarta, Melayani Seluruh Indonesia",
  workingHours: "Senin - Sabtu: 08.00 - 18.00 WIB"
};

// 0. Custom Light / Dark Theme Toggle
function initThemeToggle() {
  const btn = document.getElementById('btn-theme-toggle');
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');

  const applyTheme = (isLight) => {
    document.documentElement.classList.toggle('light-theme', isLight);
    if (icon) icon.textContent = isLight ? '🌙' : '☀️';
    if (label) label.textContent = isLight ? 'Mode Gelap' : 'Mode Terang';

    // Sinkronkan warna latar belakang kanvas 3D jika sudah aktif
    if (window.CadViewerInstance && typeof window.CadViewerInstance.setTheme === 'function') {
      window.CadViewerInstance.setTheme(isLight);
    }
    if (window.KitchenStudioInstance && typeof window.KitchenStudioInstance.setTheme === 'function') {
      window.KitchenStudioInstance.setTheme(isLight);
    }
  };

  // Muat preferensi tema tersimpan
  const savedTheme = localStorage.getItem('mebelize-theme');
  if (savedTheme === 'light') {
    applyTheme(true);
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const nextIsLight = !document.documentElement.classList.contains('light-theme');
      localStorage.setItem('mebelize-theme', nextIsLight ? 'light' : 'dark');
      applyTheme(nextIsLight);
    });
  }
}

// 1. Mobile Menu Toggle
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

// 2. CAD 3D Viewer Initialization (Kusen, Pintu, Plafon)
function initCadViewerWrapper() {
  const container = document.getElementById('cad-canvas-container');
  if (container && typeof CadViewer !== 'undefined') {
    window.CadViewerInstance = new CadViewer('cad-canvas-container');

    document.querySelectorAll('[data-cad-model]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const model = e.currentTarget.getAttribute('data-cad-model');
        window.CadViewerInstance.loadModel(model);
      });
    });

    document.querySelectorAll('[data-cad-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.getAttribute('data-cad-mode');
        window.CadViewerInstance.setRenderMode(mode);
      });
    });

    document.querySelectorAll('[data-cad-finish]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const finish = e.currentTarget.getAttribute('data-cad-finish');
        window.CadViewerInstance.setAluminumFinish(finish);
      });
    });

    const toggleDimBtn = document.getElementById('btn-toggle-dimensions');
    if (toggleDimBtn) {
      toggleDimBtn.addEventListener('click', () => {
        window.CadViewerInstance.toggleDimensions();
        toggleDimBtn.classList.toggle('text-sky-400');
      });
    }

    const toggleRotateBtn = document.getElementById('btn-toggle-rotate');
    if (toggleRotateBtn) {
      toggleRotateBtn.addEventListener('click', () => {
        window.CadViewerInstance.toggleAutoRotate();
        toggleRotateBtn.classList.toggle('text-sky-400');
      });
    }

    const resetCamBtn = document.getElementById('btn-reset-cam');
    if (resetCamBtn) {
      resetCamBtn.addEventListener('click', () => {
        window.CadViewerInstance.resetCamera();
      });
    }
  }
}

// 2B. Custom Kitchen Set 3D Studio Initialization
function initKitchenStudio() {
  const ksContainer = document.getElementById('kitchen-canvas-container');
  if (!ksContainer || typeof KitchenConfigurator3D === 'undefined') return;

  window.KitchenStudioInstance = new KitchenConfigurator3D('kitchen-canvas-container');

  const bindKitchenControl = (id, key, isCheckbox = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', (e) => {
      const val = isCheckbox ? e.target.checked : e.target.value;
      window.KitchenStudioInstance.updateOption(key, val);
    });
  };

  bindKitchenControl('ks-layout', 'layout');
  bindKitchenControl('ks-length', 'lengthCm');
  bindKitchenControl('ks-upper', 'upperCabinet');
  bindKitchenControl('ks-tall', 'tallCabinet', true);
  bindKitchenControl('ks-island', 'islandTable');
  bindKitchenControl('ks-chairs', 'chairCount');
  bindKitchenControl('ks-finish', 'finish');
  bindKitchenControl('ks-top', 'topColor');
  bindKitchenControl('ks-appliances', 'appliances', true);
  bindKitchenControl('ks-wireframe', 'wireframe', true);

  const applyBtn = document.getElementById('btn-apply-kitchen-order');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const st = window.KitchenStudioInstance.state;

      const kitchenRadio = document.querySelector('input[name="orderCategory"][data-cat-key="kitchen"]');
      if (kitchenRadio) {
        kitchenRadio.checked = true;
        orderState.category = kitchenRadio.value;
        orderState.catKey = 'kitchen';
        renderDimensionFields('kitchen');
      }

      const layoutInput = document.getElementById('dyn-ks-layout');
      const lenInput = document.getElementById('dyn-ks-lower');
      const islandInput = document.getElementById('dyn-ks-island');

      const layoutLabelMap = {
        'linear': 'Single Line',
        'l-shape': 'L-Shape',
        'u-shape': 'U-Shape'
      };
      const islandLabelMap = {
        'none': 'Tanpa Meja Island',
        'island': `Meja Island + ${st.chairCount} Kursi Bar`,
        'peninsula': `Meja Peninsula + ${st.chairCount} Kursi Bar`
      };

      if (layoutInput) layoutInput.value = layoutLabelMap[st.layout] || 'L-Shape';
      if (lenInput) lenInput.value = st.lengthCm;
      if (islandInput) islandInput.value = islandLabelMap[st.islandTable] || 'Tanpa Meja Island';

      const finishMapToOrder = {
        'black': 'Hitam Doff (Powder Coating)',
        'silver': 'Anodize Silver (Silver Terang)',
        'white': 'Putih Glossy (White Coating)',
        'wood': 'Urat Kayu (Woodgrain Cokelat)'
      };
      const finishSelect = document.getElementById('order-finish');
      if (finishSelect && finishMapToOrder[st.finish]) {
        finishSelect.value = finishMapToOrder[st.finish];
        orderState.finish = finishSelect.value;
      }

      const notesInput = document.getElementById('order-customer-notes');
      if (notesInput) {
        notesInput.value = window.KitchenStudioInstance.getSummaryText();
        orderState.notes = notesInput.value;
      }

      syncDynamicDimensionsToState();
      updateOrderSummary();

      document.getElementById('pemesanan')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// 3. Render Portfolio Items
function renderPortfolio(filterCategory = 'semua') {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  const filtered = filterCategory === 'semua'
    ? PORTFOLIO_DATA
    : PORTFOLIO_DATA.filter(item => item.category === filterCategory);

  container.innerHTML = filtered.map(item => `
    <div class="glass-panel glass-panel-hover rounded-xl overflow-hidden border border-slate-700/60 flex flex-col transition-all duration-300">
      <div class="relative h-56 overflow-hidden group">
        <img 
          src="${item.image}" 
          alt="${item.title}" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>
        
        <span class="absolute top-3 left-3 bg-sky-500/90 text-white font-mono-cad text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
          ${item.category}
        </span>
        
        <span class="absolute bottom-3 left-3 font-mono-cad text-xs bg-slate-900/90 text-sky-300 border border-sky-500/30 px-2.5 py-1 rounded">
          📏 ${item.dimension}
        </span>
      </div>

      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
            ${item.title}
          </h3>
          <p class="text-slate-400 text-xs leading-relaxed mb-4">
            ${item.description}
          </p>

          <div class="space-y-1.5 mb-4 text-xs font-mono-cad text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
            <div class="flex justify-between">
              <span class="text-slate-400">Profil:</span>
              <span class="text-sky-300 font-semibold">${item.profile}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Finishing:</span>
              <span>${item.finish}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Tebal Bahan:</span>
              <span>${item.specs.ketebalanProfil}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-1.5 mb-4">
            ${item.fileFormats.map(fmt => `
              <span class="text-[11px] font-mono-cad bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                ${fmt}
              </span>
            `).join('')}
          </div>
        </div>

        <button 
          onclick="quickOrder('${item.title}', '${item.category}', '${item.profile}')"
          class="w-full mt-2 py-2 px-4 rounded-lg bg-slate-800 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 hover:border-transparent font-medium text-xs transition-all flex items-center justify-center gap-2 group"
        >
          <span>Pesan Desain Serupa</span>
          <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('[data-portfolio-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = e.currentTarget.getAttribute('data-portfolio-filter');
      document.querySelectorAll('[data-portfolio-filter]').forEach(b => {
        b.classList.remove('bg-sky-500', 'text-white');
        b.classList.add('bg-slate-800', 'text-slate-300');
      });
      e.currentTarget.classList.add('bg-sky-500', 'text-white');
      e.currentTarget.classList.remove('bg-slate-800', 'text-slate-300');
      renderPortfolio(cat);
    });
  });
}

// 4. Render Packages
function renderPackages() {
  const container = document.getElementById('packages-grid');
  if (!container) return;

  container.innerHTML = PACKAGES_DATA.map(pkg => `
    <div class="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-300 hover:border-sky-400 ${
      pkg.recommended ? 'border-sky-500 bg-sky-950/20 shadow-xl shadow-sky-950/50 -translate-y-2' : 'border-slate-800'
    }">
      ${pkg.recommended ? `
        <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-bold text-xs uppercase px-4 py-1 rounded-full shadow-lg">
          ${pkg.badge}
        </div>
      ` : ''}

      <div>
        <div class="mb-4">
          <h3 class="text-xl font-bold text-white mb-1">${pkg.name}</h3>
          <p class="text-xs text-sky-400 font-mono-cad">${pkg.badge}</p>
        </div>

        <div class="mb-6 pb-6 border-b border-slate-800">
          <div class="flex items-baseline gap-1">
            <span class="text-xs text-slate-400">Rp</span>
            <span class="text-3xl sm:text-4xl font-extrabold text-white font-mono-cad tracking-tight">
              ${pkg.price.toLocaleString('id-ID')}
            </span>
          </div>
          <span class="text-xs text-slate-400">${pkg.priceNote}</span>
        </div>

        <ul class="space-y-3 mb-8">
          ${pkg.features.map(f => `
            <li class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
              <svg class="w-4 h-4 text-sky-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <button 
        onclick="selectPackage('${pkg.id}')"
        class="w-full py-3 px-5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
          pkg.recommended 
            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-600/30' 
            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
        }"
      >
        <span>Pilih Paket Ini</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
      </button>
    </div>
  `).join('');
}

// 5. Render FAQ
function renderFaq() {
  const container = document.getElementById('faq-accordion');
  if (!container) return;

  container.innerHTML = FAQ_DATA.map((item, idx) => `
    <div class="glass-panel rounded-xl border border-slate-800 overflow-hidden">
      <button 
        onclick="toggleFaq(${idx})" 
        class="w-full p-5 text-left flex justify-between items-center gap-4 hover:text-sky-400 transition-colors"
      >
        <span class="font-semibold text-white text-sm sm:text-base">${item.q}</span>
        <svg id="faq-icon-${idx}" class="w-5 h-5 text-sky-400 transition-transform duration-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div id="faq-content-${idx}" class="hidden px-5 pb-5 pt-0 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-800/50 mt-1">
        ${item.a}
      </div>
    </div>
  `).join('');
}

function toggleFaq(idx) {
  const content = document.getElementById(`faq-content-${idx}`);
  const icon = document.getElementById(`faq-icon-${idx}`);
  if (!content) return;

  const isHidden = content.classList.contains('hidden');
  content.classList.toggle('hidden', !isHidden);
  icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
}

// 6. Render Testimonials
function renderTestimonials() {
  const container = document.getElementById('testimonials-grid');
  if (!container) return;

  container.innerHTML = TESTIMONIALS_DATA.map(t => `
    <div class="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
      <div>
        <div class="flex text-amber-400 mb-4 text-sm">
          ${'★'.repeat(t.rating)}
        </div>
        <p class="text-slate-300 text-xs sm:text-sm italic leading-relaxed mb-6">
          "${t.text}"
        </p>
      </div>

      <div class="flex items-center gap-3 pt-4 border-t border-slate-800">
        <img src="${t.avatar}" alt="${t.name}" class="w-10 h-10 rounded-full object-cover border border-sky-400/50"/>
        <div>
          <h4 class="text-sm font-bold text-white">${t.name}</h4>
          <p class="text-xs text-sky-400 font-mono-cad">${t.role}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// 7. Dynamic Dimension Templates & Interactive Order Form
const DIMENSION_TEMPLATES = {
  kusen: {
    badge: 'KUSEN JENDELA',
    unitLabel: 'Jumlah Unit / Opening Jendela:',
    unitSuffix: 'Unit / Opening',
    fields: `
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Lebar Opening (cm)</label>
        <input type="number" id="dyn-w" value="140" min="10" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Tinggi Opening (cm)</label>
        <input type="number" id="dyn-h" value="160" min="10" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div class="col-span-2 sm:col-span-1">
        <label class="block text-[11px] text-slate-400 mb-1">Tebal Kusen</label>
        <select id="dyn-spec" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2 py-2 text-xs font-mono-cad">
          <option value="Kusen 3 Inch (7.6 cm)">Kusen 3" (7.6 cm)</option>
          <option value="Kusen 4 Inch (10.1 cm)" selected>Kusen 4" (10.1 cm)</option>
        </select>
      </div>`
  },
  pintu: {
    badge: 'PINTU ALUMINIUM',
    unitLabel: 'Jumlah Unit Pintu:',
    unitSuffix: 'Unit Pintu',
    fields: `
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Lebar Pintu (cm)</label>
        <input type="number" id="dyn-w" value="180" min="50" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Tinggi Pintu (cm)</label>
        <input type="number" id="dyn-h" value="210" min="100" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div class="col-span-2 sm:col-span-1">
        <label class="block text-[11px] text-slate-400 mb-1">Sistem &amp; Daun</label>
        <select id="dyn-spec" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2 py-2 text-xs">
          <option value="Swing 1 Daun">Swing 1 Daun</option>
          <option value="Sliding 2 Daun" selected>Sliding 2 Daun</option>
          <option value="Folding Lipat 4 Daun">Folding Lipat 4 Daun</option>
          <option value="Folding Lipat 6 Daun">Folding Lipat 6 Daun</option>
        </select>
      </div>`
  },
  kitchen: {
    badge: 'KITCHEN SET ALUMINIUM',
    unitLabel: 'Jumlah Set Dapur:',
    unitSuffix: 'Set Kitchen',
    fields: `
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Layout Dapur</label>
        <select id="dyn-ks-layout" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2 py-2 text-xs">
          <option value="Single Line">Single Line (Lurus)</option>
          <option value="L-Shape" selected>L-Shape (Sudut)</option>
          <option value="U-Shape">U-Shape (Letter U)</option>
        </select>
      </div>
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Panjang Kabinet (cm)</label>
        <input type="number" id="dyn-ks-lower" value="240" min="100" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Tinggi Plafon (cm)</label>
        <input type="number" id="dyn-ks-ceil" value="280" min="200" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div class="col-span-2 sm:col-span-3">
        <label class="block text-[11px] text-slate-400 mb-1">Meja Island / Bar &amp; Kursi</label>
        <input type="text" id="dyn-ks-island" value="Meja Island + 2 Kursi Bar" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs">
      </div>`
  },
  plafon: {
    badge: 'PLAFON PVC & ALUMINIUM',
    unitLabel: 'Jumlah Ruangan Plafon:',
    unitSuffix: 'Ruangan',
    fields: `
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Panjang Ruang (cm)</label>
        <input type="number" id="dyn-w" value="400" min="100" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Lebar Ruang (cm)</label>
        <input type="number" id="dyn-h" value="350" min="100" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div class="col-span-2 sm:col-span-1">
        <label class="block text-[11px] text-slate-400 mb-1">Model Plafon</label>
        <select id="dyn-spec" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2 py-2 text-xs">
          <option value="Flat Minimalis">Flat Minimalis</option>
          <option value="Drop Ceiling + LED Cove" selected>Drop Ceiling + LED</option>
          <option value="Kisi Baffle Aluminium">Kisi Baffle Aluminium</option>
        </select>
      </div>`
  },
  partisi: {
    badge: 'PARTISI KACA KANTOR',
    unitLabel: 'Jumlah Bidang Partisi:',
    unitSuffix: 'Bidang',
    fields: `
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Panjang Sekat (cm)</label>
        <input type="number" id="dyn-w" value="300" min="50" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Tinggi Ruangan (cm)</label>
        <input type="number" id="dyn-h" value="270" min="100" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div class="col-span-2 sm:col-span-1">
        <label class="block text-[11px] text-slate-400 mb-1">Tebal Kaca</label>
        <select id="dyn-spec" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2 py-2 text-xs font-mono-cad">
          <option value="Kaca 8mm Tempered">8mm Tempered</option>
          <option value="Kaca 10mm Tempered" selected>10mm Tempered</option>
          <option value="Kaca 12mm Tempered">12mm Tempered</option>
        </select>
      </div>`
  },
  kanopi: {
    badge: 'KANOPI / LOUVER ACP',
    unitLabel: 'Jumlah Unit Kanopi/Fasad:',
    unitSuffix: 'Unit',
    fields: `
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Panjang Bentang (cm)</label>
        <input type="number" id="dyn-w" value="450" min="100" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Lebar Proyeksi (cm)</label>
        <input type="number" id="dyn-h" value="200" min="50" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div class="col-span-2 sm:col-span-1">
        <label class="block text-[11px] text-slate-400 mb-1">Penutup / Kisi</label>
        <select id="dyn-spec" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2 py-2 text-xs">
          <option value="Kaca Tempered">Kaca Tempered</option>
          <option value="Solarflat" selected>Solarflat</option>
          <option value="Kisi Louver ACP">Kisi Louver ACP</option>
        </select>
      </div>`
  },
  custom: {
    badge: 'MEBEL CUSTOM ALUMINIUM',
    unitLabel: 'Jumlah Unit Mebel:',
    unitSuffix: 'Unit Mebel',
    fields: `
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Panjang (cm)</label>
        <input type="number" id="dyn-w" value="150" min="20" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Lebar / Dalam (cm)</label>
        <input type="number" id="dyn-d" value="55" min="20" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>
      <div>
        <label class="block text-[11px] text-slate-400 mb-1">Tinggi (cm)</label>
        <input type="number" id="dyn-h" value="200" min="20" class="dyn-dim w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-2 text-xs font-mono-cad">
      </div>`
  }
};

let orderState = {
  catKey: "kusen",
  category: "Kusen Jendela Aluminium",
  packageId: "pkg-pro",
  packageName: "Paket 3D CAD Visual Render",
  packagePrice: 250000,
  brand: "Alexindo (Standar Proyek)",
  finish: "Hitam Doff (Powder Coating)",
  dimensionSummary: "140 x 160 cm (Kusen 4 Inch)",
  dimensionWhatsappLines: "• Ukuran: *Lebar 140 cm x Tinggi 160 cm*\n• Spesifikasi Teknis: *Kusen 4 Inch (10.1 cm)*",
  unitSuffix: "Unit / Opening",
  unitCount: 1,
  fastTrack: false,
  fullRab: false,
  customerName: "",
  customerPhone: "",
  projectLocation: "",
  notes: ""
};

function syncDynamicDimensionsToState() {
  const key = orderState.catKey || 'kusen';

  if (key === 'kitchen') {
    const lay = document.getElementById('dyn-ks-layout')?.value || 'L-Shape';
    const len = document.getElementById('dyn-ks-lower')?.value || '240';
    const ceil = document.getElementById('dyn-ks-ceil')?.value || '280';
    const isl = document.getElementById('dyn-ks-island')?.value || 'Meja Island + 2 Kursi Bar';

    orderState.dimensionSummary = `${lay} | P: ${len} cm | ${isl}`;
    orderState.dimensionWhatsappLines = `• Bentuk Layout: *${lay}*\n• Panjang Kabinet Utama: *${len} cm* (Tinggi Plafon: ${ceil} cm)\n• Meja & Kursi Tambahan: *${isl}*`;
  } else if (key === 'plafon') {
    const w = document.getElementById('dyn-w')?.value || '400';
    const h = document.getElementById('dyn-h')?.value || '350';
    const spec = document.getElementById('dyn-spec')?.value || 'Drop Ceiling + LED';
    const luasM2 = ((parseFloat(w) * parseFloat(h)) / 10000).toFixed(2);

    orderState.dimensionSummary = `${w} x ${h} cm (${luasM2} m²) • ${spec}`;
    orderState.dimensionWhatsappLines = `• Ukuran Ruangan: *Panjang ${w} cm x Lebar ${h} cm* (± ${luasM2} m²)\n• Model Plafon: *${spec}*`;
  } else if (key === 'custom') {
    const w = document.getElementById('dyn-w')?.value || '150';
    const d = document.getElementById('dyn-d')?.value || '55';
    const h = document.getElementById('dyn-h')?.value || '200';

    orderState.dimensionSummary = `P: ${w} x L: ${d} x T: ${h} cm`;
    orderState.dimensionWhatsappLines = `• Dimensi Mebel (P x L x T): *${w} cm x ${d} cm x ${h} cm*`;
  } else {
    const w = document.getElementById('dyn-w')?.value || '140';
    const h = document.getElementById('dyn-h')?.value || '160';
    const spec = document.getElementById('dyn-spec')?.value || '';

    orderState.dimensionSummary = `${w} x ${h} cm (${spec})`;
    orderState.dimensionWhatsappLines = `• Ukuran: *Lebar/Panjang ${w} cm x Tinggi ${h} cm*\n• Spesifikasi Teknis: *${spec}*`;
  }
}

function renderDimensionFields(catKey) {
  const tpl = DIMENSION_TEMPLATES[catKey] || DIMENSION_TEMPLATES.kusen;
  const container = document.getElementById('dynamic-dimensions-container');
  const badge = document.getElementById('dim-category-badge');
  const unitLabel = document.getElementById('order-units-label');

  orderState.catKey = catKey;
  orderState.unitSuffix = tpl.unitSuffix;

  if (container) container.innerHTML = tpl.fields;
  if (badge) badge.textContent = tpl.badge;
  if (unitLabel) unitLabel.textContent = tpl.unitLabel;

  container?.querySelectorAll('.dyn-dim').forEach(inp => {
    inp.addEventListener('input', () => {
      syncDynamicDimensionsToState();
      updateOrderSummary();
    });
    inp.addEventListener('change', () => {
      syncDynamicDimensionsToState();
      updateOrderSummary();
    });
  });

  syncDynamicDimensionsToState();
  updateOrderSummary();
}

function initOrderForm() {
  const form = document.getElementById('order-form');
  if (!form) return;

  document.querySelectorAll('input[name="orderCategory"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      orderState.category = e.target.value;
      const key = e.target.getAttribute('data-cat-key') || 'kusen';
      renderDimensionFields(key);
    });
  });

  document.querySelectorAll('input[name="orderPackage"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const selectedPkg = PACKAGES_DATA.find(p => p.id === e.target.value);
      if (selectedPkg) {
        orderState.packageId = selectedPkg.id;
        orderState.packageName = selectedPkg.name;
        orderState.packagePrice = selectedPkg.price;
        updateOrderSummary();
      }
    });
  });

  const brandSelect = document.getElementById('order-brand');
  if (brandSelect) {
    brandSelect.addEventListener('change', (e) => {
      orderState.brand = e.target.value;
      updateOrderSummary();
    });
  }

  const finishSelect = document.getElementById('order-finish');
  if (finishSelect) {
    finishSelect.addEventListener('change', (e) => {
      orderState.finish = e.target.value;
      updateOrderSummary();
    });
  }

  const unitInput = document.getElementById('order-units');
  if (unitInput) {
    unitInput.addEventListener('input', (e) => {
      orderState.unitCount = Math.max(1, parseInt(e.target.value, 10) || 1);
      updateOrderSummary();
    });
  }

  const fastTrackCb = document.getElementById('order-addon-fast');
  const rabCb = document.getElementById('order-addon-rab');
  if (fastTrackCb) fastTrackCb.addEventListener('change', (e) => { orderState.fastTrack = e.target.checked; updateOrderSummary(); });
  if (rabCb) rabCb.addEventListener('change', (e) => { orderState.fullRab = e.target.checked; updateOrderSummary(); });

  const nameInput = document.getElementById('order-customer-name');
  const phoneInput = document.getElementById('order-customer-phone');
  const locInput = document.getElementById('order-customer-loc');
  const notesInput = document.getElementById('order-customer-notes');

  if (nameInput) nameInput.addEventListener('input', (e) => { orderState.customerName = e.target.value; });
  if (phoneInput) phoneInput.addEventListener('input', (e) => { orderState.customerPhone = e.target.value; });
  if (locInput) locInput.addEventListener('input', (e) => { orderState.projectLocation = e.target.value; });
  if (notesInput) notesInput.addEventListener('input', (e) => { orderState.notes = e.target.value; });

  const btnWhatsApp = document.getElementById('btn-send-whatsapp');
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      sendWhatsAppOrder();
    });
  }

  const btnPrint = document.getElementById('btn-print-order');
  if (btnPrint) {
    btnPrint.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  }

  renderDimensionFields('kusen');
}

function calculateTotalPrice() {
  let basePerUnit = orderState.packagePrice;
  let total = basePerUnit * orderState.unitCount;

  if (orderState.fastTrack) {
    total += 100000 * orderState.unitCount;
  }
  if (orderState.fullRab && orderState.packageId !== 'pkg-master') {
    total += 75000 * orderState.unitCount;
  }

  let discount = 0;
  if (orderState.unitCount >= 5) {
    discount = total * 0.1;
    total = total - discount;
  }

  return { total, discount };
}

function updateOrderSummary() {
  const sumCat = document.getElementById('sum-category');
  const sumPkg = document.getElementById('sum-package');
  const sumUnits = document.getElementById('sum-units');
  const sumBrand = document.getElementById('sum-brand');
  const sumFinish = document.getElementById('sum-finish');
  const sumDimensions = document.getElementById('sum-dimensions');
  const sumTotal = document.getElementById('sum-total-price');
  const sumDiscountRow = document.getElementById('sum-discount-row');
  const sumDiscountVal = document.getElementById('sum-discount-val');

  if (sumCat) sumCat.textContent = orderState.category;
  if (sumPkg) sumPkg.textContent = orderState.packageName;
  if (sumUnits) sumUnits.textContent = `${orderState.unitCount} ${orderState.unitSuffix}`;
  if (sumBrand) sumBrand.textContent = orderState.brand;
  if (sumFinish) sumFinish.textContent = orderState.finish;
  if (sumDimensions) sumDimensions.textContent = orderState.dimensionSummary;

  const { total, discount } = calculateTotalPrice();

  if (sumTotal) {
    sumTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
  }

  if (sumDiscountRow && sumDiscountVal) {
    if (discount > 0) {
      sumDiscountRow.classList.remove('hidden');
      sumDiscountVal.textContent = `- Rp ${discount.toLocaleString('id-ID')} (Diskon 10%)`;
    } else {
      sumDiscountRow.classList.add('hidden');
    }
  }
}

function selectPackage(packageId) {
  const pkgRadio = document.querySelector(`input[name="orderPackage"][value="${packageId}"]`);
  if (pkgRadio) {
    pkgRadio.checked = true;
    pkgRadio.dispatchEvent(new Event('change'));
  }

  document.getElementById('pemesanan')?.scrollIntoView({ behavior: 'smooth' });
}

function quickOrder(title, categoryName, profileName) {
  const catKeyMap = {
    'kusen': 'kusen',
    'pintu': 'pintu',
    'kitchen': 'kitchen',
    'plafon': 'plafon',
    'partisi': 'partisi',
    'kanopi': 'kanopi'
  };

  const targetKey = catKeyMap[categoryName] || 'kusen';
  const catRadio = document.querySelector(`input[name="orderCategory"][data-cat-key="${targetKey}"]`);
  if (catRadio) {
    catRadio.checked = true;
    catRadio.dispatchEvent(new Event('change'));
  }

  const notesInput = document.getElementById('order-customer-notes');
  if (notesInput) {
    notesInput.value = `Referensi Model dari Portofolio: "${title}" (${profileName})`;
    orderState.notes = notesInput.value;
  }

  document.getElementById('pemesanan')?.scrollIntoView({ behavior: 'smooth' });
}

function sendWhatsAppOrder() {
  syncDynamicDimensionsToState();
  const { total, discount } = calculateTotalPrice();

  const custName = orderState.customerName.trim() || "Calon Klien";
  const custPhone = orderState.customerPhone.trim() || "-";
  const projectLoc = orderState.projectLocation.trim() || "-";
  const custNotes = orderState.notes.trim() || "Tidak ada catatan khusus.";

  const text = `*FORM PEMESANAN DESAIN 3D AUTOCAD ALUMINIUM*
*${SHOP_CONFIG.name}*
================================

Halo Admin MEBELIZE, saya ingin memesan jasa desain AutoCAD untuk kebutuhan mebel/kusen/plafon aluminium dengan rincian:

👤 *DATA PEMESAN:*
• Nama: *${custName}*
• No. HP/WA: *${custPhone}*
• Lokasi Proyek: *${projectLoc}*

📐 *RINCIAN SPESIFIKASI DESAIN:*
• Kategori: *${orderState.category}*
• Pilihan Paket: *${orderState.packageName}*
• Jumlah Volume: *${orderState.unitCount} ${orderState.unitSuffix}*
${orderState.dimensionWhatsappLines}
• Merk Profil: *${orderState.brand}*
• Finishing/Warna: *${orderState.finish}*

⚡ *OPSI TAMBAHAN:*
• Layanan Kilat (24 Jam): *${orderState.fastTrack ? 'YA (Prioritas)' : 'Tidak (Standar)'}*
• Full RAB & Cutting List: *${orderState.fullRab ? 'YA' : 'Sesuai Paket'}*

📝 *CATATAN / REFERENSI:*
"${custNotes}"

💰 *ESTIMASI TOTAL BIAYA DESAIN:*
*Rp ${total.toLocaleString('id-ID')}* ${discount > 0 ? '(Termasuk diskon volume 10%)' : ''}

Mohon konfirmasi ketersediaan jadwal pengerjaan dan langkah selanjutnya. Terima kasih!`;

  const encodedUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(encodedUrl, '_blank');
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

window.quickOrder = quickOrder;
window.selectPackage = selectPackage;
window.toggleFaq = toggleFaq;
window.sendWhatsAppOrder = sendWhatsAppOrder;