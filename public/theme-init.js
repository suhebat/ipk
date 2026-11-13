
(function () {
  try {
    var root = document.documentElement;
    var cookieMatch = document.cookie.match(/(?:^|;\s*)theme=(dark|light)(?:;|$)/);
    var savedTheme = localStorage.getItem("theme");
    var theme = cookieMatch
      ? cookieMatch[1]
      : savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-bs-theme", theme);

    localStorage.setItem("theme", theme);

    if (!cookieMatch) {
      document.cookie = `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
  } catch (error) {
    // Abaikan jika penyimpanan tidak tersedia.
  }
})();
