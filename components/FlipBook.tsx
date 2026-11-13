"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PageFlip } from "page-flip";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

type Props = {
  pdfUrl: string;
  title: string;
  year: number;
  typeLabel: string;
  coverImage?: string | null;
};

export default function FlipBook({ pdfUrl }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<InstanceType<typeof PageFlip> | null>(null);

  const [phase, setPhase] = useState<"choice" | "loading" | "ready" | "error">(
    "choice"
  );
  const [totalPdf, setTotalPdf] = useState<number | null>(null);
  const [pageLabel, setPageLabel] = useState("– / –");
  const [zoom, setZoom] = useState(1);
  const [isFs, setIsFs] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!pdfUrl) return;
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const doc = await pdfjs.getDocument({ url: pdfUrl }).promise;
        if (!cancelled) setTotalPdf(doc.numPages);
      } catch (e) {
        console.error("[FlipBook meta]", e);
        if (!cancelled) setTotalPdf(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  const destroy = () => {
    try {
      flipRef.current?.destroy();
    } catch {
      /* ignore */
    }
    flipRef.current = null;
    if (hostRef.current) hostRef.current.innerHTML = "";
  };

  useEffect(() => () => destroy(), []);

  const start = useCallback(
    async (maxPages: number | "all") => {
      if (!pdfUrl) {
        setErrorMsg("URL PDF kosong");
        setPhase("error");
        return;
      }

      setPhase("loading");
      setErrorMsg("");
      destroy();

      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const doc = await pdfjs.getDocument({ url: pdfUrl }).promise;
        const limit =
          maxPages === "all" ? doc.numPages : Math.min(maxPages, doc.numPages);

        if (!hostRef.current) return;

        // Hanya halaman dari PDF, tanpa sampul depan/belakang buatan sendiri
        const pageNodes: HTMLElement[] = [];

        for (let i = 1; i <= limit; i++) {
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 1.8 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;

          const wrap = document.createElement("div");
          wrap.className = "fb-page fb-sheet";
          wrap.appendChild(canvas);
          pageNodes.push(wrap);
        }

        pageNodes.forEach((n) => hostRef.current!.appendChild(n));

        const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
        // lebar dibatasi agar 2 halaman + shadow tidak memunculkan scrollbar samping
        const w = Math.min(460, Math.floor(vw * 0.42));
        const h = Math.round(w * 1.4);

        const pageFlip = new PageFlip(hostRef.current, {
          width: w,
          height: h,
          size: "stretch",
          minWidth: 280,
          maxWidth: 640,
          minHeight: 400,
          maxHeight: 900,
          drawShadow: true,
          flippingTime: 700,
          usePortrait: true,
          autoSize: true,
          maxShadowOpacity: 0.3,
          showCover: false,
          mobileScrollSupport: true,
          useMouseEvents: true,
        });

        pageFlip.loadFromHTML(hostRef.current.querySelectorAll(".fb-page"));

        pageFlip.on("flip", () => {
          setPageLabel(
            `${pageFlip.getCurrentPageIndex() + 1} / ${pageFlip.getPageCount()}`
          );
        });
        setPageLabel(`1 / ${pageFlip.getPageCount()}`);
        flipRef.current = pageFlip;
        setPhase("ready");
      } catch (e) {
        console.error("[FlipBook render]", e);
        setErrorMsg(
          e instanceof Error ? e.message : "Gagal memuat pratinjau PDF."
        );
        setPhase("error");
      }
    },
    [pdfUrl]
  );

  const goPrev = () => flipRef.current?.flipPrev();
  const goNext = () => flipRef.current?.flipNext();

  const changeZoom = (d: number) => {
    setZoom((z) => {
      const next = Math.min(1.35, Math.max(0.75, +(z + d).toFixed(2)));
      const shell = document.getElementById("fb-zoom-shell");
      if (shell) {
        shell.style.transform = `scale(${next})`;
        shell.style.transformOrigin = "center top";
      }
      const sec = document.getElementById("flipbook-section");
      if (sec) sec.style.overflowX = "hidden";
      return next;
    });
  };

  const toggleFs = async () => {
    const el = document.getElementById("flipbook-section");
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.();
      setIsFs(true);
    } else {
      await document.exitFullscreen?.();
      setIsFs(false);
    }
  };

  return (
    <div id="flipbook-section" className="space-y-4 overflow-x-hidden max-w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Buku Digital Interaktif
        </h2>
        {phase === "ready" && (
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            <button type="button" onClick={goPrev} className="fb-tool">
              <ChevronLeft size={16} /> Sebelumnya
            </button>
            <span className="px-2 tabular-nums text-zinc-500">{pageLabel}</span>
            <button type="button" onClick={goNext} className="fb-tool">
              Berikutnya <ChevronRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => changeZoom(-0.1)}
              className="fb-icon"
              aria-label="Perkecil"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs text-zinc-500 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => changeZoom(0.1)}
              className="fb-icon"
              aria-label="Perbesar"
            >
              <ZoomIn size={16} />
            </button>
            <button
              type="button"
              onClick={toggleFs}
              className="fb-icon"
              aria-label="Layar penuh"
            >
              {isFs ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        )}
      </div>

      {phase === "choice" && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#B8860B]/15 text-[#B8860B] flex items-center justify-center mb-4">
            <BookOpen size={28} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Pilih Tampilan Buku</h3>
          <p className="text-sm text-zinc-500 mb-6">
            {totalPdf != null ? (
              <>
                Dokumen ini memiliki <strong>{totalPdf} halaman</strong>.
              </>
            ) : (
              "Memeriksa jumlah halaman PDF…"
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              disabled={totalPdf === null}
              onClick={() => start(20)}
              className="fb-choice disabled:opacity-50"
            >
              <span className="font-semibold text-sm block">
                {totalPdf != null && totalPdf <= 20
                  ? `Semua halaman (${totalPdf})`
                  : "20 halaman pertama"}
              </span>
              <span className="text-xs text-zinc-500">
                Lebih cepat · pratinjau
              </span>
            </button>
            {!(totalPdf != null && totalPdf <= 20) && (
              <button
                type="button"
                disabled={totalPdf === null}
                onClick={() => start("all")}
                className="fb-choice border-[#B8860B]/40 bg-[#B8860B]/10 disabled:opacity-50"
              >
                <span className="font-semibold text-sm text-[#B8860B] block">
                  {totalPdf != null
                    ? `Seluruh halaman (${totalPdf})`
                    : "Seluruh halaman"}
                </span>
                <span className="text-xs text-zinc-500">Bisa lebih lama</span>
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "loading" && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 py-16 flex flex-col items-center gap-3 text-zinc-500">
          <Loader2 className="animate-spin text-[#B8860B]" size={28} />
          <p className="text-sm">Menyiapkan halaman buku…</p>
        </div>
      )}

      {phase === "error" && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-8 text-center">
          <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">
            Pratinjau tidak tersedia
          </h3>
          <p className="text-sm text-red-600/80 dark:text-red-300/80 mb-4">
            {errorMsg}
          </p>
          <button
            type="button"
            onClick={() => setPhase("choice")}
            className="text-sm font-medium text-[#B8860B] hover:underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      <div
        className={`w-full overflow-hidden py-6 ${
          phase === "ready" ? "" : "hidden"
        }`}
      >
        <div
          id="fb-zoom-shell"
          className="w-full max-w-full min-h-[520px] flex justify-center transition-transform duration-200 origin-top overflow-hidden"
        >
          <div ref={hostRef} className="max-w-full" />
        </div>
      </div>

      <style jsx global>{`
        #flipbook-section {
          overflow-x: hidden;
          max-width: 100%;
        }
        #fb-zoom-shell {
          overflow: hidden !important;
          max-width: 100%;
        }
        .stf__parent,
        .stf__wrapper,
        .stf__block {
          max-width: 100% !important;
        }
        #flipbook-section * {
          scrollbar-width: none;
        }
        #flipbook-section *::-webkit-scrollbar {
          display: none;
        }
        .fb-tool {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.35rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #e4e4e7;
          font-size: 0.875rem;
        }
        .dark .fb-tool {
          border-color: #3f3f46;
        }
        .fb-icon {
          padding: 0.35rem;
          border-radius: 0.5rem;
          border: 1px solid #e4e4e7;
        }
        .dark .fb-icon {
          border-color: #3f3f46;
        }
        .fb-choice {
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          border: 1px solid #e4e4e7;
          background: #fff;
          text-align: left;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease,
            background-color 0.25s ease;
        }
        .dark .fb-choice {
          border-color: #3f3f46;
          background: #18181b;
        }
        .fb-choice:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 24px -10px rgba(184, 134, 11, 0.55);
          border-color: #b8860b;
        }
        .fb-choice:active:not(:disabled) {
          transform: translateY(-1px) scale(0.98);
        }
        .fb-choice:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.35);
        }
        .fb-page {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .fb-sheet {
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fb-sheet canvas {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .stf__parent {
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}