"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import { Info, Shield, FileText } from "lucide-react";

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <PageHeader
        eyebrow="Legal"
        title="Kebijakan Privasi"
        description="Penjelasan bagaimana Portal IPK mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pengunjung."
        breadcrumbs={[
          { label: "Legal" },
          { label: "Kebijakan Privasi" },
        ]}
      />

      <section className="pb-20 lg:pb-24 pt-10 lg:pt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            {/* Konten utama */}
            <div className="lg:col-span-8">
              <article className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm text-left">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                  Portal Indeks Pembangunan Kebudayaan (IPK)
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                  Kementerian Kebudayaan Republik Indonesia
                  <br />
                  Terakhir diperbarui: November 2026
                </p>

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    1. Pendahuluan
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Kementerian Kebudayaan Republik Indonesia melalui Portal
                      Indeks Pembangunan Kebudayaan (IPK) berkomitmen untuk
                      menghormati dan melindungi privasi serta data pribadi
                      setiap pengunjung.
                    </p>
                    <p>
                      Kebijakan Privasi ini menjelaskan bagaimana informasi
                      dikumpulkan, digunakan, disimpan, dilindungi, dan dikelola
                      ketika pengunjung mengakses Portal IPK maupun menggunakan
                      layanan yang tersedia di dalamnya.
                    </p>
                    <p>
                      Kebijakan ini disusun sebagai bentuk transparansi
                      pengelolaan informasi serta mengacu pada ketentuan
                      peraturan perundang-undangan mengenai pelindungan data
                      pribadi yang berlaku di Indonesia.
                    </p>
                    <p>
                      Dengan mengakses dan menggunakan layanan Portal IPK,
                      pengunjung diharapkan membaca dan memahami Kebijakan
                      Privasi ini.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    2. Informasi yang Dikumpulkan
                  </h2>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                    Portal IPK dapat mengumpulkan informasi yang diberikan secara
                    langsung oleh pengunjung maupun informasi teknis yang
                    tercatat ketika pengunjung mengakses portal.
                  </p>

                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-3">
                    2.1. Data Pribadi
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                    Data pribadi merupakan informasi mengenai individu yang dapat
                    diidentifikasi secara langsung maupun tidak langsung, baik
                    melalui informasi tersebut sendiri maupun melalui kombinasi
                    dengan informasi lainnya.
                  </p>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                    Data pribadi dapat diperoleh ketika pengunjung menggunakan
                    fasilitas yang tersedia pada Portal IPK, antara lain:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                    <li>
                      <strong className="text-zinc-900 dark:text-white">
                        Formulir Permohonan Data
                      </strong>
                      , berupa nama, alamat email, instansi atau organisasi,
                      serta informasi lain yang diperlukan untuk menindaklanjuti
                      permohonan.
                    </li>
                    <li>
                      <strong className="text-zinc-900 dark:text-white">
                        Formulir Survei Unduhan
                      </strong>
                      , berupa informasi yang diminta dalam survei untuk
                      mengevaluasi pemanfaatan dan kualitas layanan unduhan data.
                    </li>
                    <li>
                      <strong className="text-zinc-900 dark:text-white">
                        Komunikasi dan Pertanyaan
                      </strong>
                      , berupa informasi yang disampaikan melalui email atau
                      saluran komunikasi resmi pengelola portal.
                    </li>
                  </ul>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                    Pengunjung diharapkan memberikan informasi yang benar,
                    akurat, dan sesuai dengan kebutuhan layanan.
                  </p>

                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-3">
                    2.2. Data Penggunaan
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                    Ketika pengunjung mengakses Portal IPK, sistem dapat mencatat
                    informasi teknis tertentu yang dikirimkan oleh peramban atau
                    perangkat yang digunakan. Informasi tersebut dapat mencakup:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                    <li>Alamat Internet Protocol (IP).</li>
                    <li>Jenis dan versi peramban (browser).</li>
                    <li>Jenis perangkat dan sistem operasi.</li>
                    <li>Halaman atau fitur yang diakses.</li>
                    <li>Tanggal dan waktu kunjungan.</li>
                    <li>
                      Informasi teknis lainnya yang diperlukan untuk pemeliharaan
                      dan keamanan portal.
                    </li>
                  </ul>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                    Informasi penggunaan tersebut dapat dimanfaatkan untuk
                    memahami pola akses, mengevaluasi kinerja layanan, serta
                    mendeteksi gangguan teknis.
                  </p>

                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-3">
                    2.3. Cookie dan Teknologi Sejenis
                  </h3>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Portal IPK dapat menggunakan cookie atau teknologi sejenis
                      apabila diterapkan pada sistem untuk mendukung fungsi
                      teknis, keamanan, dan peningkatan pengalaman pengunjung.
                    </p>
                    <p>
                      Cookie merupakan file kecil yang disimpan pada perangkat
                      pengunjung melalui peramban. Teknologi ini dapat digunakan
                      untuk mengingat preferensi atau mendukung fungsi tertentu
                      pada portal.
                    </p>
                    <p>
                      Pengunjung dapat mengatur peramban untuk membatasi atau
                      menolak penggunaan cookie. Namun, tindakan tersebut dapat
                      memengaruhi fungsi tertentu yang tersedia pada portal.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    3. Tujuan Penggunaan Informasi
                  </h2>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                    Informasi yang dikumpulkan melalui Portal IPK digunakan untuk
                    mendukung penyelenggaraan layanan dan pelaksanaan tugas
                    pengelolaan portal, antara lain:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                    <li>
                      Menindaklanjuti permohonan data dan pertanyaan yang
                      disampaikan pengunjung.
                    </li>
                    <li>
                      Menyediakan informasi atau tanggapan terkait layanan Portal
                      IPK.
                    </li>
                    <li>
                      Mengevaluasi pemanfaatan data dan kualitas layanan portal.
                    </li>
                    <li>
                      Menyusun statistik penggunaan portal untuk kepentingan
                      evaluasi dan pengembangan layanan.
                    </li>
                    <li>
                      Memelihara keamanan, stabilitas, dan kinerja sistem.
                    </li>
                    <li>
                      Mendeteksi, mencegah, dan menangani gangguan teknis maupun
                      penyalahgunaan layanan.
                    </li>
                    <li>
                      Memenuhi kewajiban sesuai dengan ketentuan peraturan
                      perundang-undangan.
                    </li>
                  </ol>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Informasi pribadi hanya digunakan sesuai dengan tujuan
                    pemrosesan yang relevan dan ketentuan yang berlaku.
                  </p>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    4. Penyimpanan dan Pengelolaan Data
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Informasi yang diperoleh melalui Portal IPK dikelola oleh
                      Kementerian Kebudayaan sesuai dengan kebutuhan
                      penyelenggaraan layanan dan ketentuan pengelolaan informasi
                      yang berlaku.
                    </p>
                    <p>
                      Data pribadi disimpan selama diperlukan untuk memenuhi
                      tujuan pengumpulannya atau selama diwajibkan berdasarkan
                      ketentuan peraturan perundang-undangan.
                    </p>
                    <p>
                      Apabila informasi tidak lagi diperlukan untuk tujuan
                      pengumpulannya dan tidak terdapat kewajiban hukum untuk
                      menyimpannya, pengelola akan melakukan tindakan yang sesuai
                      terhadap informasi tersebut, termasuk penghapusan atau
                      pemusnahan sesuai dengan ketentuan yang berlaku.
                    </p>
                    <p>
                      Pengelolaan informasi dilakukan dengan memperhatikan prinsip
                      pembatasan akses dan penggunaan informasi sesuai dengan
                      kewenangan.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    5. Pengungkapan dan Pembagian Data
                  </h2>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                    Kementerian Kebudayaan tidak memperjualbelikan data pribadi
                    pengunjung.
                  </p>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                    Informasi pribadi dapat diakses atau diungkapkan kepada pihak
                    lain apabila diperlukan dan memiliki dasar yang sah, antara
                    lain:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                    <li>
                      Untuk pelaksanaan tugas dan fungsi pemerintahan sesuai
                      dengan ketentuan peraturan perundang-undangan.
                    </li>
                    <li>
                      Untuk memenuhi kewajiban hukum atau permintaan resmi dari
                      pihak yang berwenang.
                    </li>
                    <li>
                      Untuk mendukung penyelenggaraan dan pemeliharaan layanan
                      Portal IPK melalui pihak yang memiliki kewenangan atau
                      hubungan kerja yang sah.
                    </li>
                    <li>
                      Untuk melindungi keamanan, hak, dan kepentingan yang sah
                      sesuai dengan ketentuan yang berlaku.
                    </li>
                  </ol>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Dalam hal pemrosesan data melibatkan pihak lain, pengelola
                    memperhatikan kewajiban pelindungan data pribadi sesuai
                    dengan peraturan perundang-undangan.
                  </p>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    6. Keamanan Data
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Kementerian Kebudayaan berupaya menerapkan langkah-langkah
                      teknis dan organisasi yang sesuai untuk melindungi informasi
                      dari akses, penggunaan, pengungkapan, perubahan, kehilangan,
                      atau penghapusan yang tidak sah.
                    </p>
                    <p>
                      Langkah pengamanan dilakukan dengan memperhatikan kebutuhan
                      dan risiko dalam penyelenggaraan sistem elektronik serta
                      perkembangan teknologi.
                    </p>
                    <p>
                      Meskipun berbagai upaya pengamanan dilakukan, tidak ada
                      sistem penyimpanan maupun transmisi informasi melalui
                      jaringan elektronik yang dapat dijamin sepenuhnya bebas dari
                      risiko keamanan.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    7. Hak Pengunjung atas Data Pribadi
                  </h2>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                    Sesuai dengan ketentuan peraturan perundang-undangan mengenai
                    pelindungan data pribadi, pengunjung memiliki hak terkait data
                    pribadi yang diproses oleh pengelola, sepanjang memenuhi
                    persyaratan dan ketentuan yang berlaku. Hak tersebut antara
                    lain meliputi:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                    <li>
                      Memperoleh informasi mengenai kejelasan identitas pihak yang
                      memproses data pribadi serta tujuan pemrosesannya.
                    </li>
                    <li>
                      Melengkapi, memperbarui, dan memperbaiki kesalahan atau
                      ketidakakuratan data pribadi.
                    </li>
                    <li>
                      Memperoleh akses dan salinan data pribadi sesuai ketentuan.
                    </li>
                    <li>
                      Meminta penghentian pemrosesan, penghapusan, atau pemusnahan
                      data pribadi sesuai ketentuan yang berlaku.
                    </li>
                    <li>
                      Menarik kembali persetujuan pemrosesan data pribadi apabila
                      pemrosesan didasarkan pada persetujuan.
                    </li>
                  </ol>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Permintaan terkait hak atas data pribadi dapat disampaikan
                    melalui kontak resmi yang tercantum pada bagian akhir
                    Kebijakan Privasi ini. Setiap permintaan akan ditinjau dan
                    ditindaklanjuti sesuai dengan ketentuan peraturan
                    perundang-undangan.
                  </p>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    8. Tautan ke Situs Pihak Ketiga
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Portal IPK dapat menyediakan tautan menuju situs atau
                      layanan pihak ketiga sebagai sumber referensi atau informasi
                      tambahan.
                    </p>
                    <p>
                      Situs pihak ketiga tersebut memiliki kebijakan privasi dan
                      ketentuan penggunaan masing-masing yang berada di luar
                      pengelolaan Portal IPK.
                    </p>
                    <p>
                      Kementerian Kebudayaan tidak memiliki kendali atas praktik
                      pengumpulan, penggunaan, maupun pengelolaan data pribadi
                      pada situs pihak ketiga. Pengunjung disarankan untuk
                      membaca kebijakan privasi masing-masing situs sebelum
                      memberikan informasi pribadi melalui layanan tersebut.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    9. Perubahan Kebijakan Privasi
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Kebijakan Privasi ini dapat ditinjau dan diperbarui
                      sewaktu-waktu untuk menyesuaikan perkembangan layanan,
                      perubahan sistem, kebutuhan pengelolaan informasi, serta
                      ketentuan peraturan perundang-undangan.
                    </p>
                    <p>
                      Setiap perubahan akan ditampilkan pada halaman ini dengan
                      mencantumkan tanggal pembaruan terakhir. Pengunjung
                      disarankan untuk memeriksa halaman ini secara berkala agar
                      mengetahui ketentuan terbaru mengenai pengelolaan informasi
                      pribadi pada Portal IPK.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section>
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    10. Kontak
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Apabila memiliki pertanyaan, permintaan, atau pengaduan
                      terkait pengelolaan data pribadi dan Kebijakan Privasi ini,
                      pengunjung dapat menghubungi:
                    </p>
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 p-5">
                      <p className="font-semibold text-zinc-900 dark:text-white">
                        Pusat Data dan Teknologi Informasi
                      </p>
                      <p className="text-zinc-800 dark:text-zinc-200">
                        Kementerian Kebudayaan Republik Indonesia
                      </p>
                      <p className="mt-2">
                        Pengelola Portal Indeks Pembangunan Kebudayaan
                      </p>
                      <p className="mt-2">
                        Email:{" "}
                        <a
                          href="mailto:ipk@kemenbud.go.id"
                          className="text-[#B8860B] hover:underline"
                        >
                          ipk@kemenbud.go.id
                        </a>
                      </p>
                      <p>
                        Website:{" "}
                        <a
                          href="https://ipk.kemenbud.go.id/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B8860B] hover:underline"
                        >
                          https://ipk.kemenbud.go.id/
                        </a>
                      </p>
                    </div>
                    <p>
                      Kementerian Kebudayaan berkomitmen untuk mengelola
                      informasi pengunjung secara bertanggung jawab dengan
                      memperhatikan prinsip pelindungan data pribadi dan
                      ketentuan peraturan perundang-undangan yang berlaku.
                    </p>
                  </div>
                </section>
              </article>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-semibold">
                  <Info size={18} className="text-[#B8860B]" />
                  Dokumen Legal
                </div>
                <nav className="space-y-1">
                  <Link
                    href="/pages/kebijakan-privasi"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium bg-[#B8860B]/10 text-[#B8860B]"
                  >
                    <Shield size={16} className="shrink-0" />
                    Kebijakan Privasi
                  </Link>
                  <Link
                    href="/pages/ketentuan-penggunaan"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-[#B8860B] transition"
                  >
                    <FileText size={16} className="text-[#B8860B] shrink-0" />
                    Ketentuan Penggunaan
                  </Link>
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