/**
 * „360°“ aus Punkten (Canvas 2D, ohne Bibliothek).
 * Modus „punkte“: Das Hero-Foto zerfällt in ein Punkteraster (wie eine LED-Wand), die Punkte fliegen
 * zur Kontur der Zahl zusammen, der Rest fällt weg. Andere Modi blenden die fertige Zahl nur ein.
 * Die fertige Zahl besteht aus zwei Punkt-Ebenen (vorne Kontur, hinten versetzt = Tiefe),
 * neigt sich zur Maus und weicht ihr aus. Gesteuert wird alles über `state` (vom Scroll-Timeline getweent).
 */
export interface DotsState {
  /** 0 → 1: Foto wird zum Punkteraster */
  grid: number;
  /** 0 → 1: Punkte fliegen zur Zahl */
  fly: number;
  /** 0 → 1: fertige Zahl einblenden (Modi ohne Flug) */
  alpha: number;
}

interface Src {
  x: number;
  y: number;
  s: number;
  c: string;
  used: boolean;
  fall: number;
}
interface Dot {
  src: Src | null;
  x: number;
  y: number;
  z: number;
  c: string;
  delay: number;
  lift: number;
  ox: number;
  oy: number;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function createDots360(
  canvas: HTMLCanvasElement,
  opts: { text: string; accentFrom: number; img: HTMLImageElement | null; fontFamily: string; fly: boolean; touch: boolean },
) {
  const ctx = canvas.getContext('2d')!;
  const css = getComputedStyle(document.documentElement);
  const color = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  const front = color('--color-cream', '#f4eee4');
  const accent = color('--color-red', '#d4212d');
  const back = color('--color-ash', '#4a3a38');

  let W = 0;
  let H = 0;
  let dpr = 1;
  let step = 8;
  let dots: Dot[] = [];
  let srcs: Src[] = [];
  let built = false;
  const mouse = { x: -9999, y: -9999, tx: 0, ty: 0, rx: 0, ry: 0 };

  function build() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    if (!W || !H) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    // ---- Ziel: Kontur der Zahl als Punkteraster ----
    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const o = off.getContext('2d', { willReadFrequently: true })!;
    let fs = Math.min(W * (W < 761 ? 0.62 : 0.46), H * 0.74);
    const oc = o as CanvasRenderingContext2D & { fontStretch?: CanvasFontStretch };
    const setFont = (stretch: CanvasFontStretch) => {
      o.font = `900 ${fs}px ${opts.fontFamily}`;
      if ('fontStretch' in oc) oc.fontStretch = stretch;
    };
    // Schmaler Schnitt wie in der Headline (wdth 62). Greift fontStretch nicht, wird horizontal gestaucht.
    setFont('normal');
    const wide = o.measureText(opts.text).width;
    setFont('extra-condensed');
    const sx = o.measureText(opts.text).width > wide * 0.9 ? 0.64 : 1;
    let tw = o.measureText(opts.text).width * sx;
    if (tw > W * 0.88) {
      fs *= (W * 0.88) / tw;
      setFont('extra-condensed');
      tw = o.measureText(opts.text).width * sx;
    }
    step = Math.max(4, Math.round(fs / 68));
    const x0 = (W - tw) / 2;
    const accentX = x0 + o.measureText(opts.text.slice(0, opts.accentFrom)).width * sx;
    o.textBaseline = 'middle';
    o.lineJoin = 'round';
    o.lineWidth = step * 0.95;
    o.strokeStyle = '#fff';
    o.setTransform(sx, 0, 0, 1, x0, 0);
    o.strokeText(opts.text, 0, H / 2 + fs * 0.04);
    o.setTransform(1, 0, 0, 1, 0, 0);
    // Nur den Bereich um die Zahl auslesen, nicht das ganze Fenster
    const bx = Math.max(0, Math.floor(x0 - step * 2));
    const by = Math.max(0, Math.floor(H / 2 - fs * 0.6));
    const bw = Math.min(W - bx, Math.ceil(tw + step * 4));
    const bh = Math.min(H - by, Math.ceil(fs * 1.2));
    const data = o.getImageData(bx, by, bw, bh).data;
    const depth = fs * 0.09;
    const targets: Dot[] = [];
    for (let y = step / 2; y < H; y += step) {
      if (y < by || y >= by + bh) continue;
      for (let x = step / 2; x < W; x += step) {
        if (x < bx || x >= bx + bw) continue;
        const a = data[((Math.round(y) - by) * bw + (Math.round(x) - bx)) * 4 + 3]!;
        if (a < 120) continue;
        const isAccent = x > accentX;
        const base = { src: null, x, y, delay: Math.random() * 0.35, lift: 0.6 + Math.random() * 1.8, ox: 0, oy: 0 };
        targets.push({ ...base, z: 0, c: isAccent ? accent : front });
        targets.push({ ...base, z: depth, c: isAccent ? accent : back });
      }
    }

    // ---- Quelle: Foto als Punkteraster (nur Modus „punkte“) ----
    srcs = [];
    if (opts.fly && opts.img && opts.img.complete && opts.img.naturalWidth) {
      const gs = Math.max(12, Math.round(Math.sqrt((W * H) / 3600)));
      const cols = Math.ceil(W / gs);
      const rows = Math.ceil(H / gs);
      const t = document.createElement('canvas');
      t.width = cols;
      t.height = rows;
      const tc = t.getContext('2d', { willReadFrequently: true })!;
      // wie object-fit: cover, plus der Zoom des Heros an dieser Stelle
      const iw = opts.img.naturalWidth;
      const ih = opts.img.naturalHeight;
      const k = Math.max(W / iw, H / ih) * 1.24;
      const dw = (iw * k) / gs;
      const dh = (ih * k) / gs;
      try {
        tc.drawImage(opts.img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
        const px = tc.getImageData(0, 0, cols, rows).data;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const i = (r * cols + c) * 4;
            // abgedunkelt wie der Verlauf über dem Foto
            const R = px[i]! * 0.78;
            const G = px[i + 1]! * 0.78;
            const B = px[i + 2]! * 0.78;
            const lum = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
            srcs.push({ x: c * gs + gs / 2, y: r * gs + gs / 2, s: gs * (0.22 + 0.72 * lum), c: `rgb(${R | 0},${G | 0},${B | 0})`, used: false, fall: 0.4 + Math.random() });
          }
        }
      } catch {
        srcs = [];
      }
    }

