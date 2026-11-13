"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import {
  TrendingUp,
  GraduationCap,
  UserRoundGroup,
  Landmark,
  EighthNotes,
  BookOpen,
  VenusAndMars,
  BarChart3,
  Map,
  FileText,
  Network,
  Info,
  ChevronRight,
} from "lucide-react";

const dimensiList = [
  {
    icon: TrendingUp,
    name: "Ekonomi Budaya",
    color: "#f59e0b",
    muted: "#b45309",
    desc: "Menggambarkan keterkaitan kebudayaan dengan aktivitas ekonomi, termasuk kontribusi dan pemanfaatan potensi budaya dalam kehidupan masyarakat.",
  },
  {
    icon: GraduationCap,
    name: "Pendidikan",
    color: "#3b82f6",
    muted: "#1d4ed8",
    desc: "Menggambarkan keterkaitan pendidikan dengan pembangunan kebudayaan, termasuk akses, partisipasi, dan peran pendidikan dalam pengembangan pengetahuan dan kebudayaan.",
  },
  {
    icon: UserRoundGroup,
    name: "Ketahanan Sosial Budaya",
    color: "#10b981",
    muted: "#047857",
    desc: "Menggambarkan kemampuan masyarakat dalam mempertahankan nilai, hubungan sosial, keberagaman, serta kehidupan budaya di tengah perubahan.",
  },
  {
    icon: Landmark,
    name: "Warisan Budaya",
    color: "#8b5cf6",
    muted: "#6d28d9",
    desc: "Menggambarkan kondisi dan keberlanjutan warisan budaya, termasuk upaya pelindungan, pemanfaatan, pengembangan, dan pewarisannya.",
  },
  {
    icon: EighthNotes,
    name: "Ekspresi Budaya",
    color: "#ec4899",
    muted: "#be185d",
    desc: "Menggambarkan kesempatan dan partisipasi masyarakat dalam mengekspresikan, mengembangkan, dan menikmati berbagai bentuk ekspresi budaya.",
  },
  {
    icon: BookOpen,
    name: "Budaya Literasi",
    color: "#06b6d4",
    muted: "#0e7490",
    desc: "Menggambarkan kemampuan dan kebiasaan masyarakat dalam mengakses, memahami, memanfaatkan, dan mengembangkan pengetahuan melalui aktivitas literasi.",
  },
  {
    icon: VenusAndMars,
    name: "Gender",
    color: "#f97316",
    muted: "#c2410c",
    desc: "Menggambarkan keterlibatan dan kesetaraan perempuan dan laki-laki dalam berbagai aspek kehidupan kebudayaan.",
  },
];

