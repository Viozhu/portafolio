import React from "react";
import { useRouter } from "next/router";
import { Locale, Localized } from "../../data/portfolio";

export const useLocale = (): Locale => {
  const { locale } = useRouter();
  return (locale === "es" || locale === "ko" ? locale : "en") as Locale;
};

export const tr = (value: Localized, locale: Locale) => value[locale] ?? value.en;

export const ArrowUpRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" className={className} aria-hidden="true">
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
);

export const ArrowRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" className={className} aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export const ArrowDown = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" className={className} aria-hidden="true">
    <path d="M8 3v10M4 9l4 4 4-4" />
  </svg>
);

export const CopyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <rect x="5.5" y="5.5" width="8" height="8" />
    <path d="M10.5 3.5V2H2v8.5h1.5" />
  </svg>
);

export const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className={className} aria-hidden="true">
    <path d="m3 8.5 3 3 7-7" />
  </svg>
);

/** Small lit square used as a separator in mono runs. */
export const Pip = ({ color = "#ff2a6d" }: { color?: string }) => (
  <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
);

export const StackList = ({ items, color }: { items: string[]; color?: string }) => (
  <ul className="flex flex-wrap gap-x-3 gap-y-1">
    {items.map((s) => (
      <li key={s} className="hud flex items-center gap-1.5 text-[0.6875rem] text-haze">
        <span aria-hidden="true" className="h-px w-2" style={{ background: color ?? "#8a7aa8" }} />
        {s}
      </li>
    ))}
  </ul>
);

/** Primary / secondary actions, drawn as lit tube frames. */
export const TubeLink = ({
  href,
  color,
  children,
  external,
  solid,
  className = "",
}: {
  href: string;
  color: string;
  children: React.ReactNode;
  external?: boolean;
  solid?: boolean;
  className?: string;
}) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={`tube-btn ${solid ? "solid" : ""} ${className}`}
    style={{ "--c": color } as React.CSSProperties}
  >
    {children}
  </a>
);

/** Words like "OPIc" are names: they keep their casing under uppercase styles. */
const BRAND = /(\b[A-Z]{2,}[a-z]\b)/;
export const keepCase = (text: string): React.ReactNode =>
  text.split(BRAND).map((part, i) =>
    BRAND.test(part) ? (
      <span key={i} className="normal-case">
        {part}
      </span>
    ) : (
      part
    ),
  );
/** Uppercase for canvas lettering, brand words left as written. */
export const upperKeep = (text: string) => text.split(BRAND).map((part) => (BRAND.test(part) ? part : part.toUpperCase())).join("");
