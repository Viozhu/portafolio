import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { CONTACT, LINES, PROJECTS, ROLES, SKILLS, STUDIES } from "../../data/portfolio";
import { ArrowRight, ArrowUpRight, CheckIcon, CopyIcon, LineBadge, ProjectMedia, Roundel, StackList, tr, useLocale, useReveal } from "./parts";

/** A route list whose stem draws downward and whose stops light up when it scrolls into view. */
const RouteList = ({ className, children }: { className: string; children: React.ReactNode }) => {
  const [ref, reveal] = useReveal<HTMLOListElement>(0.12);
  return (
    <ol ref={ref} className={`${className} ${reveal}`}>
      {children}
    </ol>
  );
};
const stopDelay = (i: number) => ({ transitionDelay: `${Math.min(i, 7) * 120 + 150}ms` });

const SectionHead = ({ id, title, intro }: { id: string; title: string; intro: string }) => (
  <div className="mb-12 max-w-3xl">
    <h2 id={id} className="display text-[clamp(2.25rem,5vw,3.75rem)]">
      {title}
    </h2>
    <p className="mt-4 max-w-[60ch] text-lg text-steel">{intro}</p>
  </div>
);

/* ── Route map: every project, grouped by line ─────────────────────── */

export const RouteMap = () => {
  const { t } = useTranslation("common");
  const locale = useLocale();

  return (
    <section id="route" aria-labelledby="route-title" className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-page px-5 py-24 sm:px-8 lg:py-32">
        <SectionHead id="route-title" title={t("route_title")} intro={t("route_intro")} />

        <div className="flex flex-col gap-20">
          {LINES.map((line) => {
            const stations = PROJECTS.filter((p) => p.line === line.id).sort((a, b) => a.code.localeCompare(b.code));
            const compact = line.id === "play";
            return (
              <div key={line.id} aria-labelledby={`line-${line.id}`}>
                <div className="mb-8 flex flex-wrap items-center gap-4">
                  <LineBadge letter={line.letter} color={line.color} size="lg" />
                  <div>
                    <h3 id={`line-${line.id}`} className="wide text-2xl font-bold leading-tight">
                      {tr(line.name, locale)}
                    </h3>
                    <p className="text-steel">
                      {tr(line.blurb, locale)} · {stations.length} {t("stations")}
                    </p>
                  </div>
                </div>

                {compact ? (
                  <ol className="grid gap-x-10 border-t border-rule sm:grid-cols-2">
                    {stations.map((p) => (
                      <li key={p.code} className="flex gap-4 border-b border-rule py-5">
                        {p.image && (
                          <img src={p.image} alt="" {...({ loading: "lazy" } as object)} decoding="async" className="h-20 w-32 shrink-0 rounded-lg object-cover object-top" />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-bold tabular-nums text-steel">{p.code}</span>
                            <h4 className="wide font-bold leading-tight">{p.title}</h4>
                          </div>
                          <p className="mt-1 text-[0.9375rem] leading-snug text-steel">{tr(p.summary, locale)}</p>
                          {p.live && (
                            <a href={p.live} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-ink underline decoration-2" style={{ textDecorationColor: line.color }}>
                              {t("view_live")} <ArrowUpRight />
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                <RouteList className="relative">
                  {/* line stem */}
                  <span aria-hidden="true" className="stem absolute bottom-6 left-[1.3rem] top-6 w-2.5 rounded-full sm:left-[1.425rem]" style={{ background: line.color }} />
                  {stations.map((p, si) => (
                    <li key={p.code} className="relative grid grid-cols-[3rem_1fr] gap-x-5 border-b border-rule py-8 last:border-b-0 sm:grid-cols-[3.25rem_1fr] md:gap-x-8">
                      <span className="stop relative mt-1 inline-flex" style={stopDelay(si)}>
                        <Roundel code={p.code} color={line.color} size="md" />
                      </span>
                      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_17rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_19rem] lg:gap-10">
                        <div>
                          <h4 className="wide text-xl font-bold leading-tight">{p.title}</h4>
                          {p.period && <p className="mt-1 text-sm tabular-nums text-steel">{p.period}</p>}
                          <div className="mt-4">
                            <StackList items={p.stack} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-4 md:col-start-1 lg:col-start-2">
                          <p className="max-w-[62ch] text-[0.975rem] leading-relaxed">{tr(p.summary, locale)}</p>
                          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.9375rem] font-semibold">
                            {p.live && (
                              <a href={p.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink underline decoration-2" style={{ textDecorationColor: line.color }}>
                                {t("view_live")} <ArrowUpRight />
                              </a>
                            )}
                            {p.repo && (
                              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink underline decoration-2" style={{ textDecorationColor: line.color }}>
                                {t("view_repo")} <ArrowUpRight />
                              </a>
                            )}
                            {!p.live && !p.repo && (
                              <span className="text-sm font-medium text-steel">
                                {p.line === "ai" && !p.company ? t("private_repo") : p.line !== "play" ? t("company_work") : ""}
                              </span>
                            )}
                          </div>
                        </div>
                        <ProjectMedia project={p} className={`${p.image ? "" : "hidden md:flex"} aspect-[16/10] w-full rounded-xl md:col-start-2 md:row-span-2 md:row-start-1 lg:col-start-3 lg:row-span-1`} />
                      </div>
                    </li>
                  ))}
                </RouteList>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ── Experience: one line, a stop per role ─────────────────────────── */

export const Experience = () => {
  const { t } = useTranslation("common");
  const locale = useLocale();

  return (
    <section id="experience" aria-labelledby="exp-title" className="border-t border-rule">
      <div className="mx-auto max-w-page px-5 py-24 sm:px-8 lg:py-32">
        <SectionHead id="exp-title" title={t("experience_title")} intro={t("experience_intro")} />

        <RouteList className="relative">
          <span aria-hidden="true" className="stem absolute bottom-10 left-[0.95rem] top-3 w-2.5 rounded-full bg-line2 md:left-[12.95rem]" />
          {ROLES.map((r, ri) => {
            const color = r.current ? "#ef7c1c" : "#00a84d";
            return (
              <li key={r.company} className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 pb-14 md:grid-cols-[11rem_2.5rem_1fr] md:gap-x-6">
                <p className="col-start-2 mb-2 text-sm font-semibold tabular-nums text-steel md:col-start-1 md:row-start-1 md:mb-0 md:pt-1.5 md:text-right">
                  {r.start}
                  {r.current ? (
                    <>
                      {" – "}
                      <span className="text-line3-ink">{t("present")}</span>
                    </>
                  ) : r.end ? (
                    ` – ${r.end}`
                  ) : null}
                </p>
                <span
                  aria-hidden="true"
                  className="stop relative col-start-1 row-start-1 mt-0.5 h-10 w-10 rounded-full border-[6px] bg-paper md:col-start-2"
                  style={{ borderColor: color, boxShadow: r.current ? "0 0 0 3px #f4f4f1, 0 0 0 6px #ef7c1c" : undefined, ...stopDelay(ri) }}
                />
                <div className="col-start-2 md:col-start-3 md:row-start-1">
                  <h3 className="wide text-2xl font-bold leading-tight">
                    {r.company}
                    {r.current && (
                      <span className="ml-3 inline-block translate-y-[-0.2em] rounded-full bg-line3 px-2.5 py-0.5 align-middle text-xs font-bold uppercase tracking-[0.1em] text-ink">
                        {t("now")}
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 font-medium text-steel">
                    {tr(r.role, locale)} · {tr(r.kind, locale)}
                  </p>
                  <ul className="mt-4 flex max-w-[68ch] flex-col gap-2">
                    {r.points.map((pt, i) => (
                      <li key={i} className="relative pl-5">
                        <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-steel" />
                        {tr(pt, locale)}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </RouteList>

        <div className="mt-6 rounded-2xl border border-rule bg-paper p-6 sm:p-8">
          <h3 className="wide text-lg font-bold">{t("education")}</h3>
          <ul className="mt-4 grid gap-5 sm:grid-cols-3">
            {STUDIES.map((s) => (
              <li key={s.place}>
                <p className="font-semibold leading-snug">{tr(s.title, locale)}</p>
                <p className="mt-1 text-sm text-steel">
                  {s.place} · {s.year}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

/* ── Transfers: the stack ──────────────────────────────────────────── */

export const Transfers = () => {
  const { t } = useTranslation("common");
  const locale = useLocale();
  return (
    <section aria-labelledby="transfers-title" className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-page px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="transfers-title" className="display text-[clamp(2rem,4vw,3rem)]">
              {t("transfers_title")}
            </h2>
            <p className="mt-3 text-steel">{t("transfers_intro")}</p>
          </div>
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:col-span-8">
            {SKILLS.map((g) => (
              <div key={g.group.en}>
                <dt className="flex items-center gap-2.5 font-bold">
                  <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full" style={{ background: g.color }} />
                  {tr(g.group, locale)}
                </dt>
                <dd className="mt-2.5">
                  <StackList items={g.items} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

/* ── Terminus: contact ─────────────────────────────────────────────── */

export const Terminus = () => {
  const { t } = useTranslation("common");
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT.email}`;
    }
  };
  const exits = [
    { label: t("contact_whatsapp"), href: CONTACT.whatsapp, num: "1" },
    { label: t("contact_linkedin"), href: CONTACT.linkedin, num: "2" },
    { label: t("contact_github"), href: CONTACT.github, num: "3" },
    { label: t("contact_cv"), href: CONTACT.cv, num: "4" },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="on-sign bg-sign text-white">
      <div aria-hidden="true" className="flex h-2.5">
        <div className="flex-[3] bg-line2" />
        <div className="flex-[2] bg-line3" />
        <div className="flex-1 bg-line5" />
      </div>
      <div className="mx-auto max-w-page px-5 py-24 sm:px-8 lg:py-32">
        <div className="flex items-center gap-4">
          <Roundel code="JG" color="#ef7c1c" size="lg" transfer />
        </div>
        <h2 id="contact-title" className="display mt-8 max-w-4xl text-[clamp(2.5rem,6.4vw,5.5rem)]">
          {t("contact_title")}
        </h2>
        <p className="mt-6 max-w-[58ch] text-lg text-sign-text">{t("contact_intro")}</p>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${CONTACT.email}`}
            className="wide break-all text-[clamp(1.25rem,3.2vw,2.25rem)] font-bold text-white underline decoration-line3 decoration-[3px] underline-offset-[0.18em] hover:decoration-white"
          >
            {CONTACT.email}
          </a>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-full border border-sign-line px-3 py-1.5 text-sm font-semibold text-sign-text transition-colors hover:border-sign-text hover:text-white"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
          </button>
        </div>

        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {exits.map((e) => (
            <li key={e.num}>
              <a
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl bg-sign-deep px-4 py-4 font-semibold text-white no-underline transition-colors hover:bg-sign-line"
              >
                <span aria-hidden="true" className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#ffd200] text-sm font-extrabold text-ink">
                  {e.num}
                </span>
                {e.label}
                <ArrowRight className="ml-auto h-4 w-4 text-sign-text transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-20 text-sm text-sign-text">
          © {new Date().getFullYear()} · {t("footer")}
        </p>
      </div>
    </section>
  );
};
