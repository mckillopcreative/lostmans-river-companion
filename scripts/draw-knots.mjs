// Draws the five knots, four stages each, as SVG diagrams in public/knots/<id>-<n>.svg.
// Each line is ONE continuous strand: a Catmull-Rom curve through hand-placed points, drawn as
// a tube (dark edge, light core). Crossings are shown by drawing the strand in pieces ordered
// by depth, with butt ends at the joins so the pieces meet seamlessly: the over-strand simply
// passes on top. Free ends get rounded caps drawn underneath.
//   node scripts/draw-knots.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const out = resolve(import.meta.dirname, '..', 'public', 'knots');
mkdirSync(out, { recursive: true });

const INK = '#1f2a2e';
const CORE = '#fbf8f1';
const HOOK = '#1f2a2e';
const f = (n) => Math.round(n * 10) / 10;

// ---------- curve machinery ----------
/** Catmull-Rom through pts → array of cubic spans [p0,c1,c2,p1] */
function spans(pts) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const t = 1 / 6;
    out.push([p1, [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t], [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t], p2]);
  }
  return out;
}
const spanD = (s, move) => `${move ? `M${f(s[0][0])} ${f(s[0][1])}` : ''}C${f(s[1][0])} ${f(s[1][1])} ${f(s[2][0])} ${f(s[2][1])} ${f(s[3][0])} ${f(s[3][1])}`;

/**
 * A strand: points with an optional depth per point (depth of the span that starts there;
 * default 1). Returns [{z, d}] pieces, plus the two end points and their tangents.
 */
function strand(pts, { w = 7, core = 3.4 } = {}) {
  const P = pts.map((p) => [p[0], p[1]]);
  const Z = pts.map((p) => (p[2] ?? null));
  let z = 1;
  const zs = Z.map((v) => (v === null ? z : (z = v)));
  const sp = spans(P);
  const pieces = [];
  let cur = null;
  sp.forEach((s, i) => {
    const zi = zs[i];
    if (!cur || cur.z !== zi) {
      cur = { z: zi, d: spanD(s, true), w, core };
      pieces.push(cur);
    } else cur.d += spanD(s, false);
  });
  return { pieces, ends: [P[0], P[P.length - 1]], w, core };
}

/** helix around a vertical axis: from y0 upward, n turns, pitch, half-width; front over, back under */
function coilV(cx, y0, n, pitch, hw, { front = 3, back = 0, sag = 2 } = {}) {
  const pts = [];
  for (let k = 0; k < n; k++) {
    const y = y0 - k * pitch;
    pts.push([cx + hw, y, front]);
    pts.push([cx, y - pitch * 0.25 + sag, front]);
    pts.push([cx - hw, y - pitch * 0.5, back]);
    pts.push([cx, y - pitch * 0.75 - sag, back]);
  }
  pts.push([cx + hw, y0 - n * pitch, 1]);
  return pts;
}
/** helix around a horizontal axis: from x0 rightward */
function coilH(cy, x0, n, pitch, hh, { front = 3, back = 0, sag = 2 } = {}) {
  const pts = [];
  for (let k = 0; k < n; k++) {
    const x = x0 + k * pitch;
    pts.push([x, cy - hh, front]);
    pts.push([x + pitch * 0.25 + sag, cy, front]);
    pts.push([x + pitch * 0.5, cy + hh, back]);
    pts.push([x + pitch * 0.75 - sag, cy, back]);
  }
  pts.push([x0 + n * pitch, cy - hh, 1]);
  return pts;
}

