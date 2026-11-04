import React from "react";
import { useTranslation } from "next-i18next";
import { LINES, Locale, PROJECTS, Project, ROLES, Role, lineOf } from "../../data/portfolio";
import { ArrowUpRight, Pip, StackList, keepCase, tr, useLocale } from "./parts";

export const tube = (c: string) => ({ "--tube": c } as React.CSSProperties);
export const HOT = "#ff2a6d";
export const EXP_COLOR = "#b9a9d6";
export const SKILL_COLORS = ["#05d9e8", "#f9f002", "#b9a9d6", "#ff2a6d", "#05d9e8"];

/** Oldest role on the ground floor, current work at the top. */
/** Lettering painted into the canvas, keyed by the route's locale. */
export const CANVAS_COPY: Record<Locale, { roof: string[]; station: string; board: string[] }> = {
  en: {
    roof: ["APPLIED AI", "PRODUCT", "PLAYGROUND", "EXPERIENCE"],
    station: "막차 LAST TRAIN",
    board: ["막차 LAST TRAIN", "→ YOUR TEAM · REMOTE / FREELANCE", "ARRIVING", "BOARDING"],
  },
  es: {
    roof: ["IA APLICADA", "PRODUCTO", "PLAYGROUND", "EXPERIENCIA"],
    station: "막차 ÚLTIMO TREN",
    board: ["막차 ÚLTIMO TREN", "→ TU EQUIPO · REMOTO / FREELANCE", "LLEGANDO", "EMBARCANDO"],
  },
  ko: {
    roof: ["응용 AI", "프로덕트", "플레이그라운드", "경력"],
    station: "막차 LAST TRAIN",
    board: ["막차 LAST TRAIN", "→ 당신의 팀 · 원격 / 프리랜스", "도착 중", "탑승 중"],
  },
};

export const rolesUp = [...ROLES].reverse();
export const linesWithProjects = LINES.map((line) => ({
  line,
  projects: PROJECTS.filter((p) => p.line === line.id).sort((a, b) => a.code.localeCompare(b.code)),
}));

