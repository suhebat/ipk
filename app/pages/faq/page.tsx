"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import CtaSection from "@/components/CtaSection";
import Button from "@/components/ui/Button";
import {
  Search,
  X,
  ChevronDown,
  HelpCircle,
  BookOpen,
  BarChart3,
  FileText,
  Headset,
  LayoutGrid,
} from "lucide-react";

type FaqItem = {
  id: number;
  kategori: string;
  pertanyaan: string;
  jawaban: string;
  urutan: number;
};

const CATEGORIES = [
  { id: "all", label: "Semua Kategori", icon: LayoutGrid },
  { id: "umum", label: "Umum", icon: HelpCircle },
  { id: "metodologi", label: "Metodologi & Indikator", icon: BookOpen },
  { id: "data", label: "Data & Hasil", icon: BarChart3 },
  { id: "publikasi", label: "Publikasi", icon: FileText },
  { id: "layanan", label: "Layanan", icon: Headset },
] as const;

async function fetchFaq() {
  const res = await fetch("/api/faq");
  if (!res.ok) throw new Error("Gagal memuat FAQ");
  return res.json() as Promise<{ items: FaqItem[] }>;
}

export default function FaqPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [openId, setOpenId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["faq"],
    queryFn: fetchFaq,
  });

  const items = data?.items ?? [];

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const it of items) {
      c[it.kategori] = (c[it.kategori] || 0) + 1;
    }
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((it) => {
      if (cat !== "all" && it.kategori !== cat) return false;
      if (!term) return true;
      return (
        it.pertanyaan.toLowerCase().includes(term) ||
        it.jawaban.toLowerCase().includes(term)
      );
    });
  }, [items, cat, q]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <PageHeader
        eyebrow="Layanan IPK"
        title="Pertanyaan yang Sering Diajukan"
        description="Temukan jawaban atas pertanyaan umum mengenai IPK, data yang tersedia, metodologi, dan layanan pada portal ini."
        breadcrumbs={[
          { label: "Layanan", href: "#" },
          { label: "FAQ" },
        ]}
      />

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          {/* Search bar di tengah halaman */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari pertanyaan atau kata kunci (contoh: dimensi, publikasi, permohonan data)"
                className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  aria-label="Hapus pencarian"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8 items-start">
            {/* Sidebar kategori — sticky */}
            <aside className="lg:sticky lg:top-24 self-start">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-3 sm:p-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
                <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Kategori
                </p>

                <div className="hidden lg:block space-y-1">
                  {CATEGORIES.map(({ id, label, icon: Icon }) => {
                    const active = cat === id;
                    const count = counts[id] ?? 0;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setCat(id)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition ${
                          active
                            ? "bg-[#B8860B]/15 text-[#B8860B] font-semibold"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2 min-w-0">
                          <Icon size={16} className="shrink-0" />
                          <span className="truncate">{label}</span>
                        </span>
                        <span
                          className={`text-xs tabular-nums shrink-0 ${
                            active ? "text-[#B8860B]" : "text-zinc-400"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="lg:hidden">
                  <select
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
                  >
                    {CATEGORIES.map(({ id, label }) => (
                      <option key={id} value={id}>
                        {label} ({counts[id] ?? 0})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </aside>

            {/* Konten */}
            <div className="min-w-0">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                {isLoading ? "Memuat…" : `${filtered.length} pertanyaan`}
              </p>

              {error && (
                <p className="text-sm text-red-600 py-6">
                  Gagal memuat FAQ. Pastikan tabel <code>faqs</code> sudah dibuat
                  dan Prisma terhubung.
                </p>
              )}

              {!isLoading && !error && filtered.length === 0 && (
                <p className="text-sm text-zinc-500 py-6">
                  Tidak ada pertanyaan yang cocok dengan pencarian / kategori.
                </p>
              )}

              <div className="space-y-3">
                {filtered.map((it) => {
                  const open = openId === it.id;
                  return (
                    <div
                      key={it.id}
                      className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : it.id)}
                        className="w-full flex items-start gap-3 p-4 sm:p-5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                        aria-expanded={open}
                      >
                        <span className="flex-1 font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                          {it.pertanyaan}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-zinc-400 mt-0.5 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {open && (
                        <div className="px-4 sm:px-5 pb-5 border-t border-zinc-100 dark:border-zinc-800">
                          <p className="pt-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                            {it.jawaban}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow="Layanan IPK"
        title="Tidak menemukan jawaban yang Anda cari?"
        description="Hubungi kami untuk mendapatkan informasi lebih lanjut mengenai IPK."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/pages/permohonan-data">
            <Button variant="blue" className="!px-6 !py-3 text-sm">
              Permohonan Data
            </Button>
          </Link>
          <Link href="/pages/hubungi-kami">
            <Button variant="gold" className="!px-6 !py-3 text-sm">
              Hubungi Kami
            </Button>
          </Link>
        </div>
      </CtaSection>

      <Footer />
    </div>
  );
}