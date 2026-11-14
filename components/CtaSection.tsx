
import { ReactNode, Children } from "react";

interface CtaSectionProps {
  eyebrow?: string;
  title: string | ReactNode;
  description?: string | ReactNode;
  children?: ReactNode;
  className?: string;
  bgSvg?: string;
}

export default function CtaSection({
  eyebrow,
  title,
  description,
  children,
  className = "",
  bgSvg = "/decorations/indonesian-04.svg",
}: CtaSectionProps) {
  const childCount = Children.toArray(children).filter(Boolean).length;
  const isSingle = childCount === 1;
  const isMultiple = childCount >= 2;

  return (
    <section className="py-16 md:py-20 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`relative rounded-3xl bg-white dark:bg-zinc-900 border border-[#B8860B] p-8 md:p-14 overflow-hidden shadow-sm bg-no-repeat ${className}`}
          style={{
            backgroundImage: `url('${bgSvg}')`,
            backgroundPosition: "center right",
            backgroundSize: "700px",
          }}
        >
          <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/75 pointer-events-none z-0" />

          {/* 1 tombol: teks kiri + tombol kanan | 2+ tombol: teks di atas + tombol di bawah */}
          <div
            className={`relative z-10 ${
              isSingle
                ? "flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                : "text-left"
            }`}
          >
            <div className={isSingle ? "max-w-xl text-left" : "w-full text-left"}>
              {eyebrow && (
                <span className="text-[#B8860B] text-xs font-bold tracking-widest uppercase mb-3 inline-block">
                  {eyebrow}
                </span>
              )}

              <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3 text-zinc-900 dark:text-white leading-snug">
                {title}
              </h2>

              {description && (
                <p
                  className={`text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed ${
                    isMultiple ? "mb-6 max-w-none" : "mb-0 max-w-xl"
                  }`}
                >
                  {description}
                </p>
              )}
            </div>

            {children && (
              <div
                className={`flex gap-3 shrink-0 ${
                  isSingle
                    ? "flex-wrap items-center justify-start md:justify-end"
                    : "flex-col items-stretch md:flex-row md:items-center justify-start [&>*]:w-full md:[&>*]:w-auto"
                }`}
              >
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
