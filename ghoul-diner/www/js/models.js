// Ghoul Diner — original 3D models built from Three.js primitives (toon shading + ink outlines).
import * as THREE from '../vendor/three.module.min.js';

// ---------------------------------------------------------------- materials
const gradientMap = (() => {
  const d = new Uint8Array([70, 150, 210, 255]);
  const t = new THREE.DataTexture(d, 4, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
  return t;
})();
const mats = new Map();
export function toon(color, opt = {}) {
  const key = color + JSON.stringify(opt);
  if (!opt.unique && mats.has(key)) return mats.get(key);
  const m = new THREE.MeshToonMaterial({ color, gradientMap, ...stripUnique(opt) });
  if (!opt.unique) mats.set(key, m);
  return m;
}
function stripUnique(o) { const { unique, ...r } = o; return r; }
export const INK = 0x1c1026;
const inkMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
const glowMat = c => new THREE.MeshBasicMaterial({ color: c });

// mesh with optional inverted-hull outline
export function part(geo, color, o = {}) {
  const mat = o.mat || toon(color, o.matOpt || {});
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = o.shadow !== false; m.receiveShadow = true;
  if (o.outline !== false) {
    const ol = new THREE.Mesh(geo, inkMat);
    ol.scale.setScalar(o.ow || 1.08);
    ol.castShadow = false; ol.raycast = () => {};
    m.add(ol);
  }
  if (o.pos) m.position.set(...o.pos);
  if (o.rot) m.rotation.set(...o.rot);
  if (o.scale) m.scale.set(...o.scale);
  return m;
}
const G = {
  box: (w, h, d) => new THREE.BoxGeometry(w, h, d),
  rbox: (w, h, d, r = 0.04) => roundedBox(w, h, d, r),
  sph: (r, ws = 20, hs = 14) => new THREE.SphereGeometry(r, ws, hs),
  cyl: (rt, rb, h, s = 20, open = false) => new THREE.CylinderGeometry(rt, rb, h, s, 1, open),
  cone: (r, h, s = 16) => new THREE.ConeGeometry(r, h, s),
  cap: (r, l) => new THREE.CapsuleGeometry(r, l, 6, 14),
  torus: (r, t, arc = Math.PI * 2) => new THREE.TorusGeometry(r, t, 8, 24, arc),
};
function roundedBox(w, h, d, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: d - r * 2, bevelEnabled: true, bevelThickness: r, bevelSize: r * 0.5, bevelSegments: 2 });
  g.translate(0, 0, -(d - r * 2) / 2);
  return g;
}

// ---------------------------------------------------------------- canvas textures
const texCache = new Map();
export function canvasTex(key, w, h, draw) {
  if (texCache.has(key)) return texCache.get(key);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  texCache.set(key, t);
  return t;
}

// ---------------------------------------------------------------- eyes
function eye(r, pupil = 0x1c1026, glow = false) {
  const g = new THREE.Group();
  g.add(part(G.sph(r, 14, 10), 0xffffff, { ow: 1.15 }));
  const p = new THREE.Mesh(G.sph(r * 0.58, 12, 8), glow ? glowMat(pupil) : toon(pupil));
  p.position.z = r * 0.55; g.add(p);
  const hl = new THREE.Mesh(G.sph(r * 0.2, 8, 6), glowMat(0xffffff));
  hl.position.set(-r * 0.2, r * 0.25, r * 0.95); g.add(hl);
  return g;
}
function eyes(g, y, z, sep, r, pupil, glow) {
  for (const k of [-1, 1]) { const e = eye(r, pupil, glow); e.position.set(k * sep, y, z); g.add(e); }
}

// ---------------------------------------------------------------- characters
// Every character: Group with userData.body (bobbing part), legs (optional), animate(t, walking, seated)
function character(build) {
  const root = new THREE.Group();
  const body = new THREE.Group(); root.add(body);
  const ud = { body, legs: [], arms: [], float: false, squish: false };
  build(body, ud);
  root.userData = ud;
  root.userData.animate = (t, walking, seated, ph) => {
    const k = t * 9 + ph;
    body.position.y = ud.float ? 0.12 + Math.sin(t * 3 + ph) * 0.05 : (walking ? Math.abs(Math.sin(k)) * 0.06 : Math.sin(t * 2 + ph) * 0.01);
    body.rotation.z = walking ? Math.sin(k) * 0.08 : 0;
    ud.legs.forEach((l, i) => { l.rotation.x = walking ? Math.sin(k + i * Math.PI) * 0.6 : (seated ? -1.2 : 0); });
    ud.arms.forEach((a, i) => { a.rotation.x = walking ? Math.sin(k + i * Math.PI + Math.PI) * 0.5 : 0; });
    if (ud.squish) { const s = 1 + Math.sin(t * 6 + ph) * 0.07; body.scale.set(s, 1 / s, s); }
    if (ud.extra) ud.extra(t, ph);
  };
  return root;
}
function leg(color, x, len = 0.2, r = 0.05) {
  const pivot = new THREE.Group(); pivot.position.set(x, len + 0.02, 0);
  pivot.add(part(G.cap(r, len - r * 2), color, { pos: [0, -len / 2, 0] }));
  return pivot;
}

