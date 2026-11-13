function fileNameOnly(path: string): string {
  const clean = path.replace(/\\/g, "/").split("?")[0];
  const parts = clean.split("/").filter(Boolean);
  return parts[parts.length - 1] || clean;
}

/** Sampul → /images/publications/... */
export function coverUrl(image_path: string | null | undefined): string | null {
  if (!image_path) return null;
  const raw = image_path.trim();
  if (!raw) return null;

  // URL absolut biarkan
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

  // Sudah path baru yang benar
  if (raw.startsWith("/images/publications/")) return raw;

  // Path lama PHP / variasi lain → ambil nama file saja
  // contoh: assets/img/publications/x.jpg, /assets/img/publications/x.jpg, img/publications/x.jpg
  const name = fileNameOnly(raw);
  if (!name) return null;
  return `/images/publications/${name}`;
}

/** PDF → /docs/publikasi/... */
export function pdfUrl(download_link: string | null | undefined): string | null {
  if (!download_link) return null;
  const raw = download_link.trim();
  if (!raw) return null;

  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/docs/publikasi/")) return raw;

  const name = fileNameOnly(raw);
  if (!name) return null;
  return `/docs/publikasi/${name}`;
}