export default function TentangIPKPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <PageHeader
        eyebrow="Tentang IPK"
        title="Mengenal Lebih Dekat IPK"
        description="Kenali Indeks Pembangunan Kebudayaan sebagai instrumen untuk melihat capaian pembangunan kebudayaan Indonesia melalui tujuh dimensi pengukuran."
        breadcrumbs={[
          { label: "Tentang" },
          { label: "Tentang IPK" },
        ]}
      />

      {/* Latar belakang — jarak lebih rapat */}
      <section className="pt-10 pb-6 lg:pt-12 lg:pb-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Logo zoom sedikit — tidak potong logo */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-full max-w-[280px] aspect-square overflow-hidden rounded-2xl">
                  <img
                    src="/images/content/ipk-on-thewall.png"
                    alt="Logo Indeks Pembangunan Kebudayaan"
                    className="w-full h-full object-cover object-center scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/logos/logo-ipk-light.png";
                      (e.target as HTMLImageElement).className =
                        "max-h-56 w-auto object-contain mx-auto";
                    }}
                  />
                </div>
              </div>

              <div className="lg:col-span-8 text-left">
                <h2 className="text-brand-gold text-2xl md:text-3xl font-bold mb-5">
                  Mengenal Indeks Pembangunan Kebudayaan
                </h2>
                <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <p>
                    <strong className="text-zinc-900 dark:text-white">
                      Indeks Pembangunan Kebudayaan (IPK)
                    </strong>{" "}
                    merupakan instrumen untuk menggambarkan capaian pembangunan
                    kebudayaan di Indonesia melalui tujuh dimensi. IPK menyajikan
                    informasi terukur mengenai kondisi pembangunan kebudayaan di
                    tingkat nasional dan daerah.
                  </p>
                  <p>
                    Informasi IPK dapat membantu mengidentifikasi capaian dan
                    tantangan pembangunan kebudayaan serta menjadi bahan
                    pertimbangan dalam perencanaan, pemantauan, evaluasi, dan
                    perumusan kebijakan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Isi + sidebar */}
      <section className="pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            {/* Konten utama */}
            <div className="lg:col-span-8">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm text-left">
                <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                  Peluncuran IPK
                </h2>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                  Indeks Pembangunan Kebudayaan (IPK) diperkenalkan kepada publik
                  pada rangkaian Pekan Kebudayaan Nasional 2019. Peluncuran ini
                  menjadi tonggak pengenalan IPK sebagai instrumen untuk
                  menggambarkan capaian pembangunan kebudayaan secara terukur.
                </p>
                <figure className="mb-8">
                  <img
                    src="/images/content/launching-ipk.jpeg"
                    alt="Peluncuran Indeks Pembangunan Kebudayaan pada Pekan Kebudayaan Nasional 2019"
                    className="w-full rounded-2xl object-cover max-h-[420px]"
                    loading="lazy"
                  />
                  <figcaption className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Peluncuran Indeks Pembangunan Kebudayaan (IPK) pada rangkaian
                    Pekan Kebudayaan Nasional 2019.
                    <br />
                    <em>Sumber foto: www.kemenkopmk.go.id</em>
                  </figcaption>
                </figure>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                  Manfaat dan Pemanfaatan IPK
                </h2>
                <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8">
                  <p>
                    IPK menyediakan gambaran berbasis data untuk melihat capaian,
                    membandingkan kondisi antarwilayah, dan memantau perubahan dari
                    waktu ke waktu. Informasi ini dapat menjadi bahan pertimbangan
                    dalam perencanaan, pemantauan, evaluasi, serta penyusunan
                    kebijakan dan program kebudayaan.
                  </p>
                  <p>
                    Untuk memahami kondisi secara lebih mendalam, nilai indeks dapat
                    dibaca bersama dimensi dan indikator pembentuknya. IPK mengukur
                    aspek pembangunan kebudayaan yang dapat direpresentasikan
                    melalui data, bukan tinggi atau rendahnya nilai budaya suatu
                    wilayah.
                  </p>
                </div>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                  Dimensi Pengukuran
                </h2>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                  IPK mengukur pembangunan kebudayaan melalui tujuh dimensi yang
                  mewakili aspek berbeda dalam kehidupan masyarakat:
                </p>

                <div className="space-y-5">
                  {dimensiList.map((d) => (
                    <div
                      key={d.name}
                      className="flex gap-4 items-start p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                    >
                      <div
                        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white"
                        style={{
                          background: `linear-gradient(135deg, ${d.color}, ${d.muted})`,
                        }}
                      >
                        <d.icon size={22} strokeWidth={1.75} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                          {d.name}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {d.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                  Cakupan Wilayah
                </h2>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                  IPK menyajikan hasil pengukuran pada tingkat nasional dan
                  provinsi. Gunakan tautan berikut untuk melihat capaian nasional
                  atau menelusuri data setiap provinsi.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="/pages/hasil-nasional"
                    className="group flex flex-col p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 hover:border-[#B8860B]/50 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <BarChart3 className="text-[#B8860B]" size={22} />
                      <ChevronRight
                        size={18}
                        className="text-zinc-400 group-hover:text-[#B8860B] group-hover:translate-x-0.5 transition"
                      />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider text-[#B8860B] uppercase mb-1">
                      Data Nasional
                    </span>
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-1.5">
                      Hasil Nasional
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Lihat capaian Indeks Pembangunan Kebudayaan Indonesia dan
                      perkembangannya dari waktu ke waktu.
                    </p>
                  </a>

                  <a
                    href="/pages/hasil-provinsi"
                    className="group flex flex-col p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 hover:border-[#B8860B]/50 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Map className="text-[#B8860B]" size={22} />
                      <ChevronRight
                        size={18}
                        className="text-zinc-400 group-hover:text-[#B8860B] group-hover:translate-x-0.5 transition"
                      />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider text-[#B8860B] uppercase mb-1">
                      Data Provinsi
                    </span>
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-1.5">
                      Hasil Provinsi
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Jelajahi capaian IPK setiap provinsi dan bandingkan
                      perkembangan pembangunan kebudayaan antarwilayah.
                    </p>
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar sticky — mobile: mengalir normal, desktop: sticky saat scroll */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-semibold">
                  <Info size={18} className="text-[#B8860B]" />
                  Informasi Lanjutan
                </div>
                <nav className="space-y-1">
                  <a
                    href="/pages/dasar-hukum"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-[#B8860B] transition"
                  >
                    <FileText size={16} className="text-[#B8860B] shrink-0" />
                    Dasar Hukum &amp; Kebijakan
                  </a>
                  <a
                    href="/pages/metodologi"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-[#B8860B] transition"
                  >
                    <Network size={16} className="text-[#B8860B] shrink-0" />
                    Metodologi &amp; Indikator
                  </a>
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}