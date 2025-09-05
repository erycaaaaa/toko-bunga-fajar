// js/partials-loader.js
async function includePartials() {
  const nodes = document.querySelectorAll("[data-include]");
  await Promise.all(
    [...nodes].map(async (el) => {
      const url = el.getAttribute("data-include");
      try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error(res.statusText);
        el.innerHTML = await res.text();
      } catch (e) {
        el.innerHTML = `<!-- gagal load: ${url} - ${e.message} -->`;
      }
    })
  );
  // beri sinyal ke script lain bahwa partial sudah siap
  document.dispatchEvent(new Event("partials:loaded"));
}
document.addEventListener("DOMContentLoaded", includePartials);
