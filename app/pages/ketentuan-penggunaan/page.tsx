"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import { Info, Shield, FileText } from "lucide-react";

export default function KetentuanPenggunaanPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <PageHeader
        eyebrow="Legal"
        title="Ketentuan Penggunaan"
        description="Hak, kewajiban, dan tanggung jawab pengunjung dalam mengakses serta memanfaatkan informasi dan layanan Portal IPK."
        breadcrumbs={[
          { label: "Legal" },
          { label: "Ketentuan Penggunaan" },
        ]}
      />

      <section className="pb-20 lg:pb-24 pt-10 lg:pt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
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
                      Selamat datang di Portal Indeks Pembangunan Kebudayaan
                      (IPK), yang dikelola oleh Kementerian Kebudayaan Republik
                      Indonesia.
                    </p>
                    <p>
                      Portal ini menyediakan informasi, data, publikasi, dan
                      berbagai layanan terkait pembangunan kebudayaan di
                      Indonesia. Ketentuan Penggunaan ini mengatur hak,
                      kewajiban, dan tanggung jawab pengunjung dalam mengakses
                      serta memanfaatkan informasi dan layanan yang tersedia.
                    </p>
                    <p>
                      Dengan mengakses atau menggunakan Portal IPK, pengunjung
                      dianggap telah membaca dan memahami ketentuan ini. Apabila
                      tidak menyetujui ketentuan yang berlaku, pengunjung
                      diharapkan untuk tidak menggunakan layanan portal.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    2. Ketentuan Umum
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Kementerian Kebudayaan dapat melakukan pembaruan,
                      perubahan, penambahan, atau penghentian terhadap sebagian
                      maupun seluruh informasi dan layanan yang tersedia pada
                      Portal IPK sesuai dengan kebutuhan pengelolaan portal.
                    </p>
                    <p>
                      Informasi yang tersedia dapat mengalami perubahan,
                      koreksi, atau pembaruan berdasarkan hasil verifikasi dan
                      proses pengelolaan data.
                    </p>
                    <p>
                      Kementerian Kebudayaan tidak berkewajiban untuk
                      mempertahankan seluruh informasi atau layanan dalam bentuk
                      dan ketersediaan yang sama sepanjang waktu.
                    </p>
                    <p>
                      Pengunjung diharapkan memeriksa ketentuan penggunaan ini
                      secara berkala untuk mengetahui perubahan yang mungkin
                      dilakukan.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    3. Hak Penggunaan Data dan Informasi
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Data dan informasi yang tersedia pada Portal IPK dapat
                      dimanfaatkan untuk mendukung kegiatan penelitian,
                      pendidikan, perencanaan, evaluasi, pengembangan ilmu
                      pengetahuan, serta kebutuhan lain yang sesuai dengan
                      ketentuan peraturan perundang-undangan.
                    </p>
                    <p>
                      Pemanfaatan data dapat mencakup pengunduhan, pengutipan,
                      pengolahan, analisis, visualisasi, dan penyajian kembali
                      informasi dengan tetap memperhatikan sumber, konteks,
                      metodologi, serta ketentuan penggunaan yang berlaku.
                    </p>
                    <p>
                      Ketentuan penggunaan dapat berbeda untuk dataset atau
                      publikasi tertentu apabila terdapat batasan atau
                      persyaratan khusus yang dicantumkan pada halaman terkait.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    4. Pencantuman Sumber dan Atribusi
                  </h2>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                    Setiap penggunaan, pengutipan, pengolahan, atau penyajian
                    kembali data yang diperoleh dari Portal IPK wajib disertai
                    pencantuman sumber secara jelas. Informasi sumber
                    sekurang-kurangnya mencantumkan:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                    <li>
                      Kementerian Kebudayaan Republik Indonesia sebagai sumber
                      atau penerbit data.
                    </li>
                    <li>Judul dataset atau publikasi.</li>
                    <li>Tahun atau periode data.</li>
                    <li>Tanggal akses.</li>
                    <li>
                      Tautan menuju halaman dataset atau publikasi asli.
                    </li>
                  </ul>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                    Format pencantuman sumber yang disarankan:
                  </p>
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 p-4 text-sm text-zinc-800 dark:text-zinc-200 mb-4">
                    Sumber: Kementerian Kebudayaan Republik Indonesia, [Judul
                    Dataset], [Tahun Data], diakses pada [Tanggal Akses], melalui
                    [URL Dataset].
                  </div>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Apabila data telah diolah atau dianalisis lebih lanjut,
                      pengguna disarankan memberikan keterangan bahwa informasi
                      tersebut merupakan hasil pengolahan mandiri berdasarkan
                      data yang tersedia pada Portal IPK.
                    </p>
                    <p>
                      Pengguna tidak diperkenankan membuat pernyataan atau
                      penyajian yang menimbulkan kesan bahwa Kementerian
                      Kebudayaan memberikan dukungan, persetujuan, atau
                      pengesahan terhadap hasil analisis, produk, maupun
                      kegiatan pengguna tanpa adanya persetujuan resmi.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    5. Pengolahan dan Penyajian Kembali Data
                  </h2>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                    Pengguna dapat melakukan pengolahan dan analisis terhadap
                    data yang tersedia dengan memperhatikan definisi, cakupan,
                    satuan, periode, serta metodologi yang menyertainya. Dalam
                    menyajikan kembali data, pengguna wajib:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <li>Mempertahankan makna dan konteks data.</li>
                    <li>
                      Tidak mengubah atau memanipulasi data dengan tujuan
                      menyesatkan.
                    </li>
                    <li>Mencantumkan sumber data secara jelas.</li>
                    <li>
                      Membedakan data asli dengan hasil pengolahan atau analisis
                      mandiri.
                    </li>
                    <li>
                      Memperhatikan metadata dan catatan yang menyertai dataset.
                    </li>
                  </ul>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    6. Hak Kekayaan Intelektual
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Nama, logo, identitas visual, desain, materi, dan elemen
                      tertentu pada Portal IPK dapat dilindungi berdasarkan
                      ketentuan hak kekayaan intelektual yang berlaku.
                    </p>
                    <p>
                      Hak penggunaan terhadap data, publikasi, dan materi yang
                      tersedia pada portal mengikuti ketentuan lisensi yang
                      berlaku serta ketentuan khusus yang menyertai masing-masing
                      konten.
                    </p>
                    <p>
                      Penggunaan logo, identitas resmi, atau elemen kelembagaan
                      Kementerian Kebudayaan tidak diperkenankan dengan cara yang
                      dapat menimbulkan kesan sebagai pihak yang mewakili atau
                      memperoleh pengesahan resmi tanpa kewenangan.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    7. Ketentuan Akses dan Keamanan
                  </h2>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                    Kementerian Kebudayaan dapat melakukan pemantauan terhadap
                    akses dan pola penggunaan Portal IPK untuk menjaga keamanan,
                    stabilitas, serta keberlangsungan layanan. Pengunjung
                    dilarang melakukan tindakan yang dapat mengganggu operasional
                    portal, termasuk:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                    <li>
                      Mengakses sistem atau bagian portal tanpa hak atau
                      kewenangan.
                    </li>
                    <li>
                      Melakukan tindakan yang mengganggu ketersediaan dan kinerja
                      layanan.
                    </li>
                    <li>
                      Melakukan pengambilan data secara tidak wajar yang dapat
                      membebani sistem.
                    </li>
                    <li>
                      Memanfaatkan celah keamanan untuk memperoleh akses yang
                      tidak sah.
                    </li>
                    <li>
                      Menyebarkan kode berbahaya atau melakukan tindakan lain
                      yang bertentangan dengan hukum.
                    </li>
                  </ul>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    Dalam hal ditemukan aktivitas yang berpotensi mengganggu
                    keamanan atau stabilitas sistem, pengelola portal dapat
                    melakukan pembatasan atau pemblokiran akses sesuai kebutuhan.
                  </p>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    8. Layanan Permohonan Data
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Portal IPK dapat menyediakan fasilitas permohonan data bagi
                      pengunjung yang membutuhkan informasi tertentu.
                    </p>
                    <p>
                      Pengunjung wajib memberikan informasi yang benar dan sesuai
                      dengan kebutuhan pengajuan. Setiap permohonan akan
                      ditindaklanjuti berdasarkan ketersediaan data, kewenangan,
                      prosedur layanan, serta ketentuan peraturan
                      perundang-undangan.
                    </p>
                    <p>
                      Pengajuan permohonan tidak secara otomatis menjamin bahwa
                      seluruh data yang diminta dapat diberikan.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    9. Tautan dan Konten Pihak Ketiga
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Portal IPK dapat memuat tautan atau konten yang berasal dari
                      situs dan layanan pihak ketiga sebagai referensi tambahan.
                    </p>
                    <p>
                      Penyediaan tautan tersebut tidak serta-merta menunjukkan
                      bahwa Kementerian Kebudayaan memiliki, mengelola, atau
                      memberikan pengesahan terhadap seluruh isi dan layanan pada
                      situs pihak ketiga.
                    </p>
                    <p>
                      Penggunaan situs pihak ketiga menjadi tanggung jawab
                      masing-masing pengunjung dan mengikuti ketentuan yang
                      berlaku pada situs tersebut.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    10. Akurasi Informasi dan Sanggahan
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Kementerian Kebudayaan berupaya menyajikan data dan
                      informasi yang akurat berdasarkan sumber, metodologi, dan
                      proses pengelolaan yang berlaku.
                    </p>
                    <p>
                      Meskipun demikian, data dan informasi pada Portal IPK dapat
                      mengalami pembaruan, koreksi, atau penyesuaian. Pengunjung
                      disarankan untuk selalu memperhatikan tahun data, metadata,
                      metodologi, dan keterangan pendukung sebelum menggunakan
                      informasi sebagai dasar analisis atau pengambilan
                      keputusan.
                    </p>
                    <p>
                      Kementerian Kebudayaan tidak bertanggung jawab atas
                      interpretasi, pengolahan, maupun penggunaan data oleh pihak
                      lain yang dilakukan di luar konteks dan ketentuan yang
                      berlaku, sepanjang sesuai dengan peraturan
                      perundang-undangan.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    11. Ketentuan Hukum
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Ketentuan Penggunaan ini disusun dan dilaksanakan dengan
                      memperhatikan peraturan perundang-undangan yang berlaku di
                      Republik Indonesia.
                    </p>
                    <p>
                      Apabila terdapat ketentuan dalam dokumen ini yang dinyatakan
                      tidak berlaku berdasarkan keputusan pihak yang berwenang,
                      ketentuan lainnya tetap berlaku sepanjang tidak bertentangan
                      dengan peraturan perundang-undangan.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section className="mb-10">
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    12. Perubahan Ketentuan
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Kementerian Kebudayaan dapat mengubah atau memperbarui
                      Ketentuan Penggunaan ini sewaktu-waktu sesuai dengan
                      perkembangan layanan, kebijakan pengelolaan portal, dan
                      peraturan perundang-undangan.
                    </p>
                    <p>
                      Versi terbaru akan ditampilkan pada halaman ini dengan
                      mencantumkan tanggal pembaruan terakhir.
                    </p>
                  </div>
                </section>

                <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

                <section>
                  <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-4">
                    13. Kontak
                  </h2>
                  <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>
                      Untuk pertanyaan atau informasi lebih lanjut mengenai
                      penggunaan Portal IPK, pengunjung dapat menghubungi:
                    </p>
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 p-5">
                      <p className="font-semibold text-zinc-900 dark:text-white">
                        Pusat Data dan Teknologi Informasi
                      </p>
                      <p className="text-zinc-800 dark:text-zinc-200">
                        Kementerian Kebudayaan Republik Indonesia
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
                      Dengan mengakses dan menggunakan Portal IPK, pengunjung
                      diharapkan memahami dan mematuhi Ketentuan Penggunaan ini.
                    </p>
                  </div>
                </section>
              </article>
            </div>

            <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-semibold">
                  <Info size={18} className="text-[#B8860B]" />
                  Dokumen Legal
                </div>
                <nav className="space-y-1">
                  <Link
                    href="/pages/kebijakan-privasi"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-[#B8860B] transition"
                  >
                    <Shield size={16} className="text-[#B8860B] shrink-0" />
                    Kebijakan Privasi
                  </Link>
                  <Link
                    href="/pages/ketentuan-penggunaan"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium bg-[#B8860B]/10 text-[#B8860B]"
                  >
                    <FileText size={16} className="shrink-0" />
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