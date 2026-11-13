import { ChevronRight } from "lucide-react";

type Crumb = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
}: PageHeaderProps) {
  return (
    <section className="relative border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden">
      {/* SVG lebih besar — boleh sedikit di belakang teks */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[70%] sm:w-[60%] lg:w-[55%] flex items-center justify-end opacity-[0.52] dark:opacity-[0.22]"
        aria-hidden
      >
        <img
          src="/decorations/indonesian-02.svg"
          alt=""
          className="h-[95%] w-auto max-w-none object-contain object-right translate-x-[8%]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 pt-12 pb-8">
        <p className="text-[#B8860B] text-xs font-bold tracking-widest uppercase mb-3 inline-block">
          {eyebrow}
        </p>

        <h1 className="text-brand-gold text-3xl md:text-4xl font-bold tracking-tight mb-3 leading-tight">
          {title}
        </h1>

        {description && (
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl text-base leading-relaxed">
            {description}
          </p>
        )}

        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mt-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
          >
            <a href="/" className="hover:text-[#B8860B] transition">
              Beranda
            </a>
            {breadcrumbs.map((item, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <span
                  key={`${item.label}-${i}`}
                  className="inline-flex items-center gap-2"
                >
                  <ChevronRight size={14} className="shrink-0 opacity-60" />
                  {isLast || !item.href ? (
                    <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                      {item.label}
                    </span>
                  ) : (
                    <a
                      href={item.href}
                      className="hover:text-[#B8860B] transition"
                    >
                      {item.label}
                    </a>
                  )}
                </span>
              );
            })}
          </nav>
        )}
      </div>
    </section>
  );
}