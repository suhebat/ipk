"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search, Sun, Moon, Menu, X } from "lucide-react";
import { setTheme } from "@/lib/theme";
import Link from "next/link";

const navItems = [
  { label: "Beranda", href: "/" },
  {
    label: "Tentang",
    items: [
      { label: "Tentang IPK", href: "/pages/tentang-ipk" },
      { label: "Dasar Hukum & Kebijakan", href: "/pages/dasar-hukum" },
      { label: "Metodologi & Indikator", href: "/pages/metodologi" },
      { label: "Simulasi Perhitungan IPK", href: "/pages/intro-simulasi" },
    ],
  },
  {
    label: "Data & Hasil",
    items: [
      { label: "Hasil Nasional", href: "/pages/hasil-nasional" },
      { label: "Hasil Provinsi", href: "/pages/hasil-provinsi" },
    ],
  },
  {
    label: "Publikasi",
    items: [
      { label: "Koleksi Buku Digital", href: "/publikasi/koleksi-buku" },
      { label: "Dataset IPK", href: "/publikasi/dataset" },
      { label: "Metadata Indikator", href: "/publikasi/metadata-indikator" },
    ],
  },
  {
    label: "Layanan",
    items: [
      { label: "FAQ", href: "/pages/faq" },
      { label: "Permohonan Data", href: "/pages/permohonan-data" },
      { label: "Hubungi Kami", href: "/pages/hubungi-kami" },
    ],
  },
];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Mengecilkan navbar setelah pengguna melewati ambang scroll.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tema hanya diatur oleh script di <head> dan setTheme().
  // Komponen ini tidak menyentuh class <html> saat mount, sehingga tidak ada kedipan.
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  };

  const handleMobileMenuClick = (label: string) => {
    setOpenMobileDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <nav
      className={`sticky top-0 z-50 print:hidden border-b bg-white dark:bg-zinc-900 transition-shadow duration-300 ${
        isScrolled
          ? "border-zinc-200/90 dark:border-zinc-800 shadow-sm"
          : "border-zinc-200 dark:border-zinc-800 shadow-none"
      }`}
    >
      {/* Navbar mengecil setelah scroll; transisi tetap halus dan tidak mengubah struktur menu. */}
      <div
        className={`max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 flex items-center justify-between transition-[height] duration-300 ease-in-out ${
          isScrolled ? "h-[64px]" : "h-[100px]"
        }`}
      >
        {/* Logo: dua gambar, ditampilkan sesuai tema lewat CSS */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <img
              src="/logos/logo-light.png"
              alt="Logo IPK"
              width={56}
              height={56}
              className={`block dark:hidden w-auto object-contain transition-[height] duration-300 ${isScrolled ? "h-[48px]" : "h-[80px]"}`}
            />
            <img
              src="/logos/logo-dark.png"
              alt="Logo IPK"
              width={56}
              height={56}
              className={`hidden dark:block w-auto object-contain transition-[height] duration-300 dark:drop-shadow-[0_0_6px_rgba(184,134,11,0.35)] ${isScrolled ? "h-[48px]" : "h-[80px]"}`}
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href || "#"}
                className={`flex items-center gap-1 hover:text-[#B8860B] transition-all duration-300 ${isScrolled ? "py-4" : "py-6"}`}
              >
                {item.label}
                {item.items && <ChevronDown size={14} />}
              </Link>

              {item.items && openDropdown === item.label && (
                <div className="absolute top-full left-0 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 shadow-xl z-50">
                  {item.items.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className="block px-5 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
            aria-label="Cari"
          >
            <Search size={20} />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
            aria-label="Ganti Tema"
          >
            {/* Dark mode: tampilkan ikon matahari. Light mode: ikon bulan. */}
            <Sun size={20} className="hidden dark:block" />
            <Moon size={20} className="block dark:hidden" />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
            aria-label="Buka Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-3">
          <div className="max-w-xl mx-auto px-6 sm:px-10">
            <input
              type="text"
              placeholder="Cari..."
              className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-[#B8860B]"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-3 px-6 sm:px-10 space-y-1">
          {navItems.map((item) => {
            const hasChildren = !!item.items;
            const isSubmenuOpen = openMobileDropdown === item.label;

            return (
              <div key={item.label} className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-none">
                {hasChildren ? (
                  <button
                    onClick={() => handleMobileMenuClick(item.label)}
                    className="w-full flex items-center justify-between font-medium py-3 text-left hover:text-[#B8860B] transition"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={`text-zinc-400 transition-transform duration-300 ${
                        isSubmenuOpen ? "rotate-180 text-[#B8860B]" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block font-medium py-3 hover:text-[#B8860B] transition"
                  >
                    {item.label}
                  </Link>
                )}

                {hasChildren && isSubmenuOpen && (
                  <div className="pl-3 pb-3 pt-1 space-y-1 border-l-2 border-[#B8860B]/40 ml-2 mb-2">
                    {item.items!.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#B8860B] dark:hover:text-[#B8860B] py-2 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}