export const CHARACTERS = {
  ghost: () => character((b, ud) => {
    ud.float = true;
    const pts = [];
    for (let i = 0; i <= 12; i++) { const a = i / 12; pts.push(new THREE.Vector2(0.27 + Math.sin(a * Math.PI * 0.5) * 0.04 - a * a * 0.02, a * 0.45)); }
    const sheet = part(new THREE.LatheGeometry(pts, 28), 0xf2f6ff, { matOpt: { transparent: true, opacity: 0.93 } });
    b.add(sheet);
    b.add(part(G.sph(0.29, 24, 16), 0xf2f6ff, { pos: [0, 0.45, 0], matOpt: { transparent: true, opacity: 0.93 } }));
    // wavy hem
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; b.add(part(G.sph(0.08, 10, 8), 0xf2f6ff, { pos: [Math.cos(a) * 0.25, 0.0, Math.sin(a) * 0.25], outline: false })); }
    eyes(b, 0.5, 0.22, 0.1, 0.075, 0x2a3a9a);
    b.add(part(G.sph(0.04, 10, 8), 0x1c1026, { pos: [0, 0.37, 0.27], outline: false, scale: [1, 0.8, 0.6] }));
    for (const k of [-1, 1]) b.add(new THREE.Mesh(G.sph(0.04, 8, 6), glowMat(0xff9eb5)).translateX(k * 0.18).translateY(0.4).translateZ(0.22));
    // little arms
    for (const k of [-1, 1]) { const a = part(G.sph(0.07, 10, 8), 0xf2f6ff, { pos: [k * 0.3, 0.3, 0.05], scale: [1, 0.7, 0.7] }); b.add(a); }
  }),
  vampire: () => character((b, ud) => {
    for (const x of [-0.08, 0.08]) { const l = leg(0x241428, x, 0.22); b.add(l); ud.legs.push(l); }
    b.add(part(G.cone(0.32, 0.6, 20), 0x9a1834, { pos: [0, 0.48, -0.03] }));
    b.add(part(G.cap(0.15, 0.2), 0x2b1a2a, { pos: [0, 0.48, 0.05] }));
    b.add(part(G.cone(0.08, 0.18, 4), 0xf4f0ff, { pos: [0, 0.62, 0.17], rot: [Math.PI, 0, 0], outline: false }));
    for (const k of [-1, 1]) b.add(part(G.cone(0.12, 0.3, 4), 0x5d0d20, { pos: [k * 0.17, 0.82, -0.04], rot: [0, 0, -k * 0.5] }));
    b.add(part(G.sph(0.24, 24, 16), 0xdcd8ef, { pos: [0, 0.98, 0] }));
    const hair = part(new THREE.SphereGeometry(0.255, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), 0x241428, { pos: [0, 1.0, -0.02] });
    b.add(hair);
    b.add(part(G.cone(0.08, 0.14, 4), 0x241428, { pos: [0, 1.13, 0.2], rot: [Math.PI * 0.6, 0, 0], outline: false }));
    eyes(b, 0.98, 0.19, 0.085, 0.06, 0xd8102f, true);
    for (const k of [-1, 1]) b.add(new THREE.Mesh(G.cone(0.015, 0.05, 6), toon(0xffffff)).translateX(k * 0.035).translateY(0.86).translateZ(0.22).rotateX(Math.PI));
  }),
  mummy: () => character((b, ud) => {
    for (const x of [-0.08, 0.08]) { const l = leg(0xe8dcbc, x, 0.22, 0.06); b.add(l); ud.legs.push(l); }
    b.add(part(G.cap(0.2, 0.25), 0xe8dcbc, { pos: [0, 0.52, 0] }));
    b.add(part(G.sph(0.24, 24, 16), 0xe8dcbc, { pos: [0, 0.95, 0] }));
    for (let i = 0; i < 7; i++) {
      const tr = new THREE.Mesh(G.torus(i < 4 ? 0.205 : 0.22, 0.02), toon(0xc9b98f));
      tr.rotation.x = Math.PI / 2 + (i % 2 ? 0.15 : -0.12); tr.position.y = 0.35 + i * 0.1 + (i >= 4 ? 0.23 : 0);
      b.add(tr);
    }
    b.add(part(G.box(0.36, 0.08, 0.1), 0x3a2a1a, { pos: [0, 0.98, 0.17], outline: false }));
    const e1 = new THREE.Mesh(G.sph(0.04, 10, 8), glowMat(0xffe94a)); e1.position.set(-0.07, 0.98, 0.23); b.add(e1);
    const e2 = new THREE.Mesh(G.sph(0.03, 10, 8), glowMat(0xffe94a)); e2.position.set(0.08, 0.98, 0.23); b.add(e2);
    for (const k of [-1, 1]) { const a = new THREE.Group(); a.position.set(k * 0.24, 0.68, 0); a.add(part(G.cap(0.05, 0.22), 0xe8dcbc, { pos: [0, -0.02, 0.12], rot: [Math.PI / 2, 0, 0] })); b.add(a); }
  }),
  pumpkin: () => character((b, ud) => {
    for (const x of [-0.08, 0.08]) { const l = leg(0x3a5f26, x, 0.22); b.add(l); ud.legs.push(l); }
    b.add(part(G.cap(0.17, 0.2), 0x4b7a32, { pos: [0, 0.5, 0] }));
    const head = new THREE.Group(); head.position.y = 0.92; b.add(head);
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; head.add(part(G.sph(0.17, 16, 12), i % 2 ? 0xe8741c : 0xf58a2c, { pos: [Math.cos(a) * 0.1, 0, Math.sin(a) * 0.1], scale: [1, 0.95, 1], ow: 1.06 })); }
    head.add(part(G.cyl(0.03, 0.04, 0.12), 0x3c7a2e, { pos: [0, 0.2, 0] }));
    const face = new THREE.MeshBasicMaterial({ color: 0xffe36b });
    for (const k of [-1, 1]) { const e = new THREE.Mesh(G.cone(0.05, 0.06, 3), face); e.position.set(k * 0.08, 0.04, 0.26); e.rotation.x = Math.PI / 2; head.add(e); }
    const mouth = new THREE.Mesh(G.box(0.16, 0.035, 0.04), face); mouth.position.set(0, -0.07, 0.26); head.add(mouth);
  }),
  blob: () => character((b, ud) => {
    ud.squish = true;
    b.add(part(G.sph(0.32, 28, 20), 0x6ee67a, { pos: [0, 0.3, 0], scale: [1, 0.85, 1], matOpt: { transparent: true, opacity: 0.88 } }));
    b.add(part(G.sph(0.06, 10, 8), 0x3fae55, { pos: [0.12, 0.22, 0.2], outline: false }));
    b.add(part(G.sph(0.04, 10, 8), 0x3fae55, { pos: [-0.2, 0.18, 0.12], outline: false }));
    const e = eye(0.11, 0x2a5a1a); e.position.set(0, 0.4, 0.24); b.add(e);
    b.add(part(G.torus(0.05, 0.012, Math.PI), 0x1c1026, { pos: [0, 0.27, 0.28], rot: [0, 0, Math.PI], outline: false }));
  }),
  cyclops: () => character((b, ud) => {
    for (const x of [-0.09, 0.09]) { const l = leg(0x3d5bc0, x, 0.22, 0.06); b.add(l); ud.legs.push(l); }
    b.add(part(G.cap(0.23, 0.25), 0x5476e0, { pos: [0, 0.55, 0] }));
    b.add(part(G.sph(0.14, 14, 10), 0x8aa6f5, { pos: [0, 0.5, 0.13], scale: [1, 1.2, 0.5], outline: false }));
    b.add(part(G.sph(0.25, 24, 16), 0x5476e0, { pos: [0, 0.98, 0] }));
    for (const k of [-1, 1]) b.add(part(G.cone(0.05, 0.16, 10), 0xf2d34a, { pos: [k * 0.13, 1.22, 0], rot: [0, 0, -k * 0.35] }));
    const e = eye(0.11, 0x3a1a5a); e.position.set(0, 1.0, 0.18); b.add(e);
    b.add(part(G.box(0.1, 0.03, 0.03), 0x1c1026, { pos: [0, 0.86, 0.23], outline: false }));
    for (const k of [-1, 1]) { const a = new THREE.Group(); a.position.set(k * 0.27, 0.68, 0); a.add(part(G.cap(0.055, 0.18), 0x5476e0, { pos: [0, -0.12, 0] })); b.add(a); ud.arms.push(a); }
  }),
  waiter: () => character((b, ud) => {
    for (const x of [-0.07, 0.07]) {
      const l = new THREE.Group(); l.position.set(x, 0.26, 0);
      l.add(part(G.cyl(0.025, 0.025, 0.24, 8), 0xf4efe2, { pos: [0, -0.12, 0] }));
      l.add(part(G.sph(0.045, 8, 6), 0x1c1026, { pos: [0, -0.24, 0.02], scale: [1, .6, 1.4], outline: false }));
      b.add(l); ud.legs.push(l);
    }
    b.add(part(G.rbox(0.3, 0.3, 0.2, 0.06), 0x22202e, { pos: [0, 0.42, 0] }));
    b.add(part(G.cone(0.06, 0.14, 3), 0xf4efe2, { pos: [0, 0.5, 0.1], rot: [Math.PI, 0, 0], outline: false }));
    for (let i = 0; i < 2; i++) for (const k of [-1, 1]) b.add(part(G.box(0.08, 0.018, 0.02), 0xf4efe2, { pos: [k * 0.07, 0.38 + i * 0.06, 0.105], outline: false }));
    // bow tie
    for (const k of [-1, 1]) b.add(part(G.cone(0.04, 0.08, 4), 0xe0304a, { pos: [k * 0.04, 0.58, 0.11], rot: [0, 0, k * Math.PI / 2], ow: 1.15 }));
    // skull
    b.add(part(G.sph(0.21, 24, 16), 0xf6f1e4, { pos: [0, 0.8, 0] }));
    b.add(part(G.rbox(0.2, 0.09, 0.16, 0.03), 0xf6f1e4, { pos: [0, 0.65, 0.04] }));
    for (const k of [-1, 1]) {
      const s = new THREE.Mesh(G.sph(0.06, 12, 8), toon(0x1c1026)); s.position.set(k * 0.075, 0.8, 0.165); s.scale.set(1, 1.15, 0.6); b.add(s);
      const p = new THREE.Mesh(G.sph(0.022, 8, 6), glowMat(0x7dff9a)); p.position.set(k * 0.075, 0.8, 0.2); b.add(p);
    }
    b.add(new THREE.Mesh(G.cone(0.025, 0.04, 3), toon(0x1c1026)).translateY(0.72).translateZ(0.2).rotateX(Math.PI));
    // chef hat
    b.add(part(G.cyl(0.13, 0.12, 0.14), 0xffffff, { pos: [0, 1.04, -0.01] }));
    for (const [x, z] of [[-0.08, 0], [0.08, 0], [0, 0.06], [0, -0.07], [0, 0]]) b.add(part(G.sph(0.09, 12, 8), 0xffffff, { pos: [x, 1.16, z - 0.01], ow: 1.06 }));
    // arms + tray
    const arms = [];
    for (const k of [-1, 1]) {
      const a = new THREE.Group(); a.position.set(k * 0.17, 0.52, 0);
      a.add(part(G.cyl(0.022, 0.022, 0.24, 8), 0xf4efe2, { pos: [0, -0.1, 0] }));
      b.add(a); arms.push(a); ud.arms.push(a);
    }
    const tray = new THREE.Group(); tray.position.set(0.22, 0.62, 0.12); tray.visible = false;
    tray.add(part(G.cyl(0.17, 0.17, 0.02, 24), 0xd6d0e6, { ow: 1.06 }));
    b.add(tray); ud.tray = tray;
  }),
};
export const GUEST_KINDS = ['ghost', 'vampire', 'mummy', 'pumpkin', 'blob', 'cyclops'];

