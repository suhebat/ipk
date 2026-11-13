"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Search,
  Calendar,
  ChevronDown,
  Filter,
  RotateCcw,
  LayoutGrid,
  List,
} from "lucide-react";

type Buku = {
  id: number;
  judul: string;
  tahun: number;
  kategori: string;
  deskripsi: string;
  cover: string | null;
  fileUrl: string | null;
};

type ViewMode = "grid" | "list";
type SortMode = "terbaru" | "terlama" | "judul";

async function fetchPublikasi(): Promise<Buku[]> {
  const res = await fetch("/api/publikasi");
  if (!res.ok) throw new Error("Gagal memuat publikasi");
  const json = await res.json();
  return (json.data || []) as Buku[];
}

function CoverFallback({ judul, tahun }: { judul: string; tahun: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#B8860B] to-[#5C3C03]">
      <BookOpen className="text-white/90 mb-2" size={28} />
      <p className="text-white text-xs font-semibold leading-snug line-clamp-3">
        {judul}
      </p>
      <p className="text-white/70 text-[10px] mt-2">{tahun}</p>
    </div>
  );
}

function BukuCard({ buku, view }: { buku: Buku; view: ViewMode }) {
  const [imgError, setImgError] = useState(false);
  const showImg = Boolean(buku.cover) && !imgError;
  const isList = view === "list";
  const href = `/publikasi/koleksi-buku/${buku.id}`;

  const cover = (
    <div
      className={`relative aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 overflow-hidden ${
        isList ? "w-28 sm:w-36 shrink-0 self-start" : "w-full"
      }`}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={buku.cover!}
          alt={buku.judul}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      ) : (
        <CoverFallback judul={buku.judul} tahun={buku.tahun} />
      )}
      {!isList && (
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/90 dark:bg-zinc-950/80 text-[#B8860B] border border-[#B8860B]/20">
          {buku.kategori}
        </span>
      )}
    </div>
  );

  return (
    <article
      className={`group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#B8860B]/40 ${
        isList ? "flex flex-row gap-4 sm:gap-6 p-4 sm:p-5" : "flex flex-col"
      }`}
    >
      <Link href={href} className={isList ? "shrink-0" : "block"}>
        {cover}
      </Link>

      <div
        className={`flex flex-col flex-1 min-w-0 ${isList ? "" : "p-4 sm:p-5"}`}
      >
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
          {isList ? (
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#B8860B]">
              {buku.kategori}
            </span>
          ) : (
            <Calendar size={12} />
          )}
          {isList && <span className="text-zinc-400">•</span>}
          <span>{buku.tahun}</span>
        </div>

        <h3
          className={`font-semibold text-zinc-900 dark:text-white leading-snug mb-2 group-hover:text-[#B8860B] transition-colors ${
            isList
              ? "text-base sm:text-lg line-clamp-2"
              : "text-sm sm:text-base line-clamp-2"
          }`}
        >
          <Link href={href} className="hover:underline">
            {buku.judul}
          </Link>
        </h3>

        <p
          className={`text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 flex-1 ${
            isList ? "line-clamp-2" : "line-clamp-3"
          }`}
        >
          {buku.deskripsi}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-[#B8860B] hover:text-[#B8860B] transition"
          >
            <ExternalLink size={14} />
            Detail
          </Link>
        </div>
      </div>
    </article>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  id: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
        />
      </div>
    </div>
  );
}