export const floorId = (key: string) => `floor-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export type DomStep =
  | { kind: "street"; id: string }
  | { kind: "lobby"; id: string; tower: number }
  | { kind: "floor"; id: string; tower: number; floor: number; project?: Project; role?: Role }
  | { kind: "roof"; id: string }
  | { kind: "station"; id: string }
  | { kind: "platform"; id: string };

export const buildSteps = (): DomStep[] => {
  const steps: DomStep[] = [{ kind: "street", id: "top" }];
  linesWithProjects.forEach(({ line, projects }, t) => {
    steps.push({ kind: "lobby", id: t === 0 ? "work" : `bldg-${line.id}`, tower: t });
    projects.forEach((p, f) => steps.push({ kind: "floor", id: floorId(p.code), tower: t, floor: f, project: p }));
  });
  const et = linesWithProjects.length;
  steps.push({ kind: "lobby", id: "experience", tower: et });
  rolesUp.forEach((r, f) => steps.push({ kind: "floor", id: floorId(r.company), tower: et, floor: f, role: r }));
  steps.push({ kind: "roof", id: "stack" });
  steps.push({ kind: "station", id: "station" });
  steps.push({ kind: "platform", id: "contact" });
  return steps;
};

/** Lobby anchor of a line's tower (the first tower doubles as #work). */
export const lobbyId = (lineIndex: number) => (lineIndex === 0 ? "work" : `bldg-${LINES[lineIndex].id}`);

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
};

/* ── panels ────────────────────────────────────────────────────────── */

export const Panel = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <div data-power className="brackets relative bg-ink/95 p-5 sm:p-7" style={{ boxShadow: `inset 0 1px 0 ${color}, 0 -14px 44px -26px ${color}` }}>
    {children}
  </div>
);

const ProjectLinks = ({ p }: { p: Project }) => {
  const { t } = useTranslation("common");
  const c = lineOf(p.line).color;
  if (!p.live && !p.repo) {
    if (p.line === "play") return null;
    return <span className="hud text-haze-dim">{p.line === "ai" && !p.company ? t("private_repo") : t("company_work")}</span>;
  }
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.9375rem] font-semibold">
      {p.live && (
        <a href={p.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-white underline decoration-2" style={{ textDecorationColor: c }}>
          {t("view_live")} <ArrowUpRight />
        </a>
      )}
      {p.repo && (
        <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-white underline decoration-2" style={{ textDecorationColor: c }}>
          {t("view_repo")} <ArrowUpRight />
        </a>
      )}
    </div>
  );
};

export const FloorProject = ({ p, floor }: { p: Project; floor: number }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");
  const c = lineOf(p.line).color;
  return (
    <Panel color={c}>
      <h3 className="cond power-tube text-[clamp(2.1rem,3.6vw,3.25rem)]" style={tube(c)}>
        {keepCase(p.title)}
      </h3>
      <p className="hud mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-haze">
        <span style={{ color: c }}>{`${floor + 1}F`}</span>
        <Pip color={c} />
        <span>{p.code}</span>
        {p.period && (
          <>
            <Pip color="#4a3a6a" />
            <span>{p.period}</span>
          </>
        )}
      </p>
      {p.facts && <p className="mt-3 font-medium text-bone">{tr(p.facts, locale)}</p>}
      <p className="mt-3 max-w-[62ch] leading-relaxed text-[#cfc3e6]">{tr(p.summary, locale)}</p>
      <div className="mt-4">
        <StackList items={p.stack} color={c} />
      </div>
      <div className="mt-5">
        <ProjectLinks p={p} />
      </div>
      <span className="sr-only">{t("floor_of", { floor: floor + 1 })}</span>
    </Panel>
  );
};

export const FloorRole = ({ r, floor }: { r: Role; floor: number }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");
  const c = r.current ? HOT : EXP_COLOR;
  return (
    <Panel color={c}>
      <h3 className="cond flex flex-wrap items-center gap-x-4 gap-y-2 text-[clamp(2.1rem,3.6vw,3.25rem)]">
        <span className="power-tube" style={tube(c)}>
          {r.company}
        </span>
        {r.current && (
          <span className="hud inline-flex items-center bg-neon-pink px-2 py-1 font-bold text-ink" style={{ boxShadow: "0 0 14px -2px #ff2a6d" }}>
            {t("now")}
          </span>
        )}
      </h3>
      <p className="hud mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-haze">
        <span style={{ color: c }}>{`${floor + 1}F`}</span>
        <Pip color={c} />
        <span>
          {r.start}
          {r.current ? (
            <>
              {" – "}
              <span className="text-neon-pink">{t("present")}</span>
            </>
          ) : r.end ? (
            ` – ${r.end}`
          ) : null}
        </span>
      </p>
      <p className="mt-3 font-medium text-bone">
        {tr(r.role, locale)} <span className="text-haze">· {tr(r.kind, locale)}</span>
      </p>
      <ul className="mt-4 flex max-w-[62ch] flex-col gap-2.5">
        {r.points.map((pt, i) => (
          <li key={i} className="relative pl-5 leading-relaxed text-[#cfc3e6]">
            <span aria-hidden="true" className="absolute left-0 top-[0.72em] h-px w-2.5" style={{ background: c }} />
            {tr(pt, locale)}
          </li>
        ))}
      </ul>
    </Panel>
  );
};

/** The lobby directory: every floor, as elevator buttons. */
export const Directory = ({ floors, color }: { floors: { id: string; label: string; hot?: boolean }[]; color: string }) => {
  const { t } = useTranslation("common");
  return (
    <nav aria-label={t("floor_directory")} className="mt-6">
      <ol className="grid gap-px bg-wire sm:grid-cols-2">
        {floors
          .map((f, i) => ({ ...f, n: i + 1 }))
          .reverse()
          .map((f) => (
            <li key={f.id} className="bg-ink">
              <button
                type="button"
                onClick={() => scrollToId(f.id)}
                className="group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-ink-3"
              >
                <span className="hud w-7 shrink-0" style={{ color: f.hot ? HOT : color }}>{`${f.n}F`}</span>
                <span className="truncate text-[0.9375rem] font-medium text-bone group-hover:text-white">{f.label}</span>
              </button>
            </li>
          ))}
      </ol>
    </nav>
  );
};

