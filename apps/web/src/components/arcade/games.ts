import { clamp, H, PAL, pick, rand, W, type Game, type GameFactory, type Gfx, type Sfx } from './engine';

// ============================================================
// 1) SHAKER RUSH – Zutaten fangen, Rezepte vollmachen, Bomben meiden
// ============================================================
const INGREDIENTS = [
  { id: 'limette', c: PAL.green, label: 'LIMETTE' },
  { id: 'eis', c: PAL.cyan, label: 'EIS' },
  { id: 'kirsche', c: PAL.signal, label: 'KIRSCHE' },
  { id: 'orange', c: PAL.goldHot, label: 'ORANGE' },
  { id: 'beere', c: PAL.pink, label: 'BEERE' },
] as const;
type IngId = (typeof INGREDIENTS)[number]['id'];

const shakerRush: GameFactory = (sfx: Sfx) => {
  let x = W / 2;
  let target: number | null = null;
  let items: { x: number; y: number; v: number; kind: IngId | 'bombe' }[] = [];
  let spawn = 0;
  let time = 0;
  let lives = 3;
  let recipe: { id: IngId; done: boolean }[] = [];
  let flash = 0;
  let flashText = '';
  let shake = 0;
  let drinks = 0;

  const newRecipe = () => {
    const pool = [...INGREDIENTS].sort(() => Math.random() - 0.5).slice(0, 3);
    recipe = pool.map((p) => ({ id: p.id, done: false }));
  };

  const drawIng = (g: Gfx, kind: IngId | 'bombe', px: number, py: number) => {
    if (kind === 'bombe') {
      g.rect(px - 4, py - 4, 8, 8, PAL.ash);
      g.rect(px - 3, py - 3, 6, 6, PAL.ink);
      g.rect(px + 1, py - 7, 2, 3, PAL.mute);
      g.rect(px + 2, py - 9, 2, 2, Math.floor(g.t * 10) % 2 ? PAL.signal : PAL.goldHot);
      return;
    }
    const c = INGREDIENTS.find((i) => i.id === kind)!.c;
    if (kind === 'eis') {
      g.rect(px - 4, py - 4, 8, 8, c);
      g.rect(px - 3, py - 3, 3, 3, PAL.cream);
    } else if (kind === 'limette' || kind === 'orange') {
      g.rect(px - 4, py - 2, 8, 4, c);
      g.rect(px - 2, py - 4, 4, 8, c);
      g.rect(px - 1, py - 1, 2, 2, PAL.cream);
    } else {
      g.rect(px - 3, py - 2, 6, 6, c);
      g.rect(px, py - 6, 1, 4, PAL.green);
      g.rect(px - 2, py - 1, 2, 2, PAL.cream);
    }
  };

  const game: Game = {
    score: 0,
    over: false,
    reset() {
      x = W / 2;
      target = null;
      items = [];
      spawn = 0.4;
      time = 0;
      lives = 3;
      flash = 0;
      shake = 0;
      drinks = 0;
      this.score = 0;
      this.over = false;
      newRecipe();
    },
    update(dt, held) {
      time += dt;
      const speed = 150;
      if (held.has('ArrowLeft') || held.has('KeyA')) {
        x -= speed * dt;
        target = null;
      }
      if (held.has('ArrowRight') || held.has('KeyD')) {
        x += speed * dt;
        target = null;
      }
      if (target !== null) x += clamp(target - x, -220 * dt, 220 * dt);
      x = clamp(x, 16, W - 16);

      spawn -= dt;
      if (spawn <= 0) {
        const diff = Math.min(1, time / 70);
        spawn = rand(0.75, 1.05) - diff * 0.45;
        const bomb = Math.random() < 0.14 + diff * 0.14;
        const wanted = recipe.filter((r) => !r.done).map((r) => r.id);
        const kind: IngId | 'bombe' = bomb
          ? 'bombe'
          : Math.random() < 0.55 && wanted.length
            ? pick(wanted)
            : pick(INGREDIENTS).id;
        items.push({ x: rand(14, W - 14), y: -8, v: rand(48, 62) + diff * 60, kind });
      }

      const top = H - 32;
      for (const it of items) {
        it.y += it.v * dt;
        if (it.y > top && it.y < top + 12 && Math.abs(it.x - x) < 15) {
          it.y = H + 99;
          if (it.kind === 'bombe') {
            lives--;
            shake = 0.35;
            sfx.noise(0.25, 0.09);
            if (lives <= 0) this.over = true;
          } else {
            const slot = recipe.find((r) => r.id === it.kind && !r.done);
            if (slot) {
              slot.done = true;
              this.score += 25;
              sfx.blip(660, 0.06);
              if (recipe.every((r) => r.done)) {
                drinks++;
                this.score += 100 + drinks * 20;
                flash = 1.1;
                flashText = 'SIGNATURE DRINK!';
                sfx.blip(880, 0.08);
                setTimeout(() => sfx.blip(1320, 0.12), 90);
                newRecipe();
              }
            } else {
              this.score += 5;
              sfx.blip(440, 0.04);
            }
          }
        }
      }
      items = items.filter((i) => i.y < H + 20);
      flash = Math.max(0, flash - dt);
      shake = Math.max(0, shake - dt);
    },
    render(g) {
      const { ctx } = g;
      ctx.save();
      if (shake > 0) ctx.translate(rand(-2, 2), rand(-2, 2));
      g.rect(0, 0, W, H, PAL.night);
      for (let i = 0; i < 6; i++) g.rect(0, 20 + i * 22, W, 1, PAL.smoke);
      // Flaschenregal
      for (let i = 0; i < 12; i++) {
        const bx = 8 + i * 19;
        g.rect(
          bx,
          28 - (i % 3) * 3,
          6,
          16 + (i % 3) * 3,
          [PAL.gold, PAL.signal, PAL.cyan, PAL.green][i % 4]!,
        );
        g.rect(bx + 2, 22 - (i % 3) * 3, 2, 6, PAL.ash);
      }
      // Tresen
      g.rect(0, H - 14, W, 14, PAL.smoke);
      g.rect(0, H - 14, W, 2, PAL.gold);
      for (const it of items) drawIng(g, it.kind, it.x, it.y);
      // Shaker
      const sy = H - 34;
      g.rect(x - 9, sy, 18, 20, PAL.mute);
      g.rect(x - 7, sy + 2, 4, 16, PAL.cream);
      g.rect(x - 6, sy - 5, 12, 5, PAL.ash);
      g.rect(x - 3, sy - 9, 6, 4, PAL.mute);
      // HUD
      g.text('REZEPT', 6, 4, PAL.mute, 6);
      recipe.forEach((r, i) => {
        drawIng(g, r.id, 58 + i * 15, 7);
        if (r.done) g.rect(52 + i * 15, 12, 12, 2, PAL.green);
      });
      for (let i = 0; i < 3; i++) g.rect(W - 12 - i * 10, 5, 7, 7, i < lives ? PAL.signal : PAL.smoke);
      if (flash > 0)
        g.text(flashText, W / 2, 70, Math.floor(flash * 12) % 2 ? PAL.goldHot : PAL.cream, 10, 'center');
      ctx.restore();
    },
    pointer(type, px) {
      target = type === 'up' ? null : px;
    },
  };
  return game;
};