    // Zuordnung: beide nach x sortiert → die Punkte wandern als Welle von links nach rechts
    if (srcs.length) {
      const byX = [...srcs].sort((a, b) => a.x - b.x);
      targets.sort((a, b) => a.x - b.x || a.z - b.z);
      targets.forEach((d, i) => {
        const s = byX[Math.floor((i / targets.length) * byX.length)]!;
        s.used = true;
        d.src = s;
      });
    }
    dots = targets;
    built = true;
  }

  function draw(state: DotsState) {
    if (!built) build();
    if (!built) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2;
    const cy = H / 2;

    // Neigung folgt der Maus (Touch: langsames Schwingen)
    if (opts.touch) {
      const t = performance.now() / 1000;
      mouse.tx = Math.sin(t * 0.6) * 0.32;
      mouse.ty = Math.sin(t * 0.43) * 0.12;
    }
    mouse.rx += (mouse.tx - mouse.rx) * 0.07;
    mouse.ry += (mouse.ty - mouse.ry) * 0.07;
    const cosY = Math.cos(mouse.rx);
    const sinY = Math.sin(mouse.rx);
    const cosX = Math.cos(mouse.ry);
    const sinX = Math.sin(mouse.ry);
    const P = Math.max(W, H) * 1.1;
    const R = Math.min(W, H) * 0.09;

    // 1) Foto-Raster: alle Quellpunkte; nicht gebrauchte fallen beim Flug weg
    const fly = opts.fly && srcs.length ? state.fly : 1;
    if (opts.fly && srcs.length && state.grid > 0) {
      for (const s of srcs) {
        if (s.used && fly > 0) continue;
        const f = clamp(fly * (0.7 + s.fall));
        if (f >= 1) continue;
        ctx.globalAlpha = state.grid * (1 - f);
        ctx.fillStyle = s.c;
        const size = s.s * (1 - f * 0.6);
        ctx.fillRect(s.x - size / 2, s.y + f * f * H * 0.7 - size / 2, size, size);
      }
    }

    // 2) Zahl: Punkte im Flug oder fertig
    const alpha = opts.fly && srcs.length ? Math.min(1, state.grid * 4) : state.alpha;
    if (alpha <= 0 || (opts.fly && srcs.length && fly <= 0 && state.grid <= 0)) {
      ctx.globalAlpha = 1;
      return;
    }
    const dotSize = Math.max(2, step * 0.42);
    for (const d of dots) {
      // 3D: um Y (Maus x) und X (Maus y) drehen, dann perspektivisch projizieren
      const X = d.x - cx;
      const Y = d.y - cy;
      const X1 = X * cosY + d.z * sinY;
      const Z1 = -X * sinY + d.z * cosY;
      const Y1 = Y * cosX - Z1 * sinX;
      const Z2 = Y * sinX + Z1 * cosX;
      const k = P / (P + Z2);
      let px = cx + X1 * k;
      let py = cy + Y1 * k;
      // ausweichen, wenn die Maus nah ist
      const dx = px - mouse.x;
      const dy = py - mouse.y;
      const dd = dx * dx + dy * dy;
      let tox = 0;
      let toy = 0;
      if (dd < R * R) {
        const dist = Math.sqrt(dd) || 1;
        const push = (1 - dist / R) * (1 - dist / R) * R * 0.45;
        tox = (dx / dist) * push;
        toy = (dy / dist) * push;
      }
      d.ox += (tox - d.ox) * 0.14;
      d.oy += (toy - d.oy) * 0.14;
      px += d.ox;
      py += d.oy;
      let size = dotSize * k * (d.z ? 0.8 : 1);
      let c = d.c;

      if (d.src && fly < 1) {
        const f = ease(clamp((fly - d.delay) / 0.65));
        if (f <= 0) {
          // noch im Foto-Raster
          ctx.globalAlpha = state.grid;
          ctx.fillStyle = d.src.c;
          ctx.fillRect(d.src.x - d.src.s / 2, d.src.y - d.src.s / 2, d.src.s, d.src.s);
          continue;
        }
        // Bogen Richtung Kamera: mittendrin größer, leicht nach oben
        const arc = Math.sin(Math.PI * f);
        px = d.src.x + (px - d.src.x) * f;
        py = d.src.y + (py - d.src.y) * f - arc * H * 0.08 * d.lift;
        size = d.src.s + (size - d.src.s) * f;
        size *= 1 + arc * d.lift;
        if (f < 0.55) c = d.src.c;
      }
      ctx.globalAlpha = alpha;
      ctx.fillStyle = c;
      ctx.fillRect(px - size / 2, py - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  }

  return {
    draw,
    /** Vorab berechnen (im Leerlauf), damit der erste Übergang nicht ruckelt */
    prepare() {
      if (!built) build();
    },
    rebuild() {
      built = false;
    },
    pointer(x: number, y: number) {
      const r = canvas.getBoundingClientRect();
      mouse.x = x - r.left;
      mouse.y = y - r.top;
      if (!r.width || !r.height) return;
      // höchstens ca. ±24° (Breite) und ±12° (Höhe)
      mouse.tx = (mouse.x / r.width - 0.5) * 0.84;
      mouse.ty = (mouse.y / r.height - 0.5) * -0.42;
    },
    leave() {
      mouse.x = mouse.y = -9999;
      mouse.tx = mouse.ty = 0;
    },
    clear() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}