// ---------------------------------------------------------------- dish model (generic plate with food blob in recipe colour)
const DISH_COL = { soup: 0x6aa84f, fries: 0xf6c344, pasta: 0xf08a5d, pie: 0xe8741c, burger: 0x9b5a2e, jelly: 0x7dff9a, steak: 0x8e2a2a, cake: 0xf2b8e6 };
export function dishMesh(rid) {
  const g = new THREE.Group();
  g.add(part(G.cyl(0.13, 0.1, 0.03, 20), 0xffffff, { ow: 1.06 }));
  const col = DISH_COL[rid] || 0xcccccc;
  if (rid === 'burger') {
    g.add(part(G.cyl(0.08, 0.08, 0.035, 16), 0xd9a066, { pos: [0, 0.04, 0] }));
    g.add(part(G.cyl(0.085, 0.085, 0.03, 16), 0x5e3320, { pos: [0, 0.07, 0] }));
    g.add(part(G.sph(0.08, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), 0xd9a066, { pos: [0, 0.085, 0] }));
  } else if (rid === 'cake' || rid === 'pie') {
    g.add(part(G.cyl(0.09, 0.09, 0.09, 20), col, { pos: [0, 0.06, 0] }));
    g.add(part(G.sph(0.025, 8, 6), 0xe0304a, { pos: [0, 0.12, 0] }));
  } else if (rid === 'fries') {
    for (let i = 0; i < 6; i++) g.add(part(G.box(0.02, 0.12, 0.02), col, { pos: [Math.cos(i) * 0.04, 0.07, Math.sin(i) * 0.04], rot: [Math.sin(i) * .3, 0, Math.cos(i) * .3], outline: false }));
  } else {
    g.add(part(G.sph(0.09, 16, 10), col, { pos: [0, 0.03, 0], scale: [1, 0.55, 1] }));
  }
  return g;
}