// ============================================================
// 2) DJ DROP – Rhythmus-Spiel mit vier Spuren
// ============================================================
const LANE_KEYS = [
  ['KeyD', 'ArrowLeft'],
  ['KeyF', 'ArrowDown'],
  ['KeyJ', 'ArrowUp'],
  ['KeyK', 'ArrowRight'],
] as const;
const LANE_COLORS = [PAL.signal, PAL.goldHot, PAL.cyan, PAL.pink];
const LANE_PITCH = [523, 587, 659, 784];

const djDrop: GameFactory = (sfx: Sfx) => {
  const LANE_W = 34;
  const X0 = (W - LANE_W * 4) / 2;
  const HIT_Y = H - 30;
  const TRAVEL = 1.35;
  let t = 0;
  let bpm = 116;
  let nextBeat = 0;
  let notes: { lane: number; at: number; hit: boolean; missed: boolean }[] = [];
  let energy = 60;
  let combo = 0;
  let pulse = 0;
  let judge = '';
  let judgeT = 0;
  const laneFlash = [0, 0, 0, 0];

  const spawnPattern = (at: number) => {
    const dens = Math.min(0.85, 0.35 + t / 90);
    if (Math.random() < dens)
      notes.push({ lane: Math.floor(Math.random() * 4), at, hit: false, missed: false });
    if (t > 25 && Math.random() < dens * 0.35) {
      const l = Math.floor(Math.random() * 4);
      notes.push({ lane: l, at: at + 30 / bpm, hit: false, missed: false });
    }
  };

  const hitLane = (lane: number, self: Game) => {
    laneFlash[lane] = 0.15;
    const cand = notes
      .filter((n) => n.lane === lane && !n.hit && !n.missed)
      .sort((a, b) => Math.abs(a.at - t) - Math.abs(b.at - t))[0];
    const d = cand ? Math.abs(cand.at - t) : 1;
    if (cand && d < 0.14) {
      cand.hit = true;
      combo++;
      const mult = 1 + Math.floor(combo / 10);
      const perfect = d < 0.06;
      self.score += (perfect ? 100 : 50) * mult;
      energy = Math.min(100, energy + (perfect ? 5 : 3));
      judge = perfect ? 'PERFECT' : 'GOOD';
      judgeT = 0.4;
      sfx.blip(LANE_PITCH[lane]!, 0.07, 'square', 0.05);
    } else {
      energy -= 3;
      combo = 0;
      sfx.blip(110, 0.05, 'square', 0.03);
    }
  };

  const game: Game = {
    score: 0,
    over: false,
    reset() {
      t = 0;
      bpm = 116;
      nextBeat = 0.6;
      notes = [];
      energy = 60;
      combo = 0;
      judge = '';
      this.score = 0;
      this.over = false;
      for (let i = 0; i < 6; i++) spawnPattern(1.6 + i * (60 / bpm));
    },
    update(dt) {
      t += dt;
      bpm = Math.min(150, 116 + t * 0.4);
      if (t >= nextBeat) {
        nextBeat += 60 / bpm;
        pulse = 1;
        sfx.kick();
        setTimeout(() => sfx.hat(), (30 / bpm) * 1000);
        spawnPattern(t + TRAVEL + 6 * (60 / bpm));
      }
      for (const n of notes) {
        if (!n.hit && !n.missed && t - n.at > 0.16) {
          n.missed = true;
          combo = 0;
          energy -= 10;
          judge = 'MISS';
          judgeT = 0.4;
        }
      }
      notes = notes.filter((n) => t - n.at < 0.6);
      pulse = Math.max(0, pulse - dt * 4);
      judgeT = Math.max(0, judgeT - dt);
      for (let i = 0; i < 4; i++) laneFlash[i] = Math.max(0, laneFlash[i]! - dt);
      if (energy <= 0) {
        energy = 0;
        this.over = true;
      }
    },
    render(g) {
      g.rect(0, 0, W, H, PAL.ink);
      // Lichtkegel im Takt
      for (let i = 0; i < 5; i++) {
        const lx = 20 + i * 50 + Math.sin(g.t * 1.3 + i) * 10;
        g.ctx.fillStyle = `rgba(242,195,107,${0.05 + pulse * 0.08})`;
        g.ctx.beginPath();
        g.ctx.moveTo(lx, 0);
        g.ctx.lineTo(lx - 22, H);
        g.ctx.lineTo(lx + 22, H);
        g.ctx.fill();
      }
      for (let l = 0; l < 4; l++) {
        const lx = X0 + l * LANE_W;
        g.rect(lx, 0, LANE_W - 2, H, laneFlash[l]! > 0 ? 'rgba(243,238,229,0.12)' : 'rgba(38,33,27,0.55)');
        g.rect(lx + 4, HIT_Y, LANE_W - 10, 4, LANE_COLORS[l]!);
      }
      for (const n of notes) {
        if (n.hit) continue;
        const y = HIT_Y - ((n.at - t) / TRAVEL) * (HIT_Y + 10);
        if (y < -10) continue;
        const lx = X0 + n.lane * LANE_W;
        g.rect(lx + 5, y - 3, LANE_W - 12, 7, n.missed ? PAL.ash : LANE_COLORS[n.lane]!);
        g.rect(lx + 7, y - 2, 6, 2, PAL.cream);
      }
      // Crowd
      for (let i = 0; i < 30; i++) {
        const cx = i * 8 + 2;
        const bob = Math.abs(Math.sin(g.t * (bpm / 30) + i)) * (energy / 25);
        g.rect(cx, H - 12 - bob, 6, 12, PAL.night);
        g.rect(cx + 1, H - 16 - bob, 4, 4, PAL.night);
        if (energy > 70 && i % 5 === 0) g.rect(cx + 2, H - 22 - bob * 2, 2, 6, PAL.night);
      }
      // HUD
      g.rect(6, 6, 60, 5, PAL.smoke);
      g.rect(6, 6, (energy / 100) * 60, 5, energy > 30 ? PAL.green : PAL.signal);
      g.text('CROWD', 6, 13, PAL.mute, 6);
      g.text(`${Math.round(bpm)} BPM`, W - 6, 6, PAL.mute, 6, 'right');
      if (combo > 4) g.text(`${combo}x`, W - 6, 15, PAL.goldHot, 8, 'right');
      if (judgeT > 0)
        g.text(judge, W / 2, HIT_Y - 26, judge === 'MISS' ? PAL.signal : PAL.goldHot, 8, 'center');
    },
    key(code) {
      LANE_KEYS.forEach((keys, lane) => {
        if ((keys as readonly string[]).includes(code)) hitLane(lane, game);
      });
    },
    pointer(type, px) {
      if (type !== 'down') return;
      const lane = clamp(Math.floor((px - X0) / LANE_W), 0, 3);
      hitLane(lane, game);
    },
  };
  return game;
};

