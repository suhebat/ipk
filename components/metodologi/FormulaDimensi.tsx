"use client";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function FormulaDimensi({
  dimId,
  mode,
}: {
  dimId: number;
  mode: "2024" | "2018";
}) {
  const formulas2024: Record<
    number,
    { note: string; main: string; norm: string }
  > = {
    1: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_1 = \\dfrac{1}{2}\\sum_{i=1}^{2} S_{1.i} = \\dfrac{S_{1.1}+S_{1.2}}{2}",
      norm: "S_{1.i} = \\dfrac{X_{1.i} - \\min(X_{1.i})}{\\max(X_{1.i}) - \\min(X_{1.i})},\\quad i=1,2",
    },
    2: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_2 = \\dfrac{1}{3}\\sum_{i=1}^{3} S_{2.i} = \\dfrac{S_{2.1}+S_{2.2}+S_{2.3}}{3}",
      norm: "S_{2.i} = \\dfrac{X_{2.i} - \\min(X_{2.i})}{\\max(X_{2.i}) - \\min(X_{2.i})},\\quad i=1,2,3",
    },
    3: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_3 = \\dfrac{1}{3}\\sum_{i=1}^{3} S_{3.i} = \\dfrac{S_{3.1}+S_{3.2}+S_{3.3}}{3}",
      norm: "S_{3.i} = \\dfrac{X_{3.i} - \\min(X_{3.i})}{\\max(X_{3.i}) - \\min(X_{3.i})},\\quad i=1,2,3",
    },
    4: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_4 = \\dfrac{1}{6}\\sum_{i=1}^{6} S_{4.i} = \\dfrac{S_{4.1}+S_{4.2}+S_{4.3}+S_{4.4}+S_{4.5}+S_{4.6}}{6}",
      norm: "S_{4.i} = \\dfrac{X_{4.i} - \\min(X_{4.i})}{\\max(X_{4.i}) - \\min(X_{4.i})},\\quad i=1,2,3,4,5,6",
    },
    5: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_5 = \\dfrac{1}{4}\\sum_{i=1}^{4} S_{5.i} = \\dfrac{S_{5.1}+S_{5.2}+S_{5.3}+S_{5.4}}{4}",
      norm: "S_{5.i} = \\dfrac{X_{5.i} - \\min(X_{5.i})}{\\max(X_{5.i}) - \\min(X_{5.i})},\\quad i=1,2,3,4",
    },
    6: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_6 = \\dfrac{1}{3}\\sum_{i=1}^{3} S_{6.i} = \\dfrac{S_{6.1}+S_{6.2}+S_{6.3}}{3}",
      norm: "S_{6.i} = \\dfrac{X_{6.i} - \\min(X_{6.i})}{\\max(X_{6.i}) - \\min(X_{6.i})},\\quad i=1,2,3",
    },
    7: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_7 = \\dfrac{1}{3}\\sum_{i=1}^{3} S_{7.i} = \\dfrac{S_{7.1}+S_{7.2}+S_{7.3}}{3}",
      norm: "S_{7.i} = \\dfrac{X_{7.i} - \\min(X_{7.i})}{\\max(X_{7.i}) - \\min(X_{7.i})},\\quad i=1,2,3",
    },
  };

  const formulas2018: Record<
    number,
    { note: string; main: string; norm: string }
  > = {
    1: {
      note: "Nilai dimensi sama dengan nilai indikator setelah dinormalisasi:",
      main: "D_1 = S_{1.1}",
      norm: "S_{1.1} = \\dfrac{X_{1.1} - \\min(X_{1.1})}{\\max(X_{1.1}) - \\min(X_{1.1})}",
    },
    2: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_2 = \\dfrac{1}{6}\\sum_{i=1}^{6} S_{2.i} = \\dfrac{S_{2.1}+S_{2.2}+S_{2.3}+S_{2.4}+S_{2.5}+S_{2.6}}{6}",
      norm: "S_{2.i} = \\dfrac{X_{2.i} - \\min(X_{2.i})}{\\max(X_{2.i}) - \\min(X_{2.i})},\\quad i=1,2,3,4,5,6",
    },
    3: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_3 = \\dfrac{1}{8}\\sum_{i=1}^{8} S_{3.i} = \\dfrac{S_{3.1}+S_{3.2}+S_{3.3}+S_{3.4}+S_{3.5}+S_{3.6}+S_{3.7}+S_{3.8}}{8}",
      norm: "S_{3.i} = \\dfrac{X_{3.i} - \\min(X_{3.i})}{\\max(X_{3.i}) - \\min(X_{3.i})},\\quad i=1,2,3,4,5,6,7,8",
    },
    4: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_4 = \\dfrac{1}{6}\\sum_{i=1}^{6} S_{4.i} = \\dfrac{S_{4.1}+S_{4.2}+S_{4.3}+S_{4.4}+S_{4.5}+S_{4.6}}{6}",
      norm: "S_{4.i} = \\dfrac{X_{4.i} - \\min(X_{4.i})}{\\max(X_{4.i}) - \\min(X_{4.i})},\\quad i=1,2,3,4,5,6",
    },
    5: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_5 = \\dfrac{1}{4}\\sum_{i=1}^{4} S_{5.i} = \\dfrac{S_{5.1}+S_{5.2}+S_{5.3}+S_{5.4}}{4}",
      norm: "S_{5.i} = \\dfrac{X_{5.i} - \\min(X_{5.i})}{\\max(X_{5.i}) - \\min(X_{5.i})},\\quad i=1,2,3,4",
    },
    6: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_6 = \\dfrac{1}{3}\\sum_{i=1}^{3} S_{6.i} = \\dfrac{S_{6.1}+S_{6.2}+S_{6.3}}{3}",
      norm: "S_{6.i} = \\dfrac{X_{6.i} - \\min(X_{6.i})}{\\max(X_{6.i}) - \\min(X_{6.i})},\\quad i=1,2,3",
    },
    7: {
      note: "Nilai dimensi dihitung dari rata-rata indikator yang sudah dinormalisasi:",
      main: "D_7 = \\dfrac{1}{3}\\sum_{i=1}^{3} S_{7.i} = \\dfrac{S_{7.1}+S_{7.2}+S_{7.3}}{3}",
      norm: "S_{7.i} = \\dfrac{X_{7.i} - \\min(X_{7.i})}{\\max(X_{7.i}) - \\min(X_{7.i})},\\quad i=1,2,3",
    },
  };

  const f = (mode === "2024" ? formulas2024 : formulas2018)[dimId];
  if (!f) return null;

  return (
    <div className="mt-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-sm print:bg-white print:border-zinc-300">
      <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 print:text-black">
        Cara Menghitung Nilai Dimensi
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 mb-3 print:text-zinc-700">
        {f.note}
      </p>
      <div className="overflow-x-auto py-2 text-zinc-900 dark:text-zinc-100 print:text-black [&_.katex]:text-base sm:[&_.katex]:text-lg">
        <BlockMath math={f.main} />
      </div>
      <p className="text-zinc-600 dark:text-zinc-400 mb-3 mt-4 print:text-zinc-700">
        dengan normalisasi min–max:
      </p>
      <div className="overflow-x-auto py-2 text-zinc-900 dark:text-zinc-100 print:text-black [&_.katex]:text-base sm:[&_.katex]:text-lg">
        <BlockMath math={f.norm} />
      </div>
    </div>
  );
}
