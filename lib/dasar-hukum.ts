import { prisma } from "@/lib/prisma";

export type DasarHukumItem = {
  id: number;
  nomor_urut: number;
  badge: string;
  judul: string;
  deskripsi: string | null;
  file_url: string;
};

/** Ambil dokumen aktif, diurutkan nomor_urut naik */
export async function getDasarHukumDocuments(): Promise<DasarHukumItem[]> {
  const rows = await prisma.dasar_hukum.findMany({
    where: { is_active: true },
    orderBy: [{ nomor_urut: "asc" }, { id: "asc" }],
    select: {
      id: true,
      nomor_urut: true,
      badge: true,
      judul: true,
      deskripsi: true,
      file_url: true,
    },
  });
  return rows;
}
