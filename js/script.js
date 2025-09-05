// js/script.js
function initCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;
  window.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top  = e.clientY + "px";
  });
}

function initFab() {
  const fab = document.getElementById("fab");
  const toggle = document.getElementById("fabToggle");
  if (!fab || !toggle) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    fab.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (!fab.contains(e.target)) fab.classList.remove("open");
  });
}

function initLilyPanel() {
  const panel = document.getElementById("lily-info-panel");
  const tplSummary = document.getElementById("tpl-lily-summary");
  const tplDetails = document.getElementById("tpl-lily-details");
  if (!panel || !tplSummary || !tplDetails) return;

  panel.innerHTML = tplSummary.innerHTML;
  document.addEventListener("click", (e) => {
    const view = e.target.closest(".btn-view");
    const back = e.target.closest(".btn-back");
    if (view && panel.contains(view)) panel.innerHTML = tplDetails.innerHTML;
    if (back && panel.contains(back)) panel.innerHTML = tplSummary.innerHTML;
  });
}

function initTulipPanel() {
  const panel = document.getElementById("tulip-info-panel");
  const tplSummary = document.getElementById("tpl-tulip-summary");
  const tplDetails = document.getElementById("tpl-tulip-details");
  if (!panel || !tplSummary || !tplDetails) return;

  panel.innerHTML = tplSummary.innerHTML;
  document.addEventListener("click", (e) => {
    const view = e.target.closest(".btn-view-tulip");
    const back = e.target.closest(".btn-back-tulip");
    if (view && document.body.contains(view)) panel.innerHTML = tplDetails.innerHTML;
    if (back && document.body.contains(back)) panel.innerHTML = tplSummary.innerHTML;
  });
}

document.addEventListener("partials:loaded", () => {
  initCursor();
  initFab();
  initLilyPanel();
  initTulipPanel();
});
