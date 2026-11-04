import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { CONTACT, Project, featuredProjects, lineOf } from "../../data/portfolio";
import { ArrowRight, ArrowUpRight, LineBadge, ProjectMedia, StackList, tr, useLocale } from "./parts";

const featured = featuredProjects();

/** The arrival screen: a signage panel describing the selected station. */
const StationScreen = ({ project }: { project: Project }) => {
  const { t } = useTranslation("common");
  const locale = useLocale();
  const line = lineOf(project.line);
  return (
    <article aria-live="polite" className="on-sign flex h-full flex-col overflow-hidden rounded-2xl bg-sign text-white shadow-[0_24px_48px_-24px_rgba(18,22,31,0.55)]">
      <header className="flex items-center gap-3 border-b border-sign-line px-5 py-3.5">
        <LineBadge letter={line.letter} color={line.color} size="sm" />
        <span className="text-sm font-medium text-sign-text">{tr(line.name, locale)}</span>
        <span className="ml-auto text-sm tabular-nums text-sign-text">{project.period}</span>
      </header>
      <ProjectMedia project={project} compact className={`${project.image ? "aspect-[2/1]" : "aspect-[3/1]"} w-full`} />
      <div className="flex flex-1 flex-col gap-3.5 p-5">
        <div>
          <p className="text-sm font-semibold tabular-nums text-sign-text">{project.code}</p>
          <h3 className="wide text-2xl font-bold leading-tight">{project.title}</h3>
          {!project.image && project.facts && <p className="mt-1 text-[0.9375rem] font-medium text-white">{tr(project.facts, locale)}</p>}
        </div>
        <p className="max-w-[60ch] text-[0.9375rem] leading-relaxed text-sign-text">{tr(project.summary, locale)}</p>
        <StackList items={project.stack} dark />
        <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-1 text-[0.9375rem] font-semibold">
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-white underline decoration-line3 decoration-2 hover:decoration-white">
              {t("view_live")} <ArrowUpRight />
            </a>
          )}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-white underline decoration-line3 decoration-2 hover:decoration-white">
              {t("view_repo")} <ArrowUpRight />
            </a>
          )}
          {!project.live && !project.repo && (
            <span className="font-medium text-sign-text">{project.line === "ai" && !project.company ? t("private_repo") : t("company_work")}</span>
          )}
        </div>
      </div>
    </article>
  );
};

