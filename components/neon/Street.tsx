import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { CONTACT, LINES, Project, SKILLS, STUDIES } from "../../data/portfolio";
import { ArrowDown, ArrowRight, ArrowUpRight, Pip, TubeLink, tr, useLocale } from "./parts";
import { ContactPanel } from "./Sections";
import { keepCase, upperKeep } from "./parts";
import {
  Directory,
  EXP_COLOR,
  FloorProject,
  FloorRole,
  Panel,
  SKILL_COLORS,
  buildSteps,
  floorId,
  linesWithProjects,
  lobbyId,
  rolesUp,
  scrollToId,
  tube,
} from "./floors";
import type { SignRect, Step, StreetScene, TowerSpec } from "./scene/street";
import type { StreetAudio } from "./scene/audio";

/* ── KST clock, client only ────────────────────────────────────────── */

const useSeoulTime = () => {
  const [now, setNow] = useState<string>("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
};

const Signal = ({ bars, label }: { bars: number; label: string }) => (
  <span className="flex items-center gap-2" role="img" aria-label={`${label} ${bars}/4`}>
    <span aria-hidden="true">{label}</span>
    <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
      {[1, 2, 3, 4].map((b) => (
        <span
          key={b}
          className="w-[3px] transition-colors duration-150"
          style={{ height: `${b * 25}%`, background: b <= bars ? "#05d9e8" : "rgba(185,169,214,0.25)", boxShadow: b <= bars ? "0 0 4px #05d9e8" : undefined }}
        />
      ))}
    </span>
  </span>
);

/** Signs in the order the scene builds them: tower by tower, floor by floor. */
const signProjects: Project[] = ([] as Project[]).concat(...linesWithProjects.map(({ projects }) => projects.filter((p) => p.sign && p.featured)));
const START = Math.max(0, signProjects.findIndex((p) => p.code === "A01"));

/* ── the street, its towers, and the floors ───────────────────────── */

export const Street = () => {
  const { t } = useTranslation("common");
  const locale = useLocale();
  const clock = useSeoulTime();
  const steps = useMemo(buildSteps, []);
  const roofRaw = t("city_roof", { returnObjects: true }) as unknown;
  const roofNames = Array.isArray(roofRaw) ? (roofRaw as string[]) : ["APPLIED AI", "PRODUCT", "PLAYGROUND", "EXPERIENCE"];
  const rainRaw = t("rain_levels", { returnObjects: true }) as unknown;
  const rainLevels = Array.isArray(rainRaw) ? (rainRaw as string[]) : ["Drizzle", "Downpour", "Monsoon"];
  const tickRaw = t("ticker", { returnObjects: true }) as unknown;
  const boardRaw = t("platform_board", { returnObjects: true }) as unknown;
  const ticker = Array.isArray(tickRaw) ? (tickRaw as string[]) : [];

  const [active, setActive] = useState(START);
  const [rects, setRects] = useState<SignRect[]>([]);
  const [rain, setRain] = useState(1);
  const [sound, setSound] = useState(false);
  const [hit, setHit] = useState(false);
  const [bars, setBars] = useState(4);
  const [ready, setReady] = useState(false);
  const [at, setAt] = useState(0);

  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scene = useRef<StreetScene | null>(null);
  const audio = useRef<StreetAudio | null>(null);
  const soundOn = useRef(false);
  const visible = useRef(true);
  const onStreet = useRef(true);
  const signRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hitTimer = useRef<number>();

  const onStrike = useCallback((info: { pan: number; delay: number; power: number; ambient: boolean }) => {
    if (!info.ambient) {
      setHit(true);
      setBars(1);
      window.clearTimeout(hitTimer.current);
      hitTimer.current = window.setTimeout(() => setHit(false), 450);
      window.setTimeout(() => setBars(2), 500);
      window.setTimeout(() => setBars(3), 1100);
      window.setTimeout(() => setBars(4), 1800);
    }
    if (soundOn.current) audio.current?.thunder(info.pan, info.delay, info.power);
  }, []);

  // one canvas for the street and the towers; rebuilt per locale (lettering)
  useEffect(() => {
    let disposed = false;
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    let raf = 0;
    let resizeTimer = 0;
    let centers: number[] = [];
    let lastStep = -1;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      centers = stepRefs.current.map((el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top + window.scrollY + r.height / 2;
      });
    };
    const progress = () => {
      const st = stage.current;
      if (!st || !centers.length) return 0;
      const r = st.getBoundingClientRect();
      const vc = window.scrollY + r.top + r.height / 2;
      if (vc <= centers[0]) return 0;
      for (let i = 0; i < centers.length - 1; i++) {
        if (vc < centers[i + 1]) return i + (vc - centers[i]) / (centers[i + 1] - centers[i]);
      }
      return centers.length - 1;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = progress();
        scene.current?.setProgress(p);
        // the street's overlays fade as the camera leaves it
        const v = 1 - Math.min(1, Math.max(0, p * 2.2));
        const sec = section.current;
        if (sec) {
          sec.style.setProperty("--street", v.toFixed(3));
          sec.dataset.street = v > 0.05 ? "on" : "off";
        }
        onStreet.current = v > 0.5;
        const s = Math.round(p);
        if (s !== lastStep) {
          lastStep = s;
          setAt(s);
        }
      });
    };

    const boot = async () => {
      const { StreetScene } = await import("./scene/street");
      if (disposed || !canvas.current) return;
      const towers: TowerSpec[] = [
        ...linesWithProjects.map(({ line, projects }, i) => ({
          id: line.id,
          color: line.color,
          roof: roofNames[i] ?? line.letter,
          floors: projects.map((p) => ({ text: upperKeep(p.title), image: p.image, sign: p.featured ? p.sign : undefined })),
        })),
        {
          id: "experience",
          color: EXP_COLOR,
          roof: roofNames[3] ?? "EXPERIENCE",
          floors: rolesUp.map((r) => ({ text: r.company.toUpperCase(), hot: r.current })),
        },
      ];
      const engineSteps: Step[] = steps.map((s) =>
        s.kind === "lobby" ? { kind: "lobby", tower: s.tower } : s.kind === "floor" ? { kind: "floor", tower: s.tower, floor: s.floor } : { kind: s.kind },
      );
      const s = new StreetScene({
        canvas: canvas.current,
        overlay: overlay.current,
        towers,
        roofSigns: SKILLS.map((g, i) => ({ text: tr(g.group, locale).toUpperCase(), color: SKILL_COLORS[i % SKILL_COLORS.length] })),
        station: t("station_sign"),
        board: Array.isArray(boardRaw) ? (boardRaw as string[]) : ["막차 LAST TRAIN", "→", "ARRIVING", "BOARDING"],
        steps: engineSteps,
        reduced,
        onLayout: (r) => setRects(r),
        onStrike,
        onBuzz: (lvl) => {
          if (soundOn.current) audio.current?.setBuzz(lvl);
        },
      });
      scene.current = s;
      const text = signProjects.map((p) => p.sign ?? "").join("") + roofNames.join("") + "막차";
      const fonts = document.fonts
        ? Promise.all([document.fonts.load(`800 40px "Gothic A1 Heavy"`, text), document.fonts.load(`800 40px Archivo`, "OPEN APPLIED")])
        : Promise.resolve();
      await Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).catch(() => undefined);
      if (disposed) return;
      s.layout();
      s.setActive(START);
      measure();
      onScroll();
      s.start();
      setReady(true);

      ro = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          s.layout();
          measure();
          onScroll();
        }, 120);
      });
      if (stage.current) ro.observe(stage.current);
      if (section.current) ro.observe(section.current);
      io = new IntersectionObserver(([e]) => {
        visible.current = e.isIntersecting;
        if (e.isIntersecting && document.visibilityState === "visible") s.start();
        else s.stop();
      });
      if (section.current) io.observe(section.current);
    };
    boot();

    const onVis = () => {
      const s = scene.current;
      if (!s) return;
      if (document.visibilityState === "hidden") {
        s.stop();
        audio.current?.suspend();
      } else {
        if (visible.current) s.start();
        if (soundOn.current) audio.current?.resume();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      ro?.disconnect();
      io?.disconnect();
      scene.current?.stop();
      scene.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, onStrike]);

  useEffect(() => () => audio.current?.close(), []);

  useEffect(() => {
    scene.current?.setActive(active);
  }, [active]);

  useEffect(() => {
    scene.current?.setRain(rain);
    audio.current?.setRain(rain);
  }, [rain]);

  useEffect(() => {
    const id = window.setInterval(() => setBars((b) => (b >= 3 ? (Math.random() < 0.3 ? 3 : 4) : b)), 2200);
    return () => window.clearInterval(id);
  }, []);

  const toggleSound = useCallback(async () => {
    const next = !soundOn.current;
    soundOn.current = next;
    setSound(next);
    if (next && !audio.current) {
      const { StreetAudio } = await import("./scene/audio");
      try {
        audio.current = new StreetAudio();
        audio.current.setRain(rain);
      } catch {
        soundOn.current = false;
        setSound(false);
        return;
      }
    }
    audio.current?.setMuted(!next);
    if (!next) audio.current?.setBuzz(0);
  }, [rain]);

  const cycleRain = useCallback(() => setRain((r) => (r + 1) % 3), []);
  const strike = useCallback(() => scene.current?.strike(), []);

  const onPointerMove = (e: React.PointerEvent) => {
    const box = stage.current?.getBoundingClientRect();
    if (!box) return;
    scene.current?.setPointer(((e.clientX - box.left) / box.width) * 2 - 1, ((e.clientY - box.top) / box.height) * 2 - 1);
    // a tower under the pointer is a door
    if (canvas.current) {
      const over = (scene.current?.pick(e.clientX - box.left, e.clientY - box.top) ?? -1) >= 0;
      canvas.current.style.cursor = over ? "pointer" : "crosshair";
    }
  };
  // a tower under the pointer is a shortcut into it; anywhere else calls lightning
  const onCanvasDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const tower = scene.current?.pick(x, y) ?? -1;
    if (tower >= 0) scrollToId(tower < LINES.length ? lobbyId(tower) : "experience");
    else scene.current?.strike(x, y);
  };

  const goToSign = (i: number) => {
    setActive(i);
    window.setTimeout(() => scrollToId(floorId(signProjects[i].code)), 480);
  };
  const onSignKey = (e: React.KeyboardEvent) => {
    const n = signProjects.length;
    let next = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    signRefs.current[next]?.focus();
  };

  // elevator readout
  const cur = steps[Math.max(0, Math.min(steps.length - 1, at))];
  const tIndex = cur.kind === "lobby" || cur.kind === "floor" ? cur.tower : -1;
  const tColor = tIndex >= 0 ? (tIndex < LINES.length ? LINES[tIndex].color : EXP_COLOR) : "#05d9e8";
  const tFloors = tIndex >= 0 ? (tIndex < LINES.length ? linesWithProjects[tIndex].projects.length : rolesUp.length) : 0;
  const readout =
    cur.kind === "floor" ? `${cur.floor + 1}F` : cur.kind === "lobby" ? "L" : cur.kind === "roof" ? "R" : cur.kind === "station" ? "B1" : cur.kind === "platform" ? "B2" : "";

  const items = [...ticker, ...ticker];

  const stepClass = "relative flex min-h-[55svh] scroll-mt-14 items-end px-4 pb-10 pt-[30svh] sm:px-8 lg:items-center lg:px-[5vw] lg:py-12";
  const panelBox = "w-full lg:ml-auto lg:w-[min(36rem,42vw)]";

  return (
    <section id="top" ref={section} data-street="on" aria-labelledby="hero-name" className="relative bg-ink">
      {/* HUD layer: above the scrolling floors for the whole ride */}
      <div className="pointer-events-none sticky top-14 z-30 h-0">
        <div className="relative h-[max(calc(100svh-3.5rem),560px)]">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-36 sm:h-32"
            style={{ opacity: "calc(1 - var(--street, 1))", background: "linear-gradient(180deg, rgba(5,1,15,0.96) 0%, rgba(5,1,15,0.88) 55%, rgba(5,1,15,0) 100%)" }}
          />
          {/* HUD: stays for the whole ride */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 px-4 pt-3 sm:px-[2.5vw] sm:pt-4">
            <div className="hud brackets pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-1 bg-ink/50 px-3 py-2 text-[#d8ccef]">
              <span>
                {t("hud_location")} <span className="text-white">{clock}</span> KST
              </span>
              <span className="flex items-center gap-2">
                <Pip color="#05d9e8" />
                <span className="text-neon-cyan">{t("hud_status")}</span>
              </span>
              <Signal bars={bars} label={t("hud_signal")} />
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="hud pointer-events-auto flex items-center gap-1.5">
                <button type="button" onClick={cycleRain} className="hud-btn" aria-label={`${t("rain")}: ${rainLevels[rain]}`}>
                  <span className="hidden sm:inline">{t("rain")}</span>
                  <span className="text-white">{rainLevels[rain]}</span>
                </button>
                <button type="button" onClick={toggleSound} aria-pressed={sound} className="hud-btn" aria-label={sound ? t("sound_on") : t("sound_off")}>
                  {t("sound")}
                  <span className={sound ? "text-neon-cyan" : "text-haze-dim"}>{sound ? "ON" : "OFF"}</span>
                </button>
                <button type="button" onClick={strike} className="hud-btn hidden sm:inline-flex" aria-label={t("strike_label")}>
                  <span className="text-neon-acid">{t("strike")}</span>
                </button>
              </div>
              {readout && (
                <div aria-hidden="true" className="hud brackets flex items-center gap-3 bg-ink/70 px-3 py-2">
                  <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" style={{ color: tColor }}>
                    <path d="M5 1 9 8H1z" fill="currentColor" />
                  </svg>
                  <span className="cond text-[1.75rem] leading-none text-white" style={{ textShadow: `0 0 10px ${tColor}` }}>
                    {readout}
                  </span>
                  {tFloors > 0 && (
                    <span className="text-haze">
                      / {tFloors}F<span className="hidden sm:inline"> · {roofNames[tIndex]}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* the stage: the street, then the towers, behind everything that scrolls */}
      <div
        ref={stage}
        onPointerMove={onPointerMove}
        className="street-stage sticky top-14 h-[calc(100svh-3.5rem)] min-h-[560px] overflow-hidden"
      >
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(#05010f 0%, #12042a 40%, #2a0a4c 72%, #07021a 72.5%, #05010f 100%)" }} />
        <canvas
          ref={canvas}
          onPointerDown={onCanvasDown}
          role="img"
          aria-label={t("scene_label")}
          className={`absolute inset-0 h-full w-full cursor-crosshair touch-pan-y transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        />
        <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 opacity-50" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(5,1,15,0.72) 100%)" }} />

        {/* sign hit-areas, in world units; the scene hands them the camera */}
        <div ref={overlay} className="street-only pointer-events-none absolute left-0 top-0 h-0 w-0 origin-top-left will-change-transform">
          <div role="radiogroup" aria-label={t("signs_label")} onKeyDown={onSignKey}>
            {rects.map((r, i) => {
              const p = signProjects[i];
              if (!p) return null;
              const on = i === active;
              const w = Math.max(44, r.w + 10);
              return (
                <button
                  key={p.code}
                  ref={(el) => (signRefs.current[i] = el)}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={`${p.title} · ${p.sign ?? ""}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => goToSign(i)}
                  className="pointer-events-auto absolute"
                  style={{ left: r.x + r.w / 2 - w / 2, top: r.y - 4, width: w, height: r.h + 8 }}
                />
              );
            })}
          </div>
        </div>

        {/* scrim behind the copy */}
        <div
          aria-hidden="true"
          className="street-only pointer-events-none absolute bottom-0 left-0 top-[40%] hidden w-[50vw] lg:block"
          style={{
            background: "linear-gradient(90deg, rgba(5,1,15,0.82) 0%, rgba(5,1,15,0.62) 55%, rgba(5,1,15,0) 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 22%)",
            maskImage: "linear-gradient(180deg, transparent 0%, #000 22%)",
          }}
        />
        <div
          aria-hidden="true"
          className="street-only pointer-events-none absolute inset-x-0 bottom-0 h-[58%] lg:hidden"
          style={{ background: "linear-gradient(0deg, rgba(5,1,15,0.78) 0%, rgba(5,1,15,0.5) 60%, rgba(5,1,15,0) 100%)" }}
        />

        {/* the name, lit over the street */}
        <div className="street-only pointer-events-none absolute inset-x-0 bottom-12 flex flex-col px-4 sm:px-[5vw] lg:inset-x-auto lg:bottom-16 lg:left-0 lg:top-20 lg:w-[44vw] lg:justify-center">
          <h1
            id="hero-name"
            data-text={"Jorge Ignacio\nGaray"}
            className={`cond chroma glitch text-[clamp(3.4rem,min(8.4vw,11vh),6rem)] text-white ${hit ? "is-hit" : ""}`}
          >
            Jorge Ignacio
            <br />
            Garay
          </h1>
          {locale !== "ko" && (
            <p lang="ko" className="mt-3 text-[0.95rem] font-bold tracking-[0.04em] text-haze">
              {t("name_alt")}
            </p>
          )}
          <p className="mt-4 max-w-[30ch] text-[clamp(1.125rem,1.7vw,1.4rem)] font-semibold leading-snug text-white">{t("role")}</p>
          <p className="mt-3 hidden max-w-[44ch] text-[0.975rem] leading-relaxed text-[#cfc3e6] lg:block">{t("intro")}</p>
          <div className="pointer-events-auto mt-6 flex flex-wrap items-center gap-3">
            <TubeLink href={`mailto:${CONTACT.email}`} color="#ff2a6d" solid>
              {t("cta_write")} <ArrowRight />
            </TubeLink>
            <TubeLink href={CONTACT.cv} color="#05d9e8" external>
              {t("cta_cv")} <ArrowUpRight />
            </TubeLink>
          </div>
          <p className="mt-5 hidden text-sm text-haze lg:block">{t("signs_hint")}</p>
          <a href="#work" className="hud pointer-events-auto mt-4 inline-flex items-center gap-2 self-start py-1 text-[#d8ccef] no-underline lg:hidden">
            <Pip color="#05d9e8" />
            <span className="text-white">{t("enter_city")}</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* newswire */}
        <div className="street-only ticker absolute inset-x-0 bottom-0 flex h-10 items-center overflow-hidden border-t border-wire bg-ink/85" aria-label={t("ticker_label")} role="region">
          <span className="hud relative z-10 flex h-full shrink-0 items-center gap-2 bg-neon-pink px-3 font-bold text-ink">{t("ticker_label")}</span>
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <ul className="ticker-track flex w-max items-center" style={{ "--ticker-dur": `${Math.max(1, ticker.length) * 14}s` } as React.CSSProperties}>
              {items.map((s, i) => (
                <li key={i} aria-hidden={i >= ticker.length ? true : undefined} className="hud flex items-center gap-4 whitespace-nowrap pl-6 text-[#d8ccef]">
                  <Pip color={["#ff2a6d", "#05d9e8", "#f9f002"][i % 3]} />
                  {keepCase(s)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* the ride: each block is a stop for the camera, in the page's own flow */}
      <div className="relative z-10 -mt-[max(calc(100svh-3.5rem),560px)]">
        {steps.map((s, i) => {
          const ref = (el: HTMLDivElement | null) => (stepRefs.current[i] = el);
          if (s.kind === "street") {
            return <div key="street" ref={ref} aria-hidden="true" className="pointer-events-none h-[max(calc(100svh-3.5rem),560px)]" />;
          }
          if (s.kind === "lobby") {
            const isExp = s.tower >= linesWithProjects.length;
            const line = isExp ? null : linesWithProjects[s.tower].line;
            const c = line ? line.color : EXP_COLOR;
            const floors = isExp
              ? rolesUp.map((r) => ({ id: floorId(r.company), label: r.company, hot: r.current }))
              : linesWithProjects[s.tower].projects.map((p) => ({ id: floorId(p.code), label: p.title }));
            return (
              <div key={s.id} id={s.id} ref={ref} className={stepClass}>
                <div className={panelBox}>
                  <Panel color={c}>
                    <h2 className="cond power-tube text-[clamp(2.5rem,5vw,4.25rem)]" style={tube(c)}>
                      {line ? tr(line.name, locale) : t("experience_title")}
                    </h2>
                    <p className="mt-4 leading-relaxed text-[#cfc3e6]">{line ? tr(line.blurb, locale) : t("experience_intro")}</p>
                    {s.tower === 0 && <p className="mt-3 leading-relaxed text-[#cfc3e6]">{t("work_intro")}</p>}
                    {isExp && (
                      <div className="mt-5 border-t border-wire pt-4">
                        <h3 className="hud text-neon-cyan">{t("education")}</h3>
                        <ul className="mt-3 grid gap-3">
                          {STUDIES.map((st) => (
                            <li key={st.place} className="flex flex-wrap items-baseline justify-between gap-x-4">
                              <span className="font-semibold text-white">{tr(st.title, locale)}</span>
                              <span className="hud text-haze">
                                {st.place} · {st.year}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Directory floors={floors} color={c} />
                  </Panel>
                </div>
              </div>
            );
          }
          if (s.kind === "floor") {
            return (
              <div key={s.id} id={s.id} ref={ref} className={stepClass}>
                <div className={panelBox}>{s.project ? <FloorProject p={s.project} floor={s.floor} /> : s.role ? <FloorRole r={s.role} floor={s.floor} /> : null}</div>
              </div>
            );
          }
          if (s.kind === "roof") {
            return (
              <div key={s.id} id={s.id} ref={ref} className={stepClass}>
                <div className={panelBox}>
                  <Panel color="#f9f002">
                    <h2 className="cond chroma text-[clamp(2.75rem,5vw,4.25rem)] text-white">{t("stack_title")}</h2>
                    <p className="mt-3 text-[#cfc3e6]">{t("stack_intro")}</p>
                    <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                      {SKILLS.map((g, gi) => (
                        <div key={g.group.en}>
                          <dt className="hud flex items-center gap-2" style={{ color: SKILL_COLORS[gi % SKILL_COLORS.length] }}>
                            <Pip color={SKILL_COLORS[gi % SKILL_COLORS.length]} />
                            {tr(g.group, locale)}
                          </dt>
                          <dd className="mt-2 leading-relaxed text-bone">{g.items.join(" · ")}</dd>
                        </div>
                      ))}
                    </dl>
                  </Panel>
                </div>
              </div>
            );
          }
          if (s.kind === "platform") {
            return (
              <div key={s.id} id={s.id} ref={ref} aria-labelledby="contact-title" role="region" className={`${stepClass} lg:min-h-[calc(100svh-3.5rem)]`}>
                <div className={panelBox}>
                  <ContactPanel />
                </div>
              </div>
            );
          }
          return <div key={s.id} id={s.id} ref={ref} aria-hidden="true" className="h-[50svh]" />;
        })}
      </div>

    </section>
  );
};

