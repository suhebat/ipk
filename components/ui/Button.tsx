"use client";

import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { ChevronRight } from "lucide-react";

type Variant =
  | "primary"
  | "outline"
  | "gold"
  | "gold-solid"
  | "blue"
  | "green"
  | "red";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  showArrow?: boolean;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClass =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B]/50 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90",
  outline:
    "border border-zinc-300 dark:border-zinc-300 text-zinc-100 hover:text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white",
  gold:
    "border border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white hover:gap-3",
  "gold-solid": "bg-[#B8860B] text-white hover:bg-[#DAA622] shadow-md",
  blue:
    "bg-[#0d6efd] text-white hover:bg-[#0b5ed7] shadow-sm focus-visible:ring-[#0d6efd]/50",
  green:
    "bg-[#198754] text-white hover:bg-[#157347] shadow-sm focus-visible:ring-[#198754]/50",
  red:
    "bg-[#DC3545] text-white hover:bg-[#eb4555] shadow-sm focus-visible:ring-[#DC3545]/50",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  showArrow = false,
  ...props
}: ButtonProps) {
  const cls = `${baseClass} ${variants[variant]} ${className}`;

  const content = (
    <>
      <span className="inline-flex items-center gap-2">{children}</span>
      {showArrow && (
        <ChevronRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-0.5 shrink-0"
        />
      )}
    </>
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <a href={href} className={`group ${cls}`} {...rest}>
        {content}
      </a>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button type="button" className={`group ${cls}`} {...buttonProps}>
      {content}
    </button>
  );
}