import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string | ReactNode;
  description?: string | ReactNode;
  align?: "center" | "left";
  className?: string;
  maxWidth?: string; // default max-w-2xl untuk deskripsi
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
  maxWidth = "max-w-2xl",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={`mb-12 ${isCenter ? "text-center" : "text-left"} ${className}`}>
      {eyebrow && (
        <p className="text-brand-gold text-sm tracking-widest uppercase mb-4 font-semibold">
          {eyebrow}
        </p>
      )}

      <h2 className="text-brand-gold text-4xl font-bold mb-4 leading-tight tracking-tight">
        {title}
      </h2>

      {description && (
        <p
          className={`text-zinc-600 dark:text-zinc-400 text-base leading-relaxed ${
            isCenter ? `${maxWidth} mx-auto` : maxWidth
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}