// ============================================================
// 3) TÜRSTEHER – nur wer das richtige Armband hat, kommt rein
// ============================================================
const BANDS = [
  { id: 'gold', c: PAL.goldHot, label: 'GOLD' },
  { id: 'rot', c: PAL.signal, label: 'ROT' },
  { id: 'blau', c: PAL.blue, label: 'BLAU' },
  { id: 'gruen', c: PAL.green, label: 'GRÜN' },
] as const;
type BandId = (typeof BANDS)[number]['id'];

const bouncer: GameFactory = (sfx: Sfx) => {
  let allowed: BandId[] = [];
  let guest: {
    band: BandId;
    x: number;
    state: 'walk' | 'wait' | 'in' | 'out';
    t: number;
    shirt: string;
    hair: string;
  } | null = null;
  let decideWindow = 2.4;
  let lives = 3;
  let served = 0;
  let ruleFlash = 0;
  let feedback = '';
  let feedbackT = 0;
  let feedbackOk = true;
  let queue: { shirt: string; hair: string }[] = [];

  const SHIRTS = [PAL.ash, PAL.blue, PAL.pink, PAL.cream, PAL.smoke, PAL.gold];
  const HAIR = [PAL.ink, PAL.goldHot, PAL.signal, PAL.mute];
  const person = () => ({ shirt: pick(SHIRTS), hair: pick(HAIR) });

  const newRule = () => {
    const pool = [...BANDS].sort(() => Math.random() - 0.5);
    allowed = pool.slice(0, Math.random() < 0.5 ? 1 : 2).map((b) => b.id);
    ruleFlash = 1.4;
    sfx.blip(392, 0.08);
    setTimeout(() => sfx.blip(523, 0.1), 100);
  };
  const nextGuest = () => {
    const p = queue.shift() ?? person();
    queue.push(person());
    const wantIn = Math.random() < 0.5;
    const band = wantIn ? pick(allowed) : pick(BANDS.filter((b) => !allowed.includes(b.id))).id;
    guest = { band, x: W + 10, state: 'walk', t: 0, ...p };
  };

  const decide = (letIn: boolean, self: Game) => {
    if (!guest || guest.state !== 'wait') return;
    const ok = allowed.includes(guest.band) === letIn;
    if (ok) {
      self.score += 50 + Math.round(Math.max(0, decideWindow - guest.t) * 40);
      served++;
      feedback = letIn ? 'WILLKOMMEN!' : 'HEUTE NICHT.';
      feedbackOk = true;
      sfx.blip(letIn ? 784 : 330, 0.08);
    } else {
      lives--;
      feedback = letIn ? 'FALSCHES BAND!' : 'DAS WAR VIP!';
      feedbackOk = false;
      sfx.noise(0.2, 0.07);
    }
    feedbackT = 0.7;
    guest.state = letIn ? 'in' : 'out';
    guest.t = 0;
    if (lives <= 0) self.over = true;
    if (served > 0 && served % 6 === 0 && ok) newRule();
    decideWindow = Math.max(0.85, 2.4 - served * 0.06);
  };

  const drawPerson = (
    g: Gfx,
    px: number,
    py: number,
    shirt: string,
    hair: string,
    band?: BandId,
    scale = 1,
  ) => {
    const s = scale;
    g.rect(px - 5 * s, py - 34 * s, 10 * s, 10 * s, '#d9a47a');
    g.rect(px - 5 * s, py - 36 * s, 10 * s, 4 * s, hair);
    g.rect(px - 7 * s, py - 24 * s, 14 * s, 16 * s, shirt);
    g.rect(px - 6 * s, py - 8 * s, 5 * s, 8 * s, PAL.night);
    g.rect(px + 1 * s, py - 8 * s, 5 * s, 8 * s, PAL.night);
    if (band) {
      g.rect(px - 11 * s, py - 30 * s, 4 * s, 10 * s, shirt);
      g.rect(px - 11 * s, py - 26 * s, 4 * s, 3 * s, BANDS.find((b) => b.id === band)!.c);
    }
  };

  const game: Game = {
    score: 0,
    over: false,
    reset() {
      lives = 3;
      served = 0;
      decideWindow = 2.4;
      feedback = '';
      feedbackT = 0;
      this.score = 0;
      this.over = false;
      queue = [person(), person(), person()];
      newRule();
      nextGuest();
    },
    update(dt) {
      ruleFlash = Math.max(0, ruleFlash - dt);
      feedbackT = Math.max(0, feedbackT - dt);
      if (!guest) return;
      guest.t += dt;
      const DOOR_X = W / 2 + 18;
      if (guest.state === 'walk') {
        guest.x = Math.max(DOOR_X, guest.x - 220 * dt);
        if (guest.x === DOOR_X) {
          guest.state = 'wait';
          guest.t = 0;
        }
      } else if (guest.state === 'wait') {
        if (guest.t > decideWindow) {
          lives--;
          feedback = 'ZU LANGSAM!';
          feedbackOk = false;
          feedbackT = 0.7;
          sfx.noise(0.2, 0.07);
          guest.state = 'out';
          guest.t = 0;
          if (lives <= 0) this.over = true;
        }
      } else if (guest.state === 'in') {
        guest.x -= 160 * dt;
        if (guest.t > 0.35) nextGuest();
      } else {
        guest.x += 200 * dt;
        if (guest.t > 0.35) nextGuest();
      }
    },
    render(g) {
      g.rect(0, 0, W, H, PAL.night);
      g.rect(0, H - 20, W, 20, PAL.smoke);
      // Club-Fassade
      g.rect(56, 30, 88, H - 50, PAL.ink);
      g.rect(60, 34, 80, 6, PAL.ash);
      g.text('C-CLUB', 100, 46, Math.floor(g.t * 2) % 2 ? PAL.signal : PAL.goldHot, 8, 'center');
      g.rect(84, 70, 32, H - 90, guest?.state === 'in' ? PAL.goldHot : PAL.smoke);
      // Absperrkordel
      g.rect(150, H - 40, 2, 20, PAL.gold);
      g.rect(200, H - 40, 2, 20, PAL.gold);
      g.rect(150, H - 38, 52, 2, PAL.signal);
      // Schlange
      queue.forEach((q, i) => drawPerson(g, 190 + i * 16, H - 20, q.shirt, q.hair, undefined, 0.8));
      // Türsteher
      drawPerson(g, 40, H - 20, PAL.ink, PAL.ink);
      g.rect(34, H - 46, 12, 3, PAL.ink);
      if (guest) {
        drawPerson(g, guest.x, H - 20, guest.shirt, guest.hair, guest.band);
        // Armband-Plakette über dem Kopf, damit man die Farbe sofort erkennt
        if (guest.state === 'walk' || guest.state === 'wait') {
          const b = BANDS.find((x) => x.id === guest!.band)!;
          const bx = guest.x - 9;
          const by = H - 70;
          g.rect(bx - 1, by - 1, 20, 12, PAL.cream);
          g.rect(bx, by, 18, 10, b.c);
          g.rect(bx + 7, by + 10, 4, 3, PAL.cream);
        }
      }
      // Timer
      if (guest?.state === 'wait') {
        const left = 1 - guest.t / decideWindow;
        g.rect(W / 2 - 30, 22, 60, 4, PAL.smoke);
        g.rect(W / 2 - 30, 22, 60 * left, 4, left > 0.35 ? PAL.green : PAL.signal);
      }
      // Regel
      g.text('HEUTE REIN:', 6, 5, PAL.mute, 6);
      allowed.forEach((id, i) => {
        const b = BANDS.find((x) => x.id === id)!;
        g.rect(72 + i * 36, 4, 6, 6, b.c);
        g.text(b.label, 80 + i * 36, 5, ruleFlash > 0 && Math.floor(ruleFlash * 10) % 2 ? PAL.cream : b.c, 6);
      });
      for (let i = 0; i < 3; i++) g.rect(W - 12 - i * 10, 4, 7, 7, i < lives ? PAL.signal : PAL.smoke);
      if (ruleFlash > 0) g.text('NEUE REGEL!', W / 2, 32, PAL.goldHot, 8, 'center');
      if (feedbackT > 0) g.text(feedback, W / 2, 58, feedbackOk ? PAL.green : PAL.signal, 8, 'center');
      g.text('< NEIN', 6, H - 14, PAL.mute, 6);
      g.text('REIN >', W - 6, H - 14, PAL.mute, 6, 'right');
    },
    key(code) {
      if (code === 'ArrowLeft' || code === 'KeyA') decide(false, game);
      if (code === 'ArrowRight' || code === 'KeyD') decide(true, game);
    },
    pointer(type, px) {
      if (type === 'down') decide(px > W / 2, game);
    },
  };
  return game;
};

export const GAMES = {
  'shaker-rush': shakerRush,
  'dj-drop': djDrop,
  tuersteher: bouncer,
} satisfies Record<string, GameFactory>;