// ---------- hardware ----------
const EYE = [100, 238];
function hook() {
  return {
    back: `<path d="M${EYE[0] - 7} ${EYE[1]}a7 7 0 0 1 14 0" fill="none" stroke="${HOOK}" stroke-width="4.5"/>`,
    front: `<path d="M${EYE[0] + 7} ${EYE[1]}a7 7 0 0 1 -14 0" fill="none" stroke="${HOOK}" stroke-width="4.5"/>
      <path d="M${EYE[0]} ${EYE[1] + 7}L${EYE[0]} 292C${EYE[0]} 318 134 318 136 292L131 281" fill="none" stroke="${HOOK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
}
function swivel() {
  return {
    back: `<path d="M${EYE[0] - 7} ${EYE[1]}a7 7 0 0 1 14 0" fill="none" stroke="${HOOK}" stroke-width="4.5"/>`,
    front: `<path d="M${EYE[0] + 7} ${EYE[1]}a7 7 0 0 1 -14 0" fill="none" stroke="${HOOK}" stroke-width="4.5"/>
      <path d="M${EYE[0]} ${EYE[1] + 7}L${EYE[0]} 252" stroke="${HOOK}" stroke-width="4.5"/>
      <ellipse cx="${EYE[0]}" cy="268" rx="13" ry="16" fill="none" stroke="${HOOK}" stroke-width="4.5"/>
      <path d="M${EYE[0]} 284L${EYE[0]} 292" stroke="${HOOK}" stroke-width="4.5"/>
      <circle cx="${EYE[0]}" cy="300" r="8" fill="none" stroke="${HOOK}" stroke-width="4.5"/>`,
  };
}

// ---------- render ----------
function svg({ w = 200, h = 330, hw, strands, extra = '' }) {
  const items = [];
  for (const s of strands) for (const p of s.pieces) items.push(p);
  items.sort((a, b) => a.z - b.z);
  const tube = (p) =>
    `<path d="${p.d}" fill="none" stroke="${INK}" stroke-width="${p.w}" stroke-linejoin="round"/><path d="${p.d}" fill="none" stroke="${CORE}" stroke-width="${p.core}" stroke-linejoin="round"/>`;
  const caps = strands
    .flatMap((s) => s.ends.map((e) => `<circle cx="${f(e[0])}" cy="${f(e[1])}" r="${s.w / 2}" fill="${INK}"/><circle cx="${f(e[0])}" cy="${f(e[1])}" r="${s.core / 2}" fill="${CORE}"/>`))
    .join('');
  // hardware back half sits under the line (z<1), front half over the eye spans (between 1 and 2)
  const under = items.filter((p) => p.z < 1).map(tube).join('');
  const mid = items.filter((p) => p.z >= 1 && p.z < 2).map(tube).join('');
  const over = items.filter((p) => p.z >= 2).map(tube).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 2}" height="${h * 2}">${caps}${hw?.back ?? ''}${under}${mid}${hw?.front ?? ''}${over}${extra}</svg>`;
}

// the U through the eye: down on the left, up on the right
const thru = (xl = 95, xr = 105) => [
  [xl, 226],
  [xl, 238],
  [100, 246],
  [xr, 238],
  [xr, 226],
];

const knots = {};

// ===== Improved clinch =====
knots['improved-clinch'] = [
  () => svg({ hw: hook(), strands: [strand([[95, 14], [95, 120], ...thru(), [105, 170], [114, 140], [132, 112]])] }),
  () => {
    const s = [[95, 14], [95, 120], ...thru()];
    // tag climbs a little, then wraps the standing line upward
    s.push([106, 222, 1], ...coilV(95, 214, 5, 12, 11), [116, 150], [134, 124]);
    return svg({ hw: hook(), strands: [strand(s)] });
  },
  () => {
    const s = [[95, 14], [95, 120], ...thru()];
    s.push([106, 222, 1], ...coilV(95, 214, 5, 12, 11));
    // back down outside the wraps, through the small loop by the eye (behind both strands), then up through the big loop
    s.push([120, 158, 2], [130, 184, 2], [124, 214, 2], [112, 230, 0], [100, 232, 0], [86, 228, 0], [80, 214, 2], [88, 200, 4], [104, 194, 4], [118, 186, 4]);
    return svg({ hw: hook(), strands: [strand(s)] });
  },
  () => {
    const s = [[95, 14], [95, 150], ...thru()];
    s.push([104, 226, 1], ...coilV(95, 222, 5, 6, 8, { sag: 1 }), [110, 191, 2], [118, 186, 2]);
    return svg({ hw: hook(), strands: [strand(s)] });
  },
];

// ===== Non-slip loop knot =====
// an open overhand in the standing line around (cx, cy)
const overhand = (cx, cy) => [
  [cx, cy - 40],
  [cx, cy - 14, 1],
  [cx + 14, cy + 2, 1],
  [cx + 8, cy + 18, 1],
  [cx - 10, cy + 14, 1],
  [cx - 8, cy - 4, 2],
  [cx + 4, cy + 2, 0],
  [cx + 6, cy + 30, 1],
];
knots['loop-knot'] = [
  () => {
    const s = [[95, 14], ...overhand(95, 120).slice(1), [97, 200], [95, 226], ...thru().slice(1), [105, 200], [104, 160, 1], [100, 132, 2], [110, 110, 2], [126, 96, 2]];
    return svg({ hw: hook(), strands: [strand(s)] });
  },
  () => {
    const s = [[95, 14], ...overhand(95, 120).slice(1), [97, 200], [95, 226], ...thru().slice(1), [105, 200], [104, 160, 1], [100, 132, 2], [104, 104, 2]];
    s.push(...coilV(95, 96, 4, 12, 10), [112, 40], [128, 22]);
    return svg({ hw: hook(), strands: [strand(s)] });
  },
  () => {
    const s = [[95, 14], ...overhand(95, 120).slice(1), [97, 200], [95, 226], ...thru().slice(1), [105, 200], [104, 160, 1], [100, 132, 2], [104, 104, 2]];
    s.push(...coilV(95, 96, 4, 12, 10), [118, 50, 2], [126, 80, 2], [116, 108, 0], [104, 126, 0], [100, 150, 2], [110, 166, 2]);
    return svg({ hw: hook(), strands: [strand(s)] });
  },
  () => {
    // snug knot well above the eye, loop left open below it
    const s = [[95, 14], [95, 150], [95, 168, 1], ...coilV(95, 176, 4, 6, 8, { sag: 1 }).map((p) => [p[0], p[1] + 20, p[2]]), [96, 200, 1], [92, 214], ...thru(93, 107).slice(1), [108, 214], [104, 198, 2], [110, 186, 2], [118, 182, 2]];
    return svg({ hw: hook(), strands: [strand(s)] });
  },
];

// ===== Uni knot (swivel) =====
knots['uni-knot'] = [
  () => svg({ hw: swivel(), strands: [strand([[95, 14], [95, 120], ...thru(), [105, 150], [105, 60], [106, 40]])] }),
  () => {
    const s = [[95, 14], [95, 120], ...thru(), [105, 160], [105, 108], [96, 90], [74, 98], [62, 140], [70, 186, 2], [84, 200, 2]];
    s.push(...coilV(100, 202, 2, 14, 14), [120, 166, 2], [134, 156, 2]);
    return svg({ hw: swivel(), strands: [strand(s)] });
  },
  () => {
    const s = [[95, 14], [95, 120], ...thru(), [105, 160], [105, 104], [96, 86], [72, 94], [58, 140], [66, 196, 2], [84, 214, 2]];
    s.push(...coilV(100, 214, 5, 12, 14), [122, 150, 2], [136, 136, 2]);
    return svg({ hw: swivel(), strands: [strand(s)] });
  },
  () => {
    const s = [[95, 14], [95, 150], ...thru()];
    s.push([104, 228, 1], ...coilV(100, 226, 5, 6, 9, { sag: 1 }), [112, 194, 2], [118, 190, 2]);
    return svg({ hw: swivel(), strands: [strand(s)] });
  },
];

// ===== Palomar =====
// the doubled line is the single strand folded: down one side, round the bight, up the other.
// pairs a centre path into two parallel legs 8 apart joined by a turn at the bight.
function doubled(center, bight) {
  const n = (a, b) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  };
  const left = [], right = [];
  center.forEach((p, i) => {
    const a = center[Math.max(0, i - 1)], b = center[Math.min(center.length - 1, i + 1)];
    const [nx, ny] = n(a, b);
    left.push([p[0] + nx * 4, p[1] + ny * 4, p[2]]);
    right.push([p[0] - nx * 4, p[1] - ny * 4, p[2]]);
  });
  // right leg returns in reverse; depth of a reversed span is the depth of the span it mirrors
  const back = right.reverse().map((p, i, arr) => [p[0], p[1], (arr[i + 1] ?? p)[2] ?? 1]);
  return [...left, ...bight, ...back];
}
knots['palomar'] = [
  () => {
    const c = [[96, 14], [96, 120], [96, 222], [100, 240], [94, 262], [74, 284]];
    const bight = [[62, 300], [58, 318], [72, 326], [86, 314], [88, 296]];
    // simpler: draw it as one path: left leg down through eye, round the bight, right leg back up
    const s = [[92, 14], [92, 222], [96, 238, 1], [96, 250, 1], [80, 270], [62, 292], [58, 312], [70, 324], [86, 316], [96, 296], [104, 262, 0], [104, 250, 1], [104, 238, 1], [104, 222], [104, 30]];
    void c; void bight;
    return svg({ hw: hook(), strands: [strand(s)] });
  },
  () => {
    // doubled line ties an overhand in itself above the eye; the bight hangs free to the left
    const s = [
      [92, 14], [92, 110, 1], [104, 124, 1], [118, 140, 1], [112, 160, 1], [90, 158, 2], [80, 140, 2], [88, 128, 0], [92, 150, 1], [96, 200], [96, 238, 1], [96, 250, 1],
      [84, 270], [66, 292], [56, 312], [68, 326], [84, 318], [96, 296], [104, 262, 0], [104, 250, 1], [104, 238, 1], [104, 200], [100, 156, 2], [96, 132, 0], [86, 136, 0], [84, 152, 2], [100, 166, 2], [124, 160, 1], [124, 134, 1], [110, 118, 1], [100, 104], [100, 30],
    ];
    return svg({ hw: hook(), strands: [strand(s)] });
  },
  () => {
    // the bight has been passed over the whole hook: it now hangs round under the bend
    const s = [
      [92, 14], [92, 110, 1], [104, 124, 1], [118, 140, 1], [112, 160, 1], [90, 158, 2], [80, 140, 2], [88, 128, 0], [92, 150, 1], [96, 200], [96, 238, 1], [96, 250, 1],
      [82, 268, 0], [70, 296, 0], [80, 326, 0], [112, 334, 0], [146, 316, 3], [150, 282, 3], [136, 256, 3], [112, 250, 0], [104, 250, 1], [104, 238, 1], [104, 200], [100, 156, 2], [96, 132, 0], [86, 136, 0], [84, 152, 2], [100, 166, 2], [124, 160, 1], [124, 134, 1], [110, 118, 1], [100, 104], [100, 30],
    ];
    return svg({ hw: hook(), strands: [strand(s)] });
  },
  () => {
    // drawn down: a tight knot sits on the eye, two ends above
    const s = [[93, 14], [93, 200], [92, 218, 2], [108, 222, 2], [108, 230, 0], [96, 238, 1], [100, 246, 1], [104, 238, 1], [92, 230, 2], [92, 222, 0], [106, 214, 1], [107, 190], [110, 170], [112, 160]];
    return svg({ hw: hook(), strands: [strand(s)] });
  },
];

