// js/filter-chips.js (refined)
(function () {
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const nice = (s = '') => s.split('-').map(x => x ? x[0].toUpperCase() + x.slice(1) : '').join(' ');

  const catMenu   = $('#fbCategoryMenu');
  const catLabel  = $('#fbCategoryLabel');
  const resetBtn  = $('#fbResetBtn');
  const summaryEl = $('#fbSummary');

  const wrapSizes     = $('#fbSizes');
  const wrapColors    = $('#fbColors');
  const wrapSubcats   = $('#fbSubcats');
  const wrapStemTypes = $('#fbStemTypes'); // NEW

  // ——— utils
  const hasCF = () => {
    const cf = window.catalogFilters;
    return !!(cf && typeof cf.getState === 'function' &&
              typeof cf.setCategory === 'function' &&
              typeof cf.setSize === 'function' &&
              typeof cf.toggleColor === 'function' &&
              typeof cf.setSubCategory === 'function' &&
              typeof cf.setStemType === 'function');
  };

  function waitCatalog(max = 7000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const id = setInterval(() => {
        if (hasCF()) { clearInterval(id); resolve(window.catalogFilters); }
        else if (Date.now() - start > max) { clearInterval(id); reject(new Error('catalogFilters not ready')); }
      }, 50);
    });
  }

  function setPressed(el, isOn) {
    if (!el) return;
    el.setAttribute('aria-pressed', isOn ? 'true' : 'false');
  }

  function refreshUI() {
    if (!hasCF()) return;
    const state = window.catalogFilters.getState?.() || {};
    const cat = state.currentCategory || 'all';

    const isBuket   = (cat === 'buket-bunga');
    const isPapan   = (cat === 'bunga-papan');
    const isTangkai = (cat === 'bunga-tangkai');

    // show/hide wrapper groups
    wrapSizes    && wrapSizes.classList.toggle('d-none', !isBuket);
    wrapColors   && wrapColors.classList.toggle('d-none', !isBuket);
    wrapSubcats  && wrapSubcats.classList.toggle('d-none', !isPapan);
    wrapStemTypes&& wrapStemTypes.classList.toggle('d-none', !isTangkai);

    // label kategori
    if (catLabel) catLabel.textContent = (cat === 'all' ? 'Semua' : nice(cat));

    // summary ringkas
    const parts = [];
    parts.push(cat === 'all' ? 'Semua' : nice(cat));

    if (isBuket) {
      if (state.currentSize && state.currentSize !== 'all') parts.push('Ukuran: ' + nice(state.currentSize));
      const colors = Array.from(state.selectedColors || []);
      if (colors.length) parts.push('Warna: ' + colors.map(nice).join(', '));
    }
    if (isPapan) {
      if (state.currentSubCat && state.currentSubCat !== 'all') parts.push('Sub: ' + nice(state.currentSubCat));
    }
    if (isTangkai) {
      if (state.currentStemType && state.currentStemType !== 'all') parts.push('Jenis: ' + nice(state.currentStemType));
    }

    if (summaryEl) summaryEl.textContent = 'Terpilih: ' + (parts.join(' • ') || 'Semua');

    // highlight chips
    $$('.fb-chip[data-size]').forEach(ch => {
      setPressed(ch, ch.dataset.size === (state.currentSize || 'all'));
    });

    const selColors = state.selectedColors || new Set();
    $$('.fb-chip[data-color]').forEach(ch => {
      const on = selColors.has(ch.dataset.color);
      setPressed(ch, on);
      ch.classList.toggle('active', on);
    });

    $$('.fb-chip[data-subcat]').forEach(ch => {
      setPressed(ch, ch.dataset.subcat === (state.currentSubCat || 'all'));
    });

    $$('.fb-chip[data-jenis]').forEach(ch => {
      setPressed(ch, ch.dataset.jenis === (state.currentStemType || 'all'));
    });
  }

  function bindHandlers() {
    // kategori dropdown
    catMenu?.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-category]');
      if (!a || !hasCF()) return;
      e.preventDefault();
      window.catalogFilters.setCategory(a.getAttribute('data-category'));
      refreshUI();
    });

    // sizes (single)
    wrapSizes?.addEventListener('click', (e) => {
      const chip = e.target.closest('.fb-chip[data-size]');
      if (!chip || !hasCF()) return;
      window.catalogFilters.setSize(chip.dataset.size);
      refreshUI();
    });

    // colors (multi)
    wrapColors?.addEventListener('click', (e) => {
      const chip = e.target.closest('.fb-chip[data-color]');
      if (!chip || !hasCF()) return;
      const val = chip.dataset.color;
      const turnOn = !chip.classList.contains('active');
      window.catalogFilters.toggleColor(val, turnOn);
      refreshUI();
    });

    // subcats (single)
    wrapSubcats?.addEventListener('click', (e) => {
      const chip = e.target.closest('.fb-chip[data-subcat]');
      if (!chip || !hasCF()) return;
      window.catalogFilters.setSubCategory(chip.dataset.subcat);
      refreshUI();
    });

    // jenis bunga tangkai (single)
    wrapStemTypes?.addEventListener('click', (e) => {
      const chip = e.target.closest('.fb-chip[data-jenis]');
      if (!chip || !hasCF()) return;
      window.catalogFilters.setStemType(chip.dataset.jenis);
      refreshUI();
    });

    // reset total
    resetBtn?.addEventListener('click', () => {
      if (!hasCF()) return;
      window.catalogFilters.setCategory('all');
      window.catalogFilters.setSize('all');
      // pastikan benar-benar bersih:
      // kosongkan warna, subcat, dan jenis (jaga-jaga jika implementasi setCategory tidak mereset)
      try {
        const colors = Array.from(window.catalogFilters.getState()?.selectedColors || []);
        colors.forEach(c => window.catalogFilters.toggleColor(c, false));
      } catch {}
      window.catalogFilters.setSubCategory?.('all');
      window.catalogFilters.setStemType?.('all');
      refreshUI();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    waitCatalog()
      .then(() => {
        bindHandlers();
        refreshUI();
        // re-sync setelah layout/dynamic render selesai
        setTimeout(refreshUI, 300);
      })
      .catch(err => console.warn('[filter-chips]', err));
  });
})();
