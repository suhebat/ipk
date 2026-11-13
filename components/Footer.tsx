"use client";

import { useEffect, useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const gmapsUrl =
    "https://www.google.com/maps/place/Pusat+Data+dan+Teknologi+Informasi+Kementerian+Kebudayaan/@-6.3271161,106.7486904,20.96z/data=!4m6!3m5!1s0x2e69ef005f4e8ab1:0x5152c81758623216!8m2!3d-6.3270716!4d106.7487723!16s%2Fg%2F11ym2szx7c?entry=tts&g_ep=EgoyMDI2MDgxMi4wIPu8ASoASAFQAw%3D%3D&skid=b05d2b60-b1be-4fca-a243-f52978ed7add";

  return (
    <footer className="relative bg-zinc-50 dark:bg-zinc-900/50 pt-10 pb-12 lg:pt-12 lg:pb-16 overflow-hidden">
      {/* Decoration background (75% lebar di desktop, minimal 960px di mobile, rapat kiri di mobile dan kanan di desktop) */}
		<div
		  className="absolute inset-0 opacity-45 dark:opacity-18 pointer-events-none transition-opacity bg-no-repeat bg-[url('/decorations/footer-decoration-1.svg')] bg-[length:max(75%,960px)_auto] bg-left-bottom md:bg-right-bottom"
		/>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Logo IPK (3 kolom) */}
          <div className="md:col-span-3">
            <div className="mb-5">
              <img
                src={isDark ? "/logos/logo-ipk-dark.png" : "/logos/logo-ipk-light.png"}
                alt="Logo IPK"
                className="h-16 object-contain"
              />
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Portal Data Resmi Indeks Pembangunan Kebudayaan Indonesia.
            </p>
          </div>

          {/* Kontak (4 kolom) */}
          <div className="md:col-span-4">
            <h4 className="font-semibold text-[#B8860B] mb-4">Hubungi Kami</h4>
            <div className="text-sm text-zinc-700 dark:text-zinc-400 space-y-3.5">
              {/* Alamat dengan Pin Map & Link Google Maps */}
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2.5 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#B8860B] shrink-0 mt-1 transition-transform group-hover:scale-110" />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white group-hover:text-[#B8860B] transition-colors">
                    PUSDATIN KEMENBUD
                  </p>
                  <p className="leading-relaxed">
                    Grha Kebudayaan, Jl. RE Martadinata KM. 15.5,
                    <br />
                    Cipayung, Kec. Ciputat, Kota Tangerang Selatan, Banten 15411
                  </p>
                </div>
              </a>

              {/* Telepon */}
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B8860B] shrink-0" />
                <a
                  href="tel:02130620100"
                  className="hover:text-[#B8860B] no-underline transition-colors"
                >
                  (021) 3062 0100
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B8860B] shrink-0" />
                <a
                  href="mailto:ipk@kemenbud.go.id"
                  className="hover:text-[#B8860B] no-underline transition-colors"
                >
                  ipk@kemenbud.go.id
                </a>
              </div>
            </div>
          </div>

          {/* Sinergi Data Nasional (5 kolom, logo 150%) */}
			<div className="md:col-span-5">
			  <h4 className="font-semibold text-[#B8860B] mb-4">
				Sinergi Data Nasional
			  </h4>
			  <div className="flex flex-nowrap gap-4 items-center">
				  <a href="https://kemenbud.go.id" target="_blank" rel="noopener noreferrer" className="inline-block">
					<img src={isDark ? "/logos/kemenbud-dark.png" : "/logos/kemenbud-light.png"} alt="Kemenbud" className="h-[120px] object-contain transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:drop-shadow-lg motion-reduce:transition-none motion-reduce:hover:transform-none" />
				  </a>

				  <a href="https://www.bappenas.go.id" target="_blank" rel="noopener noreferrer" className="inline-block">
					<img src={isDark ? "/logos/bappenas-dark.png" : "/logos/bappenas-light.png"} alt="Bappenas" className="h-[120px] object-contain transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:drop-shadow-lg motion-reduce:transition-none motion-reduce:hover:transform-none" />
				  </a>

				  <a href="https://www.bps.go.id" target="_blank" rel="noopener noreferrer" className="inline-block">
					<img src={isDark ? "/logos/bps-dark.png" : "/logos/bps-light.png"} alt="BPS" className="h-[120px] object-contain transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:drop-shadow-lg motion-reduce:transition-none motion-reduce:hover:transform-none" />
				  </a>
				</div>
			</div>
        </div>

        {/* Copyright & Menu Kebijakan */}
		<div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
		  <p className="text-xs text-zinc-500">
			Hak Cipta © 2026 Kementerian Kebudayaan.
		  </p>

		  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-zinc-500">
			<Link
			  href="/pages/kebijakan-privasi"
			  className="flex items-center gap-2 transition-colors hover:text-[#B8860B]"
			>
			  <span className="h-1.5 w-1.5 rounded-full bg-current" />
			  Kebijakan Privasi
			</Link>

			<Link
			  href="/pages/ketentuan-penggunaan"
			  className="flex items-center gap-2 transition-colors hover:text-[#B8860B]"
			>
			  <span className="h-1.5 w-1.5 rounded-full bg-current" />
			  Ketentuan Penggunaan
			</Link>
		  </div>
		</div>
      </div>
    </footer>
  );
}