import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { FileText } from "lucide-react";
import { getDasarHukumDocuments } from "@/lib/dasar-hukum";

/** Cache singkat — dokumen jarang berubah */
export const revalidate = 60;

function formatNo(n: number) {
  return String(n).padStart(2, "0");
}

export default async function DasarHukumPage() {
  let dokumen: Awaited<ReturnType<typeof getDasarHukumDocuments>> = [];
  let loadError = false;

  try {
    dokumen = await getDasarHukumDocuments();
  } catch (e) {
    console.error("[dasar-hukum page]", e);
    loadError = true;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="sticky top-0 z-50 print:!hidden no-print w-full">
        <Navbar />
      </div>

      <PageHeader
        eyebrow="Tentang IPK"
        title="Dasar Hukum & Kebijakan"
        description="Pelaksanaan IPK berlandaskan pada berbagai peraturan dan kebijakan pemerintah yang mendukung pengukuran, pemantauan, serta pembangunan kebudayaan berbasis data."
        breadcrumbs={[
          { label: "Tentang", href: "/pages/tentang-ipk" },
          { label: "Dasar Hukum & Kebijakan" },
        ]}
      />

      <section className="pt-10 pb-20 lg:pt-12 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          {loadError && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-6">
              Gagal memuat data dari database. Periksa koneksi Prisma / tabel{" "}
              <code className="text-xs">dasar_hukum</code>.
            </p>
          )}

          {!loadError && dokumen.length === 0 && (
            <p className="text-sm text-zinc-500 py-8">
              Belum ada dokumen dasar hukum yang dipublikasikan.
            </p>
          )}

          <div className="space-y-4">
            {dokumen.map((d) => (
              <div
                key={d.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm"
              >
                <div className="text-3xl font-bold text-[#B8860B]/80 tabular-nums w-12 shrink-0">
                  {formatNo(d.nomor_urut || d.id)}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <span className="inline-block text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 mb-2">
                    {d.badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white mb-1">
                    {d.judul}
                  </h3>
                  {d.deskripsi && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {d.deskripsi}
                    </p>
                  )}
                </div>

                <Button
                  href={d.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="green"
                  className="shrink-0 !px-5 !py-2.5 text-sm"
                >
                  <span className="inline-flex items-center gap-2">
                    <FileText size={16} />
                    Buka PDF
                  </span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
