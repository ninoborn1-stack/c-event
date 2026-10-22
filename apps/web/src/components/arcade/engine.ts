/**
 * Mini-Engine für die Retro-Spiele: feste kleine Auflösung, Pixel-Grafik per fillRect,
 * Eingabe als Tasten + Pointer in Spielkoordinaten. Kein Framework, kein Asset-Download.
 */
export const W = 240;
export const H = 180;

export const PAL = {
  ink: '#0c0a08',
  night: '#16130f',
  smoke: '#26211b',
  ash: '#4a4238',
  mute: '#9b8f7e',
  cream: '#f3eee5',
  gold: '#d4a25a',
  goldHot: '#f2c36b',
  signal: '#ff4a26',
  green: '#7fd18b',
  cyan: '#6fd6e8',
  pink: '#ff5fa2',
  blue: '#5b7cff',
};

export interface Gfx {
  ctx: CanvasRenderingContext2D;
  font: string;
  t: number;
  rect(x: number, y: number, w: number, h: number, c: string): void;
  text(s: string, x: number, y: number, c?: string, size?: number, align?: CanvasTextAlign): void;
}

export interface Sfx {
  blip(freq: number, dur?: number, type?: OscillatorType, vol?: number): void;
  kick(): void;
  hat(): void;
  noise(dur?: number, vol?: number): void;
}

export interface Game {
  score: number;
  over: boolean;
  reset(): void;
  update(dt: number, held: ReadonlySet<string>): void;
  render(g: Gfx): void;
  key?(code: string): void;
  pointer?(type: 'down' | 'move' | 'up', x: number, y: number): void;
}

export type GameFactory = (sfx: Sfx) => Game;

export function makeGfx(ctx: CanvasRenderingContext2D, font: string): Gfx {
  return {
    ctx,
    font,
    t: 0,
    rect(x, y, w, h, c) {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    },
    text(s, x, y, c = PAL.cream, size = 8, align = 'left') {
      ctx.fillStyle = c;
      ctx.font = `${size}px ${font}`;
      ctx.textAlign = align;
      ctx.textBaseline = 'top';
      ctx.fillText(s, Math.round(x), Math.round(y));
    },
  };
}

/** Chiptune-Sounds per WebAudio. Startet erst nach einer Nutzeraktion (Browser-Regel). */
export function makeSfx(isMuted: () => boolean): Sfx & { unlock(): void } {
  let ac: AudioContext | null = null;
  const ctx = () => {
    if (isMuted()) return null;
    if (!ac) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
    }
    if (ac.state === 'suspended') void ac.resume();
    return ac;
  };
  const env = (a: AudioContext, g: GainNode, vol: number, dur: number) => {
    g.gain.setValueAtTime(vol, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
  };
  return {
    unlock: () => void ctx(),
    blip(freq, dur = 0.08, type = 'square', vol = 0.06) {
      const a = ctx();
      if (!a) return;
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, a.currentTime);
      env(a, g, vol, dur);
      o.connect(g).connect(a.destination);
      o.start();
      o.stop(a.currentTime + dur);
    },
    kick() {
      const a = ctx();
      if (!a) return;
      const o = a.createOscillator();
      const g = a.createGain();
      o.frequency.setValueAtTime(140, a.currentTime);
      o.frequency.exponentialRampToValueAtTime(40, a.currentTime + 0.12);
      env(a, g, 0.25, 0.14);
      o.connect(g).connect(a.destination);
      o.start();
      o.stop(a.currentTime + 0.15);
    },
    hat() {
      this.noise(0.03, 0.03);
    },
    noise(dur = 0.1, vol = 0.05) {
      const a = ctx();
      if (!a) return;
      const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = a.createBufferSource();
      const g = a.createGain();
      src.buffer = buf;
      env(a, g, vol, dur);
      src.connect(g).connect(a.destination);
      src.start();
    },
  };
}

export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]!;
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
