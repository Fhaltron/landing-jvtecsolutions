"use strict";

try {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.dataset.theme = "dark";
  }
} catch {
  // La página funciona aunque el navegador bloquee el almacenamiento local.
}

const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = themeToggle?.querySelector(".theme-label");

function updateThemeButton(isDark) {
  if (!themeToggle || !themeLabel) return;

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
  themeLabel.textContent = isDark ? "Modo claro" : "Modo oscuro";
}

if (themeToggle) {
  updateThemeButton(document.documentElement.dataset.theme === "dark");

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    updateThemeButton(isDark);

    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // El cambio visual se conserva durante la sesión actual.
    }
  });
}

document.querySelectorAll(".gallery-grid img").forEach((image) => {
  const hideUnavailableImage = () => {
    image.hidden = true;
  };

  image.addEventListener("error", hideUnavailableImage, { once: true });

  if (image.complete && image.naturalWidth === 0) {
    hideUnavailableImage();
  }
});