export default function KoleksiBukuPage() {
  const [q, setQ] = useState("");
  const [tahun, setTahun] = useState("Semua");
  const [kategori, setKategori] = useState("Semua");
  const [sort, setSort] = useState<SortMode>("terbaru");
  const [view, setView] = useState<ViewMode>("grid");

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["publikasi"],
    queryFn: fetchPublikasi,
  });

  const tahunOptions = useMemo(() => {
    const years = Array.from(new Set(data.map((b) => b.tahun))).sort(
      (a, b) => b - a
    );
    return [
      { value: "Semua", label: "Semua Tahun" },
      ...years.map((y) => ({ value: String(y), label: String(y) })),
    ];
  }, [data]);

  const kategoriOptions = useMemo(() => {
    const cats = Array.from(
      new Set(data.map((b) => b.kategori).filter(Boolean))
    ).sort();
    return [
      { value: "Semua", label: "Semua Jenis" },
      ...cats.map((c) => ({ value: c, label: c })),
    ];
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((b) => {
      const matchQ =
        !q ||
        b.judul.toLowerCase().includes(q.toLowerCase()) ||
        b.deskripsi.toLowerCase().includes(q.toLowerCase());
      const matchTahun = tahun === "Semua" || String(b.tahun) === tahun;
      const matchKat = kategori === "Semua" || b.kategori === kategori;
      return matchQ && matchTahun && matchKat;
    });
  }, [data, q, tahun, kategori]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "terbaru") arr.sort((a, b) => b.tahun - a.tahun);
    else if (sort === "terlama") arr.sort((a, b) => a.tahun - b.tahun);
    else arr.sort((a, b) => a.judul.localeCompare(b.judul, "id"));
    return arr;
  }, [filtered, sort]);

  const resetFilter = () => {
    setQ("");
    setTahun("Semua");
    setKategori("Semua");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <PageHeader
        eyebrow="Publikasi"
        title="Koleksi Buku Digital"
        description="Jelajahi publikasi resmi Indeks Pembangunan Kebudayaan: laporan tahunan, analisis, dan e-book metodologi."
        breadcrumbs={[
          { label: "Publikasi", href: "#" },
          { label: "Koleksi Buku Digital" },
        ]}
      />

      <section className="pt-8 pb-16 lg:pt-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Sticky Sidebar Filter */}
            <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 pb-5 mb-6 border-b border-zinc-200 dark:border-zinc-800">
                  <Filter size={18} className="text-[#B8860B]" />
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                    Filter Publikasi
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="cari-publikasi"
                      className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                      Cari Publikasi
                    </label>
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                      <input
                        id="cari-publikasi"
                        type="search"
                        placeholder="Cari judul publikasi…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30"
                      />
                    </div>
                  </div>

                  <SelectField
                    id="filter-tahun"
                    label="Tahun"
                    value={tahun}
                    onChange={setTahun}
                    options={tahunOptions}
                  />

                  <SelectField
                    id="filter-jenis"
                    label="Jenis Publikasi"
                    value={kategori}
                    onChange={setKategori}
                    options={kategoriOptions}
                  />

                  <button
                    type="button"
                    onClick={resetFilter}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-[#B8860B] hover:text-[#B8860B] transition"
                  >
                    <RotateCcw size={16} />
                    Reset Filter
                  </button>
                </div>
              </div>
            </aside>

            {/* Konten */}
            <div className="flex-1 min-w-0 space-y-6">
              {isLoading && (
                <p className="text-sm text-zinc-500 py-8">Memuat koleksi buku…</p>
              )}
              {error && (
                <p className="text-sm text-red-600 py-8">
                  Gagal memuat data. Periksa API{" "}
                  <code className="text-xs">/api/publikasi</code> dan koneksi DB.
                </p>
              )}

              {!isLoading && !error && (
                <>
                  {/* Toolbar: jumlah hasil + urutan + tampilan */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-zinc-500">
                      <strong className="text-zinc-800 dark:text-zinc-200">
                        {sorted.length}
                      </strong>{" "}
                      publikasi ditemukan
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="urutkan"
                          className="text-sm text-zinc-500"
                        >
                          Urutkan:
                        </label>
                        <div className="relative">
                          <select
                            id="urutkan"
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortMode)}
                            className="appearance-none rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-3 pr-8 py-2 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30"
                          >
                            <option value="terbaru">Terbaru</option>
                            <option value="terlama">Terlama</option>
                            <option value="judul">Judul A–Z</option>
                          </select>
                          <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500"
                          />
                        </div>
                      </div>

                      <div
                        role="group"
                        aria-label="Tampilan"
                        className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5"
                      >
                        <button
                          type="button"
                          aria-label="Tampilan grid"
                          aria-pressed={view === "grid"}
                          onClick={() => setView("grid")}
                          className={`p-1.5 rounded-md transition ${
                            view === "grid"
                              ? "bg-[#B8860B] text-white"
                              : "text-zinc-500 hover:text-[#B8860B]"
                          }`}
                        >
                          <LayoutGrid size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label="Tampilan list"
                          aria-pressed={view === "list"}
                          onClick={() => setView("list")}
                          className={`p-1.5 rounded-md transition ${
                            view === "list"
                              ? "bg-[#B8860B] text-white"
                              : "text-zinc-500 hover:text-[#B8860B]"
                          }`}
                        >
                          <List size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {sorted.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-16 text-center">
                      <FileText
                        className="mx-auto text-zinc-300 dark:text-zinc-600 mb-3"
                        size={36}
                      />
                      <p className="text-sm text-zinc-500">
                        Tidak ada publikasi yang cocok dengan filter Anda.
                      </p>
                    </div>
                  ) : view === "grid" ? (
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {sorted.map((buku) => (
                        <BukuCard key={buku.id} buku={buku} view="grid" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 sm:gap-5">
                      {sorted.map((buku) => (
                        <BukuCard key={buku.id} buku={buku} view="list" />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}