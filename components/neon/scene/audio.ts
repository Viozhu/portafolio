/*
 * The street's sound, synthesized with Web Audio. Nothing is loaded.
 * Created only from a user gesture (the SOUND button).
 */

type Ctx = AudioContext;

const noiseBuffer = (ctx: Ctx, seconds: number, brown: boolean) => {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (brown) {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      } else d[i] = w;
    }
  }
  return buf;
};

export class StreetAudio {
  private ctx: Ctx;
  private master: GainNode;
  private rainGain: GainNode;
  private buzzGain: GainNode;
  private brown: AudioBuffer;
  private white: AudioBuffer;
  private muted = false;

  constructor() {
    const AC: typeof AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AC();
    const ctx = this.ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);
    this.master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.4);

    this.white = noiseBuffer(ctx, 2.5, false);
    this.brown = noiseBuffer(ctx, 5, true);

    // rain bed: filtered white noise, looped
    const rain = ctx.createBufferSource();
    rain.buffer = this.white;
    rain.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 500;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 5200;
    this.rainGain = ctx.createGain();
    this.rainGain.gain.value = 0.05;
    rain.connect(hp).connect(lp).connect(this.rainGain).connect(this.master);
    rain.start();

    // neon buzz: 120 Hz mains hum through a dirty transformer
    const saw = ctx.createOscillator();
    saw.type = "sawtooth";
    saw.frequency.value = 120;
    const sq = ctx.createOscillator();
    sq.type = "square";
    sq.frequency.value = 240;
    const sqGain = ctx.createGain();
    sqGain.gain.value = 0.25;
    const bl = ctx.createBiquadFilter();
    bl.type = "lowpass";
    bl.frequency.value = 900;
    this.buzzGain = ctx.createGain();
    this.buzzGain.gain.value = 0;
    saw.connect(bl);
    sq.connect(sqGain).connect(bl);
    bl.connect(this.buzzGain).connect(this.master);
    saw.start();
    sq.start();
  }

  setRain(level: number) {
    const v = [0.035, 0.06, 0.1][level] ?? 0.06;
    this.rainGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.6);
  }

  setBuzz(level: number) {
    this.buzzGain.gain.setTargetAtTime(level * 0.022, this.ctx.currentTime, 0.012);
  }

  thunder(pan: number, delay: number, power: number) {
    const ctx = this.ctx;
    const t0 = ctx.currentTime + delay;
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) panner.pan.value = Math.max(-1, Math.min(1, pan * 0.8));
    const out = panner ?? ctx.createGain();
    out.connect(this.master);

    // crack: only when close
    if (delay < 0.7 && power > 0.6) {
      const crack = ctx.createBufferSource();
      crack.buffer = this.white;
      const chp = ctx.createBiquadFilter();
      chp.type = "highpass";
      chp.frequency.value = 1400;
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0, t0);
      cg.gain.linearRampToValueAtTime(0.32 * power, t0 + 0.008);
      cg.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28);
      crack.connect(chp).connect(cg).connect(out);
      crack.start(t0, Math.random() * 1.5, 0.35);
    }

    // rumble: brown noise, lowpass sweeping down, modulated
    const rum = ctx.createBufferSource();
    rum.buffer = this.brown;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(900 * power + 200, t0);
    lp.frequency.exponentialRampToValueAtTime(90, t0 + 3.2);
    const g = ctx.createGain();
    const peak = 0.9 * power;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.09);
    g.gain.exponentialRampToValueAtTime(peak * 0.45, t0 + 0.6);
    g.gain.exponentialRampToValueAtTime(peak * 0.7, t0 + 1.0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 4.2);
    rum.connect(lp).connect(g).connect(out);
    rum.start(t0, Math.random() * 0.8, 4.4);
    rum.onended = () => out.disconnect();
  }

  setMuted(m: boolean) {
    this.muted = m;
    this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.15);
    if (!m && this.ctx.state === "suspended") this.ctx.resume().catch(() => undefined);
  }

  suspend() {
    this.ctx.suspend().catch(() => undefined);
  }

  resume() {
    if (!this.muted) this.ctx.resume().catch(() => undefined);
  }

  close() {
    this.ctx.close().catch(() => undefined);
  }
}
