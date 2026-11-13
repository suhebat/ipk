"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { CheckCircle2, ListChecks, Loader2 } from "lucide-react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const initialForm = {
  nama_pemohon: "",
  email: "",
  telepon: "",
  instansi: "",
  jabatan: "",
  jenis_pemohon: "",
  jenis_data: "",
  wilayah: "",
  detail_wilayah: "",
  format_data: "",
  tujuan: "",
  detail_permintaan: "",
  referensi: "",
};

export default function PermohonanDataPage() {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const [form, setForm] = useState(initialForm);
  const [tahun, setTahun] = useState<string[]>([]);
  const [tahunOptions, setTahunOptions] = useState<string[]>([
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
  ]);
  const [loadingTahun, setLoadingTahun] = useState(true);

  const [lampiran, setLampiran] = useState<File | null>(null);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNo, setSuccessNo] = useState<string | null>(null);

  const uraianCount = form.detail_permintaan.length;

  // Mengambil daftar tahun data secara dinamis dari database saat komponen dimuat
  useEffect(() => {
    async function loadAvailableYears() {
      try {
        const res = await fetch("/api/tahun-tersedia");
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setTahunOptions(json.data);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data tahun:", err);
      } finally {
        setLoadingTahun(false);
      }
    }
    loadAvailableYears();
  }, []);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTahun = (y: string) => {
    setTahun((prev) =>
      prev.includes(y) ? prev.filter((t) => t !== y) : [...prev, y]
    );
  };

  const resetAll = () => {
    setForm(initialForm);
    setTahun([]);
    setLampiran(null);
    setAgree(false);
    setError(null);
    setSuccessNo(null);
    setTurnstileToken("");
    turnstileRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agree) {
      setError("Anda harus menyetujui pernyataan sebelum mengirim permohonan.");
      return;
    }
    if (tahun.length === 0) {
      setError("Pilih minimal satu tahun data.");
      return;
    }
    if (!turnstileToken) {
      setError("Selesaikan verifikasi keamanan terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      tahun.forEach((y) => fd.append("tahun[]", y));
      if (lampiran) fd.append("lampiran", lampiran);
      fd.append("turnstileToken", turnstileToken);

      const res = await fetch("/api/permohonan-data", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") {
        throw new Error(json.message || "Gagal mengirim permohonan.");
      }
      setSuccessNo(json.nomor_permohonan || "REQ-IPK-XXXX");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
      setTurnstileToken("");
      turnstileRef.current?.reset();
    }
  };

  const fieldCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40";
  const labelCls =
    "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5";

  if (successNo) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />
        <PageHeader
          eyebrow="Layanan IPK"
          title="Permohonan Data"
          description="Ajukan permohonan data IPK sesuai kebutuhan Anda."
          breadcrumbs={[
            { label: "Layanan", href: "#" },
            { label: "Permohonan Data" },
          ]}
        />
        <section className="py-16">
          <div className="max-w-lg mx-auto px-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-5">
              <CheckCircle2 className="text-emerald-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Permohonan Berhasil Dikirim
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              Terima kasih. Permohonan Anda telah dicatat dan akan diverifikasi
              oleh pengelola layanan data.
            </p>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5 mb-6">
              <p className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                Nomor Permohonan
              </p>
              <p className="text-xl font-bold text-[#B8860B]">{successNo}</p>
              <p className="text-xs text-zinc-500 mt-2">
                Simpan nomor ini untuk keperluan komunikasi atau tindak lanjut.
              </p>
            </div>
            <Button
              variant="gold"
              className="!px-6 !py-3 text-sm"
              onClick={resetAll}
            >
              Buat Permohonan Baru
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <PageHeader
        eyebrow="Layanan IPK"
        title="Permohonan Data"
        description="Ajukan permohonan data IPK sesuai kebutuhan Anda dengan melengkapi informasi pemohon, rincian data, dan tujuan penggunaannya."
        breadcrumbs={[
          { label: "Layanan", href: "#" },
          { label: "Permohonan Data" },
        ]}
      />

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 flex gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-[#B8860B]/15 flex items-center justify-center text-[#B8860B]">
                  <ListChecks size={22} />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">
                    Formulir Permohonan Data
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Silakan lengkapi informasi berikut dengan benar. Pastikan
                    data yang dimohon belum tersedia di halaman Hasil Nasional,
                    Hasil Provinsi, atau Dataset IPK.
                  </p>
                </div>
              </div>

              {/* 1. Data Pemohon */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-5">
                  <span className="w-8 h-8 rounded-lg bg-[#B8860B] text-white text-sm font-bold flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h2 className="font-semibold text-lg">Data Pemohon</h2>
                    <p className="text-sm text-zinc-500">
                      Informasi identitas pemohon data.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="nama_pemohon"
                      value={form.nama_pemohon}
                      onChange={onChange}
                      required
                      className={fieldCls}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Alamat Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      required
                      className={fieldCls}
                      placeholder="nama@email.com"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telepon"
                      value={form.telepon}
                      onChange={onChange}
                      required
                      className={fieldCls}
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Instansi / Institusi{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="instansi"
                      value={form.instansi}
                      onChange={onChange}
                      required
                      className={fieldCls}
                      placeholder="Nama instansi / universitas"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Jabatan / Status</label>
                    <input
                      name="jabatan"
                      value={form.jabatan}
                      onChange={onChange}
                      className={fieldCls}
                      placeholder="Contoh: Peneliti, Mahasiswa"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Jenis Pemohon <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="jenis_pemohon"
                      value={form.jenis_pemohon}
                      onChange={onChange}
                      required
                      className={fieldCls}
                    >
                      <option value="" disabled>
                        Pilih jenis pemohon
                      </option>
                      <option value="pemerintah">Pemerintah</option>
                      <option value="akademisi">Akademisi / Peneliti</option>
                      <option value="mahasiswa">Mahasiswa / Pelajar</option>
                      <option value="swasta">Swasta</option>
                      <option value="masyarakat">Masyarakat Umum</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Data yang Dimohon */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-5">
                  <span className="w-8 h-8 rounded-lg bg-[#B8860B] text-white text-sm font-bold flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h2 className="font-semibold text-lg">Data yang Dimohon</h2>
                    <p className="text-sm text-zinc-500">
                      Tentukan data IPK yang Anda perlukan.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>
                      Jenis Data <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="jenis_data"
                      value={form.jenis_data}
                      onChange={onChange}
                      required
                      className={fieldCls}
                    >
                      <option value="" disabled>
                        Pilih jenis data
                      </option>
                      <option value="IPK Nasional">IPK Nasional</option>
                      <option value="IPK Provinsi">IPK Provinsi</option>
                      <option value="Skor Dimensi">Skor Dimensi</option>
                      <option value="Indikator">Indikator</option>
                      <option value="Metadata">Metadata Indikator</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>
                      Wilayah <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="wilayah"
                      value={form.wilayah}
                      onChange={onChange}
                      required
                      className={fieldCls}
                    >
                      <option value="" disabled>
                        Pilih wilayah
                      </option>
                      <option value="nasional">Nasional</option>
                      <option value="provinsi">Provinsi</option>
                      <option value="kab-kota">Kabupaten / Kota</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Detail Wilayah</label>
                    <input
                      name="detail_wilayah"
                      value={form.detail_wilayah}
                      onChange={onChange}
                      className={fieldCls}
                      placeholder="Contoh: Jawa Barat, DKI Jakarta"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Format Data <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="format_data"
                      value={form.format_data}
                      onChange={onChange}
                      required
                      className={fieldCls}
                    >
                      <option value="" disabled>
                        Pilih format
                      </option>
                      <option value="xlsx">Excel (XLSX)</option>
                      <option value="csv">CSV</option>
                      <option value="pdf">PDF</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  {/* Checkbox Pilihan Tahun Dinamis */}
                  <div className="sm:col-span-2">
                    <label className={labelCls}>
                      Tahun Data <span className="text-red-500">*</span>
                    </label>
                    {loadingTahun ? (
                      <div className="flex items-center gap-2 text-xs text-zinc-400 py-1">
                        <Loader2 size={14} className="animate-spin" /> Menyesuaikan ketersediaan tahun...
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {tahunOptions.map((y) => (
                          <label
                            key={y}
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm cursor-pointer transition select-none ${
                              tahun.includes(y)
                                ? "border-[#B8860B] bg-[#B8860B]/10 text-[#B8860B] font-semibold"
                                : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="accent-[#B8860B] cursor-pointer"
                              checked={tahun.includes(y)}
                              onChange={() => toggleTahun(y)}
                            />
                            {y}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Tujuan Penggunaan */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-5">
                  <span className="w-8 h-8 rounded-lg bg-[#B8860B] text-white text-sm font-bold flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h2 className="font-semibold text-lg">Tujuan Penggunaan</h2>
                    <p className="text-sm text-zinc-500">
                      Jelaskan tujuan penggunaan data yang dimohon.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>
                      Tujuan Penggunaan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tujuan"
                      value={form.tujuan}
                      onChange={onChange}
                      required
                      className={fieldCls}
                    >
                      <option value="" disabled>
                        Pilih tujuan penggunaan
                      </option>
                      <option value="penelitian">Penelitian</option>
                      <option value="perencanaan">
                        Perencanaan Pembangunan
                      </option>
                      <option value="analisis">Analisis / Kajian</option>
                      <option value="pendidikan">Pendidikan</option>
                      <option value="publikasi">Publikasi</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>
                      Uraian Kebutuhan Data{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="detail_permintaan"
                      value={form.detail_permintaan}
                      onChange={onChange}
                      required
                      rows={6}
                      maxLength={1000}
                      className={fieldCls}
                      placeholder="Jelaskan secara singkat data yang dibutuhkan dan bagaimana data tersebut akan digunakan."
                    />
                    <div className="flex justify-between text-xs text-zinc-500 mt-1.5">
                      <span>Jelaskan kebutuhan data secara spesifik.</span>
                      <span>{uraianCount} / 1000</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>
                      Referensi / Nomor surat (opsional)
                    </label>
                    <input
                      name="referensi"
                      value={form.referensi}
                      onChange={onChange}
                      className={fieldCls}
                      placeholder="Nomor surat pengantar, jika ada"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Lampiran (PDF/DOC, maks. 5 MB)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        setLampiran(e.target.files?.[0] ?? null)
                      }
                      className="block w-full text-sm text-zinc-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#B8860B]/15 file:text-[#B8860B] file:font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Verifikasi Keamanan */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
                <label className={labelCls}>
                  Verifikasi Keamanan <span className="text-red-500">*</span>
                </label>
                <Turnstile
                  ref={turnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  options={{ theme: "auto", language: "id" }}
                  onSuccess={(token) => {
                    setError(null);
                    setTurnstileToken(token);
                  }}
                  onExpire={() => setTurnstileToken("")}
                  onError={() => {
                    setTurnstileToken("");
                    setError(
                      "Verifikasi keamanan gagal dimuat. Muat ulang halaman atau nonaktifkan adblock."
                    );
                  }}
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 accent-[#B8860B]"
                />
                <span>
                  Saya menyatakan bahwa data yang dimohon akan digunakan sesuai
                  tujuan yang dicantumkan dan tidak akan disalahgunakan.
                </span>
              </label>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Reset
                </button>
                <Button
                  type="submit"
                  variant="gold"
                  className="!px-6 !py-2.5 text-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Mengirim…
                    </span>
                  ) : (
                    "Kirim Permohonan →"
                  )}
                </Button>
              </div>
            </form>

            <aside className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
                  Proses
                </p>
                <h3 className="font-semibold mb-4">Alur Permohonan</h3>
                <ol className="space-y-4">
                  {[
                    {
                      n: "1",
                      t: "Isi formulir",
                      d: "Lengkapi informasi pemohon dan kebutuhan data.",
                      c: "bg-blue-500",
                    },
                    {
                      n: "2",
                      t: "Verifikasi",
                      d: "Permohonan diperiksa oleh pengelola layanan data.",
                      c: "bg-emerald-500",
                    },
                    {
                      n: "3",
                      t: "Tindak lanjut",
                      d: "Pemohon mendapat informasi status via email.",
                      c: "bg-amber-500",
                    },
                  ].map((s) => (
                    <li key={s.n} className="flex gap-3">
                      <span
                        className={`shrink-0 w-7 h-7 rounded-full ${s.c} text-white text-xs font-bold flex items-center justify-center`}
                      >
                        {s.n}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{s.t}</p>
                        <p className="text-xs text-zinc-500">{s.d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
                  Butuh Bantuan?
                </p>
                <h3 className="font-semibold mb-2">Hubungi Kami</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Jika mengalami kendala dalam pengajuan, silakan menghubungi
                  layanan IPK.
                </p>
                <Link
                  href="/pages/hubungi-kami"
                  className="text-sm font-semibold text-[#B8860B] hover:underline inline-flex items-center gap-1"
                >
                  Hubungi layanan →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}