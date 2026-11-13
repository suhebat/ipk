"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import FlipBook from "@/components/FlipBook";
import DownloadSurveyModal, {
  type DatasetItem,
} from "@/components/DownloadSurveyModal";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Tag,
} from "lucide-react";

type Pub = {
  id: number;
  title: string;
  year: number;
  type: string | null;
  description: string | null;
  seo_description: string | null;
  image_path: string | null;
  download_link: string | null;
  seo_keywords?: string | null;
};

type Related = {
  id: number;
  title: string;
  year: number;
  type: string | null;
  image_path: string | null;
  download_link?: string | null;
};

async function fetchPub(id: string) {
  const res = await fetch(`/api/publikasi/${id}`);
  if (!res.ok) {
    throw new Error("Gagal memuat publikasi");
  }
  return res.json() as Promise<{
    status: string;
    item: Pub;
    related: Related[];
  }>;
}

export default function DetailPublikasiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["publikasi", id],
    queryFn: () => fetchPub(id),
  });

  const pub = data?.item;
  const related = data?.related ?? [];

  const coverSrc = pub?.image_path ?? null;
  const pdfSrc = pub?.download_link ?? null;
  const typeLabel = pub?.type || "Publikasi";

  const surveyItem: DatasetItem | null =
    pub && pdfSrc
      ? {
          dataset: "publikasi",
          period: String(pub.year),
          label: pub.title,
          halaman: "koleksi-buku",
          availableFormats: ["pdf"],
          fileUrl: pdfSrc,
          fileName: `IPK-publikasi-${pub.id}.pdf`,
        }
      : null;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <PageHeader
        eyebrow="Publikasi IPK"
        title={pub?.title || "Detail Buku"}
        description="Informasi lengkap dan pratinjau buku digital Indeks Pembangunan Kebudayaan."
        breadcrumbs={[
          { label: "Publikasi", href: "#" },
          { label: "Koleksi Buku Digital", href: "/publikasi/koleksi-buku" },
          { label: "Detail Buku" },
        ]}
      />

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          {isLoading && (
            <p className="text-sm text-zinc-500 py-12 text-center">
              Memuat detail publikasi…
            </p>
          )}

          {error && (
            <div className="text-center py-16">
              <h1 className="text-xl font-bold mb-2">
                Publikasi tidak ditemukan
              </h1>
              <p className="text-sm text-zinc-500 mb-6">
                Data yang Anda cari tidak tersedia.
              </p>
              <Link href="/publikasi/koleksi-buku">
                <Button variant="gold" className="!px-5 !py-2.5 text-sm">
                  Kembali ke Daftar Publikasi
                </Button>
              </Link>
            </div>
          )}

          {pub && (
            <>
              <Link
                href="/publikasi/koleksi-buku"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-[#B8860B] mb-8 transition"
              >
                <ArrowLeft size={16} />
                Kembali ke koleksi
              </Link>

              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 mb-12">
                {/* Cover + unduh */}
                <div className="mx-auto lg:mx-0 w-full max-w-[280px]">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-lg">
                    {coverSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverSrc}
                        alt={pub.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm p-6 text-center">
                        Tidak ada sampul
                      </div>
                    )}
                  </div>

                  {pdfSrc && (
                    <Button
                      variant="red"
                      onClick={() => setIsSurveyOpen(true)}
                      className="mt-4 w-full"
                    >
                      <Download size={18} />
                      Unduh PDF
                    </Button>
                  )}
                </div>

                {/* Meta + deskripsi */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-[#B8860B]/15 text-[#B8860B]">
                      <Tag size={12} />
                      {typeLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      <Calendar size={12} />
                      Tahun {pub.year}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      <FileText size={12} />
                      PDF
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-5">
                    {pub.title}
                  </h1>

                  <section className="mb-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-2">
                      Tentang Publikasi
                    </h2>
                    <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                      {pub.description || "Deskripsi belum tersedia."}
                    </p>
                  </section>

                  {pub.seo_description && (
                    <section>
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-2">
                        Ringkasan
                      </h2>
                      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                        {pub.seo_description}
                      </p>
                    </section>
                  )}
                </div>
              </div>

              {/* Flipbook */}
              {pdfSrc ? (
                <div className="mb-16 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6">
                  <FlipBook
                    pdfUrl={pdfSrc}
                    title={pub.title}
                    year={pub.year}
                    typeLabel={typeLabel}
                    coverImage={coverSrc}
                  />
                </div>
              ) : (
                <p className="text-sm text-zinc-500 mb-12">
                  File PDF belum tersedia untuk pratinjau interaktif.
                </p>
              )}

              {/* Publikasi terkait */}
              {related.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-5">Publikasi Terkait</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        href={`/publikasi/koleksi-buku/${r.id}`}
                        className="group rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-[#B8860B]/50 transition"
                      >
                        <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900">
                          {r.image_path ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={r.image_path}
                              alt={r.title}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
                            />
                          ) : null}
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-zinc-500 mb-0.5">{r.year}</p>
                          <p className="text-sm font-medium line-clamp-2 group-hover:text-[#B8860B] transition">
                            {r.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </section>

      <DownloadSurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        item={surveyItem}
      />

      <Footer />
    </div>
  );
}