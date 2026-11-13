"use client";

import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";

import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const initial = {
  nama: "",
  email: "",
  telepon: "",
  instansi: "",
  kategori: "",
  subjek: "",
  pesan: "",
};

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export default function HubungiKamiPage() {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const [form, setForm] = useState(initial);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<string | null>(null);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const resetAll = () => {
    setForm(initial);
    setAgree(false);
    setError(null);
    setTicket(null);
    setTurnstileToken("");
    turnstileRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agree) {
      setError("Anda harus menyetujui pernyataan sebelum mengirim pesan.");
      return;
    }
    if (!turnstileToken) {
      setError("Selesaikan verifikasi keamanan terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") {
        throw new Error(json.message || "Gagal mengirim pesan.");
      }
      setTicket(json.nomor_tiket || "IPK-XXXX");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
      // Token hanya bisa dipakai sekali, jadi widget selalu direset setelah submit
      setTurnstileToken("");
      turnstileRef.current?.reset();
    }
  };

  const fieldCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40";
  const labelCls =
    "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <PageHeader
        eyebrow="Layanan IPK"
        title="Hubungi Kami"
        description="Hubungi pengelola portal IPK untuk menyampaikan pertanyaan, masukan, atau memperoleh informasi lebih lanjut mengenai layanan dan data pembangunan kebudayaan."
        breadcrumbs={[
          { label: "Layanan", href: "#" },
          { label: "Hubungi Kami" },
        ]}
      />

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">
            <aside className="space-y-5 lg:sticky lg:top-24">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
                  Informasi Kontak
                </p>
                <h2 className="text-xl font-bold mb-2">Layanan Informasi IPK</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Saluran komunikasi bagi pengguna yang memerlukan keterangan
                  terkait portal IPK.
                </p>
              </div>

              {[
                {
                  icon: Mail,
                  label: "Email",
                  body: (
                    <a
                      href="mailto:ipk@kemenbud.go.id"
                      className="text-[#B8860B] hover:underline"
                    >
                      ipk@kemenbud.go.id
                    </a>
                  ),
                },
                {
                  icon: Phone,
                  label: "Telepon",
                  body: (
                    <a
                      href="tel:+622130620100"
                      className="text-[#B8860B] hover:underline"
                    >
                      +62 21 3062 0100
                    </a>
                  ),
                },
                {
                  icon: MapPin,
                  label: "Alamat",
                  body: (
                    <p className="text-sm leading-relaxed">
                      PUSDATIN KEMENBUD
                      <br />
                      Grha Kebudayaan, Jl. RE Martadinata KM. 15.5, Cipayung,
                      <br />
                      Kec. Ciputat, Kota Tangerang Selatan, Banten 15411
                    </p>
                  ),
                },
                {
                  icon: Clock,
                  label: "Jam Layanan",
                  body: (
                    <p className="text-sm">
                      Senin–Jumat
                      <br />
                      08.00–16.00 WIB
                    </p>
                  ),
                },
              ].map(({ icon: Icon, label, body }) => (
                <div
                  key={label}
                  className="flex gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-[#B8860B]/15 text-[#B8860B] flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-400 mb-0.5">
                      {label}
                    </p>
                    {body}
                  </div>
                </div>
              ))}
            </aside>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-8">
              {ticket ? (
                <div className="text-center py-6">
                  <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-emerald-600" size={28} />
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    Pesan Berhasil Dikirim
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5">
                    Terima kasih telah menghubungi kami. Pesan Anda telah
                    dicatat dan akan ditindaklanjuti.
                  </p>
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 px-4 py-3 mb-5 inline-block">
                    <p className="text-xs text-zinc-500">
                      Nomor Referensi Tiket
                    </p>
                    <p className="text-lg font-bold text-[#B8860B]">{ticket}</p>
                  </div>
                  <div>
                    <Button
                      variant="gold"
                      className="!px-5 !py-2.5 text-sm"
                      onClick={resetAll}
                    >
                      Kirim Pesan Baru
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1">
                    Kirim Pesan
                  </p>
                  <h2 className="text-xl font-bold mb-1">
                    Ada yang ingin ditanyakan?
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                    Isi formulir berikut dan sampaikan pertanyaan atau pesan
                    Anda kepada kami.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="nama"
                          value={form.nama}
                          onChange={onChange}
                          required
                          className={fieldCls}
                          placeholder="Nama Anda"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>
                          Email <span className="text-red-500">*</span>
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
                        <label className={labelCls}>Telepon</label>
                        <input
                          type="tel"
                          name="telepon"
                          value={form.telepon}
                          onChange={onChange}
                          className={fieldCls}
                          placeholder="08xxxxxxxxxx"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Instansi</label>
                        <input
                          name="instansi"
                          value={form.instansi}
                          onChange={onChange}
                          className={fieldCls}
                          placeholder="Instansi / organisasi"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>
                        Kategori <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="kategori"
                        value={form.kategori}
                        onChange={onChange}
                        required
                        className={fieldCls}
                      >
                        <option value="" disabled>
                          Pilih kategori
                        </option>
                        <option value="data">Data & Hasil</option>
                        <option value="metodologi">
                          Metodologi & Indikator
                        </option>
                        <option value="publikasi">Publikasi</option>
                        <option value="permohonan-data">
                          Permohonan Data
                        </option>
                        <option value="website">Website</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>
                        Subjek <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="subjek"
                        value={form.subjek}
                        onChange={onChange}
                        required
                        maxLength={150}
                        className={fieldCls}
                        placeholder="Tuliskan subjek pesan"
                      />
                    </div>

                    <div>
                      <label className={labelCls}>
                        Pesan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="pesan"
                        value={form.pesan}
                        onChange={onChange}
                        required
                        rows={6}
                        maxLength={1500}
                        className={fieldCls}
                        placeholder="Tuliskan pertanyaan atau pesan Anda..."
                      />
                      <p className="text-xs text-zinc-500 mt-1 text-right">
                        {form.pesan.length} / 1500
                      </p>
                    </div>

                    <div>
                      <label className={labelCls}>
                        Verifikasi Keamanan{" "}
                        <span className="text-red-500">*</span>
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
                        Saya menyetujui bahwa informasi yang saya berikan dapat
                        digunakan untuk keperluan tindak lanjut atas pesan atau
                        pertanyaan saya.
                      </span>
                    </label>

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3">
                        {error}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 pt-1">
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
                            <Loader2 size={16} className="animate-spin" />{" "}
                            Mengirim…
                          </span>
                        ) : (
                          "Kirim Pesan →"
                        )}
                      </Button>
                    </div>
                  </form>
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