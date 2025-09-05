// js/catalog.js
(function () {
  const grid        = document.getElementById('catalogGrid');
  const ddSizeWrap  = document.getElementById('ddSizeWrap');
  const ddColorWrap = document.getElementById('ddColorWrap');

  // STATE
  let currentCategory = 'all';
  let currentSize     = 'all';
  let selectedColors  = new Set();

  // Utils
  const idr = (n) => 'Rp ' + (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const labelCategory = (cat) =>
    cat === 'buket-bunga'   ? 'Buket Bunga'   :
    cat === 'bunga-tangkai' ? 'Bunga Tangkai' :
    cat === 'bunga-tangan'  ? 'Bunga Tangan'  :
    cat === 'bunga-papan'   ? 'Bunga Papan'   : cat;

  // Card template (tidak mengubah layout kartumu)
  const productCard = (p) => {
    const sizeLabel  = p.size  ? ` • Ukuran: ${p.size[0].toUpperCase() + p.size.slice(1)}` : '';
    const colorLabel = p.color ? ` • Warna: ${p.color}` : '';
    const message = encodeURIComponent(
      `Halo kak, saya ingin pesan *${p.name}* 🌷\n` +
      `Kategori: ${labelCategory(p.category)}${p.size ? `\nUkuran: ${p.size}` : ''}${p.color ? `\nWarna: ${p.color}` : ''}\n` +
      `Harga: Rp ${p.price.toLocaleString('id-ID')}\n` +
      `${window.location.origin}/${(p.img || '').replace(/^\//,'')}`
    );

    return `
      <div class="col-6 col-md-4 col-lg-3 catalog-item"
           data-category="${p.category}"
           ${p.size  ? `data-size="${p.size}"` : ''}
           ${p.color ? `data-color="${String(p.color).toLowerCase()}"` : ''}>
        <div class="card h-100">
          <img src="${(p.img || '').replace(/^\//,'')}" class="card-img-top" alt="${p.name}" loading="lazy">
          <div class="card-body">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text small text-muted mb-2">
              Kategori: ${labelCategory(p.category)}${sizeLabel}${colorLabel}
            </p>
            <div class="d-flex justify-content-between align-items-center">
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
    const show = currentCategory === 'buket-bunga';
    if (ddSizeWrap)  ddSizeWrap.style.display  = show ? '' : 'none';
    if (ddColorWrap) ddColorWrap.style.display = show ? '' : 'none';
  }

  function applyFilter(){
    const cards = Array.from(grid.querySelectorAll('.catalog-item'));
    cards.forEach(card=>{
      const cat   = card.getAttribute('data-category');
      const size  = card.getAttribute('data-size')  || 'none';
      const color = (card.getAttribute('data-color')||'').toLowerCase();

      const catMatch = (currentCategory === 'all') || (cat === currentCategory);

      let sizeMatch = true;
      if (currentCategory === 'buket-bunga')
        sizeMatch = (currentSize === 'all') || (size === currentSize);

      let colorMatch = true;
      if (selectedColors.size > 0)
        colorMatch = color && selectedColors.has(color);

      card.classList.toggle('d-none', !(catMatch && sizeMatch && colorMatch));
    });
    toggleSubfilters();
  }

  // === API global agar filter.js bisa set state ===
  window.catalogFilters = {
    setCategory(cat){
      currentCategory = cat;
      if (cat !== 'buket-bunga'){ currentSize = 'all'; selectedColors.clear(); }
      applyFilter();
    },
    setSize(size){ currentSize = size; applyFilter(); },
    toggleColor(color, checked){
      const v = String(color).toLowerCase().trim();
      if (checked) selectedColors.add(v); else selectedColors.delete(v);
      applyFilter();
    },
    getState(){ return { currentCategory, currentSize, selectedColors }; }
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
