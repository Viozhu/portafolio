/*
 * The street and its four towers, one canvas, one camera.
 *
 * World units are the hero's own CSS pixels: at the first screen the camera is
 * the identity and the page shows the alley. Scrolling moves the camera into the
 * same towers the visitor already saw: each tower is a line of work, each floor
 * a project, a glass elevator rides the facade, the stack lights up over the
 * roofs and the walk ends at the last-train station down the street.
 *
 * Draw order: sky → far skylines (bitmaps, parallax) → near world (vector:
 * towers, signs, stalls, walkers) → a rippled reflection of everything above
 * the kerb → rain → lightning. Nothing is loaded except fonts and the
 * project screenshots shown through the windows.
 */

/* ── public types ─────────────────────────────────────────────────── */

export interface FloorSpec {
  /** Lettering shown in the window when there is no picture. */
  text: string;
  image?: string;
  /** Lit magenta regardless of the tower colour (current roles). */
  hot?: boolean;
  /** Hangul neon sign hanging beside this floor (featured projects). */
  sign?: string;
}

export interface TowerSpec {
  id: string;
  color: string;
  roof: string;
  floors: FloorSpec[];
}

export type StepKind = "street" | "lobby" | "floor" | "roof" | "station" | "platform";

export interface Step {
  kind: StepKind;
  tower?: number;
  floor?: number;
}

export interface SignRect {
  x: number;
  y: number;
  w: number;
  h: number;
  tower: number;
  floor: number;
}

export interface StrikeInfo {
  pan: number;
  delay: number;
  power: number;
  ambient: boolean;
}

export interface StreetOptions {
  canvas: HTMLCanvasElement;
  /** Holds the sign hit-areas; receives the camera as a CSS matrix. */
  overlay: HTMLElement | null;
  towers: TowerSpec[];
  roofSigns: { text: string; color: string }[];
  station: string;
  /** Lines of the hanging departure board on the platform. */
  board: string[];
  steps: Step[];
  reduced: boolean;
  onLayout: (signs: SignRect[]) => void;
  onStrike?: (info: StrikeInfo) => void;
  onBuzz?: (level: number) => void;
}

/* ── helpers ──────────────────────────────────────────────────────── */

const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const canvasOf = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.ceil(w));
  c.height = Math.max(1, Math.ceil(h));
  return c;
};
const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgba = (hex: string, a: number) => {
  const [r, g, b] = rgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};
