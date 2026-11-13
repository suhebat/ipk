"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, Minus, RotateCcw } from "lucide-react";

type ProvinsiItem = {
  id?: number;
  kode: string;
  kodeBps?: string;
  nama: string;
  skorIpk: number | null;
  dimensi?: Record<string, number | null> | null;
};

async function fetchProvinsi(tahun: number) {
  const res = await fetch(`/api/provinsi?tahun=${tahun}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal ambil data provinsi");
  const json = await res.json();
  return (json.data || []) as ProvinsiItem[];
}

function getKategori(skor: number | null, isDark: boolean = false) {
  if (skor == null) {
    return {
      label: "—",
      bg: isDark ? "#27272a" : "#e4e4e7",
      text: isDark ? "#a1a1aa" : "#71717a",
      color: isDark ? "#3f3f46" : "#cbd5e1",
    };
  }
  if (skor <= 20) {
    return {
      label: "Sangat Rendah",
      bg: isDark ? "#7F1D1D" : "#EF4444",
      text: "#ffffff",
      color: isDark ? "#7F1D1D" : "#EF4444",
    };
  }
  if (skor <= 40) {
    return {
      label: "Rendah",
      bg: isDark ? "#9A3412" : "#F97316",
      text: "#ffffff",
      color: isDark ? "#9A3412" : "#F97316",
    };
  }
  if (skor <= 60) {
    return {
      label: "Sedang",
      bg: isDark ? "#854D0E" : "#EAB308",
      text: isDark ? "#ffffff" : "#000000",
      color: isDark ? "#854D0E" : "#EAB308",
    };
  }
  if (skor <= 80) {
    return {
      label: "Tinggi",
      bg: isDark ? "#166534" : "#22C55E",
      text: "#ffffff",
      color: isDark ? "#166534" : "#22C55E",
    };
  }
  return {
    label: "Sangat Tinggi",
    bg: isDark ? "#15803D" : "#16A34A",
    text: "#ffffff",
    color: isDark ? "#15803D" : "#16A34A",
  };
}

const SVG_ID_TO_CODE: Record<string, string> = {
  "ID-AC": "11",
  "ID-SU": "12",
  "ID-SB": "13",
  "ID-RI": "14",
  "ID-JA": "15",
  "ID-SS": "16",
  "ID-BE": "17",
  "ID-LA": "18",
  "ID-BB": "19",
  "ID-KR": "21",
  "ID-JK": "31",
  "ID-JB": "32",
  "ID-JT": "33",
  "ID-YO": "34",
  "ID-JI": "35",
  "ID-BT": "36",
  "ID-BA": "51",
  "ID-NB": "52",
  "ID-NT": "53",
  "ID-KB": "61",
  "ID-KT": "62",
  "ID-KS": "63",
  "ID-KI": "64",
  "ID-KU": "65",
  "ID-SA": "71",
  "ID-ST": "72",
  "ID-SN": "73",
  "ID-SG": "74",
  "ID-GO": "75",
  "ID-SR": "76",
  "ID-MA": "81",
  "ID-MU": "82",
  "ID-PA": "91",
  "ID-PD": "92",
  "ID-PS": "93",
  "ID-PT": "94",
  "ID-PE": "95",
  "ID-PB": "96",
};

export default function MapProvinsi({ tahunAwal = 2024 }: { tahunAwal?: number }) {
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);

  const [selectedTahun, setSelectedTahun] = useState(tahunAwal);
  const [selectedKode, setSelectedKode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    nama: string;
    skor: string;
    x: number;
    y: number;
  } | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isDark, setIsDark] = useState(false);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const daftarTahun = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const is38 = selectedTahun >= 2024;
  const count = is38 ? 38 : 34;

  useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["provinsi", selectedTahun],
    queryFn: () => fetchProvinsi(selectedTahun),
  });

  const { data: dataNasional } = useQuery({
    queryKey: ["nasional"],
    queryFn: async () => {
      const res = await fetch("/api/nasional");
      if (!res.ok) throw new Error("Gagal ambil data nasional");
      const json = await res.json();
      return json.data as { tahun: number; skorIpk: number }[];
    },
  });

  const skorNasional =
    dataNasional?.find((d) => Number(d.tahun) === selectedTahun)?.skorIpk ??
    null;

  const selected = useMemo(() => {
    if (!selectedKode || !data) return null;
    return (
      data.find((p) => String(p.kode).padStart(2, "0") === selectedKode) ||
      null
    );
  }, [selectedKode, data]);

  const ranked = useMemo(() => {
    const list = (data || []).filter((p) => p.skorIpk != null);
    const sorted = [...list].sort((a, b) => (b.skorIpk ?? 0) - (a.skorIpk ?? 0));
    return {
      top3: sorted.slice(0, 3),
      bottom3: [...sorted].reverse().slice(0, 3),
    };
  }, [data]);

  useEffect(() => {
    const candidatePaths = [
      `/assets/svg/maps/indonesia-${count}-provinsi.svg`,
      `/geo/indonesia-${count}-provinsi.svg`,
      `/decorations/indonesia-${count}-provinsi.svg`,
    ];

    async function loadSvg() {
      for (const path of candidatePaths) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            let text = await res.text();
            if (text.includes("<svg")) {
              text = text.replace(/<\?xml[\s\S]*?\?>/gi, "");
              text = text.replace(/<!DOCTYPE[\s\S]*?>/gi, "");
              text = text.replace(
                /<amcharts:[^>]*>[\s\S]*?<\/amcharts:[^>]*>/gi,
                ""
              );
              text = text.replace(/<amcharts:[^>]*\/>/gi, "");
              text = text.replace(/\s+amcharts:[a-zA-Z0-9_-]+="[^"]*"/gi, "");
              setSvgContent(text);
              return;
            }
          }
        } catch (_) {}
      }
    }

    loadSvg();
  }, [count]);

  useEffect(() => {
    if (!svgWrapperRef.current || !data?.length || !svgContent) return;

    const svg = svgWrapperRef.current.querySelector("svg");
    if (!svg) return;

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.maxHeight = "460px";

    const cleanStr = (s: string) =>
      String(s || "")
        .toLowerCase()
        .replace(/provinsi/gi, "")
        .replace(/daerah istimewa/gi, "")
        .replace(/dki/gi, "")
        .replace(/kepulauan/gi, "kep")
        .replace(/[^a-z0-9]/g, "")
        .trim();

    const dataByCode = new Map<string, ProvinsiItem>();
    const dataByCleanName = new Map<string, ProvinsiItem>();

    data.forEach((p) => {
      const c = String(p.kode).padStart(2, "0");
      dataByCode.set(c, p);
      if (p.kodeBps) dataByCode.set(String(p.kodeBps), p);
      dataByCleanName.set(cleanStr(p.nama), p);
    });

    const applyHover = (el: SVGPathElement) => {
      if (isDark) {
        el.style.opacity = "1";
        el.style.filter = "brightness(1.6) saturate(1.15)";
        el.style.stroke = "#fde68a";
        el.style.strokeWidth = "1.4";
      } else {
        el.style.opacity = "0.82";
        el.style.filter = "brightness(1.18)";
      }
    };

    const clearHover = (el: SVGPathElement) => {
      el.style.opacity = "1";
      el.style.filter = "none";
      el.style.stroke = "#ffffff";
      el.style.strokeWidth = "0.7";
    };

    const allPaths = svg.querySelectorAll("path");

    allPaths.forEach((pathEl) => {
      const id = (pathEl.getAttribute("id") || "").trim().toUpperCase();
      const title = (
        pathEl.getAttribute("title") ||
        pathEl.getAttribute("name") ||
        ""
      ).trim();
      const cleanTitle = cleanStr(title);

      const isForeign =
        id.startsWith("MY") ||
        id.startsWith("TL") ||
        id.startsWith("BN") ||
        cleanTitle.includes("malaysia") ||
        cleanTitle.includes("sabah") ||
        cleanTitle.includes("sarawak") ||
        cleanTitle.includes("timorleste") ||
        cleanTitle.includes("brunei");

      if (isForeign) {
        pathEl.style.fill = isDark ? "#9ca3af" : "#cbd5e1";
        pathEl.style.stroke = "#ffffff";
        pathEl.style.strokeWidth = "0.7";
        pathEl.style.cursor = "default";
        pathEl.style.pointerEvents = "none";
        return;
      }

      let found: ProvinsiItem | undefined;

      if (id && SVG_ID_TO_CODE[id]) {
        found = dataByCode.get(SVG_ID_TO_CODE[id]);
      }

      if (!found && cleanTitle) {
        found = dataByCleanName.get(cleanTitle);
        if (!found) {
          for (const [k, item] of dataByCleanName) {
            if (
              cleanTitle === k ||
              cleanTitle.includes(k) ||
              k.includes(cleanTitle)
            ) {
              found = item;
              break;
            }
          }
        }
      }

      if (found) {
        const kat = getKategori(found.skorIpk, isDark);
        pathEl.style.fill = kat.color;
        pathEl.style.stroke = "#ffffff";
        pathEl.style.strokeWidth = "0.7";
        pathEl.style.cursor = "pointer";
        pathEl.style.pointerEvents = "auto";
        pathEl.style.transition = "filter 0.2s, opacity 0.2s, stroke 0.2s";

        const provItem = found;

        pathEl.onmouseenter = (e) => {
          applyHover(pathEl);
          setTooltip({
            nama: provItem.nama,
            skor:
              provItem.skorIpk != null
                ? provItem.skorIpk.toFixed(2).replace(".", ",")
                : "—",
            x: e.clientX,
            y: e.clientY,
          });
        };

        pathEl.onmousemove = (e) => {
          setTooltip({
            nama: provItem.nama,
            skor:
              provItem.skorIpk != null
                ? provItem.skorIpk.toFixed(2).replace(".", ",")
                : "—",
            x: e.clientX,
            y: e.clientY,
          });
        };

        pathEl.onmouseleave = () => {
          clearHover(pathEl);
          setTooltip(null);
        };

        pathEl.onclick = () => {
          setSelectedKode(String(provItem.kode).padStart(2, "0"));
        };
      } else {
        pathEl.style.fill = isDark ? "#4b5563" : "#cbd5e1";
        pathEl.style.stroke = isDark ? "#6b7280" : "#94a3b8";
        pathEl.style.strokeWidth = "0.5";
      }
    });
  }, [data, svgContent, isDark]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.35, 3.5));
  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1 || e.touches.length !== 1) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y,
    });
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const kat = getKategori(selected?.skorIpk ?? null, isDark);
  const selisih =
    selected?.skorIpk != null && skorNasional != null
      ? Number((selected.skorIpk - skorNasional).toFixed(2))
      : null;

  const profilHref = selected
    ? `/pages/hasil-provinsi?kode=${String(selected.kode).padStart(2, "0")}&tahun=${selectedTahun}`
    : "/pages/hasil-provinsi";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-9 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Tahun
            </label>
            <select
              value={selectedTahun}
              onChange={(e) => {
                setSelectedTahun(Number(e.target.value));
                handleResetZoom();
              }}
              className="text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-[#B8860B] shadow-sm"
            >
              {daftarTahun.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
            Jumlah Provinsi: {selectedTahun >= 2024 ? 38 : 34}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="order-1 lg:order-none lg:col-span-9 relative">
          <div
            ref={mapViewportRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`w-full h-[450px] rounded-3xl overflow-hidden bg-[#c8e7f5] dark:bg-[#0c4a6e] border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative shadow-md select-none ${
              scale > 1 ? "cursor-grab active:cursor-grabbing" : ""
            }`}
          >
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-white/95 dark:bg-zinc-900/95 p-1 rounded-xl shadow-lg border border-zinc-200/80 dark:border-zinc-700/80 backdrop-blur-sm">
              <button
                type="button"
                onClick={handleZoomIn}
                className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg transition"
                title="Perbesar"
                aria-label="Zoom in"
              >
                <Plus size={17} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg transition"
                title="Perkecil"
                aria-label="Zoom out"
              >
                <Minus size={17} strokeWidth={2.5} />
              </button>
              {scale > 1 && (
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg transition border-t border-zinc-200 dark:border-zinc-700 pt-1 mt-0.5"
                  title="Kembalikan Posisi"
                  aria-label="Reset zoom"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>

            {isLoading && (
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                Memuat peta & data...
              </div>
            )}

            {!isLoading && !svgContent && (
              <div className="text-sm text-rose-600 dark:text-rose-400 text-center p-4">
                File peta SVG belum ditemukan di folder{" "}
                <code>/public/assets/svg/maps/</code>
              </div>
            )}

            {!isLoading && svgContent && (
              <div
                ref={svgWrapperRef}
                style={{
                  transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: isDraggingRef.current
                    ? "none"
                    : "transform 0.25s ease-out",
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
                className="w-full h-full flex items-center justify-center pointer-events-auto"
              />
            )}

            {tooltip && (
              <div
                className="fixed z-50 bg-black/90 text-white text-xs font-medium px-3.5 py-2 rounded-xl pointer-events-none shadow-2xl -translate-x-1/2 -translate-y-full border border-white/20 text-center leading-tight"
                style={{ left: tooltip.x, top: tooltip.y - 14 }}
              >
                <div className="font-semibold text-white/95">{tooltip.nama}</div>
                <div className="text-zinc-300 text-[11px] mt-0.5">
                  IPK: {tooltip.skor}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="order-3 lg:order-none lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 text-left shadow-sm lg:min-h-[450px] flex flex-col justify-between">
            {selected ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Provinsi Terpilih</p>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-snug">
                    {selected.nama}
                  </h3>
                  <span
                    className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                    style={{ backgroundColor: kat.bg, color: kat.text }}
                  >
                    {kat.label}
                  </span>
                </div>

                <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 pt-4">
                  <p className="text-xs text-zinc-400">
                    Nilai IPK ({selectedTahun})
                  </p>
                  <p className="text-4xl font-extrabold tabular-nums text-zinc-900 dark:text-white mt-1">
                    {selected.skorIpk != null
                      ? selected.skorIpk.toFixed(2).replace(".", ",")
                      : "—"}
                  </p>
                  {selisih != null && (
                    <p
                      className={`text-xs font-medium mt-2 ${
                        selisih >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {selisih >= 0 ? "↑ +" : "↓ "}
                      {selisih.toFixed(2).replace(".", ",")}{" "}
                      {selisih >= 0 ? "di atas" : "di bawah"} nasional
                    </p>
                  )}
                </div>

                <Link
                  href={profilHref}
                  className="inline-flex items-center justify-center w-full bg-[#B8860B] hover:bg-[#9a7009] text-white text-xs font-semibold py-3 px-4 rounded-full transition mt-auto shadow-sm"
                >
                  Lihat Profil Lengkap
                </Link>
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                <p className="text-xs text-zinc-400 mb-1">Ringkasan Nasional</p>
                <p className="text-4xl font-extrabold tabular-nums text-zinc-900 dark:text-white mt-1">
                  {skorNasional != null
                    ? skorNasional.toFixed(2).replace(".", ",")
                    : "—"}
                </p>
                <p className="text-xs text-zinc-400 mt-1 mb-5">
                  Skor IPK Nasional {selectedTahun}
                </p>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3.5 mb-3">
                  <p className="text-xs font-semibold text-emerald-600 mb-2">
                    Capaian Teratas
                  </p>
                  <ol className="space-y-1.5 text-xs">
                    {ranked.top3.map((p, i) => (
                      <li key={p.kode} className="flex justify-between gap-2">
                        <span className="text-zinc-600 dark:text-zinc-400 truncate">
                          {i + 1}. {p.nama}
                        </span>
                        <span className="font-semibold tabular-nums shrink-0">
                          {p.skorIpk?.toFixed(2).replace(".", ",")}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3.5 mb-4">
                  <p className="text-xs font-semibold text-rose-600 mb-2">
                    Capaian Terendah
                  </p>
                  <ol className="space-y-1.5 text-xs">
                    {ranked.bottom3.map((p, i) => (
                      <li key={p.kode} className="flex justify-between gap-2">
                        <span className="text-zinc-600 dark:text-zinc-400 truncate">
                          {i + 1}. {p.nama}
                        </span>
                        <span className="font-semibold tabular-nums shrink-0">
                          {p.skorIpk?.toFixed(2).replace(".", ",")}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <p className="text-[11px] text-zinc-400 mt-auto leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  Arahkan atau klik provinsi pada peta untuk melihat detail.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="order-2 lg:order-last col-span-full text-left">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Kategori IPK
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              Sangat Rendah
              <span className="w-3.5 h-3.5 rounded-sm bg-[#EF4444] dark:bg-[#7F1D1D]" />
              &le;20,00
            </span>
            <span className="inline-flex items-center gap-1.5">
              Rendah
              <span className="w-3.5 h-3.5 rounded-sm bg-[#F97316] dark:bg-[#9A3412]" />
              20,01 &ndash; &le;40,00
            </span>
            <span className="inline-flex items-center gap-1.5">
              Sedang
              <span className="w-3.5 h-3.5 rounded-sm bg-[#EAB308] dark:bg-[#854D0E]" />
              40,01 &ndash; &le;60,00
            </span>
            <span className="inline-flex items-center gap-1.5">
              Tinggi
              <span className="w-3.5 h-3.5 rounded-sm bg-[#22C55E] dark:bg-[#166534]" />
              60,01 &ndash; &le;80,00
            </span>
            <span className="inline-flex items-center gap-1.5">
              Sangat Tinggi
              <span className="w-3.5 h-3.5 rounded-sm bg-[#16A34A] dark:bg-[#15803D]" />
              80,01 &ndash; &le;100,00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}