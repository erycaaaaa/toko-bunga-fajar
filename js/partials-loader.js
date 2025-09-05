// js/partials-loader.js (opsional)
async function includePartials() {
  const nodes = document.querySelectorAll("[data-include]");
  await Promise.all(
    [...nodes].map(async (el) => {
      const raw = el.getAttribute("data-include") || "";
      const url = raw.startsWith("/") ? "." + raw : raw; // <- normalisasi
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(res.status + " " + res.statusText);
        el.innerHTML = await res.text();
      } catch (e) {
        el.innerHTML = `<!-- gagal load: ${url} - ${e.message} -->`;
        console.error("includePartials error:", url, e);
      }
    })
  );
  document.dispatchEvent(new Event("partials:loaded"));
}
document.addEventListener("DOMContentLoaded", includePartials);
