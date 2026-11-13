// app/api/dataset/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const archiver = require("archiver") as any;
import { PassThrough } from "stream";
import { generateDatasetReadme } from "@/lib/generateDatasetReadme";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dataset = (searchParams.get("dataset") as "nasional" | "provinsi") || "nasional";
  const period = searchParams.get("period") || "2024";
  const format = (searchParams.get("format") as "xlsx" | "csv") || "xlsx";
  const userName = searchParams.get("nama") || undefined;
  const userInstitution = searchParams.get("instansi") || undefined;

  // Nama file dataset utama
  const dataFileName = `ipk-${dataset}-${period}.${format}`;
  const dataFilePath = path.join(process.cwd(), "public", "datasets", dataFileName);

  // Buat isi teks README otomatis
  const readmeContent = generateDatasetReadme({
    dataset,
    period,
    format,
    userName,
    userInstitution,
  });

  // Buat stream ZIP menggunakan Archiver
  const archive = archiver("zip", { zlib: { level: 9 } });
  const passThrough = new PassThrough();

  archive.pipe(passThrough);

  // 1. Masukkan file README.txt
  archive.append(readmeContent, { name: "README.txt" });

  // 2. Masukkan file data utama (.xlsx / .csv)
  if (fs.existsSync(dataFilePath)) {
    archive.file(dataFilePath, { name: dataFileName });
  } else {
    // Jika file fisik belum ada, Anda bisa memasukkan buffer hasil auto-generate di sini
    // archive.append(generatedBuffer, { name: dataFileName });
  }

  await archive.finalize();

  const zipFileName = `Dataset-IPK-${dataset}-${period}.zip`;

  // Return file ZIP sebagai stream response
  return new NextResponse(passThrough as any, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${zipFileName}"`,
    },
  });
}