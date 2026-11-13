import * as XLSX from "xlsx";
import JSZip from "jszip";
import { autoColWidths, type NasResponse } from "./types";

function buildNasionalReadme(tahun: number, metodologi: string) {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const pageUrl = "https://ipk.kemenbud.go.id/pages/hasil-nasional";

  return [
    "README.txt",
    "================================================================================",
    "IDENTITAS DATASET",
    "================================================================================",
    `Nama dataset       : IPK Nasional ${tahun}`,
    `Periode data       : ${tahun}`,
    `Metodologi         : ${metodologi || "—"}`,
    "Format file        : xlsx (dikemas dalam ZIP bersama README.txt)",
    `Tanggal diunduh    : ${today}`,
    "",
    "================================================================================",
    "PRODUSEN DAN SUMBER DATA",
    "================================================================================",
    "Instansi           : Kementerian Kebudayaan Republik Indonesia",
    "Portal             : https://ipk.kemenbud.go.id",
    `Halaman dataset    : ${pageUrl}`,
    "",
    "================================================================================",
    "ISI FILE EXCEL",
    "================================================================================",
    "Sheet Ringkasan  : skor IPK komposit, metodologi, daftar dimensi",
    "Sheet Dimensi    : skor per dimensi",
    "Sheet Indikator  : rata-rata nasional tiap indikator",
    "Sheet Tren       : skor IPK nasional per tahun",
    "",
    "================================================================================",
    "PENCANTUMAN SUMBER",
    "================================================================================",
    "Sumber: Kementerian Kebudayaan Republik Indonesia,",
    `IPK Nasional ${tahun}, diakses pada ${today}, melalui ${pageUrl}.`,
    "",
    "================================================================================",
    "LISENSI DAN KETENTUAN",
    "================================================================================",
    "Dataset dapat digunakan untuk keperluan penelitian, pendidikan, analisis,",
    "dan pemanfaatan informasi publik sesuai ketentuan yang berlaku.",
    "",
    "Pengguna wajib mencantumkan sumber data dan tidak boleh menyajikan hasil",
    "pengolahan seolah-olah merupakan publikasi resmi kementerian.",
    "",
    "Ketentuan penggunaan mengikuti kebijakan resmi yang berlaku pada portal.",
    "Baca: https://ipk.kemenbud.go.id/pages/ketentuan-penggunaan",
    "",
  ].join("\n");
}

export async function exportNasionalZip(data: NasResponse) {
  const tahun = data.year;
  const metodologi = data.metodologi || "—";

  const metaRows: (string | number)[][] = [
    ["IPK Nasional"],
    ["Tahun", tahun],
    ["Metodologi", metodologi],
    ["Skor IPK komposit", data.skor_ipk ?? "—"],
    ["Sumber", "ipk.kemenbud.go.id"],
    ["Diunduh", new Date().toLocaleString("id-ID")],
    [],
  ];

  const dimRows: (string | number | null)[][] = [
    ["No", "Dimensi", "Skor"],
    ...data.dimensi.map((d) => [d.id, d.nama, d.nilai ?? "—"]),
  ];

  const indRows: (string | number | null)[][] = [
    ["Dimensi", "Kode", "Nama Indikator", "Nilai", "Sumber"],
  ];
  for (const g of data.grouped || []) {
    for (const ind of g.indikator) {
      indRows.push([
        g.nama,
        ind.kode,
        ind.nama,
        ind.nilai ?? "—",
        ind.sumber || "—",
      ]);
    }
  }

  const trenRows: (string | number | null)[][] = [
    ["Tahun", "Skor IPK"],
    ...data.tren.map((t) => [t.tahun, t.skor_ipk ?? "—"]),
  ];

  const ringkasData = [...metaRows, ["Ringkasan Dimensi"], [], ...dimRows];
  const dimData = [["Skor Dimensi"], [], ...dimRows];
  const indData = [["Rincian Indikator"], [], ...indRows];
  const trenData = [["Tren IPK Nasional"], [], ...trenRows];

  const sheetRingkas = XLSX.utils.aoa_to_sheet(ringkasData);
  const sheetDimensi = XLSX.utils.aoa_to_sheet(dimData);
  const sheetIndikator = XLSX.utils.aoa_to_sheet(indData);
  const sheetTren = XLSX.utils.aoa_to_sheet(trenData);

  sheetRingkas["!cols"] = autoColWidths(ringkasData);
  sheetDimensi["!cols"] = autoColWidths(dimData);
  sheetIndikator["!cols"] = autoColWidths(indData);
  sheetTren["!cols"] = autoColWidths(trenData);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheetRingkas, "Ringkasan");
  XLSX.utils.book_append_sheet(wb, sheetDimensi, "Dimensi");
  XLSX.utils.book_append_sheet(wb, sheetIndikator, "Indikator");
  XLSX.utils.book_append_sheet(wb, sheetTren, "Tren");

  const xlsxBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  const zip = new JSZip();
  zip.file(`IPK_Nasional_${tahun}.xlsx`, xlsxBuffer);
  zip.file("README.txt", buildNasionalReadme(tahun, metodologi));

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `IPK_Nasional_${tahun}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
