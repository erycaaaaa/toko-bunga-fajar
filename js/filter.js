// js/filter.js
(function(){
  const catMenu   = document.getElementById('ddCategoryMenu');
  const catLabel  = document.getElementById('ddCategoryLabel');

  const sizeMenu  = document.getElementById('ddSizeMenu');
  const sizeLabel = document.getElementById('ddSizeLabel');

  const colorWrap = document.getElementById('ddColorWrap');
  const colorLabel= document.getElementById('ddColorLabel');

  const subMenu   = document.getElementById('ddSubCatMenu');   // 👈 NEW
  const subLabel  = document.getElementById('ddSubCatLabel');   // 👈 NEW

  // Helper label
  const nice = (s)=> s.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ');

  // Kategori
  if (catMenu) catMenu.addEventListener('click', (e)=>{
    const a = e.target.closest('a[data-category]');
    if (!a) return;
    e.preventDefault();
    const val = a.getAttribute('data-category');
    catLabel.textContent = (val==='all' ? 'Semua' : nice(val));
    window.catalogFilters.setCategory(val);
  });

  // Ukuran
  if (sizeMenu) sizeMenu.addEventListener('click', (e)=>{
    const a = e.target.closest('a[data-size]');
    if (!a) return;
    e.preventDefault();
    const val = a.getAttribute('data-size');
    sizeLabel.textContent = (val==='all' ? 'Semua' : nice(val));
    window.catalogFilters.setSize(val);
  });

  // Warna (multi)
  if (colorWrap){
    const chks = colorWrap.querySelectorAll('.color-chk');
    const updateLabel = ()=>{
      const picked = Array.from(chks).filter(c=>c.checked).map(c=>nice(c.value));
      colorLabel.textContent = picked.length ? picked.join(', ') : 'Semua';
    };
    chks.forEach(chk=>{
      chk.addEventListener('change', ()=>{
        window.catalogFilters.toggleColor(chk.value, chk.checked);
        updateLabel();
      });
    });
    updateLabel();
  }

  // Subkategori Bunga Papan
  if (subMenu) subMenu.addEventListener('click', (e)=>{
    const a = e.target.closest('a[data-subcat]');
    if (!a) return;
    e.preventDefault();
    const val = a.getAttribute('data-subcat');
    subLabel.textContent = (val==='all' ? 'Semua' : nice(val));
    window.catalogFilters.setSubCategory(val);
  });

})();
