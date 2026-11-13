"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Calculator, Play, ArrowLeft } from "lucide-react";

export default function IntroSimulasiPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <section className="flex items-center justify-center px-4 py-12 sm:py-16 lg:py-20">
        <div className="w-full max-w-5xl rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/40 dark:shadow-none p-6 sm:p-8 lg:p-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Teks & aksi */}
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#B8860B] bg-[#B8860B]/10 border border-[#B8860B]/20 rounded-full px-3.5 py-1.5 mb-5">
                <Calculator size={16} />
                Simulasi Interaktif IPK
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-zinc-900 dark:text-white leading-snug mb-4">
                Siap untuk Mencoba Simulasi Perhitungan IPK?
              </h1>

              <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-md">
                Pelajari bagaimana Indeks Pembangunan Kebudayaan dihitung.
                Masukkan nilai indikator, amati perubahannya secara langsung,
                dan pahami kontribusi setiap dimensi terhadap skor IPK.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/pages/simulasi"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B8860B] hover:bg-[#9a7009] text-white text-sm font-semibold transition shadow-md shadow-[#B8860B]/25"
                >
                  <Play size={18} fill="currentColor" />
                  Lanjut ke Simulasi
                </Link>

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                >
                  <ArrowLeft size={18} />
                  Kembali
                </button>
              </div>
            </div>

            {/* Gambar */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-lg aspect-[4/3] bg-zinc-100 dark:bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero/hero-bg-2.png"
                  alt="Ilustrasi Simulasi IPK"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}