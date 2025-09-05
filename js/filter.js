// js/filter.js
document.addEventListener('DOMContentLoaded', () => {
  const api = window.catalogFilters;          // API dari catalog.js
  if (!api) return;

  const ddCategoryLabel = document.getElementById('ddCategoryLabel');
  const ddSizeLabel     = document.getElementById('ddSizeLabel');
  const ddColorLabel    = document.getElementById('ddColorLabel');

  // Kategori (single)
  document.querySelectorAll('#ddCategoryMenu [data-category]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const cat = a.dataset.category;
      ddCategoryLabel.textContent = a.textContent.trim();
      api.setCategory(cat);

      // reset label jika keluar dari Buket Bunga
      if (cat !== 'buket-bunga'){
        ddSizeLabel.textContent  = 'Semua';
        ddColorLabel.textContent = 'Semua';
        document.querySelectorAll('#ddColorWrap .color-chk').forEach(c=>c.checked=false);
      }
    });
  });

  // Ukuran (single)
  document.querySelectorAll('#ddSizeMenu [data-size]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const size = a.dataset.size;
      ddSizeLabel.textContent = a.textContent.trim();
      api.setSize(size);
    });
  });

  // Warna (multi)
  const updateColorLabel = ()=>{
    const n = (api.getState().selectedColors.size) || 0;
    ddColorLabel.textContent = n ? `${n} dipilih` : 'Semua';
  };
  document.querySelectorAll('#ddColorWrap .color-chk').forEach(chk=>{
    chk.addEventListener('change', ()=>{
      api.toggleColor(chk.value, chk.checked);
      updateColorLabel();
    });
  });
});
