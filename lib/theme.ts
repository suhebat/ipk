
export type Theme = "dark" | "light";

export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-bs-theme", theme);
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem("theme", theme);
    document.cookie = `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch (error) {
    // Tetap terapkan tema jika penyimpanan tidak tersedia.
  }

  applyTheme(theme);
}
