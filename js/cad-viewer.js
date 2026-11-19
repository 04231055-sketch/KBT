// Interactive 3D CAD Blueprint Viewer & Kitchen Studio Configurator for MEBELIZE
// Powered by Three.js

class CadViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentModel = 'kusen';
    this.renderMode = 'solid';
    this.finishType = 'silver';
    this.autoRotate = true;
    this.showDimensions = true;
    this.isLightTheme = document.documentElement.classList.contains('light-theme');

    this.initScene();
    this.initLights();
    this.initGrid();
    this.loadModel('kusen');
    this.animate();

    window.addEventListener('resize', () => this.onResize());
  }

  initScene() {
    const w = this.container.clientWidth || 800;
    const h = this.container.clientHeight || 480;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.isLightTheme ? 0xe2e8f0 : 0x060d1a);

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    this.camera.position.set(2.4, 1.8, 3.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 1.4;
    this.controls.maxDistance = 8.5;

    this.modelGroup = new THREE.Group();
    this.dimGroup = new THREE.Group();
    this.scene.add(this.modelGroup);
    this.scene.add(this.dimGroup);
  }

  initLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, this.isLightTheme ? 0.85 : 0.65);
    this.scene.add(this.ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(4, 6, 5);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(-4, 3, -4);
    this.scene.add(rimLight);
  }

  initGrid() {
    if (this.gridHelper) this.scene.remove(this.gridHelper);
    const c1 = this.isLightTheme ? 0x0284c7 : 0x0ea5e9;
    const c2 = this.isLightTheme ? 0xcbd5e1 : 0x1e293b;
    this.gridHelper = new THREE.GridHelper(8, 24, c1, c2);
    this.gridHelper.position.y = -1.05;
    this.scene.add(this.gridHelper);
  }

  setTheme(isLight) {
    this.isLightTheme = isLight;
    if (this.scene) {
      this.scene.background = new THREE.Color(isLight ? 0xe2e8f0 : 0x060d1a);
    }
    if (this.ambientLight) {
      this.ambientLight.intensity = isLight ? 0.85 : 0.65;
    }
    this.initGrid();
  }

  getAluminumMaterial() {
    const finishColors = {
      silver: { color: 0xd1d5db, metalness: 0.78, roughness: 0.25 },
      black: { color: 0x1e293b, metalness: 0.45, roughness: 0.55 },
      white: { color: 0xf8fafc, metalness: 0.2, roughness: 0.35 },
      wood: { color: 0x78350f, metalness: 0.15, roughness: 0.65 }
    };

    const cfg = finishColors[this.finishType] || finishColors.silver;

    if (this.renderMode === 'wireframe') {
      return new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true });
    }
    if (this.renderMode === 'xray') {
      return new THREE.MeshStandardMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.35,
        metalness: cfg.metalness,
        roughness: cfg.roughness
      });
    }

    return new THREE.MeshStandardMaterial({
      color: cfg.color,
      metalness: cfg.metalness,
      roughness: cfg.roughness
    });
  }

  getGlassMaterial() {
    if (this.renderMode === 'wireframe') {
      return new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    }
    return new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: this.renderMode === 'xray' ? 0.18 : 0.38,
      roughness: 0.08,
      metalness: 0.1
    });
  }

  clearGroups() {
    while (this.modelGroup.children.length > 0) {
      this.modelGroup.remove(this.modelGroup.children[0]);
    }
    while (this.dimGroup.children.length > 0) {
      this.dimGroup.remove(this.dimGroup.children[0]);
    }
  }

  loadModel(type) {
    this.currentModel = type;
    this.clearGroups();

    document.querySelectorAll('[data-cad-model]').forEach(btn => {
      const active = btn.getAttribute('data-cad-model') === type;
      btn.className = active
        ? 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 text-white border border-sky-400 transition-all shadow'
        : 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition-all';
    });

    if (type === 'kusen') this.buildKusenJendela();
    else if (type === 'pintu') this.buildPintuSliding();
    else if (type === 'plafon') this.buildCustomPlafon();

    this.dimGroup.visible = this.showDimensions;
  }

  addBox(group, w, h, d, x, y, z, mat) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }

  addDimensionLine(p1, p2) {
    const mat = new THREE.LineBasicMaterial({ color: 0xf59e0b });
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...p1),
      new THREE.Vector3(...p2)
    ]);
    const line = new THREE.Line(geo, mat);
    this.dimGroup.add(line);
  }

  buildKusenJendela() {
    const alu = this.getAluminumMaterial();
    const glass = this.getGlassMaterial();
    const W = 1.5, H = 1.7, D = 0.1, t = 0.06;

    // Outer Frame
    this.addBox(this.modelGroup, W, t, D, 0, H / 2 - t / 2, 0, alu);
    this.addBox(this.modelGroup, W, t, D, 0, -H / 2 + t / 2, 0, alu);
    this.addBox(this.modelGroup, t, H, D, -W / 2 + t / 2, 0, 0, alu);
    this.addBox(this.modelGroup, t, H, D, W / 2 - t / 2, 0, 0, alu);

    // Transom & Center Mullion
    const transomY = 0.35;
    this.addBox(this.modelGroup, W - t * 2, t, D, 0, transomY, 0, alu);
    this.addBox(this.modelGroup, t, transomY + H / 2 - t, D, 0, (-H / 2 + transomY) / 2, 0, alu);

    // Top Fixed Glass
    this.addBox(this.modelGroup, W - t * 2, H / 2 - transomY - t, 0.012, 0, (H / 2 + transomY) / 2, 0, glass);

    // Left & Right Casement Sashes
    const sashW = (W - t * 3) / 2;
    const sashH = transomY + H / 2 - t * 1.5;
    const sashY = (-H / 2 + transomY) / 2;
    [-W / 4, W / 4].forEach(sx => {
      this.addBox(this.modelGroup, sashW, 0.045, 0.05, sx, sashY + sashH / 2 - 0.022, 0.02, alu);
      this.addBox(this.modelGroup, sashW, 0.045, 0.05, sx, sashY - sashH / 2 + 0.022, 0.02, alu);
      this.addBox(this.modelGroup, 0.045, sashH, 0.05, sx - sashW / 2 + 0.022, sashY, 0.02, alu);
      this.addBox(this.modelGroup, 0.045, sashH, 0.05, sx + sashW / 2 - 0.022, sashY, 0.02, alu);
      this.addBox(this.modelGroup, sashW - 0.08, sashH - 0.08, 0.01, sx, sashY, 0.02, glass);
    });

    this.addDimensionLine([-W / 2, -H / 2 - 0.15, 0], [W / 2, -H / 2 - 0.15, 0]);
    this.addDimensionLine([W / 2 + 0.15, -H / 2, 0], [W / 2 + 0.15, H / 2, 0]);
  }

  buildPintuSliding() {
    const alu = this.getAluminumMaterial();
    const glass = this.getGlassMaterial();
    const W = 2.4, H = 2.0, D = 0.12, t = 0.065;

    this.addBox(this.modelGroup, W, t, D, 0, H / 2 - t / 2, 0, alu);
    this.addBox(this.modelGroup, W, 0.03, D, 0, -H / 2 + 0.015, 0, alu);
    this.addBox(this.modelGroup, t, H, D, -W / 2 + t / 2, 0, 0, alu);
    this.addBox(this.modelGroup, t, H, D, W / 2 - t / 2, 0, 0, alu);

    const leafW = (W - t * 2) / 2 + 0.03;
    const leafH = H - t - 0.04;
    [
      { x: -W / 4 + 0.01, z: -0.025 },
      { x: W / 4 - 0.01, z: 0.025 }
    ].forEach(p => {
      this.addBox(this.modelGroup, leafW, 0.07, 0.045, p.x, leafH / 2 - 0.035, p.z, alu);
      this.addBox(this.modelGroup, leafW, 0.09, 0.045, p.x, -leafH / 2 + 0.045, p.z, alu);
      this.addBox(this.modelGroup, 0.06, leafH, 0.045, p.x - leafW / 2 + 0.03, 0, p.z, alu);
      this.addBox(this.modelGroup, 0.06, leafH, 0.045, p.x + leafW / 2 - 0.03, 0, p.z, alu);
      this.addBox(this.modelGroup, leafW - 0.11, leafH - 0.15, 0.012, p.x, 0, p.z, glass);
    });

    this.addDimensionLine([-W / 2, -H / 2 - 0.15, 0], [W / 2, -H / 2 - 0.15, 0]);
    this.addDimensionLine([W / 2 + 0.15, -H / 2, 0], [W / 2 + 0.15, H / 2, 0]);
  }

  buildCustomPlafon() {
    const alu = this.getAluminumMaterial();
    const panelMat = this.renderMode === 'wireframe'
      ? new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true })
      : new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5, metalness: 0.1 });
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xfde68a });

    const W = 2.6, D = 2.2, yTop = 0.55;

    // Rangka Hollow Aluminium Grid (terlihat dari atas & samping)
    for (let x = -W / 2; x <= W / 2 + 0.01; x += 0.65) {
      this.addBox(this.modelGroup, 0.04, 0.04, D, x, yTop + 0.06, 0, alu);
    }
    for (let z = -D / 2; z <= D / 2 + 0.01; z += 0.55) {
      this.addBox(this.modelGroup, W, 0.04, 0.04, 0, yTop + 0.03, z, alu);
    }

    // Panel Plafon Utama & Drop Ceiling Trap
    this.addBox(this.modelGroup, W, 0.03, D, 0, yTop, 0, panelMat);
    const dropW = 1.65, dropD = 1.35;
    this.addBox(this.modelGroup, dropW, 0.12, dropD, 0, yTop - 0.075, 0, panelMat);

    // Lis Aluminium Tepian Drop Ceiling + Jalur LED Cove
    this.addBox(this.modelGroup, dropW + 0.04, 0.03, 0.03, 0, yTop - 0.13, dropD / 2, alu);
    this.addBox(this.modelGroup, dropW + 0.04, 0.03, 0.03, 0, yTop - 0.13, -dropD / 2, alu);
    this.addBox(this.modelGroup, 0.03, 0.03, dropD + 0.04, dropW / 2, yTop - 0.13, 0, alu);
    this.addBox(this.modelGroup, 0.03, 0.03, dropD + 0.04, -dropW / 2, yTop - 0.13, 0, alu);

    // Hidden LED Strip Glow
    this.addBox(this.modelGroup, dropW - 0.06, 0.015, 0.015, 0, yTop - 0.025, dropD / 2 + 0.01, ledMat);
    this.addBox(this.modelGroup, dropW - 0.06, 0.015, 0.015, 0, yTop - 0.025, -dropD / 2 - 0.01, ledMat);

    this.addDimensionLine([-W / 2, yTop - 0.25, D / 2 + 0.15], [W / 2, yTop - 0.25, D / 2 + 0.15]);
    this.addDimensionLine([W / 2 + 0.15, yTop - 0.25, -D / 2], [W / 2 + 0.15, yTop - 0.25, D / 2]);
  }

  setRenderMode(mode) {
    this.renderMode = mode;
    document.querySelectorAll('[data-cad-mode]').forEach(btn => {
      const active = btn.getAttribute('data-cad-mode') === mode;
      btn.className = active
        ? 'px-2.5 py-1 rounded text-xs font-mono-cad border border-sky-400 text-sky-300 bg-slate-900'
        : 'px-2.5 py-1 rounded text-xs font-mono-cad border border-slate-700 text-slate-400 hover:text-slate-200 bg-slate-900';
    });
    this.loadModel(this.currentModel);
  }

  setAluminumFinish(finish) {
    this.finishType = finish;
    document.querySelectorAll('[data-cad-finish]').forEach(btn => {
      const active = btn.getAttribute('data-cad-finish') === finish;
      btn.classList.toggle('ring-2', active);
      btn.classList.toggle('ring-sky-400', active);
    });
    this.loadModel(this.currentModel);
  }

  toggleDimensions() {
    this.showDimensions = !this.showDimensions;
    this.dimGroup.visible = this.showDimensions;
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
  }

  resetCamera() {
    this.camera.position.set(2.4, 1.8, 3.2);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  onResize() {
    if (!this.container) return;
    const w = this.container.clientWidth || 800;
    const h = this.container.clientHeight || 480;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.autoRotate && this.modelGroup) {
      this.modelGroup.rotation.y += 0.004;
      this.dimGroup.rotation.y += 0.004;
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// =========================================================================
// CUSTOM 3D KITCHEN SET CONFIGURATOR (ERGONOMIC AISLE & WALKWAY CLEARANCE)
// =========================================================================
class KitchenConfigurator3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.isLightTheme = document.documentElement.classList.contains('light-theme');

    this.state = {
      layout: 'l-shape',
      lengthCm: '240',
      upperCabinet: 'glass',
      tallCabinet: true,
      islandTable: 'island',
      chairCount: '2',
      finish: 'black',
      topColor: 'nero',
      appliances: true,
      wireframe: false
    };

    this.initScene();
    this.buildKitchen();
    this.animate();

    window.addEventListener('resize', () => this.onResize());
  }

  initScene() {
    const w = this.container.clientWidth || 700;
    const h = this.container.clientHeight || 500;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.isLightTheme ? 0xe2e8f0 : 0x060d1a);

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    this.camera.position.set(3.2, 2.8, 3.9);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.target.set(0, 0.85, 0);
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 10;

    this.ambientLight = new THREE.AmbientLight(0xffffff, this.isLightTheme ? 0.9 : 0.7);
    this.scene.add(this.ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
    dirLight.position.set(4, 7, 5);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.35);
    fillLight.position.set(-4, 4, -4);
    this.scene.add(fillLight);

    this.kitchenGroup = new THREE.Group();
    this.scene.add(this.kitchenGroup);

    this.initGrid();
  }

  initGrid() {
    if (this.gridHelper) this.scene.remove(this.gridHelper);
    const c1 = this.isLightTheme ? 0x0284c7 : 0x0ea5e9;
    const c2 = this.isLightTheme ? 0xcbd5e1 : 0x1e293b;
    this.gridHelper = new THREE.GridHelper(10, 28, c1, c2);
    this.gridHelper.position.y = 0;
    this.scene.add(this.gridHelper);
  }

  setTheme(isLight) {
    this.isLightTheme = isLight;
    if (this.scene) {
      this.scene.background = new THREE.Color(isLight ? 0xe2e8f0 : 0x060d1a);
    }
    if (this.ambientLight) {
      this.ambientLight.intensity = isLight ? 0.9 : 0.7;
    }
    this.initGrid();
  }

  updateOption(key, value) {
    this.state[key] = value;
    this.buildKitchen();
  }

  getMaterials() {
    if (this.state.wireframe) {
      const wf = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true });
      return { frame: wf, door: wf, top: wf, glass: wf, metal: wf, chair: wf };
    }

    const finishes = {
      black: { frame: 0x0f172a, door: 0x1e293b, metalness: 0.45, roughness: 0.5 },
      silver: { frame: 0x94a3b8, door: 0xcbd5e1, metalness: 0.75, roughness: 0.25 },
      white: { frame: 0xe2e8f0, door: 0xf8fafc, metalness: 0.2, roughness: 0.35 },
      wood: { frame: 0x451a03, door: 0x78350f, metalness: 0.15, roughness: 0.65 }
    };

    const tops = {
      nero: 0x090d16,
      carrara: 0xf1f5f9,
      concrete: 0x64748b
    };

    const f = finishes[this.state.finish] || finishes.black;
    const topHex = tops[this.state.topColor] || tops.nero;

    return {
      frame: new THREE.MeshStandardMaterial({ color: f.frame, metalness: f.metalness, roughness: f.roughness }),
      door: new THREE.MeshStandardMaterial({ color: f.door, metalness: f.metalness * 0.7, roughness: f.roughness }),
      top: new THREE.MeshStandardMaterial({ color: topHex, metalness: 0.15, roughness: 0.2 }),
      glass: new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.42, roughness: 0.1 }),
      metal: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 }),
      chair: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.3 })
    };
  }

  addBox(w, h, d, x, y, z, mat) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.kitchenGroup.add(mesh);
    return mesh;
  }

  buildKitchen() {
    while (this.kitchenGroup.children.length > 0) {
      this.kitchenGroup.remove(this.kitchenGroup.children[0]);
    }

    const mats = this.getMaterials();
    const rawW = (parseInt(this.state.lengthCm, 10) || 240) / 100;
    // Pastikan lebar U-Shape minimal 2.50m agar lorong tengah tetap lega
    const W = this.state.layout === 'u-shape' ? Math.max(rawW, 2.5) : rawW;
    const depth = 0.60;
    const baseH = 0.82;
    const topH = 0.04;
    const backZ = -1.25; // Sisi depan kabinet belakang berada di z = -0.95

    // 1. KABINET BAWAH UTAMA (DINDING BELAKANG)
    this.addBox(W, baseH, depth, 0, baseH / 2, backZ, mats.door);
    this.addBox(W + 0.02, topH, depth + 0.03, 0, baseH + topH / 2, backZ + 0.01, mats.top);

    // Garis Modul Pintu Kabinet Bawah
    const modules = Math.max(3, Math.round(W / 0.6));
    const modW = W / modules;
    for (let i = 1; i < modules; i++) {
      const mx = -W / 2 + i * modW;
      this.addBox(0.015, baseH - 0.08, 0.02, mx, baseH / 2, backZ + depth / 2 + 0.005, mats.frame);
    }

    // 2. SAYAP KIRI (L-SHAPE & U-SHAPE)
    const wingLen = 1.15; // Ujung sayap berakhir di z = -0.95 + 1.15 = +0.20
    const wingCenterZ = (backZ + depth / 2) + wingLen / 2;
    if (this.state.layout === 'l-shape' || this.state.layout === 'u-shape') {
      const leftX = -W / 2 + depth / 2;
      this.addBox(depth, baseH, wingLen, leftX, baseH / 2, wingCenterZ, mats.door);
      this.addBox(depth + 0.02, topH, wingLen + 0.02, leftX, baseH + topH / 2, wingCenterZ, mats.top);
    }

    // 3. SAYAP KANAN (KHUSUS U-SHAPE) & LEMARI TINGGI / KULKAS
    if (this.state.layout === 'u-shape') {
      const rightX = W / 2 - depth / 2;
      if (this.state.tallCabinet) {
        // Lemari tinggi ditempatkan rata di ujung sayap kanan agar TIDAK menjorok menutup lorong!
        const counterRightLen = 0.55;
        const counterRightZ = (backZ + depth / 2) + counterRightLen / 2;
        this.addBox(depth, baseH, counterRightLen, rightX, baseH / 2, counterRightZ, mats.door);
        this.addBox(depth + 0.02, topH, counterRightLen + 0.02, rightX, baseH + topH / 2, counterRightZ, mats.top);

        const tallD = 0.60;
        const tallZ = counterRightZ + counterRightLen / 2 + tallD / 2; // Berakhir tepat di z = +0.20 sejajar sayap kiri
        this.addBox(depth, 2.15, tallD, rightX, 1.075, tallZ, mats.frame);
        this.addBox(depth - 0.04, 2.08, 0.02, rightX, 1.075, tallZ + tallD / 2 + 0.005, mats.door);
      } else {
        this.addBox(depth, baseH, wingLen, rightX, baseH / 2, wingCenterZ, mats.door);
        this.addBox(depth + 0.02, topH, wingLen + 0.02, rightX, baseH + topH / 2, wingCenterZ, mats.top);
      }
    } else if (this.state.tallCabinet) {
      // Pada Linear / L-Shape, lemari tinggi ditempatkan rapi di sisi paling kanan kabinet belakang
      const tallW = 0.65;
      const tallX = W / 2 + tallW / 2 + 0.02;
      this.addBox(tallW, 2.15, depth, tallX, 1.075, backZ, mats.frame);
      this.addBox(tallW - 0.05, 2.08, 0.02, tallX, 1.075, backZ + depth / 2 + 0.005, mats.door);
    }

    // 4. LEMARI KABINET ATAS (UPPER CABINET)
    if (this.state.upperCabinet !== 'none') {
      const upH = 0.72;
      const upD = 0.36;
      const upY = 1.78;
      const upZ = backZ - depth / 2 + upD / 2;
      const doorMat = this.state.upperCabinet === 'glass' ? mats.glass : mats.door;

      this.addBox(W, upH, upD, 0, upY, upZ, mats.frame);
      for (let i = 0; i < modules; i++) {
        const px = -W / 2 + (i + 0.5) * modW;
        this.addBox(modW - 0.03, upH - 0.04, 0.02, px, upY, upZ + upD / 2 + 0.008, doorMat);
      }
    }

    // 5. SINK, KOMPOR TANAM & COOKER HOOD
    if (this.state.appliances) {
      const topY = baseH + topH;
      // Sink di sisi kiri kabinet belakang
      const sinkX = -W * 0.22;
      this.addBox(0.55, 0.02, 0.40, sinkX, topY + 0.005, backZ, mats.metal);
      this.addBox(0.03, 0.24, 0.03, sinkX, topY + 0.12, backZ - 0.16, mats.metal);
      this.addBox(0.03, 0.03, 0.14, sinkX, topY + 0.24, backZ - 0.10, mats.metal);

      // Kompor Tanam di sisi kanan kabinet belakang
      const stoveX = W * 0.20;
      this.addBox(0.58, 0.02, 0.44, stoveX, topY + 0.005, backZ, mats.top);
      [[-0.14, -0.10], [0.14, -0.10], [-0.14, 0.10], [0.14, 0.10]].forEach(([bx, bz]) => {
        this.addBox(0.11, 0.015, 0.11, stoveX + bx, topY + 0.02, backZ + bz, mats.metal);
      });

      // Cooker Hood
      this.addBox(0.65, 0.08, 0.45, stoveX, 1.48, backZ - 0.05, mats.metal);
      this.addBox(0.24, 0.65, 0.24, stoveX, 1.82, backZ - 0.14, mats.metal);
    }

    // 6. MEJA ISLAND / PENINSULA & KURSI BAR (ANTI NUTUP JALAN)
    const chairs = parseInt(this.state.chairCount, 10) || 0;

    if (this.state.islandTable === 'island') {
      const islandD = 0.65;
      let islandW = Math.min(W * 0.85, 2.0);
      let islandX = 0;
      let islandZ = 0.50;

      if (this.state.layout === 'u-shape') {
        // Ujung sayap U ada di z = +0.20.
        // Letakkan island di z = +1.45 -> lorong jalan masuk U-Shape terbuka selebar 0.92 meter!
        islandZ = 1.45;
        islandW = Math.min(W, 2.2);
      } else if (this.state.layout === 'l-shape') {
        // Geser sedikit ke kanan (+0.28) agar lorong dari sisi kiri juga terbuka lega
        islandX = 0.28;
        islandZ = 0.55;
        islandW = Math.min(W * 0.68, 1.7);
      }

      this.addBox(islandW, baseH, islandD, islandX, baseH / 2, islandZ, mats.door);
      this.addBox(islandW + 0.08, topH, islandD + 0.16, islandX, baseH + topH / 2, islandZ + 0.05, mats.top);

      // Kursi Bar di sisi depan luar meja island
      if (chairs > 0) {
        const spacing = islandW / (chairs + 1);
        for (let c = 1; c <= chairs; c++) {
          const cx = islandX - islandW / 2 + c * spacing;
          const cz = islandZ + islandD / 2 + 0.22;
          this.buildBarStool(cx, cz, mats);
        }
      }
    } else if (this.state.islandTable === 'peninsula') {
      if (this.state.layout === 'u-shape') {
        // Pada U-Shape, peninsula dibuat menghadap keluar ke kanan di ujung sayap kanan agar bagian dalam U tetap 100% terbuka
        const penW = 1.15;
        const penD = 0.55;
        const penX = W / 2 + penW / 2 - 0.02;
        const penZ = -0.05;
        this.addBox(penW, baseH, penD, penX, baseH / 2, penZ, mats.door);
        this.addBox(penW + 0.06, topH, penD + 0.14, penX, baseH + topH / 2, penZ + 0.04, mats.top);

        if (chairs > 0) {
          const spacing = penW / (chairs + 1);
          for (let c = 1; c <= chairs; c++) {
            const cx = penX - penW / 2 + c * spacing;
            this.buildBarStool(cx, penZ + penD / 2 + 0.22, mats);
          }
        }
      } else {
        // Pada Linear / L-Shape, peninsula menyatu di sisi kanan kabinet utama
        const penW = 0.60;
        const penD = 1.25;
        const penX = W / 2 - penW / 2;
        const penZ = (backZ + depth / 2) + penD / 2;
        this.addBox(penW, baseH, penD, penX, baseH / 2, penZ, mats.door);
        this.addBox(penW + 0.14, topH, penD + 0.04, penX + 0.05, baseH + topH / 2, penZ, mats.top);

        if (chairs > 0) {
          const spacing = penD / (chairs + 1);
          for (let c = 1; c <= chairs; c++) {
            const cz = penZ - penD / 2 + c * spacing;
            this.buildBarStool(penX + penW / 2 + 0.24, cz, mats);
          }
        }
      }
    }
  }

  buildBarStool(x, z, mats) {
    // Dudukan & Tiang Kursi Bar
    const seatGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.05, 20);
    const seat = new THREE.Mesh(seatGeo, mats.chair);
    seat.position.set(x, 0.62, z);
    seat.castShadow = true;
    this.kitchenGroup.add(seat);

    const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.60, 12);
    const pole = new THREE.Mesh(poleGeo, mats.metal);
    pole.position.set(x, 0.30, z);
    this.kitchenGroup.add(pole);

    const baseGeo = new THREE.CylinderGeometry(0.18, 0.19, 0.02, 20);
    const base = new THREE.Mesh(baseGeo, mats.metal);
    base.position.set(x, 0.01, z);
    this.kitchenGroup.add(base);
  }

  getSummaryText() {
    const layoutNames = { 'linear': 'Single Line', 'l-shape': 'L-Shape', 'u-shape': 'U-Shape' };
    const upperNames = { 'glass': 'Pintu Kaca Aluminium', 'solid': 'Panel ACP Solid', 'none': 'Tanpa Kabinet Atas' };
    const islandNames = { 'none': 'Tanpa Meja Island', 'island': 'Meja Island Tengah', 'peninsula': 'Meja Bar Peninsula' };
    const topNames = { 'nero': 'Hitam Nero', 'carrara': 'Putih Carrara', 'concrete': 'Abu Beton' };

    return `Konfigurasi Studio Kitchen Set 3D: Layout ${layoutNames[this.state.layout]}, Panjang ${this.state.lengthCm} cm, Kabinet Atas: ${upperNames[this.state.upperCabinet]}, Lemari Tinggi: ${this.state.tallCabinet ? 'Ya' : 'Tidak'}, ${islandNames[this.state.islandTable]} (${this.state.chairCount} Kursi Bar), Top Table Granit ${topNames[this.state.topColor]}, Kelengkapan Sink & Kompor: ${this.state.appliances ? 'Ya' : 'Tidak'}.`;
  }

  onResize() {
    if (!this.container) return;
    const w = this.container.clientWidth || 700;
    const h = this.container.clientHeight || 500;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}