// ---------------------------------------------------------------- items
function light(color, intensity, dist, y) {
  const l = new THREE.PointLight(color, intensity, dist, 2);
  l.position.y = y; return l;
}
function flame(y, x = 0, z = 0) {
  const f = new THREE.Mesh(G.cone(0.03, 0.08, 8), glowMat(0xffb347));
  f.position.set(x, y, z); return f;
}
export const ITEM_MODELS = {
  stove(ud) {
    const g = new THREE.Group();
    g.add(part(G.rbox(0.78, 0.62, 0.72, 0.05), 0x8d8aa6, { pos: [0, 0.31, 0] }));
    g.add(part(G.box(0.8, 0.05, 0.74), 0x4a4760, { pos: [0, 0.64, 0] }));
    for (const x of [-0.18, 0.18]) g.add(part(G.cyl(0.13, 0.13, 0.03, 20), 0x2a2638, { pos: [x, 0.68, 0.05], outline: false }));
    const doorMat = toon(0x262236, { unique: true, emissive: 0x000000 });
    g.add(part(G.box(0.5, 0.3, 0.03), 0, { mat: doorMat, pos: [0, 0.3, 0.37] }));
    g.add(part(G.box(0.36, 0.03, 0.04), 0xc9c4dc, { pos: [0, 0.5, 0.39] }));
    for (const x of [-0.25, 0.25]) g.add(part(G.cyl(0.035, 0.035, 0.03, 10), 0xff5f7a, { pos: [x, 0.55, 0.37], rot: [Math.PI / 2, 0, 0], outline: false }));
    // pot + flames (visible when cooking)
    const pot = new THREE.Group(); pot.position.set(0.18, 0.7, 0.05);
    pot.add(part(G.cyl(0.14, 0.12, 0.18, 20), 0x3a3550, { pos: [0, 0.09, 0] }));
    const liquid = new THREE.Mesh(G.cyl(0.125, 0.125, 0.01, 20), glowMat(0x7dff9a)); liquid.position.y = 0.17; pot.add(liquid);
    pot.add(part(G.torus(0.14, 0.015), 0x5a5470, { pos: [0, 0.18, 0], rot: [Math.PI / 2, 0, 0], outline: false }));
    const flames = new THREE.Group();
    for (let i = 0; i < 5; i++) { const f = new THREE.Mesh(G.cone(0.035, 0.1, 6), glowMat(i % 2 ? 0xb6ff5c : 0x3fd36a)); const a = i / 5 * Math.PI * 2; f.position.set(Math.cos(a) * 0.1, 0.0, Math.sin(a) * 0.1); flames.add(f); }
    pot.add(flames);
    const steam = new THREE.Group();
    for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(G.sph(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: 0xe6fff0, transparent: true, opacity: 0.5 })); steam.add(s); }
    pot.add(steam);
    g.add(pot);
    const pl = light(0x7dff9a, 0, 2.5, 0.9); g.add(pl);
    Object.assign(ud, { doorMat, pot, flames, steam, pl, height: 1.0 });
    return g;
  },
  counter(ud) {
    const g = new THREE.Group();
    g.add(part(G.rbox(0.84, 0.56, 0.7, 0.04), 0xa8693f, { pos: [0, 0.28, 0] }));
    g.add(part(G.box(0.6, 0.34, 0.02), 0x7c4a2b, { pos: [0, 0.27, 0.36], outline: false }));
    g.add(part(G.box(0.92, 0.06, 0.78), 0xefe4f5, { pos: [0, 0.59, 0] }));
    const dishSpot = new THREE.Group(); dishSpot.position.y = 0.63; g.add(dishSpot);
    Object.assign(ud, { dishSpot, height: 0.9 });
    return g;
  },
  table(ud) { return tableModel(ud, false); },
  tableFancy(ud) { return tableModel(ud, true); },
  candle(ud) {
    const g = new THREE.Group();
    g.add(part(G.cyl(0.14, 0.18, 0.06, 20), 0xc9a54a, { pos: [0, 0.03, 0] }));
    g.add(part(G.cyl(0.03, 0.03, 0.7, 10), 0xd9b24e, { pos: [0, 0.4, 0] }));
    g.add(part(G.box(0.48, 0.04, 0.04), 0xd9b24e, { pos: [0, 0.68, 0] }));
    const fl = [];
    for (const x of [-0.22, 0, 0.22]) {
      const y = x ? 0.7 : 0.75;
      g.add(part(G.cyl(0.035, 0.035, 0.16, 10), 0xfbf3e3, { pos: [x, y + 0.08, 0] }));
      const f = flame(y + 0.2, x); g.add(f); fl.push(f);
    }
    const pl = light(0xffaa55, 1.6, 3.2, 1.0); g.add(pl);
    Object.assign(ud, { flames: fl, pl, height: 1.1 });
    return g;
  },
  pumpkin(ud) {
    const g = new THREE.Group();
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; g.add(part(G.sph(0.22, 16, 12), i % 2 ? 0xd9661a : 0xf2862e, { pos: [Math.cos(a) * 0.12, 0.22, Math.sin(a) * 0.12], ow: 1.05 })); }
    g.add(part(G.cyl(0.035, 0.05, 0.14), 0x3c7a2e, { pos: [0, 0.48, 0] }));
    const fm = new THREE.MeshBasicMaterial({ color: 0xffe36b });
    for (const k of [-1, 1]) { const e = new THREE.Mesh(G.cone(0.06, 0.08, 3), fm); e.position.set(k * 0.1, 0.27, 0.33); e.rotation.x = Math.PI / 2; g.add(e); }
    const m = new THREE.Mesh(G.box(0.2, 0.04, 0.04), fm); m.position.set(0, 0.15, 0.33); g.add(m);
    const pl = light(0xff8a2c, 1.2, 2.6, 0.35); g.add(pl);
    Object.assign(ud, { pl, height: 0.6 });
    return g;
  },
  tomb(ud) {
    const g = new THREE.Group();
    g.add(part(G.cyl(0.38, 0.4, 0.05, 20), 0x3d7a3a, { pos: [0, 0.025, 0] }));
    g.add(part(G.box(0.5, 0.1, 0.3), 0x77748c, { pos: [0, 0.1, 0] }));
    g.add(part(G.box(0.4, 0.5, 0.14), 0x9a97b0, { pos: [0, 0.4, 0] }));
    g.add(part(new THREE.CylinderGeometry(0.2, 0.2, 0.14, 20, 1, false, 0, Math.PI), 0x9a97b0, { pos: [0, 0.65, 0], rot: [Math.PI / 2, Math.PI / 2, 0] }));
    const tex = canvasTex('rip', 128, 64, (c) => { c.fillStyle = '#4a475a'; c.font = '900 40px system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('R.I.P', 64, 34); });
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.17), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    p.position.set(0, 0.5, 0.075); g.add(p);
    ud.height = 0.9;
    return g;
  },
  cauldron(ud) {
    const g = new THREE.Group();
    for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; g.add(part(G.cyl(0.03, 0.03, 0.2, 6), 0x2a2734, { pos: [Math.cos(a) * 0.2, 0.1, Math.sin(a) * 0.2] })); }
    const fire = new THREE.Mesh(G.cone(0.14, 0.18, 8), glowMat(0xff7a2c)); fire.position.y = 0.1; g.add(fire);
    g.add(part(new THREE.SphereGeometry(0.34, 24, 16, 0, Math.PI * 2, Math.PI * 0.2, Math.PI * 0.8), 0x2a2734, { pos: [0, 0.42, 0], matOpt: { side: THREE.DoubleSide } }));
    g.add(part(G.torus(0.28, 0.04), 0x3a3746, { pos: [0, 0.69, 0], rot: [Math.PI / 2, 0, 0] }));
    const liq = new THREE.Mesh(G.cyl(0.27, 0.27, 0.02, 24), glowMat(0x5cff8d)); liq.position.y = 0.66; g.add(liq);
    const bubbles = [];
    for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(G.sph(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: 0xa0ffb4, transparent: true })); g.add(b); bubbles.push(b); }
    const pl = light(0x5cff8d, 1.4, 3, 0.9); g.add(pl);
    Object.assign(ud, { bubbles, fire, pl, height: 1.0 });
    return g;
  },
  crystal(ud) {
    const g = new THREE.Group();
    g.add(part(G.cyl(0.12, 0.2, 0.25, 6), 0x7a4a2a, { pos: [0, 0.125, 0] }));
    for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; g.add(part(G.cone(0.04, 0.16, 6), 0xc9a54a, { pos: [Math.cos(a) * 0.11, 0.3, Math.sin(a) * 0.11] })); }
    const orb = new THREE.Mesh(G.sph(0.24, 28, 20), new THREE.MeshToonMaterial({ color: 0xb26cff, emissive: 0x5a1fa0, gradientMap, transparent: true, opacity: 0.9 }));
    orb.position.y = 0.52; g.add(orb);
    const core = new THREE.Mesh(G.sph(0.1, 12, 10), glowMat(0xf3d9ff)); core.position.y = 0.52; g.add(core);
    const pl = light(0xb26cff, 1.6, 3.4, 0.6); g.add(pl);
    Object.assign(ud, { orb, core, pl, height: 1.0 });
    return g;
  },
  gargoyle(ud) {
    const g = new THREE.Group();
    g.add(part(G.box(0.5, 0.3, 0.5), 0x6b6880, { pos: [0, 0.15, 0] }));
    g.add(part(G.sph(0.19, 16, 12), 0x8e8ba3, { pos: [0, 0.48, 0], scale: [1, 1.2, 0.9] }));
    g.add(part(G.sph(0.15, 16, 12), 0x8e8ba3, { pos: [0, 0.8, 0.04] }));
    for (const k of [-1, 1]) {
      g.add(part(G.cone(0.04, 0.14, 8), 0x77748a, { pos: [k * 0.1, 0.96, 0.02], rot: [0, 0, -k * 0.4] }));
      const w = new THREE.Shape(); w.moveTo(0, 0); w.lineTo(0.42, 0.32); w.lineTo(0.36, 0.05); w.lineTo(0.3, -0.12); w.lineTo(0.12, -0.15); w.lineTo(0, 0);
      const wing = part(new THREE.ExtrudeGeometry(w, { depth: 0.03, bevelEnabled: false }), 0x77748a, { pos: [k * 0.12, 0.55, -0.12], scale: [k, 1, 1], ow: 1.04 });
      g.add(wing);
      const e = new THREE.Mesh(G.sph(0.025, 8, 6), glowMat(0xff3355)); e.position.set(k * 0.06, 0.82, 0.17); g.add(e);
    }
    ud.height = 1.1;
    return g;
  },
};
function tableModel(ud, fancy) {
  const g = new THREE.Group();
  // chair (back side, toward the walls)
  const chair = new THREE.Group(); chair.position.set(-0.27, 0, -0.27); chair.rotation.y = Math.PI / 4;
  const cc = fancy ? 0x9b3fc2 : 0xb07a4a, cd = fancy ? 0x6d2590 : 0x7c5230;
  for (const [x, z] of [[-.12, -.12], [.12, -.12], [-.12, .12], [.12, .12]]) chair.add(part(G.cyl(0.02, 0.02, 0.26, 6), 0x3a271c, { pos: [x, 0.13, z] }));
  chair.add(part(G.rbox(0.32, 0.06, 0.32, 0.02), cc, { pos: [0, 0.28, 0] }));
  chair.add(part(G.rbox(0.32, 0.4, 0.05, 0.02), cd, { pos: [0, 0.5, -0.15] }));
  g.add(chair);
  g.add(part(G.cyl(0.14, 0.18, 0.04, 16), 0x2b1c22, { pos: [0.05, 0.02, 0.05] }));
  g.add(part(G.cyl(0.035, 0.035, 0.4, 10), 0x2b1c22, { pos: [0.05, 0.22, 0.05] }));
  g.add(part(G.cyl(0.34, 0.34, 0.05, 28), fancy ? 0x5d1f7c : 0x6b4128, { pos: [0.05, 0.43, 0.05] }));
  if (fancy) {
    g.add(part(G.cyl(0.36, 0.4, 0.22, 28, true), 0xb25bd8, { pos: [0.05, 0.36, 0.05], matOpt: { side: THREE.DoubleSide } }));
    g.add(part(G.cyl(0.36, 0.36, 0.015, 28), 0xb25bd8, { pos: [0.05, 0.465, 0.05], outline: false }));
    g.add(part(G.cyl(0.025, 0.025, 0.14, 8), 0xfff2cf, { pos: [0.25, 0.54, -0.05] }));
    const f = flame(0.65, 0.25, -0.05); g.add(f); ud.flames = [f];
    ud.pl = light(0xffaa55, 0.8, 2.2, 0.8); g.add(ud.pl);
  } else {
    g.add(part(G.cyl(0.3, 0.3, 0.012, 28), 0xf1e3cf, { pos: [0.05, 0.462, 0.05], outline: false }));
    g.add(part(G.torus(0.22, 0.012), 0xc83c50, { pos: [0.05, 0.47, 0.05], rot: [Math.PI / 2, 0, 0], outline: false }));
  }
  const dishSpot = new THREE.Group(); dishSpot.position.set(0, 0.48, 0); g.add(dishSpot);
  Object.assign(ud, { dishSpot, seat: new THREE.Vector3(-0.27, 0.22, -0.27), height: 0.9 });
  return g;
}
export function buildItem(type) {
  const ud = {};
  const g = ITEM_MODELS[type](ud);
  g.userData = ud;
  return g;
}

