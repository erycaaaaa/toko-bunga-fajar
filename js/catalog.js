// js/catalog.js
(function () {
  const grid         = document.getElementById('catalogGrid');
  const ddSizeWrap   = document.getElementById('ddSizeWrap');
  const ddColorWrap  = document.getElementById('ddColorWrap');
  const ddSubCatWrap = document.getElementById('ddSubCatWrap'); // panel dropdown subkategori papan (kalau pakai)
  // CHIP grup baru ada di filter bar (fbStemTypes) dan di-handle oleh filter-chips.js

  // STATE
  let currentCategory = 'all';
  let currentSize     = 'all';
  let currentSubCat   = 'all';           // untuk bunga-papan
  let currentStemType = 'all';           // 👈 NEW: untuk bunga-tangkai
  let selectedColors  = new Set();

  // Utils
  const idr = (n) => 'Rp ' + (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const labelCategory = (cat) =>
    cat === 'buket-bunga'   ? 'Buket Bunga'   :
    cat === 'bunga-tangkai' ? 'Bunga Tangkai' :
    cat === 'bunga-tangan'  ? 'Bunga Tangan'  :
    cat === 'bunga-papan'   ? 'Bunga Papan'   : cat;

  const labelSubCategory = (sub) =>
    sub === 'wedding'         ? 'Wedding' :
    sub === 'selamat-sukses'  ? 'Selamat Sukses' :
    sub === 'duka-cita'       ? 'Duka Cita' :
    sub === 'ulang-tahun'     ? 'Ulang Tahun' : 'Semua';

  const labelJenis = (j) => {
    const m = (j||'').toLowerCase();
    return m === 'mawar' ? 'Mawar' :
           m === 'kerisan' ? 'Kerisan' :
           m === 'lily' ? 'Lily' :
           m === 'tulip' ? 'Tulip' :
           m === 'pompom' ? 'Pompom' :
           m === 'aster' ? 'Aster' :
           m === 'gompi' ? 'Gompi' :
           m === 'pikok' ? 'Pikok' :
           m === 'rotensia' ? 'Rotensia' : 'Semua';
  };
const productCard = (p) => {
  const sizeLabel  = p.size  ? ` • Ukuran: ${p.size[0].toUpperCase() + p.size.slice(1)}` : '';
  const colorLabel = p.color ? ` • Warna: ${p.color}` : '';
  const jenisVal   = (p.jenis || p.species || p['Jenis Bunga'] || '').toString().toLowerCase().trim();

  const message = encodeURIComponent(
    `Haloo kak Fajar, saya ingin pesan *${p.name}* 🌷\n` +
    `Kategori: ${labelCategory(p.category)}` +
    `${p.subCategory ? `\nSubkategori: ${labelSubCategory(p.subCategory)}` : ''}` +
    `${jenisVal ? `\nJenis: ${labelJenis(jenisVal)}` : ''}` +
    `${p.size ? `\nUkuran: ${p.size}` : ''}${p.color ? `\nWarna: ${p.color}` : ''}\n` +
    `Harga: Rp ${p.price.toLocaleString('id-ID')}\n` +
    `${window.location.origin}/${(p.img || '').replace(/^\//,'')}`
  );

  return `
  <div class="col-6 col-md-4 col-lg-3 catalog-item"
       data-category="${p.category}"${p.subCategory ? ` data-subcat="${p.subCategory}"` : ''}${jenisVal ? ` data-jenis="${jenisVal}"` : ''}${p.size ? ` data-size="${p.size}"` : ''}${p.color ? ` data-color="${String(p.color).toLowerCase()}"` : ''}>
    <!-- jadikan card flex kolom -->
    <div class="card h-100 d-flex flex-column">
      <img src="${(p.img || '').replace(/^\//,'')}" class="card-img-top" alt="${p.name}" loading="lazy">

      <!-- body juga flex kolom agar bar bawah bisa didorong ke bawah -->
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${p.name}</h5>
        <p class="card-text small text-muted mb-2">
          Kategori: ${labelCategory(p.category)}${
            p.category === 'bunga-papan' && p.subCategory ? ` • Sub: ${labelSubCategory(p.subCategory)}` : ''
          }${
            p.category === 'bunga-tangkai' && jenisVal ? ` • Jenis: ${labelJenis(jenisVal)}` : ''
          }${sizeLabel}${colorLabel}
        </p>

        <!-- bar harga + tombol: selalu nempel bawah -->
        <div class="mt-auto pt-2 d-flex justify-content-between align-items-center border-top">
          <span class="fw-semibold">${idr(p.price)}</span>
          <a class="btn btn-sm btn-primary" target="_blank" rel="noopener"
             href="https://wa.me/6285798526834?text=${message}">Pesan</a>
        </div>
      </div>
    </div>
  </div>`;
};


  const render = (list) => { grid.innerHTML = list.map(productCard).join(''); };

  function toggleSubfilters(){
    const showBuket = currentCategory === 'buket-bunga';
    if (ddSizeWrap)  ddSizeWrap.style.display  = showBuket ? '' : 'none';
    if (ddColorWrap) ddColorWrap.style.display = showBuket ? '' : 'none';

    const showPapan = currentCategory === 'bunga-papan';
    if (ddSubCatWrap) ddSubCatWrap.style.display = showPapan ? '' : 'none';
    // Chip “Jenis Bunga” untuk bunga-tangkai ditangani di filter-chips.js (show/hide UI-nya)
  }

  function applyFilter(){
    const cards = Array.from(grid.querySelectorAll('.catalog-item'));
    cards.forEach(card=>{
      const cat    = card.getAttribute('data-category');
      const size   = card.getAttribute('data-size')   || 'none';
      const color  = (card.getAttribute('data-color') || '').toLowerCase();
      const subcat = card.getAttribute('data-subcat') || 'none';
      const jenis  = card.getAttribute('data-jenis')  || 'none';

      const catMatch = (currentCategory === 'all') || (cat === currentCategory);

      // Buket Bunga
      let sizeMatch = true;
      if (currentCategory === 'buket-bunga')
        sizeMatch = (currentSize === 'all') || (size === currentSize);

      let colorMatch = true;
      if (selectedColors.size > 0)
        colorMatch = color && selectedColors.has(color);

      // Bunga Papan
      let subCatMatch = true;
      if (currentCategory === 'bunga-papan')
        subCatMatch = (currentSubCat === 'all') || (subcat === currentSubCat);

      // Bunga Tangkai (Jenis Bunga)
      let jenisMatch = true;
      if (currentCategory === 'bunga-tangkai')
        jenisMatch = (currentStemType === 'all') || (jenis === currentStemType);

      const isShow = catMatch && sizeMatch && colorMatch && subCatMatch && jenisMatch;
      card.classList.toggle('d-none', !isShow);
    });
    toggleSubfilters();
  }

  // API global
  window.catalogFilters = {
    setCategory(cat){
      currentCategory = cat;
      if (cat !== 'buket-bunga'){ currentSize = 'all'; selectedColors.clear(); }
      if (cat !== 'bunga-papan'){ currentSubCat = 'all'; }
      if (cat !== 'bunga-tangkai'){ currentStemType = 'all'; }
      applyFilter();
    },
    setSize(size){ currentSize = size; applyFilter(); },
    toggleColor(color, checked){
      const v = String(color).toLowerCase().trim();
      if (checked) selectedColors.add(v); else selectedColors.delete(v);
      applyFilter();
    },
    setSubCategory(sub){ currentSubCat = sub; applyFilter(); },
    setStemType(jenis){ currentStemType = jenis; applyFilter(); },   // 👈 NEW
    getState(){ return { currentCategory, currentSize, currentSubCat, currentStemType, selectedColors }; }
  };

  // Load data
  fetch('data/catalog.json')
    .then(r => { if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(data => { render(data); applyFilter(); })
    .catch(err => {
      console.error(err);
      grid.innerHTML = `<div class="col-12"><div class="alert alert-danger">
        Gagal memuat <code>data/catalog.json</code> — ${String(err)}</div></div>`;
    });


})();
