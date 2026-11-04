import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Locale, Localized, Project, lineOf } from "../../data/portfolio";

export const useLocale = (): Locale => {
  const { locale } = useRouter();
  return (locale === "es" || locale === "ko" ? locale : "en") as Locale;
};

export const tr = (value: Localized, locale: Locale) => value[locale] ?? value.en;

/**
 * Scroll-armed reveal. Returns a ref and a className: nothing is hidden until
 * JS has mounted ("armed"), so no-JS and SSR always show the full content.
 */
export const useReveal = <T extends HTMLElement>(threshold = 0.2) => {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    // already on screen at load: show without arming
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
      setSeen(true);
      return;
    }
    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, `${armed ? "armed" : ""} ${seen ? "in-view" : ""}`] as const;
};

type RoundelSize = "sm" | "md" | "lg" | "xl";
const ROUNDEL: Record<RoundelSize, string> = {
  sm: "w-9 h-9 text-[0.7rem] border-[3px]",
  md: "w-12 h-12 text-sm border-4",
  lg: "w-16 h-16 text-base border-[5px]",
  xl: "w-24 h-24 text-2xl border-[7px]",
};

/** Seoul-style station number mark: white disc, line-coloured ring, code inside. */
export const Roundel = ({
  code,
  color,
  size = "md",
  transfer = false,
  className = "",
}: {
  code: string;
  color: string;
  size?: RoundelSize;
  transfer?: boolean;
  className?: string;
}) => (
  <span
    className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-paper font-bold text-ink wide leading-none ${ROUNDEL[size]} ${className}`}
    style={{ borderColor: color, boxShadow: transfer ? `0 0 0 3px #fff, 0 0 0 6px ${color}` : undefined }}
  >
    {code}
  </span>
);

/** Filled line badge, e.g. the "A" disc for the Applied AI line. */
export const LineBadge = ({ letter, color, size = "md" }: { letter: string; color: string; size?: "sm" | "md" | "lg" }) => {
  const s = size === "lg" ? "w-14 h-14 text-2xl" : size === "sm" ? "w-6 h-6 text-xs" : "w-9 h-9 text-base";
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-extrabold text-ink wide leading-none ${s}`}
      style={{ background: color }}
    >
      {letter}
    </span>
  );
};

export const ArrowUpRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
);

export const ArrowRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export const CopyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
  </svg>
);

export const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m3 8.5 3 3 7-7" />
  </svg>
);

/**
 * The project's picture. Real screenshot when one exists; otherwise a
 * station plate (signage panel with the station code), never a fake screenshot.
 */
export const ProjectMedia = ({ project, className = "", compact = false }: { project: Project; className?: string; compact?: boolean }) => {
  const line = lineOf(project.line);
  const locale = useLocale();
  if (project.image) {
    return (
      <div className={`overflow-hidden bg-sign-deep ${className}`}>
        <img src={project.image} alt="" {...({ loading: "lazy" } as object)} decoding="async" className="h-full w-full object-cover object-left-top" />
      </div>
    );
  }
  return (
    <div aria-hidden="true" className={`relative flex flex-col justify-between overflow-hidden bg-sign p-5 ${className}`}>
      <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2" style={{ background: line.color }} />
      {!compact && (
        <div className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sign-text">
          <LineBadge letter={line.letter} color={line.color} size="sm" />
          {project.period}
        </div>
      )}
      <Roundel code={project.code} color={line.color} size="xl" className={`relative self-center ${compact ? "my-auto" : ""}`} />
      {!compact && project.facts && <div className="relative wide text-base font-bold leading-snug text-white">{tr(project.facts, locale)}</div>}
    </div>
  );
};

export const StackList = ({ items, dark = false }: { items: string[]; dark?: boolean }) => (
  <ul className="flex flex-wrap gap-1.5">
    {items.map((s) => (
      <li
        key={s}
        className={`rounded-full border px-2.5 py-0.5 text-[0.8125rem] font-medium ${
          dark ? "border-sign-line text-sign-text" : "border-rule text-steel"
        }`}
      >
        {s}
      </li>
    ))}
  </ul>
);
