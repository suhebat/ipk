// lib/generateDatasetReadme.ts

export interface ReadmeOptions {
  dataset: "nasional" | "provinsi";
  period: string; // contoh: "2018-2023" atau "2024"
  format: "xlsx" | "csv";
  userName?: string;
  userInstitution?: string;
}

export function generateDatasetReadme({
  dataset,
  period,
  format,
  userName,
  userInstitution,
}: ReadmeOptions): string {
  const isNasional = dataset === "nasional";
  const cakupan = isNasional ? "Nasional" : "38 Provinsi se-Indonesia";
  const title = `DATASET INDEKS PEMBANGUNAN KEBUDAYAAN (IPK) ${
    isNasional ? "NASIONAL" : "PROVINSI"
  } PERIODE ${period.replace("-", "–")}`;

  const downloadDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `================================================================================
${title}
Kementerian Kebudayaan Republik Indonesia
================================================================================

1. DESKRIPSI DATASET
--------------------------------------------------------------------------------
Dataset ini memuat hasil pengukuran Indeks Pembangunan Kebudayaan (IPK) yang
dihitung berdasarkan 7 dimensi dan indikator-indikator pembangunnya.

- Nama Dataset      : IPK ${isNasional ? "Nasional" : "Provinsi"}
- Periode Pengukuran: ${period.replace("-", "–")}
- Cakupan Wilayah   : ${cakupan}
- Format Berkas     : ${format.toUpperCase()}
- Tanggal Pengunduhan: ${downloadDate}
${userName ? `- Diunduh Oleh     : ${userName}${userInstitution ? ` (${userInstitution})` : ""}\n` : ""}
2. STRUKTUR DAN 7 DIMENSI IPK
--------------------------------------------------------------------------------
Nilai IPK dihitung dari rata-rata terbobot/terstandarisasi dari 7 Dimensi:
  1. Dimensi Ekonomi Budaya
  2. Dimensi Pendidikan
  3. Dimensi Ketahanan Sosial Budaya
  4. Dimensi Warisan Budaya
  5. Dimensi Ekspresi Budaya
  6. Dimensi Budaya Literasi
  7. Dimensi Gender

3. METODOLOGI & KOMPARABILITAS DATA
--------------------------------------------------------------------------------
- Periode 2018–2023 : Menggunakan kerangka kerja metodologi awal IPK.
- Periode 2024+     : Menggunakan penyempurnaan metodologi terbaru (pemutakhiran
                      indikator dan penyesuaian bobot/sumber data BPS).
Perhatian: Perbandingan langsung antar-periode dengan metodologi yang berbeda
harus dilakukan dengan memperhatikan catatan perubahan pada dokumen Metodologi.

4. KETENTUAN PENGGUNAAN DAN SITASI (PENGUTIPAN)
--------------------------------------------------------------------------------
Data ini terbuka untuk keperluan penelitian, analisis kebijakan, jurnalisme,
dan kebutuhan akademik. Apabila Anda menggunakan data ini dalam publikasi,
mohon cantumkan sitasi resmi sebagai berikut:

Format Sitasi (APA Style):
Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (${period.slice(-4)}).
  Dataset Indeks Pembangunan Kebudayaan (IPK) ${isNasional ? "Nasional" : "Provinsi"} ${period.replace("-", "–")}.
  Diakses dari Portal Resmi Indeks Pembangunan Kebudayaan Republik Indonesia
  pada ${downloadDate}.

5. KONTAK & INFORMASI LEBIH LANJUT
--------------------------------------------------------------------------------
Dokumentasi lengkap mengenai konsep, definisi operasional, rumus perhitungan,
serta metadata indikator dapat diakses di:
- Website Resmi : https://ipk.kemenbud.go.id
- Halaman Metodologi: https://ipk.kemenbud.go.id/pages/metodologi
- Layanan Permohonan Data: https://ipk.kemenbud.go.id/pages/layanan-data

================================================================================
© ${new Date().getFullYear()} Pusat Data dan Teknologi Informasi Kementerian Kebudayaan Republik Indonesia.
Hak cipta dilindungi undang-undang.
================================================================================
`;
}