const mix = (a: string, b: string, t: number) => {
  const x = rgb(a);
  const y = rgb(b);
  const c = x.map((v, i) => Math.round(v + (y[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const hasHangul = (s: string) => /[가-힣]/.test(s);

const HANGUL = '"Gothic A1 Heavy", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif';
const LATIN = 'Archivo, "Arial Narrow", sans-serif';
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

/* ── internal types ───────────────────────────────────────────────── */

interface Win {
  x: number;
  y: number;
  w: number;
  h: number;
  lit: boolean;
  on: string;
  off: string;
}
interface Layer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  lit: HTMLCanvasElement;
  margin: number;
  follow: number;
  wins: Win[];
}
interface Tower {
  spec: TowerSpec;
  x: number;
  w: number;
  lobby: number;
  floorH: number;
  top: number;
  images: (HTMLImageElement | null)[];
  lobbyStep: number;
}
interface Sign {
  text: string;
  color: string;
  rect: SignRect;
  g: number;
  level: number;
  ev: number;
  evEnd: number;
  next: number;
  flick: number;
  index: number;
}
interface Filler {
  x: number;
  w: number;
  h: number;
  tone: string;
  wins: { x: number; y: number; w: number; h: number; c: string }[];
}
interface Tent {
  x: number;
  w: number;
  h: number;
  sprite: HTMLCanvasElement;
  pad: number;
}
interface Walker {
  x: number;
  dir: number;
  speed: number;
  h: number;
  color: string;
  phase: number;
}
interface Cam {
  x: number;
  y: number;
  z: number;
}

const MAX_DROPS = 1500;
const MAX_SPLASH = 600;
const MAX_RIPPLES = 240;
const MAX_STEAM = 40;

export class StreetScene {
  private o: StreetOptions;
  private ctx: CanvasRenderingContext2D;
  private dpr = 1;
  private W = 0;
  private H = 0;
  private horizon = 0;
  private mobile = false;
  private rand = seeded(61);

  private sky!: HTMLCanvasElement;
  private clouds!: HTMLCanvasElement;
  private fog!: HTMLCanvasElement;
  private layers: Layer[] = [];
  private towers: Tower[] = [];
  private signs: Sign[] = [];
  private fillers: Filler[] = [];
  private open: { x: number; y: number; w: number; h: number; g: number } | null = null;
  private tents: Tent[] = [];
  private walkers: Walker[] = [];
  private stationX = 0;
  private openLimit = NaN;
  private trainArrived = -1;
  private keys: Cam[] = [];
  private asphalt!: HTMLCanvasElement;
  private refl!: HTMLCanvasElement;
  private reflCtx!: CanvasRenderingContext2D;
  private puff!: HTMLCanvasElement;
  private spills = new Map<string, HTMLCanvasElement>();

  private dx = new Float32Array(MAX_DROPS);
  private dy = new Float32Array(MAX_DROPS);
  private dz = new Float32Array(MAX_DROPS);
  private dl = new Float32Array(MAX_DROPS);
  private dv = new Float32Array(MAX_DROPS);
  private sx = new Float32Array(MAX_SPLASH);
  private sy = new Float32Array(MAX_SPLASH);
  private svx = new Float32Array(MAX_SPLASH);
  private svy = new Float32Array(MAX_SPLASH);
  private sl = new Float32Array(MAX_SPLASH);
  private sHead = 0;
  private rx = new Float32Array(MAX_RIPPLES);
  private ry = new Float32Array(MAX_RIPPLES);
  private rr = new Float32Array(MAX_RIPPLES);
  private rl = new Float32Array(MAX_RIPPLES);
  private rHead = 0;
  private px = new Float32Array(MAX_STEAM);
  private py = new Float32Array(MAX_STEAM);
  private pr = new Float32Array(MAX_STEAM);
  private pl = new Float32Array(MAX_STEAM);
  private pHead = 0;

  private rainLevel = 1;
  private active = -1;
  private p = 0;
  private time = 0;
  private last = 0;
  private raf = 0;
  private running = false;
  private winClock = 0;
  private steamClock = 0;
  private zoom = 1;

  private pointer = { x: 0, y: 0 };
  private pointerTarget = { x: 0, y: 0 };
  private lastPointer = -1e9;

  private strikeAt = -1e9;
  private strikeAmbient = false;
  private bolt: number[][] = [];
  private nextAmbient = 0;
  private flash = 0;

  constructor(o: StreetOptions) {
    this.o = o;
    this.ctx = o.canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;
    this.nextAmbient = 9 + Math.random() * 10;
  }

  /* ── public API ─────────────────────────────────────────────────── */

  layout() {
    const parent = this.o.canvas.parentElement!;
    const W = parent.clientWidth;
    const H = parent.clientHeight;
    if (!W || !H) return;
    this.W = W;
    this.H = H;
    this.mobile = W < 768;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.mobile ? 1.75 : 2);
    const c = this.o.canvas;
    c.width = Math.round(W * this.dpr);
    c.height = Math.round(H * this.dpr);
    c.style.width = `${W}px`;
    c.style.height = `${H}px`;
    this.horizon = Math.round(H * (this.mobile ? 0.7 : 0.74));
    this.rand = seeded(61);
    this.buildSky();
    this.buildLayers();
    this.buildTowers();
    this.buildStreet();
    this.computeKeys();
    for (let i = 0; i < MAX_DROPS; i++) this.respawn(i, Math.random() * H * 1.1 - H * 0.1);
    this.o.onLayout(this.signs.map((s) => s.rect));
    this.frame(0);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.max(0, Math.min(0.05, (now - this.last) / 1000));
      this.last = now;
      this.frame(dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Fractional step index from the page scroll. */
  setProgress(p: number) {
    this.p = p;
    if (!this.running) this.frame(0);
  }

  /** Light up one sign (index into the signs list) with a power-on stutter. */
  setActive(i: number) {
    if (i === this.active) return;
    this.active = i;
    const s = this.signs[i];
    if (!s || this.o.reduced) return;
    s.ev = 1;
    s.evEnd = this.time + 0.5;
  }

  setRain(level: number) {
    this.rainLevel = level;
  }

  setPointer(nx: number, ny: number) {
    const k = this.o.reduced ? 0.35 : 1;
    this.pointerTarget.x = clamp(nx, -1, 1) * k;
    this.pointerTarget.y = clamp(ny, -1, 1) * k;
    this.lastPointer = this.time;
  }

  strike(x?: number, y?: number) {
    // never more than one strike per 1.2s: three flash pulses each, kept under 3 flashes a second
    if (this.time - this.strikeAt < 1.2) return;
    this.fire(x ?? this.W * (0.15 + Math.random() * 0.7), y ?? this.H * 0.35, false);
  }

  /** Fit the OPEN sign between the HUD and the top of the name block (stage px). */
  fitOpen(nameTop: number) {
    this.openLimit = nameTop;
    this.placeOpen();
  }

  private placeOpen() {
    const { W, H, mobile } = this;
    this.open = null;
    if (mobile || !W) return;
    const top = 60;
    const limit = Number.isFinite(this.openLimit) ? this.openLimit - 14 : Math.max(78, H * 0.1) + 60;
    const g = Math.min(clamp(W * 0.026, 26, 40), (limit - top) / 1.5);
    if (g < 18) return;
    const h = g * 1.5;
    this.open = { x: W * 0.3, y: Math.max(top, limit - h), w: g * 3.4, h, g };
  }

  /** Which tower is under a screen point, or -1. */
  pick(sx: number, sy: number) {
    const cam = this.camera();
    const wx = (sx - this.W / 2) / cam.z + cam.x;
    const wy = (sy - this.H / 2) / cam.z + cam.y;
    return this.towers.findIndex((t) => wx >= t.x && wx <= t.x + t.w && wy >= t.top - 40 && wy <= this.horizon);
  }

  /* ── build ──────────────────────────────────────────────────────── */

  private buildSky() {
    const { W, H } = this;
    const sky = canvasOf(W, H);
    const g = sky.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#05010f");
    grad.addColorStop(0.35, "#12042a");
    grad.addColorStop(0.62, "#2a0a4c");
    grad.addColorStop(0.78, "#3d0f5e");
    grad.addColorStop(1, "#2a0a4c");
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);
    const glows: [number, string, number][] = [
      [0.2, "#ff2a6d", 0.16],
      [0.55, "#7a2bd6", 0.2],
      [0.85, "#05d9e8", 0.1],
    ];
    for (const [fx, col, a] of glows) {
      const r = W * 0.45;
      const rg = g.createRadialGradient(W * fx, this.horizon, 0, W * fx, this.horizon, r);
      rg.addColorStop(0, rgba(col, a));
      rg.addColorStop(1, rgba(col, 0));
      g.fillStyle = rg;
      g.fillRect(0, 0, W, H);
    }
    this.sky = sky;

    const cl = canvasOf(W, this.horizon * 0.6);
    const cg = cl.getContext("2d")!;
    const r = seeded(7);
    for (let i = 0; i < 26; i++) {
      const x = r() * W;
      const y = r() * this.horizon * 0.42;
      const rw = W * (0.08 + r() * 0.2);
      const rh = rw * (0.18 + r() * 0.15);
      const rgd = cg.createRadialGradient(x, y, 0, x, y, rw);
      rgd.addColorStop(0, "rgba(150,120,230,0.32)");
      rgd.addColorStop(1, "rgba(150,120,230,0)");
      cg.fillStyle = rgd;
      cg.save();
      cg.translate(x, y);
      cg.scale(1, rh / rw);
      cg.translate(-x, -y);
      cg.fillRect(x - rw, y - rw, rw * 2, rw * 2);
      cg.restore();
    }
    this.clouds = cl;

    const fog = canvasOf(8, 160);
    const fg = fog.getContext("2d")!;
    const fgrad = fg.createLinearGradient(0, 0, 0, 160);
    fgrad.addColorStop(0, "rgba(70,24,120,0)");
    fgrad.addColorStop(1, "rgba(70,24,120,0.42)");
    fg.fillStyle = fgrad;
    fg.fillRect(0, 0, 8, 160);
    this.fog = fog;
  }

  /** Three distant skylines as bitmaps; the near world is drawn live. */
  private buildLayers() {
    const { W, horizon, mobile } = this;
    const unit = clamp(W / 1440, 0.55, 1.3);
    const tones = ["#1a0433", "#13032a", "#0c021d"];
    const litTones = ["#5c43a3", "#45307f", "#2f1d5c"];
    const margins = mobile ? [W * 0.4, W * 0.5, W * 0.6] : [W * 0.3, W * 0.4, W * 0.5];
    const follow = [0.06, 0.14, 0.28];
    const heights: [number, number][] = [
      [0.42, 0.82],
      [0.32, 0.66],
      [0.22, 0.52],
    ];
    const widths: [number, number][] = [
      [26, 70],
      [40, 96],
      [60, 130],
    ];
    const winSize = [
      [2, 2, 3],
      [2.5, 3, 4],
      [3.5, 4, 5],
    ];
    const litP = [0.3, 0.22, 0.16];
    const warm = ["#ffd38a", "#ffb35c", "#9fd8ff", "#ff9ad0", "#e8f0ff"];
    this.layers = [];
    for (let i = 0; i < 3; i++) {
      const margin = margins[i];
      const lw = W + margin * 2;
      const can = canvasOf(lw, horizon);
      const g = can.getContext("2d")!;
      const lit = canvasOf(lw * 0.5, horizon * 0.5);
      const lg = lit.getContext("2d")!;
      lg.setTransform(0.5, 0, 0, 0.5, 0, 0);
      const wins: Win[] = [];
      const alphaW = 0.5 + i * 0.16;
      let x = -this.rand() * 40;
      while (x < lw) {
        const bw = (widths[i][0] + this.rand() * (widths[i][1] - widths[i][0])) * unit;
        const bh = horizon * (heights[i][0] + this.rand() * (heights[i][1] - heights[i][0]));
        const top = horizon - bh;
        g.fillStyle = tones[i];
        g.fillRect(x, top, bw, bh + 2);
        lg.fillStyle = litTones[i];
        lg.fillRect(x, top, bw, bh + 2);
        if (this.rand() < 0.3) {
          const sw = bw * 0.5;
          g.fillRect(x + bw * 0.25, top - 10, sw, 11);
          lg.fillRect(x + bw * 0.25, top - 10, sw, 11);
        }
        const [ww, wh, gap] = winSize[i].map((v) => v * unit);
        const cols = Math.floor((bw - gap * 2) / (ww + gap));
        const rows = Math.floor((bh - gap * 3) / (wh + gap * 1.4));
        for (let cI = 0; cI < cols; cI++) {
          for (let rI = 0; rI < rows; rI++) {
            const wx = x + gap * 1.5 + cI * (ww + gap);
            const wy = top + gap * 2 + rI * (wh + gap * 1.4);
            if (wy > horizon - 6) continue;
            const on = this.rand() < litP[i];
            const col = warm[Math.floor(this.rand() * warm.length)];
            const onC = rgba(col, alphaW * (0.55 + this.rand() * 0.45));
            const offC = mix(tones[i], "#2a1450", 0.3);
            g.fillStyle = on ? onC : offC;
            g.fillRect(wx, wy, ww, wh);
            if (this.rand() < 0.4) wins.push({ x: wx, y: wy, w: ww, h: wh, lit: on, on: onC, off: offC });
          }
        }
        if (i === 2) {
          g.fillStyle = rgba("#ff2a6d", 0.16);
          g.fillRect(x, top, 1, bh);
          g.fillStyle = rgba("#05d9e8", 0.12);
          g.fillRect(x + bw - 1, top, 1, bh);
        }
        x += bw + this.rand() * 10 * unit;
      }
      this.layers.push({ canvas: can, ctx: g, lit, margin, follow: follow[i], wins });
    }
  }

  /** The four towers, their signs, and the near buildings around them. */
  private buildTowers() {
    const { W, H, horizon, mobile, o } = this;
    const lobby = Math.round(H * (mobile ? 0.05 : 0.06));
    const topMargin = H * (mobile ? 0.13 : 0.15);
    const parapet = H * 0.03;
    const maxFloors = Math.max(...o.towers.map((t) => t.floors.length));
    const floorH = (horizon - lobby - topMargin - parapet) / maxFloors;
    const bw = W * (mobile ? 0.16 : 0.095);
    const gaps = mobile ? [0.07, 0.07, 0.035] : [0.045, 0.045, 0.025];
    let x = W * (mobile ? 0.12 : 0.47);
    const lobbyOf = (ti: number) => o.steps.findIndex((s) => s.kind === "lobby" && s.tower === ti);

    this.towers = o.towers.map((spec, ti) => {
      const top = horizon - lobby - spec.floors.length * floorH - parapet;
      const images = spec.floors.map((f) => {
        if (!f.image || typeof Image === "undefined") return null;
        const img = new Image();
        img.decoding = "async";
        img.src = f.image;
        return img;
      });
      const t: Tower = { spec, x, w: bw, lobby, floorH, top, images, lobbyStep: lobbyOf(ti) };
      x += bw + W * (gaps[ti] ?? 0.04);
      return t;
    });

    // signs hang beside the floor they name: the first tower alternates sides,
    // the others hang on their right edge
    const twoFloors = floorH * 2 - 8;
    this.signs = [];
    this.towers.forEach((t, ti) => {
      t.spec.floors.forEach((f, k) => {
        if (!f.sign) return;
        const glyphs = Array.from(f.sign).length;
        const g = Math.min(twoFloors / (4 * 1.12 + 0.75), (W * (mobile ? 0.07 : 0.026)) / 1.5);
        const w = g * 1.5;
        const h = glyphs * g * 1.12 + g * 0.75;
        const left = ti === 0 ? k % 2 === 0 : false;
        const floorBottom = horizon - lobby - k * floorH;
        const sx = left ? t.x - w - 3 : t.x + t.w + 3;
        this.signs.push({
          text: f.sign,
          color: t.spec.color,
          rect: { x: sx, y: floorBottom - 4 - h, w, h, tower: ti, floor: k },
          g,
          level: 0.62,
          ev: 0,
          evEnd: 0,
          next: 3 + Math.random() * 10,
          flick: 1,
          index: this.signs.length,
        });
      });
    });

    // near buildings: a dark mass behind the title, and the rest of the block
    const r = seeded(29);
    const warm = ["#ffd38a", "#ffb35c", "#9fd8ff", "#ff9ad0"];
    const tone = "#07021a";
    this.fillers = [];
    const last = this.towers[this.towers.length - 1];
    this.stationX = Math.max(W * 1.12, last.x + last.w + W * 0.12);
    const addFiller = (fx: number, w: number, h: number, litP: number) => {
      const wins: Filler["wins"] = [];
      const ww = clamp(W / 1440, 0.6, 1.2) * 5;
      for (let wy = horizon - h + 10; wy < horizon - 12; wy += ww * 2.2) {
        for (let wx = fx + 8; wx < fx + w - 10; wx += ww * 1.9) {
          if (r() < litP) wins.push({ x: wx, y: wy, w: ww, h: ww * 1.3, c: warm[Math.floor(r() * warm.length)] });
        }
      }
      this.fillers.push({ x: fx, w, h, tone, wins });
    };
    if (!mobile) {
      let fx = -W * 0.3;
      while (fx < W * 0.42) {
        const w = W * (0.07 + r() * 0.06);
        addFiller(fx, w, horizon * (0.6 + r() * 0.24), 0.06);
        fx += w + 4;
      }
    }
    let fx = last.x + last.w + W * 0.03;
    while (fx < this.stationX + W * 1.2) {
      const w = W * (0.06 + r() * 0.07);
      if (!(fx + w > this.stationX - 40 && fx < this.stationX + 320)) addFiller(fx, w, horizon * (0.35 + r() * 0.45), 0.1);
      fx += w + 6;
    }

    this.placeOpen();
  }

  private spill(color: string) {
    const hit = this.spills.get(color);
    if (hit) return hit;
    const size = 128;
    const c = canvasOf(size, size);
    const g = c.getContext("2d")!;
    const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, rgba(color, 0.42));
    rg.addColorStop(0.45, rgba(color, 0.12));
    rg.addColorStop(1, rgba(color, 0));
    g.fillStyle = rg;
    g.fillRect(0, 0, size, size);
    this.spills.set(color, c);
    return c;
  }

  private buildStreet() {
    const { W, H, horizon, mobile } = this;
    const streetH = H - horizon;
    const unit = clamp(W / 1440, 0.6, 1.2);
    this.refl = canvasOf(W * 0.25, H * 0.25);
    this.reflCtx = this.refl.getContext("2d")!;

    const a = canvasOf(W, streetH);
    const ag = a.getContext("2d")!;
    const grad = ag.createLinearGradient(0, 0, 0, streetH);
    grad.addColorStop(0, "rgba(7,2,18,0.38)");
    grad.addColorStop(1, "rgba(5,1,15,0.78)");
    ag.fillStyle = grad;
    ag.fillRect(0, 0, W, streetH);
    ag.globalCompositeOperation = "destination-out";
    const r = seeded(19);
    for (let i = 0; i < (mobile ? 5 : 9); i++) {
      const px = r() * W;
      const py = streetH * (0.15 + r() * 0.7);
      const rw = W * (0.08 + r() * 0.14);
      const rh = rw * (0.12 + r() * 0.08);
      ag.save();
      ag.translate(px, py);
      ag.scale(1, rh / rw);
      const pg = ag.createRadialGradient(0, 0, 0, 0, 0, rw);
      pg.addColorStop(0, "rgba(0,0,0,0.7)");
      pg.addColorStop(1, "rgba(0,0,0,0)");
      ag.fillStyle = pg;
      ag.fillRect(-rw, -rw, rw * 2, rw * 2);
      ag.restore();
    }
    ag.globalCompositeOperation = "source-over";
    ag.fillStyle = "rgba(220,210,240,0.09)";
    for (let x = -20; x < W; x += 90 * unit) ag.fillRect(x, streetH * 0.58, 46 * unit, 2.5);
    ag.fillStyle = "#140a28";
    ag.fillRect(0, 0, W, 5);
    ag.fillStyle = "rgba(255,42,109,0.22)";
    ag.fillRect(0, 0, W, 1);
    this.asphalt = a;

    // pojangmacha in front of the block
    const t0 = this.towers[0];
    const t1 = this.towers[1];
    const spots = mobile ? [0.04, 0.83] : [(t0.x - W * 0.045) / W, (t1.x + t1.w + W * 0.0225 - W * 0.03) / W];
    const tw = clamp(W * 0.06, 54, 110);
    this.tents = spots.map((fx, i) => {
      const w = tw * (0.9 + (i % 2) * 0.15);
      const h = w * 0.58;
      const pad = w * 0.5;
      const s = this.dpr * 1.5;
      const c = canvasOf((w + pad * 2) * s, (h + pad * 2) * s);
      const g = c.getContext("2d")!;
      g.setTransform(s, 0, 0, s, 0, 0);
      const ox = pad;
      const oy = pad;
      const glow = g.createRadialGradient(ox + w / 2, oy + h * 0.75, 0, ox + w / 2, oy + h * 0.75, w * 0.9);
      glow.addColorStop(0, "rgba(255,140,60,0.42)");
      glow.addColorStop(1, "rgba(255,140,60,0)");
      g.fillStyle = glow;
      g.fillRect(0, 0, w + pad * 2, h + pad * 2);
      g.fillStyle = "rgba(255,122,26,0.55)";
      g.fillRect(ox + w * 0.06, oy + h * 0.32, w * 0.88, h * 0.68);
      g.fillStyle = "rgba(40,10,20,0.72)";
      for (let k = 0; k < 3; k++) {
        const px = ox + w * (0.22 + k * 0.28);
        g.beginPath();
        g.arc(px, oy + h * 0.56, h * 0.075, 0, Math.PI * 2);
        g.fill();
        g.fillRect(px - h * 0.09, oy + h * 0.64, h * 0.18, h * 0.24);
      }
      g.fillStyle = "rgba(60,16,10,0.8)";
      g.fillRect(ox + w * 0.1, oy + h * 0.82, w * 0.8, h * 0.05);
      g.save();
      g.beginPath();
      g.moveTo(ox, oy + h * 0.34);
      g.lineTo(ox + w * 0.14, oy);
      g.lineTo(ox + w * 0.86, oy);
      g.lineTo(ox + w, oy + h * 0.34);
      g.closePath();
      g.clip();
      for (let k = 0; k < 9; k++) {
        g.fillStyle = k % 2 ? "#c94a0c" : "#ff7a1a";
        g.fillRect(ox + (w / 9) * k, oy, w / 9 + 0.5, h * 0.34);
      }
      g.restore();
      g.fillStyle = "rgba(255,220,170,0.7)";
      g.fillRect(ox + w * 0.02, oy + h * 0.33, w * 0.96, 1.5);
      return { x: W * fx, w, h, sprite: c, pad };
    });

    const cols = ["#05d9e8", "#ff2a6d", "#f9f002", "#b9a9d6"];
    const r2 = seeded(5);
    this.walkers = Array.from({ length: mobile ? 5 : 7 }, (_, i) => ({
      x: mobile ? r2() * W : W * (0.44 + r2() * 0.56),
      dir: r2() < 0.5 ? -1 : 1,
      speed: (18 + r2() * 22) * unit,
      h: clamp(H * 0.055, 26, 46) * (0.85 + r2() * 0.3),
      color: cols[i % cols.length],
      phase: r2() * 6,
    }));

    const puff = canvasOf(64, 64);
    const pg = puff.getContext("2d")!;
    const rg = pg.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, "rgba(230,220,255,0.5)");
    rg.addColorStop(1, "rgba(230,220,255,0)");
    pg.fillStyle = rg;
    pg.fillRect(0, 0, 64, 64);
    this.puff = puff;
  }

  /* ── camera ─────────────────────────────────────────────────────── */

  private computeKeys() {
    const { W, H, mobile, horizon } = this;
    const sx = mobile ? 0.5 : 0.3;
    const sy = mobile ? 0.24 : 0.5;
    const focus = (wx: number, wy: number, z: number): Cam => ({ x: wx + (0.5 - sx) * (W / z), y: wy + (0.5 - sy) * (H / z), z });
    const ts = this.towers;
    const minX = ts[0].x - W * 0.05;
    const maxX = ts[ts.length - 1].x + ts[ts.length - 1].w + W * 0.03;
    const tallest = Math.min(...ts.map((t) => t.top));
    const signW = this.signs[0]?.rect.w ?? 0;

    this.keys = this.o.steps.map((s) => {
      if (s.kind === "street") return { x: W / 2, y: H / 2, z: 1 };
      if (s.kind === "roof") {
        const z = mobile ? Math.min((W * 0.96) / (maxX - minX), (H * 0.4) / (horizon - tallest + 200)) * 1.5 : Math.min((W * 0.5) / (maxX - minX), (H * 0.62) / (horizon - tallest));
        return focus((minX + maxX) / 2, tallest - (mobile ? 30 : 60), z);
      }
      if (s.kind === "station") {
        // the entrance from the street, with the cut-away stairwell going down
        const g = this.underground();
        return focus(g.ex + g.ew / 2, horizon + g.D * 0.12, mobile ? 1.05 : 1.15);
      }
      if (s.kind === "platform") {
        const g = this.underground();
        // the hall fills the screen; the train's front cars sit left of the panel
        const z = mobile ? Math.min((H * 0.42) / (g.hy1 - g.hy0), 1.6) : (H * 0.86) / (g.hy1 - g.hy0);
        return focus(g.hx0 + g.trainLen * (mobile ? 0.3 : 0.32), (g.hy0 + g.hy1) / 2 - (H * (mobile ? 0.1 : 0.06)) / z, z);
      }
      const t = ts[s.tower!];
      if (s.kind === "lobby") {
        const h = horizon - t.top + 40;
        const z = mobile ? Math.min((H * 0.42) / h, (W * 0.7) / (t.w + signW * 2)) : Math.min((H * 0.84) / h, (W * 0.38) / (t.w + signW * 2));
        return focus(t.x + t.w / 2, (t.top + horizon) / 2 - 10 - (H * 0.07) / z, z);
      }
      const fy = horizon - t.lobby - (s.floor! + 0.5) * t.floorH;
      const z = mobile ? Math.min((H * 0.2) / t.floorH, (W * 0.84) / (t.w + signW * 2)) : Math.min((H * 0.3) / t.floorH, (W * 0.44) / (t.w + signW * 2 + 20));
      return focus(t.x + t.w / 2, fy, z);
    });
  }

  private camAt(p: number): Cam {
    const k = this.keys;
    if (!k.length) return { x: this.W / 2, y: this.H / 2, z: 1 };
    if (this.o.reduced) return k[clamp(Math.round(p), 0, k.length - 1)];
    const i = clamp(Math.floor(p), 0, k.length - 1);
    const j = Math.min(k.length - 1, i + 1);
    const t = smooth(clamp(p - i, 0, 1));
    const a = k[i];
    const b = k[j];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t) };
  }

  /** Scroll camera plus the pointer's parallax, which only lives on the street. */
  private camera(): Cam {
    const c = this.camAt(this.p);
    const street = 1 - clamp(this.p, 0, 1);
    return { x: c.x + this.pointer.x * 34 * street, y: c.y + this.pointer.y * 10 * street, z: c.z };
  }

  /* ── frame ──────────────────────────────────────────────────────── */

  private respawn(i: number, y?: number) {
    const { W, H } = this;
    const z = Math.random();
    this.dz[i] = z;
    this.dx[i] = -W * 0.1 + Math.random() * W * 1.3;
    const sp = (H / 900) * (z < 0.4 ? 620 : z < 0.75 ? 900 : 1250);
    this.dv[i] = sp * (0.85 + Math.random() * 0.3) * (this.o.reduced ? 0.55 : 1);
    this.dl[i] = (z < 0.4 ? 9 : z < 0.75 ? 16 : 26) * (0.8 + Math.random() * 0.5) * clamp(H / 900, 0.7, 1.3);
    this.dy[i] = y ?? -Math.random() * H * 0.25 - this.dl[i];
  }

  private frame(dt: number) {
    const { ctx, W, H, dpr, o, horizon } = this;
    if (!W) return;
    const reduced = o.reduced;
    this.time += dt;
    const t = this.time;

    if (t - this.lastPointer > 4 && !reduced) {
      this.pointerTarget.x = Math.sin(t * 0.11) * 0.55;
      this.pointerTarget.y = Math.sin(t * 0.07 + 1) * 0.25;
    }
    const ease = 1 - Math.exp(-dt * (reduced ? 1.5 : 2.6));
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * ease;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * ease;

    this.flash = this.flashAt(t - this.strikeAt);
    if (!reduced && t > this.nextAmbient) {
      this.fire(W * Math.random(), H * 0.25, true);
      this.nextAmbient = t + (this.rainLevel === 2 ? 7 + Math.random() * 9 : 14 + Math.random() * 18);
    }
    const flash = this.flash;
    const cam = this.camera();
    const z = cam.z;
    this.zoom = z;
    const toY = (wy: number) => (wy - cam.y) * z + H / 2;
    const horizonS = toY(horizon);
    const streetOn = 1 - clamp(this.p, 0, 1);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    // sky stays put; clouds drift with the camera a little
    ctx.drawImage(this.sky, 0, 0, W, H);
    ctx.globalAlpha = 0.35 + flash * 0.65;
    ctx.drawImage(this.clouds, -this.pointer.x * 6 - (cam.x - W / 2) * 0.02, -(cam.y - H / 2) * 0.03, W, this.horizon * 0.6);
    ctx.globalAlpha = 1;
    if (flash > 0.01) {
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `rgba(150,130,255,${flash * 0.32})`;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
    }

    // distant windows switching
    this.winClock += dt;
    while (this.winClock > 0.09) {
      this.winClock -= 0.09;
      const L = this.layers[1 + Math.floor(Math.random() * 2)];
      if (L && L.wins.length) {
        const w = L.wins[Math.floor(Math.random() * L.wins.length)];
        w.lit = !w.lit;
        L.ctx.fillStyle = w.lit ? w.on : w.off;
        L.ctx.fillRect(w.x, w.y, w.w, w.h);
      }
    }

    // far skylines: each follows a fraction of the camera
    this.layers.forEach((L) => {
      const f = L.follow;
      const lz = Math.exp(Math.log(z) * f);
      const lcx = W / 2 + (cam.x - W / 2) * f;
      const lcy = H / 2 + (cam.y - H / 2) * f;
      const ox = W / 2 - lcx * lz - L.margin * lz;
      const oy = H / 2 - lcy * lz;
      const cw = L.canvas.width * lz;
      const x0 = (((ox % cw) + cw) % cw) - cw;
      for (let x = x0; x < W; x += cw) {
        if (x + cw < 0) continue;
        ctx.drawImage(L.canvas, x, oy, cw, L.canvas.height * lz);
        if (flash > 0.02) {
          ctx.globalAlpha = Math.min(1, flash);
          ctx.drawImage(L.lit, x, oy, cw, L.canvas.height * lz);
          ctx.globalAlpha = 1;
        }
      }
      const base = oy + horizon * lz;
      const fh = horizon * 0.22 * lz;
      ctx.drawImage(this.fog, 0, base - fh, W, fh);
      if (base < H) {
        ctx.fillStyle = "#12032a";
        ctx.fillRect(0, base, W, H - base);
      }
    });

    // near world
    ctx.setTransform(dpr * z, 0, 0, dpr * z, dpr * (W / 2 - cam.x * z), dpr * (H / 2 - cam.y * z));
    const viewL = cam.x - W / 2 / z - 40;
    const viewR = cam.x + W / 2 / z + 40;
    const lit = (hex: string) => (flash > 0.02 ? mix(hex, "#3a2470", Math.min(1, flash)) : hex);

    for (const f of this.fillers) {
      if (f.x > viewR || f.x + f.w < viewL) continue;
      ctx.fillStyle = lit(f.tone);
      ctx.fillRect(f.x, horizon - f.h, f.w, f.h + 2);
      ctx.fillStyle = rgba("#ff2a6d", 0.22);
      ctx.fillRect(f.x, horizon - f.h, 1, f.h);
      for (const w of f.wins) {
        ctx.fillStyle = rgba(w.c, 0.5);
        ctx.fillRect(w.x, w.y, w.w, w.h);
      }
    }

    // spill light from the signs onto the facades
    this.signs.forEach((s, i) => this.updateSign(s, i, t, reduced));
    ctx.globalCompositeOperation = "lighter";
    for (const s of this.signs) {
      const k = s.level * s.flick;
      if (k < 0.02) continue;
      const sz = s.rect.w * 3.2;
      ctx.globalAlpha = k;
      ctx.drawImage(this.spill(s.color), s.rect.x + s.rect.w / 2 - sz / 2, s.rect.y + s.rect.h / 2 - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    const roofStep = o.steps.findIndex((s) => s.kind === "roof");
    const roofGlow = clamp(1 - Math.abs(this.p - roofStep) / 1.4, 0, 1);
    this.towers.forEach((tw) => {
      if (tw.x > viewR + 60 || tw.x + tw.w + 60 < viewL) return;
      this.drawTower(tw, t, z, lit);
    });
    this.signs.forEach((s, i) => this.drawSign(s, i, t, reduced));
    this.drawOpen(t, reduced);
    this.drawRoofSigns(roofGlow, t);

    for (const tn of this.tents) {
      if (tn.x > viewR || tn.x + tn.w < viewL) continue;
      ctx.drawImage(tn.sprite, tn.x - tn.pad, horizon - tn.h - tn.pad, tn.w + tn.pad * 2, tn.h + tn.pad * 2);
    }
    this.drawWalkers(dt, reduced);

    // the wet street: whatever sits above the kerb, flipped, blurred and rippled
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (horizonS < H) {
      const top = Math.max(0, horizonS);
      const streetH = H - top;
      const srcH = Math.min(streetH, top);
      if (srcH > 4) {
        const rc = this.reflCtx;
        const rw = this.refl.width;
        const rh = Math.max(1, Math.round(this.refl.height * (srcH / H)));
        rc.setTransform(1, 0, 0, -1, 0, rh);
        rc.drawImage(o.canvas, 0, (top - srcH) * dpr, W * dpr, srcH * dpr, 0, 0, rw, rh);
        rc.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#07021a";
        ctx.fillRect(0, top, W, streetH);
        ctx.globalAlpha = 0.78;
        const band = 3;
        const amp = reduced ? 1.5 : 3 + this.rainLevel * 1.6;
        for (let y = 0; y < streetH; y += band) {
          const depth = y / streetH;
          const sy = Math.min(rh - 1, (y / srcH) * rh);
          if (y > srcH) break;
          const off = (Math.sin(y * 0.09 + t * 2.1) + Math.sin(y * 0.031 - t * 1.3) * 0.6) * amp * (0.3 + depth);
          ctx.drawImage(this.refl, 0, sy, rw, Math.max(0.5, (band / srcH) * rh), off - 4, top + y, W + 8, band + 0.6);
        }
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = "#07021a";
        ctx.fillRect(0, top, W, streetH);
      }
      ctx.drawImage(this.asphalt, 0, top, W, Math.max(streetH, 1));
      if (flash > 0.02) {
        ctx.fillStyle = `rgba(150,130,255,${flash * 0.12})`;
        ctx.fillRect(0, top, W, streetH);
      }
    }

    if (o.overlay) {
      o.overlay.style.transform = `matrix(${z},0,0,${z},${W / 2 - cam.x * z},${H / 2 - cam.y * z})`;
    }

    // steam above the stalls, and the station cut away under the street, in world space
    ctx.setTransform(dpr * z, 0, 0, dpr * z, dpr * (W / 2 - cam.x * z), dpr * (H / 2 - cam.y * z));
    this.drawSteam(dt, reduced);
    this.drawUnderground(t, z, reduced);
    this.drawStation(t, z);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // no rain underground
    const g = this.underground();
    const ux0 = (g.x0 - cam.x) * z + W / 2;
    const ux1 = (g.x1 - cam.x) * z + W / 2;
    const uy0 = toY(horizon + 2);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.rect(ux0, uy0, ux1 - ux0, H * 4);
    ctx.clip("evenodd");
    this.drawRain(dt, reduced, horizonS, streetOn);
    ctx.restore();
    this.drawBolt(t);
  }

  /* ── towers ─────────────────────────────────────────────────────── */

  private carFloor(tw: Tower) {
    return clamp(this.p - tw.lobbyStep - 1, -1, tw.spec.floors.length - 1);
  }

  private drawTower(tw: Tower, t: number, z: number, lit: (hex: string) => string) {
    const { ctx, horizon } = this;
    const c = tw.spec.color;
    const n = tw.spec.floors.length;
    const car = this.carFloor(tw);
    const detail = clamp((z - 1.3) / 0.9, 0, 1);
    const near = clamp(1 - Math.abs(this.p - tw.lobbyStep - n / 2) / (n / 2 + 1.5), 0, 1);

    ctx.fillStyle = lit("#0c0420");
    ctx.fillRect(tw.x, tw.top, tw.w, horizon - tw.top + 2);
    ctx.fillStyle = rgba(c, 0.4 + near * 0.4);
    ctx.fillRect(tw.x, tw.top, 1.5, horizon - tw.top);
    ctx.fillRect(tw.x + tw.w - 1.5, tw.top, 1.5, horizon - tw.top);

    // lobby
    const ly = horizon - tw.lobby;
    ctx.fillStyle = lit("#140a2c");
    ctx.fillRect(tw.x, ly, tw.w, tw.lobby);
    const door = ctx.createLinearGradient(0, ly + tw.lobby * 0.35, 0, horizon);
    door.addColorStop(0, rgba(c, 0.15));
    door.addColorStop(1, rgba(c, 0.6));
    ctx.fillStyle = door;
    ctx.fillRect(tw.x + tw.w * 0.34, ly + tw.lobby * 0.38, tw.w * 0.32, tw.lobby * 0.62);
    this.neonText(tw.spec.roof, tw.x + tw.w / 2, ly + tw.lobby * 0.2, tw.lobby * 0.22, c, 0.85, tw.w * 0.9);

    // floors
    for (let k = 0; k < n; k++) {
      const fy = horizon - tw.lobby - (k + 1) * tw.floorH;
      const on = k <= car + 0.5;
      const active = Math.abs(car - k) < 0.5;
      this.drawFloor(tw, k, fy, on, active, t, z);
      if (detail > 0.02) {
        ctx.globalAlpha = detail;
        ctx.font = `600 ${tw.floorH * 0.13}px ${MONO}`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = active ? (tw.spec.floors[k].hot ? "#ff2a6d" : c) : "rgba(185,169,214,0.6)";
        ctx.fillText(`${k + 1}F`, tw.x - tw.floorH * 0.12 - (this.hasLeftSigns(tw) ? this.signW() + 4 : 0), fy + tw.floorH / 2);
        ctx.globalAlpha = 1;
      }
    }

    // glass elevator column set into the facade
    const ex = tw.x + tw.w * 0.82;
    const ew = tw.w * 0.12;
    const shaftTop = tw.top + this.H * 0.03;
    ctx.fillStyle = "rgba(5,217,232,0.07)";
    ctx.fillRect(ex, shaftTop, ew, horizon - shaftTop);
    ctx.fillStyle = "rgba(5,217,232,0.3)";
    ctx.fillRect(ex, shaftTop, 0.8, horizon - shaftTop);
    ctx.fillRect(ex + ew - 0.8, shaftTop, 0.8, horizon - shaftTop);
    const carH = tw.floorH * 0.62;
    const carY = car < 0 ? horizon - tw.lobby * 0.5 - carH / 2 : horizon - tw.lobby - (car + 0.5) * tw.floorH - carH / 2;
    ctx.fillRect(ex + ew / 2 - 0.4, shaftTop, 0.8, carY - shaftTop);
    ctx.save();
    ctx.shadowColor = "#05d9e8";
    ctx.shadowBlur = 14 * this.dpr * z;
    ctx.fillStyle = "rgba(200,250,255,0.9)";
    ctx.fillRect(ex + ew * 0.1, carY, ew * 0.8, carH);
    ctx.restore();
    ctx.fillStyle = "#0c0420";
    ctx.fillRect(ex + ew * 0.28, carY + carH * 0.28, ew * 0.44, carH * 0.6);

    // parapet and roof sign on stilts
    const par = this.H * 0.03;
    ctx.fillStyle = lit("#140a2c");
    ctx.fillRect(tw.x - 2, tw.top, tw.w + 4, par);
    ctx.fillStyle = rgba(c, 0.55);
    ctx.fillRect(tw.x - 2, tw.top, tw.w + 4, 1);
    const stilt = this.H * 0.035;
    ctx.fillStyle = "#1b0d33";
    ctx.fillRect(tw.x + tw.w * 0.2, tw.top - stilt, 1.5, stilt);
    ctx.fillRect(tw.x + tw.w * 0.8 - 1.5, tw.top - stilt, 1.5, stilt);
    this.neonText(tw.spec.roof, tw.x + tw.w / 2, tw.top - stilt - tw.w * 0.1, tw.w * 0.2, c, 0.75 + near * 0.25, tw.w * 1.05);
  }

  private hasLeftSigns(tw: Tower) {
    return this.signs.some((s) => this.towers[s.rect.tower] === tw && s.rect.x < tw.x);
  }
  private signW() {
    return this.signs[0]?.rect.w ?? 0;
  }

  private drawFloor(tw: Tower, k: number, fy: number, on: boolean, active: boolean, t: number, z: number) {
    const { ctx } = this;
    const f = tw.spec.floors[k];
    const c = f.hot ? "#ff2a6d" : tw.spec.color;
    const wx = tw.x + tw.w * 0.06;
    const wy = fy + tw.floorH * 0.14;
    const ww = tw.w * 0.72;
    const wh = tw.floorH * 0.68;
    ctx.fillStyle = "#1d0f38";
    ctx.fillRect(tw.x, fy + tw.floorH - tw.floorH * 0.05, tw.w, tw.floorH * 0.05);

    if (!on) {
      ctx.fillStyle = "#0a0418";
      ctx.fillRect(wx, wy, ww, wh);
      const r = seeded(k * 31 + Math.round(tw.x));
      for (let i = 0; i < 3; i++) {
        if (r() < 0.6) {
          ctx.fillStyle = "rgba(255,200,140,0.28)";
          ctx.fillRect(wx + r() * ww * 0.75, wy + wh * (0.15 + r() * 0.5), ww * 0.12, wh * 0.22);
        }
      }
    } else {
      const img = tw.images[k];
      if (img && img.complete && img.naturalWidth) {
        const s = Math.max(ww / img.naturalWidth, wh / img.naturalHeight);
        ctx.globalAlpha = active ? 1 : 0.55;
        ctx.drawImage(img, 0, 0, ww / s, wh / s, wx, wy, ww, wh);
        ctx.globalAlpha = 1;
        ctx.fillStyle = rgba(c, active ? 0.06 : 0.2);
        ctx.fillRect(wx, wy, ww, wh);
      } else {
        const g = ctx.createLinearGradient(0, wy, 0, wy + wh);
        g.addColorStop(0, "#120725");
        g.addColorStop(1, rgba(c, active ? 0.22 : 0.1));
        ctx.fillStyle = g;
        ctx.fillRect(wx, wy, ww, wh);
        this.neonText(f.text, wx + ww / 2, wy + wh / 2, wh * 0.42, c, active ? 1 : 0.5, ww * 0.86);
      }
      if (!this.o.reduced) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(wx, wy, ww, wh);
      ctx.clip();
      const sheenX = wx + ((t * 30 + k * 70) % (ww + 200)) - 100;
      const sg = ctx.createLinearGradient(sheenX, 0, sheenX + ww * 0.2, 0);
      sg.addColorStop(0, "rgba(255,255,255,0)");
      sg.addColorStop(0.5, "rgba(255,255,255,0.07)");
      sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(wx, wy, ww, wh);
      ctx.restore();
      }
    }
    ctx.fillStyle = "rgba(12,4,32,0.85)";
    const mw = Math.max(0.6, 1.4 / z);
    for (let m = 1; m < 4; m++) ctx.fillRect(wx + (ww * m) / 4 - mw / 2, wy, mw, wh);
    ctx.fillRect(wx, wy + wh * 0.62, ww, mw);

    if (active) {
      ctx.save();
      ctx.shadowColor = c;
      ctx.shadowBlur = 18 * this.dpr * z;
      ctx.strokeStyle = c;
      ctx.lineWidth = Math.max(0.8, 1.6 / z) * 1.2;
      ctx.strokeRect(wx - 1.5, wy - 1.5, ww + 3, wh + 3);
      ctx.restore();
    }
  }

  /* ── signs ──────────────────────────────────────────────────────── */

  private updateSign(s: Sign, i: number, t: number, reduced: boolean) {
    // the sign beside the floor being read burns brightest
    const tw = this.towers[s.rect.tower];
    const car = this.carFloor(tw);
    const reading = Math.abs(car - s.rect.floor) < 0.5;
    const target = i === this.active || reading ? 1 : 0.6;
    s.level += (target - s.level) * 0.12;
    if (reduced) {
      s.flick = 1;
      return;
    }
    if (s.ev === 0 && t > s.next) {
      const r = Math.random();
      s.ev = r < 0.45 ? 1 : r < 0.75 ? 2 : 3;
      s.evEnd = t + (s.ev === 1 ? 0.25 + Math.random() * 0.45 : s.ev === 2 ? 0.07 + Math.random() * 0.14 : 0.4 + Math.random() * 0.8);
    }
    if (s.ev !== 0 && t > s.evEnd) {
      s.ev = 0;
      s.next = t + 4 + Math.random() * 11;
    }
    s.flick = s.ev === 1 ? (Math.random() < 0.55 ? 1 : 0.12) : s.ev === 2 ? 0.06 : s.ev === 3 ? 0.48 + Math.sin(t * 60) * 0.05 : 1;
  }

  private drawSign(s: Sign, i: number, t: number, reduced: boolean) {
    const { ctx } = this;
    const { x, y, w, h } = s.rect;
    const jitter = s.ev === 1 ? (Math.random() - 0.5) * 0.6 : 0;
    // bracket arms to the facade
    ctx.fillStyle = "#1b0d33";
    const toward = x < this.towers[s.rect.tower].x ? x + w : x - 3;
    ctx.fillRect(toward, y + h * 0.15, 3, 1.5);
    ctx.fillRect(toward, y + h * 0.85, 3, 1.5);
    // housing
    ctx.fillStyle = "#0a0417";
    ctx.fillRect(x + jitter, y, w, h);
    ctx.strokeStyle = rgba(s.color, 0.3);
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x + 0.4 + jitter, y + 0.4, w - 0.8, h - 0.8);
    const glyphs = Array.from(s.text);
    const g = s.g;
    ctx.font = `800 ${g}px ${HANGUL}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    const k = Math.min(1, s.level * s.flick);
    const cx = x + w / 2 + jitter;
    const at = (n: number) => y + g * 0.38 + g * 1.12 * (n + 0.5);
    // unlit glass
    ctx.strokeStyle = mix(s.color, "#1a1030", 0.72);
    ctx.lineWidth = g * 0.05;
    glyphs.forEach((ch, n) => ctx.strokeText(ch, cx, at(n)));
    if (k > 0.02) {
      // tube: wide soft pass, mid pass, pale core, all without blur so it stays crisp at any zoom
      ctx.globalCompositeOperation = "lighter";
      const passes: [number, string, number][] = [
        [g * 0.32, s.color, 0.12],
        [g * 0.16, s.color, 0.45],
        [g * 0.05, mix(s.color, "#ffffff", 0.7), 1],
      ];
      for (const [lw, col, a] of passes) {
        ctx.globalAlpha = a * k;
        ctx.lineWidth = lw;
        ctx.strokeStyle = col;
        glyphs.forEach((ch, n) => ctx.strokeText(ch, cx, at(n)));
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
    // scan band on the chosen sign
    if (i === this.active && !reduced) {
      const p = ((t % 3.2) / 3.2) * 1.6 - 0.3;
      const by = y + h * p;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      const bg = ctx.createLinearGradient(0, by - h * 0.1, 0, by + h * 0.1);
      bg.addColorStop(0, "rgba(255,255,255,0)");
      bg.addColorStop(0.5, "rgba(255,255,255,0.16)");
      bg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = bg;
      ctx.fillRect(x, by - h * 0.1, w, h * 0.2);
      ctx.restore();
    }
  }

  /** OPEN, minus its N, on the dark block behind the title. */
  private drawOpen(t: number, reduced: boolean) {
    const os = this.open;
    if (!os) {
      this.o.onBuzz?.(0);
      return;
    }
    const { ctx } = this;
    const yellow = "#f9f002";
    ctx.fillStyle = "#0a0417";
    roundRect(ctx, os.x, os.y, os.w, os.h, os.h * 0.32);
    ctx.fill();
    ctx.font = `800 ${os.g}px ${LATIN}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    const letters = Array.from("OPEN");
    const adv = letters.map((l) => ctx.measureText(l).width + os.g * 0.1);
    const total = adv.reduce((a, b) => a + b, 0);
    const startX = os.x + (os.w - total) / 2;
    const cy = os.y + os.h / 2 + os.g * 0.04;
    const phase = (t * 1.3) % 7;
    const sputter = reduced ? 0 : phase < 0.9 && Math.sin(t * 53) * Math.sin(t * 17.3) > 0.35 ? 0.55 + Math.random() * 0.35 : 0;
    this.o.onBuzz?.(sputter);
    const stroke = (only: (i: number) => boolean, lw: number, col: string, a: number) => {
      ctx.globalAlpha = a;
      ctx.lineWidth = lw;
      ctx.strokeStyle = col;
      let x = startX;
      letters.forEach((l, i) => {
        if (only(i)) ctx.strokeText(l, x, cy);
        x += adv[i];
      });
    };
    stroke(() => true, os.g * 0.05, "#3d3a1a", 1);
    ctx.strokeStyle = "#3d3a1a";
    roundRect(ctx, os.x + 2, os.y + 2, os.w - 4, os.h - 4, os.h * 0.3);
    ctx.stroke();
    ctx.globalCompositeOperation = "lighter";
    const hum = reduced ? 0.9 : 0.86 + Math.sin(t * 40) * 0.04;
    for (const [lw, col, a] of [
      [os.g * 0.3, yellow, 0.12],
      [os.g * 0.14, yellow, 0.5],
      [os.g * 0.05, "#fffbb0", 1],
    ] as [number, string, number][]) {
      stroke((i) => i !== 3, lw, col, a * hum);
      ctx.globalAlpha = a * hum;
      ctx.lineWidth = lw * 0.8;
      roundRect(ctx, os.x + 2, os.y + 2, os.w - 4, os.h - 4, os.h * 0.3);
      ctx.stroke();
      if (sputter > 0) stroke((i) => i === 3, lw, col, a * sputter);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    const glow = this.spill(yellow);
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.5;
    ctx.drawImage(glow, os.x - os.w * 0.3, os.y - os.w * 0.8, os.w * 1.6, os.w * 1.6 + os.h);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  private drawRoofSigns(glow: number, t: number) {
    const signs = this.o.roofSigns;
    if (!signs.length || glow <= 0.02) return;
    const first = this.towers[0];
    const last = this.towers[this.towers.length - 1];
    const x0 = first.x;
    const x1 = last.x + last.w;
    const tallest = Math.min(...this.towers.map((b) => b.top));
    const { ctx } = this;
    const size = (x1 - x0) / signs.length / 6;
    signs.forEach((s, i) => {
      const x = x0 + ((x1 - x0) * (i + 0.5)) / signs.length;
      const y = tallest - this.H * 0.12 - (i % 2) * this.H * 0.05;
      ctx.globalAlpha = glow;
      ctx.fillStyle = "#1b0d33";
      ctx.fillRect(x - 0.75, y + size * 0.7, 1.5, this.H * 0.06);
      const blink = this.o.reduced ? 0.8 : (Math.sin(t * 2 + i) + 1) / 2 > 0.8 ? 1 : 0.3;
      ctx.fillStyle = `rgba(255,60,80,${blink})`;
      ctx.fillRect(x - 1.5, y + size * 0.7 + this.H * 0.06, 3, 3);
      ctx.globalAlpha = 1;
      this.neonText(s.text, x, y, size, s.color, glow, (x1 - x0) / signs.length - 8);
    });
  }

  /** Geometry of the station: entrance on the street, stairwell, platform hall. */
  private underground() {
    const { W, H, horizon, mobile } = this;
    const u = clamp(W / 1440, 0.5, 1.2) * (mobile ? 1.5 : 1);
    const D = H * 0.95;
    const ex = this.stationX;
    const ew = 230 * u;
    const x0 = ex - W * 0.08;
    const hx0 = ex + ew * 0.55;
    const trainLen = Math.max(W * 0.85, 760 * u);
    const hx1 = hx0 + trainLen * 1.15;
    const x1 = hx1 + W * 0.9;
    const hy0 = horizon + D * 0.34;
    const hy1 = horizon + D * 0.98;
    const floorY = hy1 - (hy1 - hy0) * 0.2;
    const doorH = (hy1 - hy0) * 0.42;
    return { u, D, ex, ew, x0, x1, hx0, hx1, hy0, hy1, floorY, doorH, trainLen };
  }

  /** The entrance: a glass canopy over the stairs, lit from below. */
  private drawStation(t: number, z: number) {
    const { ctx, horizon } = this;
    const g = this.underground();
    const { u, ex: x, ew: w } = g;
    const acid = "#f9f002";
    // light rising out of the stairwell
    ctx.globalCompositeOperation = "lighter";
    const rise = ctx.createRadialGradient(x + w / 2, horizon, 0, x + w / 2, horizon, w * 0.9);
    rise.addColorStop(0, rgba(acid, 0.28));
    rise.addColorStop(1, rgba(acid, 0));
    ctx.fillStyle = rise;
    ctx.fillRect(x - w * 0.5, horizon - w * 0.9, w * 2, w * 0.9);
    ctx.globalCompositeOperation = "source-over";
    // side glass walls and posts
    const roofY = horizon - 120 * u;
    ctx.fillStyle = "rgba(160,200,255,0.06)";
    ctx.fillRect(x + 8 * u, roofY + 10 * u, 6 * u, 120 * u - 10 * u);
    ctx.fillRect(x + w - 14 * u, roofY + 4 * u, 6 * u, 120 * u - 4 * u);
    ctx.fillStyle = "rgba(160,200,255,0.05)";
    ctx.fillRect(x + 14 * u, roofY + 10 * u, w * 0.35, 120 * u - 10 * u);
    ctx.fillStyle = "#2a1a47";
    for (const px of [x + 8 * u, x + w * 0.5, x + w - 14 * u]) ctx.fillRect(px, roofY + 6 * u, 3 * u, horizon - roofY - 6 * u);
    // handrails following the stairs down
    ctx.strokeStyle = rgba(acid, 0.55);
    ctx.lineWidth = Math.max(0.8, 1.6 / z);
    ctx.beginPath();
    ctx.moveTo(x + w * 0.18, horizon - 34 * u);
    ctx.lineTo(x + w * 0.18, horizon);
    ctx.lineTo(x + w * 0.62, horizon + g.D * 0.3);
    ctx.moveTo(x + w * 0.82, horizon - 34 * u);
    ctx.lineTo(x + w * 0.82, horizon);
    ctx.stroke();
    // slanted glass roof with a lit edge
    ctx.beginPath();
    ctx.moveTo(x - 10 * u, roofY + 14 * u);
    ctx.lineTo(x + w + 10 * u, roofY - 4 * u);
    ctx.lineTo(x + w + 10 * u, roofY + 6 * u);
    ctx.lineTo(x - 10 * u, roofY + 24 * u);
    ctx.closePath();
    ctx.fillStyle = "rgba(180,220,255,0.12)";
    ctx.fill();
    ctx.save();
    ctx.shadowColor = acid;
    ctx.shadowBlur = 12 * this.dpr * z;
    ctx.strokeStyle = acid;
    ctx.lineWidth = Math.max(1, 2 / z);
    ctx.beginPath();
    ctx.moveTo(x - 10 * u, roofY + 24 * u);
    ctx.lineTo(x + w + 10 * u, roofY + 6 * u);
    ctx.stroke();
    ctx.restore();
    // the sign over it
    const sy = roofY - 70 * u;
    ctx.fillStyle = "#0a0417";
    ctx.fillRect(x + 4 * u, sy, w - 8 * u, 54 * u);
    ctx.strokeStyle = rgba(acid, 0.5);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 4 * u, sy, w - 8 * u, 54 * u);
    ctx.fillStyle = "#1b0d33";
    ctx.fillRect(x + w * 0.3, sy + 54 * u, 2 * u, roofY - sy - 54 * u + 12 * u);
    ctx.fillRect(x + w * 0.7, sy + 54 * u, 2 * u, roofY - sy - 54 * u + 6 * u);
    const flick = !this.o.reduced && Math.sin(t * 23) * Math.sin(t * 5.3) > 0.96 ? 0.4 : 1;
    this.neonText(this.o.station, x + w / 2, sy + 27 * u, 26 * u, acid, flick, w - 36 * u);
  }

  /** Under the street: the stairwell and the platform where the last train comes in. */
  private drawUnderground(t: number, z: number, reduced: boolean) {
    const { ctx, horizon, o } = this;
    const g = this.underground();
    const { u, D, x0, x1, hx0, hx1, hy0, hy1, floorY, doorH, trainLen } = g;
    const acid = "#f9f002";
    const cyan = "#05d9e8";
    const thin = Math.max(0.6, 1 / z);

    // earth and the street slab, cut away like a diagram
    ctx.fillStyle = "#06020f";
    ctx.fillRect(x0, horizon + 2, x1 - x0, D + 40);
    ctx.fillStyle = "#120a26";
    ctx.fillRect(x0, horizon + 2, x1 - x0, 24 * u);
    ctx.fillStyle = "rgba(185,169,214,0.05)";
    for (let y = horizon + 40 * u; y < horizon + D; y += 26 * u) ctx.fillRect(x0, y, x1 - x0, thin);
    ctx.fillStyle = rgba("#ff2a6d", 0.4);
    ctx.fillRect(x0, horizon + 2, x1 - x0, thin);
    ctx.fillStyle = rgba("#ff2a6d", 0.25);
    ctx.fillRect(x0, horizon + 2, thin, D);
    ctx.fillRect(x1 - thin, horizon + 2, thin, D);

    // stairwell: a lit diagonal down to the hall
    const sx0 = g.ex + g.ew * 0.18;
    const sx1 = g.ex + g.ew * 0.82;
    const drop = hy0 + (hy1 - hy0) * 0.15 - horizon;
    const run = drop * 0.7;
    ctx.beginPath();
    ctx.moveTo(sx0, horizon + 2);
    ctx.lineTo(sx1, horizon + 2);
    ctx.lineTo(sx1 + run, horizon + drop);
    ctx.lineTo(sx0 + run, horizon + drop);
    ctx.closePath();
    const sg = ctx.createLinearGradient(0, horizon, 0, horizon + drop);
    sg.addColorStop(0, rgba(acid, 0.1));
    sg.addColorStop(1, rgba(acid, 0.32));
    ctx.fillStyle = sg;
    ctx.fill();
    ctx.fillStyle = rgba(acid, 0.4);
    for (let k = 1; k < 16; k++) {
      const f = k / 16;
      ctx.fillRect(sx0 + run * f, horizon + drop * f, sx1 - sx0, thin);
    }

    // the hall
    ctx.fillStyle = "#100626";
    ctx.fillRect(hx0, hy0, hx1 - hx0, hy1 - hy0);
    // tunnel wall tiles
    ctx.fillStyle = "rgba(185,169,214,0.06)";
    const tile = 16 * u;
    for (let y = hy0 + 24 * u; y < floorY - doorH; y += tile) ctx.fillRect(hx0, y, hx1 - hx0, thin);
    for (let x = hx0; x < hx1; x += tile * 1.6) ctx.fillRect(x, hy0 + 24 * u, thin, floorY - doorH - hy0 - 24 * u);
    // the line's band along the wall
    const bandY = hy0 + (floorY - doorH - hy0) * 0.55;
    ctx.save();
    ctx.shadowColor = acid;
    ctx.shadowBlur = 10 * this.dpr * z;
    ctx.fillStyle = acid;
    ctx.fillRect(hx0, bandY, hx1 - hx0, 5 * u);
    ctx.restore();
    // ceiling and fluorescent strips (one of them failing)
    ctx.fillStyle = "#0a0418";
    ctx.fillRect(hx0, hy0, hx1 - hx0, 22 * u);
    let li = 0;
    for (let x = hx0 + 30 * u; x < hx1 - 60 * u; x += 110 * u) {
      const dead = li === 3 && !reduced && Math.sin(t * 31) * Math.sin(t * 7) > 0.2;
      ctx.save();
      ctx.shadowColor = "#cdeeff";
      ctx.shadowBlur = dead ? 0 : 14 * this.dpr * z;
      ctx.fillStyle = dead ? "rgba(120,140,160,0.4)" : "rgba(225,245,255,0.95)";
      ctx.fillRect(x, hy0 + 22 * u, 60 * u, 4 * u);
      ctx.restore();
      li++;
    }
    // light pooling on the floor
    ctx.globalCompositeOperation = "lighter";
    const pool = ctx.createLinearGradient(0, hy0, 0, hy1);
    pool.addColorStop(0, "rgba(200,230,255,0.06)");
    pool.addColorStop(1, "rgba(200,230,255,0)");
    ctx.fillStyle = pool;
    ctx.fillRect(hx0, hy0, hx1 - hx0, hy1 - hy0);
    ctx.globalCompositeOperation = "source-over";

    // the train: arrives as the visitor comes down, braking, then opens its doors
    const step = o.steps.findIndex((st) => st.kind === "platform");
    const a = reduced ? (this.p > step - 0.5 ? 1 : 0) : clamp((this.p - (step - 1)) / 0.85, 0, 1);
    const ease = 1 - Math.pow(1 - a, 3);
    const tx = hx0 + (hx1 - hx0 - trainLen) / 2 + (1 - ease) * (trainLen + 400 * u);
    const tTop = floorY - doorH * 1.18;
    const tBot = floorY - 3 * u;
    if (a >= 0.999) {
      if (this.trainArrived < 0) this.trainArrived = this.time;
    } else this.trainArrived = -1;
    const open = this.trainArrived < 0 ? 0 : reduced ? 1 : clamp((this.time - this.trainArrived - 0.35) / 0.7, 0, 1);
    const cars = 3;
    const carLen = trainLen / cars;
    const doors = 4;
    // rails
    ctx.fillStyle = "#2a1a47";
    ctx.fillRect(hx0, tBot + 1 * u, hx1 - hx0, 2 * u);
    ctx.save();
    ctx.beginPath();
    ctx.rect(hx0, hy0, hx1 - hx0, hy1 - hy0);
    ctx.clip();
    const moving = a > 0 && a < 1 && !reduced;
    for (let c = 0; c < cars; c++) {
      const cx = tx + c * carLen + 3 * u;
      const cw = carLen - 6 * u;
      if (moving) {
        // speed streak behind each car
        ctx.fillStyle = rgba(acid, 0.06 * (1 - ease));
        ctx.fillRect(cx + cw, tTop + 10 * u, 220 * u * (1 - ease), tBot - tTop - 20 * u);
      }
      ctx.fillStyle = "#2b2342";
      roundRect(ctx, cx, tTop, cw, tBot - tTop, c === 0 ? 22 * u : 6 * u);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(cx + 8 * u, tTop + 4 * u, cw - 16 * u, thin * 1.5);
      // windows band, warm
      const wy = tTop + (tBot - tTop) * 0.22;
      const wh = (tBot - tTop) * 0.3;
      ctx.fillStyle = "rgba(255,226,168,0.75)";
      ctx.fillRect(cx + 16 * u, wy, cw - 32 * u, wh);
      // stripe
      ctx.save();
      ctx.shadowColor = acid;
      ctx.shadowBlur = 8 * this.dpr * z;
      ctx.fillStyle = acid;
      ctx.fillRect(cx, wy + wh + 8 * u, cw, 4 * u);
      ctx.restore();
      // doors
      for (let d = 0; d < doors; d++) {
        const dx = cx + (cw * (d + 0.5)) / doors;
        const dw = 18 * u;
        const gap = open * dw;
        ctx.fillStyle = "#1c1630";
        ctx.fillRect(dx - dw - gap, tTop + 10 * u, dw, tBot - tTop - 14 * u);
        ctx.fillRect(dx + gap, tTop + 10 * u, dw, tBot - tTop - 14 * u);
        if (open > 0) {
          ctx.fillStyle = `rgba(255,236,190,${0.85 * open})`;
          ctx.fillRect(dx - gap, tTop + 10 * u, gap * 2, tBot - tTop - 14 * u);
        }
      }
      if (c === 0) {
        // destination board on the cab
        ctx.fillStyle = "#0a0417";
        ctx.fillRect(cx + 26 * u, tTop + 8 * u, 120 * u, 18 * u);
        this.neonText(o.board[0] ?? "", cx + 86 * u, tTop + 17 * u, 11 * u, "#ffb000", 1, 110 * u);
        ctx.save();
        ctx.shadowColor = "#fff6c0";
        ctx.shadowBlur = 16 * this.dpr * z;
        ctx.fillStyle = "#fff6c0";
        ctx.fillRect(cx + 6 * u, tBot - 26 * u, 10 * u, 5 * u);
        ctx.restore();
      }
    }
    ctx.restore();

    // platform screen doors, in front of the train
    const pTop = floorY - doorH;
    const panels = Math.round((hx1 - hx0) / (carLen / doors));
    const pw = (hx1 - hx0) / panels;
    for (let i = 0; i < panels; i++) {
      const px = hx0 + i * pw;
      const slide = open * pw * 0.28;
      ctx.fillStyle = "rgba(170,210,255,0.1)";
      ctx.fillRect(px + 3 * u - slide * (i % 2 ? -1 : 1) * 0, pTop, pw * 0.5 - 4 * u - slide, doorH);
      ctx.fillRect(px + pw * 0.5 + 1 * u + slide, pTop, pw * 0.5 - 4 * u - slide, doorH);
      ctx.fillStyle = "#2a1a47";
      ctx.fillRect(px, pTop - 8 * u, 3 * u, doorH + 8 * u);
      ctx.fillStyle = open > 0.5 ? rgba(acid, 0.9) : rgba(cyan, 0.7);
      ctx.fillRect(px + pw * 0.2, pTop - 6 * u, pw * 0.6, 2 * u);
    }
    ctx.fillStyle = "#1b0d33";
    ctx.fillRect(hx0, pTop - 10 * u, hx1 - hx0, 4 * u);

    // the platform floor and its yellow tactile strip
    ctx.fillStyle = "#1a0f30";
    ctx.fillRect(hx0, floorY, hx1 - hx0, hy1 - floorY);
    ctx.fillStyle = rgba(acid, 0.75);
    for (let x = hx0; x < hx1; x += 6 * u) ctx.fillRect(x, floorY + 3 * u, 2.4 * u, 2.4 * u);
    ctx.fillStyle = rgba(acid, 0.35);
    ctx.fillRect(hx0, floorY, hx1 - hx0, thin);

    // people waiting; one is reading a phone
    const people = [0.18, 0.47, 0.71];
    people.forEach((f, i) => {
      const px = hx0 + (hx1 - hx0) * f;
      const ph = doorH * 0.82;
      const fy = floorY + (hy1 - floorY) * 0.55;
      ctx.fillStyle = "#05010f";
      ctx.beginPath();
      ctx.arc(px, fy - ph * 0.9, ph * 0.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(px - ph * 0.1, fy - ph * 0.82, ph * 0.2, ph * 0.46);
      ctx.fillRect(px - ph * 0.08, fy - ph * 0.38, ph * 0.06, ph * 0.38);
      ctx.fillRect(px + ph * 0.02, fy - ph * 0.38, ph * 0.06, ph * 0.38);
      if (i === 1) {
        ctx.save();
        ctx.shadowColor = cyan;
        ctx.shadowBlur = 10 * this.dpr * z;
        ctx.fillStyle = "rgba(160,240,255,0.9)";
        ctx.fillRect(px + ph * 0.08, fy - ph * 0.7, ph * 0.06, ph * 0.09);
        ctx.restore();
      }
    });

    // the hanging departure board
    const bw = Math.min(trainLen * 0.5, 420 * u);
    const bh = 64 * u;
    const bx = hx0 + trainLen * 0.13;
    const by = hy0 + 44 * u;
    ctx.fillStyle = "#1b0d33";
    ctx.fillRect(bx + bw * 0.2, hy0 + 22 * u, 2 * u, by - hy0 - 22 * u);
    ctx.fillRect(bx + bw * 0.8, hy0 + 22 * u, 2 * u, by - hy0 - 22 * u);
    ctx.fillStyle = "#050208";
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = "#2a1a47";
    ctx.lineWidth = 2 * u;
    ctx.strokeRect(bx, by, bw, bh);
    const lines = o.board.slice(0, 2);
    const status = open > 0.5 ? o.board[3] ?? "" : o.board[2] ?? "";
    const blink = reduced || Math.sin(t * 5) > -0.3;
    this.ledText(lines[0] ?? "", bx + 12 * u, by + bh * 0.3, 14 * u, "#ffb000", bw * 0.62);
    this.ledText(lines[1] ?? "", bx + 12 * u, by + bh * 0.72, 12 * u, "#ffb000", bw * 0.62);
    if (blink) this.ledText(status, bx + bw - 12 * u, by + bh * 0.5, 13 * u, open > 0.5 ? "#39ff88" : "#ff5a3c", bw * 0.32, true);
  }

  /** Amber dot-matrix lettering for the departure board. */
  private ledText(text: string, x: number, y: number, size: number, color: string, maxW: number, right = false) {
    const { ctx } = this;
    ctx.save();
    ctx.font = `700 ${size}px ${hasHangul(text) ? HANGUL : MONO}`;
    ctx.textAlign = right ? "right" : "left";
    ctx.textBaseline = "middle";
    const m = ctx.measureText(text).width;
    const s = m > maxW ? maxW / m : 1;
    ctx.translate(x, y);
    ctx.scale(s, 1);
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 0.5 * this.dpr * this.zoom;
    ctx.fillStyle = color;
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  private drawWalkers(dt: number, reduced: boolean) {
    const { ctx, W, horizon } = this;
    for (const w of this.walkers) {
      const lo = this.mobile ? -60 : W * 0.44;
      w.x += w.dir * w.speed * dt * (reduced ? 0.5 : 1);
      if (w.x < lo) w.x = W + 60;
      if (w.x > W + 60) w.x = lo;
      w.phase += dt * w.speed * 0.16;
      const x = w.x;
      const foot = horizon + 2;
      const h = w.h;
      const swing = Math.sin(w.phase) * h * 0.12;
      ctx.strokeStyle = "#0a0418";
      ctx.lineWidth = Math.max(2, h * 0.09);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, foot - h * 0.42);
      ctx.lineTo(x + swing, foot);
      ctx.moveTo(x, foot - h * 0.42);
      ctx.lineTo(x - swing, foot);
      ctx.stroke();
      ctx.fillStyle = "#0a0418";
      ctx.fillRect(x - h * 0.1, foot - h * 0.8, h * 0.2, h * 0.42);
      ctx.beginPath();
      ctx.arc(x, foot - h * 0.86, h * 0.08, 0, Math.PI * 2);
      ctx.fill();
      const uy = foot - h * 1.08;
      const ur = h * 0.42;
      ctx.beginPath();
      ctx.moveTo(x - ur, uy);
      ctx.quadraticCurveTo(x, uy - ur * 0.95, x + ur, uy);
      ctx.closePath();
      ctx.fillStyle = "rgba(14,6,30,0.92)";
      ctx.fill();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = rgba(w.color, 0.85);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, uy - ur * 0.42);
      ctx.lineTo(x, foot - h * 0.62);
      ctx.strokeStyle = rgba(w.color, 0.95);
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    }
  }

  private drawSteam(dt: number, reduced: boolean) {
    const { ctx, horizon } = this;
    this.steamClock += dt;
    const every = reduced ? 0.6 : 0.25;
    while (this.steamClock > every) {
      this.steamClock -= every;
      const tn = this.tents[Math.floor(Math.random() * this.tents.length)];
      if (!tn) break;
      const i = this.pHead;
      this.pHead = (this.pHead + 1) % MAX_STEAM;
      this.px[i] = tn.x + tn.w * (0.3 + Math.random() * 0.4);
      this.py[i] = horizon - tn.h * 0.95;
      this.pr[i] = tn.w * 0.12;
      this.pl[i] = 1;
    }
    const rise = reduced ? 10 : 22;
    for (let i = 0; i < MAX_STEAM; i++) {
      if (this.pl[i] <= 0) continue;
      this.pl[i] -= dt * 0.33;
      this.py[i] -= rise * dt;
      this.px[i] += Math.sin(this.time * 0.8 + i) * 6 * dt;
      this.pr[i] += dt * 16;
      const l = Math.max(0, this.pl[i]);
      ctx.globalAlpha = l * l * 0.35;
      const r = this.pr[i];
      ctx.drawImage(this.puff, this.px[i] - r, this.py[i] - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
  }

  private drawRain(dt: number, reduced: boolean, horizonS: number, streetOn: number) {
    const { ctx, W, H } = this;
    const area = clamp((W * H) / (1440 * 900), 0.32, 1);
    const levels = [0.32, 0.62, 1];
    const n = Math.floor(MAX_DROPS * levels[this.rainLevel] * area * (reduced ? 0.3 : 1) * (0.35 + 0.65 * streetOn));
    const slant = 0.27;
    const ground = Math.min(H, horizonS);
    const streetH = H - ground;
    const passes: [number, number, number, string][] = [
      [0, 0.4, 0.8, "rgba(170,160,230,0.28)"],
      [0.4, 0.75, 1, "rgba(190,190,245,0.38)"],
      [0.75, 1.01, 1.4, "rgba(215,215,255,0.5)"],
    ];
    for (let i = 0; i < n; i++) {
      const v = this.dv[i];
      this.dy[i] += v * dt;
      this.dx[i] -= v * slant * dt;
      const z = this.dz[i];
      const land = streetH > 4 ? ground + streetH * (0.04 + 0.96 * z) : H + 30;
      if (this.dy[i] >= land) {
        if (streetH > 4) this.land(this.dx[i], land, z);
        this.respawn(i);
      }
    }
    for (const [lo, hi, lw, col] of passes) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const z = this.dz[i];
        if (z < lo || z >= hi) continue;
        const l = this.dl[i];
        ctx.moveTo(this.dx[i], this.dy[i]);
        ctx.lineTo(this.dx[i] + l * slant, this.dy[i] - l);
      }
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.lineCap = "butt";
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(210,205,255,0.55)";
    for (let i = 0; i < MAX_SPLASH; i++) {
      if (this.sl[i] <= 0) continue;
      this.sl[i] -= dt;
      this.svy[i] += 900 * dt;
      this.sx[i] += this.svx[i] * dt;
      this.sy[i] += this.svy[i] * dt;
      ctx.fillRect(this.sx[i], this.sy[i], 1.3, 1.3);
    }
    ctx.beginPath();
    for (let i = 0; i < MAX_RIPPLES; i++) {
      if (this.rl[i] <= 0) continue;
      this.rl[i] -= dt * 1.7;
      this.rr[i] += dt * 20;
      const r = this.rr[i];
      ctx.moveTo(this.rx[i] + r, this.ry[i]);
      ctx.ellipse(this.rx[i], this.ry[i], r, r * 0.26, 0, 0, Math.PI * 2);
    }
    ctx.strokeStyle = `rgba(200,190,255,${0.16 + this.rainLevel * 0.05})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  private land(x: number, y: number, z: number) {
    if (z > 0.3) {
      for (let k = 0; k < 2; k++) {
        const i = this.sHead;
        this.sHead = (this.sHead + 1) % MAX_SPLASH;
        this.sx[i] = x;
        this.sy[i] = y;
        this.svx[i] = (Math.random() - 0.5) * 140 * z;
        this.svy[i] = -(70 + Math.random() * 110) * z;
        this.sl[i] = 0.18 + Math.random() * 0.14;
      }
    }
    if (Math.random() < 0.35 + this.rainLevel * 0.15) {
      const i = this.rHead;
      this.rHead = (this.rHead + 1) % MAX_RIPPLES;
      this.rx[i] = x;
      this.ry[i] = y;
      this.rr[i] = 0.5;
      this.rl[i] = 0.5 + z * 0.5;
    }
  }

  /* ── lightning ──────────────────────────────────────────────────── */

  private fire(x: number, y: number, ambient: boolean) {
    const { W, H, o } = this;
    this.strikeAt = this.time;
    this.strikeAmbient = ambient || o.reduced;
    this.bolt = [];
    if (!this.strikeAmbient) {
      const x0 = x + (Math.random() - 0.5) * W * 0.25;
      const y1 = clamp(y, H * 0.2, H * 0.68);
      const main = this.zigzag(x0, -10, x + (Math.random() - 0.5) * 30, y1, 7, W * 0.05);
      this.bolt.push(main);
      for (let b = 0; b < 3; b++) {
        const at = Math.floor(main.length * (0.2 + Math.random() * 0.5)) & ~1;
        const bx = main[at];
        const by = main[at + 1];
        const ang = (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 0.6);
        const len = H * (0.1 + Math.random() * 0.14);
        this.bolt.push(this.zigzag(bx, by, bx + Math.sin(ang) * len, by + Math.cos(ang) * len, 5, len * 0.12));
      }
    }
    o.onStrike?.({
      pan: clamp((x / W) * 2 - 1, -1, 1),
      delay: ambient ? 1.2 + Math.random() * 1.6 : 0.25 + Math.random() * 0.9,
      power: ambient ? 0.45 : 1,
      ambient,
    });
  }

  private zigzag(x0: number, y0: number, x1: number, y1: number, depth: number, disp: number) {
    let pts = [x0, y0, x1, y1];
    let d = disp;
    for (let k = 0; k < depth; k++) {
      const next: number[] = [];
      for (let i = 0; i < pts.length - 2; i += 2) {
        const ax = pts[i];
        const ay = pts[i + 1];
        const bx = pts[i + 2];
        const by = pts[i + 3];
        next.push(ax, ay, (ax + bx) / 2 + (Math.random() - 0.5) * d, (ay + by) / 2 + (Math.random() - 0.5) * d * 0.3);
      }
      next.push(pts[pts.length - 2], pts[pts.length - 1]);
      pts = next;
      d *= 0.55;
    }
    return pts;
  }

  private flashAt(dt: number) {
    if (dt < 0 || dt > 2) return 0;
    if (this.o.reduced) return 0.45 * Math.exp(-dt / 0.35) * Math.min(1, dt / 0.08);
    if (this.strikeAmbient) return 0.35 * Math.exp(-dt / 0.12) + 0.2 * (dt > 0.16 ? Math.exp(-(dt - 0.16) / 0.1) : 0);
    const pulses: [number, number][] = [
      [0, 1],
      [0.07, 0.55],
      [0.2, 0.85],
    ];
    let f = 0;
    for (const [at, a] of pulses) if (dt >= at) f += a * Math.exp(-(dt - at) / 0.065);
    return Math.min(1, f);
  }

  private drawBolt(t: number) {
    if (!this.bolt.length) return;
    const age = t - this.strikeAt;
    if (age > 0.34) {
      this.bolt = [];
      return;
    }
    const vis = age < 0.05 || (age > 0.07 && age < 0.12) || (age > 0.2 && age < 0.3) ? 1 : 0.25;
    const { ctx } = this;
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const passes: [number, string][] = [
      [9, `rgba(160,110,255,${0.22 * vis})`],
      [3.5, `rgba(200,180,255,${0.55 * vis})`],
      [1.3, `rgba(255,255,255,${0.95 * vis})`],
    ];
    for (const [lw, col] of passes) {
      ctx.strokeStyle = col;
      this.bolt.forEach((pts, k) => {
        ctx.lineWidth = k === 0 ? lw : lw * 0.55;
        ctx.beginPath();
        ctx.moveTo(pts[0], pts[1]);
        for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
        ctx.stroke();
      });
    }
    ctx.globalCompositeOperation = "source-over";
  }

  /** Neon lettering in world units: coloured glow under a pale core. */
  private neonText(text: string, x: number, y: number, size: number, color: string, k: number, maxW?: number) {
    if (k <= 0.01 || size <= 0) return;
    const { ctx } = this;
    const hangul = hasHangul(text);
    ctx.save();
    ctx.font = `800 ${size}px ${hangul ? HANGUL : LATIN}`;
    if (!hangul) {
      try {
        (ctx as any).fontStretch = "condensed";
      } catch {
        /* older canvases ignore it */
      }
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let s = 1;
    if (maxW) {
      const m = ctx.measureText(text).width;
      if (m > maxW) s = maxW / m;
    }
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.globalAlpha = k;
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 0.6 * this.dpr * this.zoom * s;
    ctx.fillStyle = color;
    ctx.fillText(text, 0, 0);
    ctx.shadowBlur = size * 0.2 * this.dpr * this.zoom * s;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.globalAlpha = k * 0.75;
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