// ===== Albright (horizontal) =====
const AW = 340, AH = 220, CY = 110;
// heavy leader folded into a U, open to the left, bend at the right
function leader(x0top = 20, x0bot = 70, bend = 262) {
  return strand(
    [[x0top, CY - 26], [bend - 30, CY - 26], [bend - 4, CY - 22], [bend + 12, CY - 6], [bend + 12, CY + 6], [bend - 4, CY + 22], [bend - 30, CY + 26], [x0bot, CY + 26]],
    { w: 11, core: 5.6 },
  );
}
knots['albright'] = [
  () => {
    const light = strand([[326, 198], [292, 170], [262, 146, 2], [246, 124, 1], [220, CY], [90, CY], [70, CY]]);
    return svg({ w: AW, h: AH, strands: [leader(), light] });
  },
  () => {
    const light = strand([[326, 198], [292, 170], [262, 146, 2], [246, 124, 1], [220, CY], [120, CY], [72, CY], [64, CY - 22], [80, CY - 34], ...coilH(CY, 92, 5, 18, 34), [196, 60], [214, 32]]);
    return svg({ w: AW, h: AH, strands: [leader(), light] });
  },
  () => {
    const light = strand([[326, 198], [292, 170], [262, 146, 2], [246, 124, 1], [220, CY], [120, CY], [72, CY], [64, CY - 22], [80, CY - 34], ...coilH(CY, 90, 10, 9, 34), [196, CY - 30, 2], [212, CY - 8, 1], [232, CY + 4, 1], [262, 136, 2], [298, 164, 2], [330, 178, 2]]);
    return svg({ w: AW, h: AH, strands: [leader(), light] });
  },
  () => {
    const light = strand([[326, 196], [292, 168], [262, 146, 2], [246, 124, 1], [220, CY], [150, CY], [116, CY], [108, CY - 22], [116, CY - 32], ...coilH(CY, 118, 10, 6, 30, { sag: 1 }), [184, CY - 26, 2], [196, CY - 8, 1], [212, CY + 2, 1], [232, CY + 10, 2], [252, 132, 2]]);
    return svg({ w: AW, h: AH, strands: [leader(20, 110), light] });
  },
];

let n = 0;
for (const [id, stages] of Object.entries(knots)) {
  stages.forEach((draw, i) => {
    writeFileSync(resolve(out, `${id}-${i + 1}.svg`), draw());
    n++;
  });
}
console.log(`✓ ${n} knot diagrams → public/knots/`);