// animate item visuals (called every frame)
export function animateItem(g, it, t, status, rmapIcon) {
  const ud = g.userData;
  if (ud.flames && it.type !== 'stove') ud.flames.forEach((f, i) => { f.scale.set(1, 0.85 + Math.sin(t * 12 + i * 2) * 0.2, 1); });
  if (ud.pl && it.type !== 'stove') ud.pl.intensity = (ud.baseI ??= ud.pl.intensity) * (0.9 + Math.sin(t * 7 + it.id) * 0.1);
  if (ud.bubbles) ud.bubbles.forEach((b, i) => { const p = (t * 0.7 + i / 4) % 1; b.position.set(Math.cos(i * 2) * 0.12, 0.68 + p * 0.45, Math.sin(i * 2) * 0.12); b.material.opacity = 1 - p; b.scale.setScalar(1 - p * 0.5); });
  if (ud.fire) ud.fire.scale.set(1, 0.85 + Math.sin(t * 11) * 0.2, 1);
  if (ud.orb) { ud.core.scale.setScalar(0.9 + Math.sin(t * 3) * 0.15); ud.orb.rotation.y = t; }
  if (it.type === 'stove') {
    const cooking = status === 'cooking';
    ud.pot.visible = cooking || status === 'ready';
    ud.flames.visible = cooking;
    ud.steam.visible = cooking;
    ud.flames.children.forEach((f, i) => f.scale.set(1, 0.7 + Math.abs(Math.sin(t * 14 + i)) * 0.6, 1));
    ud.steam.children.forEach((s, i) => { const p = (t * 0.6 + i / 3) % 1; s.position.set(Math.sin(p * 6 + i) * 0.05, 0.2 + p * 0.45, 0); s.material.opacity = 0.5 * (1 - p); s.scale.setScalar(0.6 + p); });
    ud.doorMat.emissive.setHex(cooking ? 0x2fae55 : status === 'spoiled' ? 0x4a5a10 : 0x000000);
    ud.doorMat.emissiveIntensity = cooking ? 0.7 + Math.sin(t * 8) * 0.3 : 0.6;
    ud.pl.intensity = cooking ? 1.2 + Math.sin(t * 10) * 0.3 : 0;
  }
}