export const Hero = () => {
  const { t } = useTranslation("common");
  const locale = useLocale();
  const [active, setActive] = useState(featured.length - 1);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // keep the selected station in view when the line scrolls (phones)
  useEffect(() => {
    const center = (smooth: boolean) => {
      const box = scroller.current;
      const btn = refs.current[active];
      if (!box || !btn || box.scrollWidth <= box.clientWidth) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const delta = btn.getBoundingClientRect().left - box.getBoundingClientRect().left;
      box.scrollTo({ left: box.scrollLeft + delta - box.clientWidth / 2 + btn.offsetWidth / 2, behavior: smooth && !reduce ? "smooth" : "auto" });
    };
    if (first.current) {
      first.current = false;
      // first paint: wait for layout and fonts, then jump to the terminus
      const run = () => requestAnimationFrame(() => center(false));
      if (document.fonts?.ready) document.fonts.ready.then(run);
      else run();
    } else center(true);
  }, [active]);
  const n = featured.length;
  const pct = (i: number) => (i / (n - 1)) * 100;

  const onKey = (e: React.KeyboardEvent) => {
    let next = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = Math.min(n - 1, active + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = Math.max(0, active - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <section id="top" aria-labelledby="hero-name" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-page gap-x-12 gap-y-8 px-5 pb-14 pt-10 sm:px-8 lg:grid-cols-12 lg:gap-y-6 lg:pt-10">
        {/* Station name sign */}
        <div className="order-1 flex flex-col lg:col-span-7">
          <div className="flex items-center gap-4">
            <span className="relative inline-flex h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-full border-[5px] border-line2 bg-line5 sm:h-20 sm:w-20">
              <img src="/work/jorge.webp" alt="Jorge Ignacio Garay" width={80} height={80} className="h-full w-full object-cover" />
            </span>
            <p className="text-[0.95rem] font-medium leading-snug text-steel">
              Seoul, KR
              <br />
              <span lang={locale === "ko" ? "en" : "ko"}>{t("name_alt")}</span>
            </p>
          </div>

          <h1 id="hero-name" className="display mt-6 text-[clamp(3rem,6.6vw,5.5rem)]">
            Jorge Ignacio
            <br />
            Garay
          </h1>
          <p className="wide mt-5 text-[clamp(1.25rem,2.1vw,1.625rem)] font-semibold leading-snug">{t("role")}</p>
          <p className="mt-4 max-w-[58ch] text-steel">{t("intro")}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${CONTACT.email}`}
              className="group inline-flex items-center gap-2.5 rounded-full bg-sign py-3 pl-3 pr-5 font-semibold text-white no-underline transition-colors hover:bg-ink"
            >
              <span aria-hidden="true" className="h-5 w-5 rounded-full border-[5px] border-line3 bg-paper" />
              {t("cta_write")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={CONTACT.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 font-semibold text-ink no-underline transition-colors hover:bg-ink hover:text-white"
            >
              {t("cta_cv")} <ArrowUpRight />
            </a>
          </div>
        </div>

        {/* Arrival screen: below the line on phones so a tap shows its result */}
        <div id="work" className="order-3 scroll-mt-24 lg:order-2 lg:col-span-5">
          <StationScreen project={featured[active]} />
        </div>

      {/* The line */}
      <div className="order-2 min-w-0 lg:order-3 lg:col-span-12 lg:pb-6">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="line-label" className="flex items-center gap-3 wide text-lg font-bold">
            <span aria-hidden="true" className="flex h-2.5 w-12 overflow-hidden rounded-full">
              <span className="flex-1 bg-line2" />
              <span className="flex-1 bg-line3" />
            </span>
            {t("line_label")}
            <ArrowRight className="h-5 w-5 text-line3-ink" />
          </h2>
          <span className="hidden text-sm text-steel sm:inline">{t("line_hint")}</span>
        </div>
        <div ref={scroller} className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <div className="relative min-w-[68rem] px-16 pb-2 pt-10 sm:min-w-[46rem]">
            {/* track segments, coloured by the line each segment runs into */}
            <div aria-hidden="true" className="absolute inset-x-16 top-[3.3rem] h-2.5">
              {featured.slice(1).map((p, i) => (
                <div
                  key={p.code}
                  className="absolute top-0 h-full"
                  style={{ left: `${pct(i)}%`, width: `${pct(1)}%`, background: lineOf(p.line).color }}
                />
              ))}
              {/* the train */}
              <div className="train pointer-events-none absolute -top-10 h-0 w-0" style={{ left: `${pct(active)}%` }}>
                <div className="absolute left-0 flex -translate-x-1/2 flex-col items-center">
                  {/* a Seoul Metro car seen side-on: body, window band, orange door stripe, rounded cab */}
                  <div className="relative flex h-7 w-16 items-center gap-1 rounded-l-md rounded-r-[14px] bg-sign pl-1.5 pr-3">
                    <span className="h-3 w-2.5 rounded-[2px] bg-sign-text" />
                    <span className="h-3 w-2.5 rounded-[2px] bg-sign-text" />
                    <span className="h-4 w-1.5 bg-line3" />
                    <span className="h-3 w-2.5 rounded-[2px] bg-sign-text" />
                    <span className="absolute bottom-0 right-1 h-1 w-1.5 rounded-full bg-[#ffd200]" />
                  </div>
                  <span className="h-2 w-0.5 bg-sign" />
                </div>
              </div>
            </div>

            <div role="radiogroup" aria-labelledby="line-label" onKeyDown={onKey} className="relative flex justify-between">
              {featured.map((p, i) => {
                const line = lineOf(p.line);
                const on = i === active;
                const last = i === n - 1;
                return (
                  <button
                    key={p.code}
                    ref={(el) => (refs.current[i] = el)}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    className="group -mx-16 flex w-32 flex-col items-center gap-3 rounded-lg"
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full border-[5px] transition-colors"
                      style={{ borderColor: line.color, background: on ? line.color : "#fff" }}
                    >
                      {last && !on && <span className="h-2.5 w-2.5 rounded-full" style={{ background: line.color }} />}
                    </span>
                    <span className="flex w-full flex-col items-center text-center">
                      <span className="text-xs font-bold tabular-nums text-steel">{p.code}</span>
                      <span className={`wide mt-0.5 text-[0.95rem] font-bold leading-tight ${on ? "text-ink" : "text-steel group-hover:text-ink"}`}>
                        {p.title}
                      </span>
                      <span className="mt-0.5 text-xs text-steel">
                        {last ? t("terminus") : p.period}
                        {last ? ` · ${p.period}` : ""}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};
