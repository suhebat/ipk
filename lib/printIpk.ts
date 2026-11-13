export type PrintIpkOptions = {
  year: number;
  title: string;
  metodologi?: string;
  /** "dimensi" = sembunyikan blok .print-hide-indikator */
  scope: "dimensi" | "semua";
};

type CollapseSnapshot = {
  el: HTMLElement;
  className: string;
  display: string;
  visibility: string;
  height: string;
  overflow: string;
};

/** Jeda agar DOM sempat berubah sebelum dialog print terbuka */
const PRINT_DELAY_MS = 350;
/** Batas waktu restore jika event afterprint tidak terpanggil */
const FALLBACK_RESTORE_MS = 2000;

/**
 * Cetak area #ipk-print-root (hasil nasional / provinsi).
 * Memakai class body.printing-scoped agar hanya root yang terlihat.
 *
 * Akordion: dibuka hanya untuk proses print, lalu dikembalikan ke state layar.
 */
export async function printIpkPage(opts: PrintIpkOptions): Promise<void> {
  if (typeof window === "undefined") return;

  const body = document.body;
  const snapshots: CollapseSnapshot[] = [];
  let restored = false;
  let fallbackTimer: number | undefined;

  body.classList.add("printing-scoped");
  body.classList.toggle("print-scope-dimensi", opts.scope === "dimensi");

  // Buka panel collapse HANYA selama print (lalu restore)
  if (opts.scope === "semua") {
    document
      .querySelectorAll<HTMLElement>("#ipk-print-root [data-print-collapse]")
      .forEach((el) => {
        snapshots.push({
          el,
          className: el.className,
          display: el.style.display,
          visibility: el.style.visibility,
          height: el.style.height,
          overflow: el.style.overflow,
        });
        el.classList.remove("hidden");
        el.style.display = "block";
        el.style.visibility = "visible";
        el.style.height = "auto";
        el.style.overflow = "visible";
      });
  }

  const restore = () => {
    if (restored) return;
    restored = true;

    window.removeEventListener("afterprint", restore);
    if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);

    for (const s of snapshots) {
      s.el.className = s.className;
      s.el.style.display = s.display;
      s.el.style.visibility = s.visibility;
      s.el.style.height = s.height;
      s.el.style.overflow = s.overflow;
    }
    snapshots.length = 0;

    body.classList.remove("printing-scoped", "print-scope-dimensi");
  };

  window.addEventListener("afterprint", restore);

  try {
    await new Promise((r) => window.setTimeout(r, PRINT_DELAY_MS));
    window.print();
  } catch (err) {
    restore();
    throw err;
  } finally {
    // Fallback jika afterprint tidak terpanggil
    if (!restored) {
      fallbackTimer = window.setTimeout(restore, FALLBACK_RESTORE_MS);
    }
  }
}