// ---------------------------------------------------------------- world (room + graveyard outside)
export function buildRoom(w, h, doorC, title) {
  const g = new THREE.Group();
  // floor (checker diner tiles)
  const ftex = canvasTex('floor', 128, 128, (c) => {
    c.fillStyle = '#e4d6f0'; c.fillRect(0, 0, 128, 128);
    c.fillStyle = '#3a2752'; c.fillRect(0, 0, 64, 64); c.fillRect(64, 64, 64, 64);
    c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 2; c.strokeRect(0, 0, 64, 64); c.strokeRect(64, 64, 64, 64); c.strokeRect(64, 0, 64, 64); c.strokeRect(0, 64, 64, 64);
  }).clone();
  ftex.wrapS = ftex.wrapT = THREE.RepeatWrapping; ftex.repeat.set(w / 2, h / 2); ftex.magFilter = THREE.NearestFilter; ftex.needsUpdate = true;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshToonMaterial({ map: ftex, gradientMap }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(w / 2 - 0.5, 0.001, h / 2 - 0.5); floor.receiveShadow = true;
  floor.userData.isFloor = true;
  g.add(floor);
  g.add(part(G.box(w + 0.1, 0.25, h + 0.1), 0x24163a, { pos: [w / 2 - 0.5, -0.125, h / 2 - 0.5], outline: false }));
  // walls
  const wallTex = canvasTex('wallpaper', 64, 128, (c) => {
    c.fillStyle = '#3e2660'; c.fillRect(0, 0, 64, 128);
    c.fillStyle = '#4a2f72'; c.fillRect(0, 0, 32, 128);
    c.fillStyle = 'rgba(255,220,255,.12)';
    for (let y = 16; y < 128; y += 32) { c.beginPath(); c.arc(48, y, 4, 0, 7); c.fill(); c.beginPath(); c.arc(16, y + 16, 4, 0, 7); c.fill(); }
  });
  const WH = 2.1, WT = 0.18;
  const mkWall = (len) => {
    const t2 = wallTex.clone(); t2.wrapS = t2.wrapT = THREE.RepeatWrapping; t2.repeat.set(len * 2, 1); t2.needsUpdate = true;
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, WH, WT), [toon(0x2a1942), toon(0x2a1942), toon(0x5a3d8a), toon(0x2a1942), new THREE.MeshToonMaterial({ map: t2, gradientMap }), toon(0x2a1942)]);
    m.receiveShadow = true; m.castShadow = true;
    return m;
  };
  const back = mkWall(w + WT); back.position.set(w / 2 - 0.5 - WT / 2, WH / 2, -0.5 - WT / 2); g.add(back);
  const left = mkWall(h + WT); left.rotation.y = Math.PI / 2; left.position.set(-0.5 - WT / 2, WH / 2, h / 2 - 0.5 - WT / 2); g.add(left);
  // wainscot + trims
  g.add(part(G.box(w, 0.55, 0.06), 0x2a1532, { pos: [w / 2 - 0.5, 0.275, -0.47], outline: false }));
  g.add(part(G.box(0.06, 0.55, h), 0x2a1532, { pos: [-0.47, 0.275, h / 2 - 0.5], outline: false }));
  g.add(part(G.box(w, 0.06, 0.1), 0x8b5a3a, { pos: [w / 2 - 0.5, 0.57, -0.46], outline: false }));
  g.add(part(G.box(0.1, 0.06, h), 0x8b5a3a, { pos: [-0.46, 0.57, h / 2 - 0.5], outline: false }));
  g.add(part(G.box(w + WT * 2, 0.1, WT + 0.08), 0x7a5bb0, { pos: [w / 2 - 0.5 - WT / 2, WH + 0.05, -0.5 - WT / 2], outline: false }));
  g.add(part(G.box(WT + 0.08, 0.1, h + WT), 0x7a5bb0, { pos: [-0.5 - WT / 2, WH + 0.05, h / 2 - 0.5 - WT / 2], outline: false }));
  // windows on back wall
  const sky = canvasTex('sky', 64, 96, (c) => {
    const gr = c.createLinearGradient(0, 0, 0, 96); gr.addColorStop(0, '#0d1b48'); gr.addColorStop(1, '#4a2f8a'); c.fillStyle = gr; c.fillRect(0, 0, 64, 96);
    c.fillStyle = '#fff6c9'; c.beginPath(); c.arc(40, 30, 11, 0, 7); c.fill();
    c.fillStyle = '#0d1b48'; c.beginPath(); c.arc(35, 26, 10, 0, 7); c.fill();
    c.fillStyle = '#fff'; for (const [x, y] of [[10, 12], [20, 50], [50, 70], [12, 80], [54, 8]]) c.fillRect(x, y, 2, 2);
    c.fillStyle = '#1a1029'; c.beginPath(); c.moveTo(0, 96); c.lineTo(0, 78); c.lineTo(14, 70); c.lineTo(26, 80); c.lineTo(40, 72); c.lineTo(64, 84); c.lineTo(64, 96); c.fill();
  });
  for (let c = 1; c < w; c += 2) {
    const win = new THREE.Group(); win.position.set(c, 1.25, -0.48);
    win.add(new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.8), new THREE.MeshBasicMaterial({ map: sky })));
    win.add(part(G.box(0.65, 0.07, 0.08), 0x6b4128, { pos: [0, 0.42, 0] }));
    win.add(part(G.box(0.7, 0.07, 0.14), 0x6b4128, { pos: [0, -0.42, 0.03] }));
    for (const k of [-1, 1]) win.add(part(G.box(0.07, 0.85, 0.08), 0x6b4128, { pos: [k * 0.3, 0, 0] }));
    win.add(part(G.box(0.03, 0.8, 0.05), 0x6b4128, { pos: [0, 0, 0], outline: false }));
    g.add(win);
  }
  // portraits on the left wall
  const portrait = canvasTex('portrait', 64, 80, (c) => {
    c.fillStyle = '#2b5d4a'; c.fillRect(0, 0, 64, 80);
    c.fillStyle = '#e9f0d0'; c.beginPath(); c.arc(32, 36, 14, 0, 7); c.fill(); c.fillRect(24, 44, 16, 10);
    c.fillStyle = '#1c1026'; c.beginPath(); c.arc(26, 34, 4, 0, 7); c.arc(38, 34, 4, 0, 7); c.fill();
    c.fillStyle = '#1d3b30'; c.fillRect(14, 58, 36, 22);
  });
  for (let r = 1; r < h; r += 3) {
    const p = new THREE.Group(); p.position.set(-0.47, 1.3, r); p.rotation.y = Math.PI / 2;
    p.add(part(G.box(0.5, 0.62, 0.05), 0xb8862b, {}));
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.5), new THREE.MeshToonMaterial({ map: portrait, gradientMap })); pic.position.z = 0.03; p.add(pic);
    g.add(p);
  }
  // wall lamps
  for (let c = 0; c < w; c += 2) {
    const l = new THREE.Group(); l.position.set(c, 1.75, -0.42);
    l.add(part(G.cone(0.1, 0.14, 12, true), 0x7dff9a, { rot: [Math.PI, 0, 0], mat: new THREE.MeshBasicMaterial({ color: 0xb6ffc8 }) }));
    g.add(l);
  }
  // entrance: mat + neon sign
  g.add(part(G.box(0.8, 0.02, 0.6), 0x7a2f3f, { pos: [doorC, 0.01, h - 0.15], outline: false }));
  const sign = new THREE.Group(); sign.position.set(doorC + 1.25, 0, h + 0.6);
  sign.add(part(G.cyl(0.04, 0.04, 1.2, 8), 0x2a1d38, { pos: [0, 0.6, 0] }));
  const stex = canvasTex('sign-' + title, 512, 160, (c) => {
    c.fillStyle = '#1d0f2b'; c.fillRect(0, 0, 512, 160);
    c.strokeStyle = '#ff5fa8'; c.lineWidth = 8; c.strokeRect(8, 8, 496, 144);
    c.font = '900 64px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.shadowColor = '#7dff9a'; c.shadowBlur = 18; c.fillStyle = '#b6ffc8'; c.fillText(title, 256, 84);
  });
  const sm = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.47, 0.06), [toon(0x1d0f2b), toon(0x1d0f2b), toon(0x1d0f2b), toon(0x1d0f2b), new THREE.MeshBasicMaterial({ map: stex }), toon(0x1d0f2b)]);
  sm.position.y = 1.35; sign.add(sm);
  sign.rotation.y = -Math.PI / 4;
  const sl = new THREE.PointLight(0x7dff9a, 1.2, 3); sl.position.set(0, 1.3, 0.4); sign.add(sl);
  g.add(sign);
  return g;
}
export function buildOutside() {
  const g = new THREE.Group();
  const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 48), toon(0x1f2a26));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.26; ground.receiveShadow = true; g.add(ground);
  const rnd = mulberry(7);
  // graveyard props scattered around (kept away from the diner footprint)
  for (let i = 0; i < 60; i++) {
    const a = rnd() * Math.PI * 2, d = 9 + rnd() * 16;
    const x = Math.cos(a) * d + 4, z = Math.sin(a) * d + 4;
    const k = rnd();
    let m;
    if (k < 0.45) {
      m = new THREE.Group();
      m.add(part(G.box(0.4, 0.55, 0.12), 0x5d5a70, { pos: [0, 0.27, 0] }));
      m.add(part(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16, 1, false, 0, Math.PI), 0x5d5a70, { pos: [0, 0.55, 0], rot: [Math.PI / 2, Math.PI / 2, 0] }));
      m.rotation.set(0, rnd() * 1.5, (rnd() - .5) * 0.3);
    } else if (k < 0.75) {
      m = new THREE.Group();
      m.add(part(G.cyl(0.08, 0.14, 1.6, 7), 0x2b1f26, { pos: [0, 0.8, 0] }));
      for (let b = 0; b < 3; b++) m.add(part(G.cyl(0.03, 0.06, 0.8, 5), 0x2b1f26, { pos: [Math.cos(b * 2.1) * 0.2, 1.2 + b * 0.15, Math.sin(b * 2.1) * 0.2], rot: [Math.sin(b * 2.1) * 0.9, 0, -Math.cos(b * 2.1) * 0.9] }));
    } else {
      m = new THREE.Group();
      for (let p = 0; p < 4; p++) m.add(part(G.cyl(0.03, 0.03, 0.7, 5), 0x3a3346, { pos: [p * 0.3, 0.35, 0] }));
      m.add(part(G.box(1.0, 0.05, 0.04), 0x3a3346, { pos: [0.45, 0.55, 0] }));
      m.rotation.y = rnd() * Math.PI;
    }
    m.position.set(x, -0.26, z);
    m.scale.setScalar(0.9 + rnd() * 0.6);
    g.add(m);
  }
  // moon
  const moon = new THREE.Mesh(G.sph(3, 24, 16), glowMat(0xfff3c4));
  moon.position.set(-30, 26, -30); g.add(moon);
  return g;
}
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
