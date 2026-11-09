/* Ghoul Diner — an original monster-restaurant management game.
 * All code, art (procedurally drawn) and design are original to this project. */
'use strict';
(() => {
const $ = s => document.querySelector(s);
const canvas = $('#game');
let ctx = canvas.getContext('2d');
const EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const SAVE_KEY = 'ghoul-diner-save-v1';

// ---------------------------------------------------------------- i18n
const I18N = {
  en: {
    title: 'Ghoul Diner', lv: 'Lv', shop: 'Shop', build: 'Build', staff: 'Staff', settings: 'Settings',
    kitchen: 'Kitchen', dining: 'Dining', decor: 'Decor', expand: 'Expand', recipes: 'What to cook?',
    tut0: 'Tap the stove to cook something!',
    tut1: 'When the food is ready, tap the stove to put it on the counter.',
    tut2: 'Your skeleton waiter serves the guests. Earn coins and decorate your diner!',
    noCoins: 'Not enough coins!', noCounter: 'No free counter! Buy another one in the shop.',
    spoiled: 'The food spoiled! Tap to clean the stove.', cleaned: 'Stove cleaned.',
    left: 'Ready in {0}', levelUp: 'Level up! Level {0}', unlocked: 'Unlocked: {0}',
    lockedLv: 'Level {0}', placeHint: 'Choose a tile, then press Place', moveHint: 'Choose a new tile, then press Place', place: 'Place',
    buildHint: 'Tap an item to move or sell it', move: 'Move', sell: 'Sell +{0}', done: 'Done', cancel: 'Cancel',
    cantPlace: "Can't place it there", occupied: 'A guest is sitting there', lastOne: 'You need at least one of these',
    maxReached: 'Maximum for your level ({0})', waiters: 'Skeleton waiters', hire: 'Hire', hired: 'New waiter hired!',
    nextWaiter: 'More waiters unlock at higher levels', lang: 'Language', sound: 'Sound', on: 'On', off: 'Off',
    reset: 'Start over', confirmReset: 'Are you sure? All progress will be deleted.',
    expandTo: 'Expand to {0}×{1}', maxSize: 'Your diner is at its largest size!', expanded: 'Your diner got bigger!',
    sec: 's', min: 'm', hr: 'h', owned: 'Owned: {0}', rating: 'rating', serv: 'servings',
    welcome: 'Welcome back! Your stoves kept cooking.', about: 'An original game. All art is drawn by code.',
    stats: 'Guests served: {0}', ready: 'Ready!'
  },
  ckb: {
    title: 'چێشتخانەی غوول', lv: 'ئاست', shop: 'فرۆشگا', build: 'دیزاین', staff: 'کارمەند', settings: 'ڕێکخستن',
    kitchen: 'مەتبەخ', dining: 'هۆڵی خواردن', decor: 'ڕازاندنەوە', expand: 'فراوانکردن', recipes: 'چی لێدەنێیت؟',
    tut0: 'لەسەر تەباخەکە دابگرە بۆ لێنانی خواردن!',
    tut1: 'کاتێک خواردنەکە ئامادە بوو، لەسەر تەباخەکە دابگرە بۆ دانانی لەسەر پێشخانەکە.',
    tut2: 'گارسۆنە ئێسکەپەیکەرەکەت خواردن بۆ میوانەکان دەبات. پارە کۆبکەرەوە و چێشتخانەکەت بڕازێنەوە!',
    noCoins: 'پارەت بەس نییە!', noCounter: 'پێشخانی بەتاڵ نییە! یەکێکی تر لە فرۆشگا بکڕە.',
    spoiled: 'خواردنەکە خراپ بوو! دابگرە بۆ پاککردنەوەی تەباخەکە.', cleaned: 'تەباخەکە پاککرایەوە.',
    left: 'ئامادە دەبێت لە {0}', levelUp: 'ئاست بەرزبووەوە! ئاستی {0}', unlocked: 'کرایەوە: {0}',
    lockedLv: 'ئاستی {0}', placeHint: 'خانەیەک هەڵبژێرە و پاشان دابنێ', moveHint: 'خانەیەکی نوێ هەڵبژێرە و پاشان دابنێ', place: 'دابنێ',
    buildHint: 'شتێک هەڵبژێرە بۆ جوڵاندن یان فرۆشتن', move: 'جوڵاندن', sell: 'فرۆشتن +{0}', done: 'تەواو', cancel: 'پاشگەزبوونەوە',
    cantPlace: 'ناتوانرێت لێرە دابنرێت', occupied: 'میوانێک لێرە دانیشتووە', lastOne: 'دەبێت لانیکەم یەکێکت هەبێت',
    maxReached: 'زۆرترین ژمارە بۆ ئاستەکەت ({0})', waiters: 'گارسۆنە ئێسکەپەیکەرەکان', hire: 'دامەزراندن', hired: 'گارسۆنێکی نوێ دامەزرا!',
    nextWaiter: 'گارسۆنی زیاتر لە ئاستی بەرزتر دەکرێتەوە', lang: 'زمان', sound: 'دەنگ', on: 'کراوە', off: 'داخراو',
    reset: 'دەستپێکردنەوە لە سەرەتاوە', confirmReset: 'دڵنیایت؟ هەموو پێشکەوتنەکەت دەسڕێتەوە.',
    expandTo: 'فراوانکردن بۆ {0}×{1}', maxSize: 'چێشتخانەکەت گەیشتووەتە گەورەترین قەبارە!', expanded: 'چێشتخانەکەت گەورەتر بوو!',
    sec: 'چ', min: 'خ', hr: 'ک', owned: 'هەتە: {0}', rating: 'ناوبانگ', serv: 'بەش',
    welcome: 'بەخێربێیتەوە! تەباخەکانت بەردەوام بوون لە لێنان.', about: 'یارییەکی ئەسڵی. هەموو وێنەکان بە کۆد کێشراون.',
    stats: 'میوانی خزمەتکراو: {0}', ready: 'ئامادەیە!'
  }
};
let lang = 'ckb';
function t(k, ...a) {
  let s = (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;
  a.forEach((v, i) => { s = s.replace('{' + i + '}', v); });
  return s;
}
const nm = o => o.name[lang] || o.name.en;

// ---------------------------------------------------------------- data
const RECIPES = [
  { id: 'soup',   icon: '🍲', lvl: 1, cost: 5,    time: 10,   serv: 6,  price: 3,  name: { en: 'Swamp Soup', ckb: 'شۆربای زەلکاو' } },
  { id: 'fries',  icon: '🍟', lvl: 1, cost: 15,   time: 30,   serv: 10, price: 4,  name: { en: 'Bat-Wing Fries', ckb: 'پەتاتەی باڵی شەمشەمەکوێرە' } },
  { id: 'pasta',  icon: '🍝', lvl: 2, cost: 40,   time: 60,   serv: 12, price: 7,  name: { en: 'Eyeball Pasta', ckb: 'پاستای گلێنە' } },
  { id: 'pie',    icon: '🥧', lvl: 3, cost: 80,   time: 120,  serv: 15, price: 10, name: { en: 'Pumpkin Pie', ckb: 'پایی کولەکە' } },
  { id: 'burger', icon: '🍔', lvl: 4, cost: 150,  time: 300,  serv: 20, price: 15, name: { en: 'Graveyard Burger', ckb: 'بەرگری گۆڕستان' } },
  { id: 'jelly',  icon: '🍮', lvl: 5, cost: 250,  time: 600,  serv: 25, price: 21, name: { en: 'Slime Jelly', ckb: 'جێلی لینج' } },
  { id: 'steak',  icon: '🥩', lvl: 7, cost: 500,  time: 1200, serv: 30, price: 36, name: { en: 'Moonlight Steak', ckb: 'ستێکی مانگەشەو' } },
  { id: 'cake',   icon: '🎂', lvl: 9, cost: 1000, time: 3600, serv: 40, price: 62, name: { en: 'Phantom Cake', ckb: 'کێکی تارمایی' } },
];
const RMAP = Object.fromEntries(RECIPES.map(r => [r.id, r]));
const freshTime = r => Math.max(180, r.time * 3); // seconds a ready dish stays good

const ITEMS = {
  stove:      { cat: 'kitchen', cost: 150, lvl: 1, rating: 0, grow: 0.6, max: l => 1 + Math.floor(l / 2), name: { en: 'Cursed Stove', ckb: 'تەباخی نەفرەتلێکراو' } },
  counter:    { cat: 'kitchen', cost: 80,  lvl: 1, rating: 0, grow: 0.5, max: l => 1 + Math.floor((l + 1) / 2), name: { en: 'Serving Counter', ckb: 'پێشخان' } },
  table:      { cat: 'dining',  cost: 40,  lvl: 1, rating: 0, grow: 0.15, seat: true, name: { en: 'Crooked Table', ckb: 'مێزی خوار' } },
  tableFancy: { cat: 'dining',  cost: 180, lvl: 3, rating: 2, grow: 0.15, seat: true, name: { en: 'Velvet Table', ckb: 'مێزی مەخمەڵ' } },
  candle:     { cat: 'decor',   cost: 25,  lvl: 1, rating: 1,  name: { en: 'Candelabra', ckb: 'مۆمدان' } },
  pumpkin:    { cat: 'decor',   cost: 60,  lvl: 2, rating: 2,  name: { en: 'Grinning Lantern', ckb: 'کولەکەی ڕووناک' } },
  tomb:       { cat: 'decor',   cost: 120, lvl: 3, rating: 4,  name: { en: 'Tombstone', ckb: 'کێلی گۆڕ' } },
  cauldron:   { cat: 'decor',   cost: 250, lvl: 5, rating: 6,  name: { en: 'Bubbling Cauldron', ckb: 'مەنجەڵی جادوو' } },
  crystal:    { cat: 'decor',   cost: 600, lvl: 7, rating: 10, name: { en: 'Crystal Ball', ckb: 'گۆی بلوور' } },
  gargoyle:   { cat: 'decor',   cost: 1200, lvl: 9, rating: 18, name: { en: 'Gargoyle Statue', ckb: 'پەیکەری دێو' } },
};
const SIZES = [
  { w: 6, h: 8, cost: 0, lvl: 1 }, { w: 7, h: 9, cost: 400, lvl: 3 }, { w: 8, h: 10, cost: 1200, lvl: 5 },
  { w: 9, h: 11, cost: 3500, lvl: 8 }, { w: 10, h: 12, cost: 9000, lvl: 11 },
];
const GUEST_KINDS = ['ghost', 'vampire', 'mummy', 'pumpkin', 'blob', 'cyclops'];
const xpNeed = l => Math.round(15 * Math.pow(l, 1.6));
const maxWaiters = l => Math.min(6, 1 + Math.floor(l / 3));
const waiterCost = n => Math.round(120 * Math.pow(n, 1.5));

// ---------------------------------------------------------------- state
let S;
let nextId = 1;
function freshState() {
  return {
    v: 1, coins: 120, xp: 0, level: 1, sizeIdx: 0, staff: 1, sound: true, lang: 'ckb', tut: 0, served: 0, sat: 0.7,
    items: [
      { id: 1, type: 'stove', c: 0, r: 1 }, { id: 2, type: 'counter', c: 1, r: 1 },
      { id: 3, type: 'table', c: 1, r: 4 }, { id: 4, type: 'table', c: 4, r: 4 }, { id: 5, type: 'candle', c: 5, r: 0 },
    ],
    nextId: 6, saved: Date.now(),
  };
}
function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) { S = Object.assign(freshState(), JSON.parse(raw)); return true; }
  } catch (e) { /* ignore */ }
  S = freshState();
  return false;
}
function save() {
  S.saved = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
}
const hadSave = load();
lang = S.lang;
nextId = S.nextId;

// runtime-only
let guests = [], waiters = [], floaters = [], sparks = [];
let mode = 'play'; // play | build | place
let selected = null; // item in build mode
let placing = null; // {type} or {item}
let hover = null; // tile under pointer while placing
let spawnT = 3, time = 0;

// ---------------------------------------------------------------- grid helpers
const grid = () => SIZES[S.sizeIdx];
const door = () => ({ c: Math.floor(grid().w / 2), r: grid().h - 1 });
const itemAt = (c, r) => S.items.find(i => i.c === c && i.r === r);
const itemById = id => S.items.find(i => i.id === id);
const count = type => S.items.filter(i => i.type === type).length;
function inGrid(c, r) { const g = grid(); return c >= 0 && r >= 0 && c < g.w && r < g.h; }

function findPath(fc, fr, tc, tr) {
  const g = grid();
  if (!inGrid(tc, tr)) return null;
  const W = g.w, H = g.h, N = W * H;
  const blocked = new Uint8Array(N);
  for (const i of S.items) if (inGrid(i.c, i.r)) blocked[i.r * W + i.c] = 1;
  fc = Math.max(0, Math.min(W - 1, Math.round(fc)));
  fr = Math.max(0, Math.min(H - 1, Math.round(fr)));
  const start = fr * W + fc, goal = tr * W + tc;
  if (start === goal) return [];
  const prev = new Int32Array(N).fill(-1);
  prev[start] = start;
  const q = [start];
  for (let qi = 0; qi < q.length; qi++) {
    const cur = q[qi];
    const cx = cur % W, cy = (cur / W) | 0;
    const nb = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
    for (const [nx, ny] of nb) {
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const ni = ny * W + nx;
      if (prev[ni] !== -1) continue;
      if (blocked[ni] && ni !== goal) continue;
      prev[ni] = cur;
      if (ni === goal) {
        const path = [];
        for (let p = goal; p !== start; p = prev[p]) path.push({ c: p % W, r: (p / W) | 0 });
        return path.reverse();
      }
      q.push(ni);
    }
  }
  return null;
}
function freeTileNear(c, r) {
  const g = grid();
  for (let d = 0; d < g.w + g.h; d++)
    for (let dy = -d; dy <= d; dy++)
      for (let dx = -d; dx <= d; dx++) {
        if (Math.abs(dx) + Math.abs(dy) !== d) continue;
        const x = c + dx, y = r + dy;
        if (inGrid(x, y) && !itemAt(x, y)) return { c: x, r: y };
      }
  return { c, r };
}

// ---------------------------------------------------------------- economy
const decorPoints = () => S.items.reduce((s, i) => s + (ITEMS[i.type].rating || 0), 0);
const popularity = () => decorPoints() + Math.round(S.sat * 20);
function itemCost(type) {
  const d = ITEMS[type];
  return Math.round(d.cost * (1 + (d.grow || 0) * count(type)));
}
function addCoins(n, x, y) {
  S.coins += n;
  if (n > 0) { const p = $('#coinsPill'); p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump'); }
  if (x !== undefined) floaters.push({ x, y, text: (n > 0 ? '+' : '') + n + ' 🪙', t: 0, color: '#ffd25a' });
}
function addXp(n) {
  S.xp += n;
  while (S.xp >= xpNeed(S.level)) {
    S.xp -= xpNeed(S.level);
    S.level++;
    const un = [...RECIPES.filter(r => r.lvl === S.level), ...Object.values(ITEMS).filter(i => i.lvl === S.level)].map(nm);
    toast(t('levelUp', S.level) + (un.length ? ' — ' + t('unlocked', un.join('، ')) : ''), 4000);
    sfx('level');
    for (let i = 0; i < 40; i++) sparks.push({ x: Math.random(), y: -0.05, vx: (Math.random() - .5) * .2, vy: Math.random() * .3 + .1, t: 0, col: `hsl(${Math.random() * 360},90%,65%)` });
  }
}

// ---------------------------------------------------------------- audio
let actx = null;
function sfx(kind) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = { tap: [[520, .05]], coin: [[880, .06], [1320, .08]], cook: [[300, .08], [420, .1]], level: [[523, .1], [659, .1], [784, .1], [1046, .2]], bad: [[200, .15], [150, .2]], place: [[360, .06], [480, .07]] }[kind] || [[440, .05]];
    let at = actx.currentTime;
    for (const [f, d] of notes) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = kind === 'bad' ? 'sawtooth' : 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.12, at);
      g.gain.exponentialRampToValueAtTime(0.001, at + d);
      o.connect(g).connect(actx.destination);
      o.start(at); o.stop(at + d);
      at += d * 0.8;
    }
  } catch (e) { /* audio unavailable */ }
}

// ---------------------------------------------------------------- toast
let toastTimer = 0;
function toast(msg, ms = 2400) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

// ---------------------------------------------------------------- stoves & counters
function stoveStatus(st, now) {
  if (st.cook) {
    if (now >= st.cook.end) { st.ready = { rid: st.cook.rid, until: st.cook.end + freshTime(RMAP[st.cook.rid]) * 1000 }; st.cook = null; }
    else return 'cooking';
  }
  if (st.ready) {
    if (now > st.ready.until) { st.ready = null; st.spoiled = true; }
    else return 'ready';
  }
  return st.spoiled ? 'spoiled' : 'idle';
}
function startCooking(st, r) {
  if (S.coins < r.cost) { toast(t('noCoins')); sfx('bad'); return false; }
  addCoins(-r.cost);
  st.cook = { rid: r.id, end: Date.now() + r.time * 1000 };
  sfx('cook');
  if (S.tut === 0) { S.tut = 1; toast(t('tut1'), 4500); }
  save();
  return true;
}
function plate(st) {
  const r = RMAP[st.ready.rid];
  const counters = S.items.filter(i => i.type === 'counter');
  const target = counters.find(c => c.dish === r.id) || counters.find(c => !c.dish || c.n <= 0);
  if (!target) { toast(t('noCounter')); sfx('bad'); return; }
  if (target.dish !== r.id) { target.dish = r.id; target.n = 0; target.reserved = 0; }
  target.n += r.serv;
  st.ready = null;
  sfx('place');
  const p = tileCenter(st.c, st.r);
  floaters.push({ x: p.x, y: p.y, text: r.icon + ' ×' + r.serv, t: 0, color: '#7dff9a' });
  if (S.tut === 1) { S.tut = 2; toast(t('tut2'), 5000); }
  save();
}
function tapStove(st) {
  const s = stoveStatus(st, Date.now());
  if (s === 'idle') openRecipes(st);
  else if (s === 'cooking') toast(RMAP[st.cook.rid].icon + ' ' + t('left', fmtTime((st.cook.end - Date.now()) / 1000)));
  else if (s === 'ready') plate(st);
  else { st.spoiled = false; toast(t('cleaned')); sfx('tap'); save(); }
}
function fmtTime(sec) {
  sec = Math.max(0, Math.ceil(sec));
  if (sec < 60) return sec + t('sec');
  if (sec < 3600) { const m = Math.floor(sec / 60), s = sec % 60; return m + t('min') + (s ? ' ' + s + t('sec') : ''); }
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return h + t('hr') + (m ? ' ' + m + t('min') : '');
}

// ---------------------------------------------------------------- guests
function spawnInterval() { return Math.max(2.5, 12 - popularity() * 0.12); }
function trySpawn() {
  const d = door();
  const taken = new Set(guests.filter(g => g.state !== 'out').map(g => g.table));
  const free = S.items.filter(i => ITEMS[i.type].seat && !taken.has(i.id));
  for (let k = free.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [free[k], free[j]] = [free[j], free[k]]; }
  for (const tb of free) {
    const p = findPath(d.c, d.r, tb.c, tb.r);
    if (!p) continue;
    guests.push({
      kind: GUEST_KINDS[Math.floor(Math.random() * Math.min(GUEST_KINDS.length, 2 + S.level))],
      x: d.c, y: d.r + 1, path: [{ c: d.c, r: d.r }, ...p], speed: 1.8 + Math.random() * .6,
      state: 'in', table: tb.id, patience: 0, maxPat: 50 + decorPoints() * 0.6, timer: 0, assigned: false, face: 1, ph: Math.random() * 6,
    });
    return;
  }
}
function leave(g) {
  const d = door();
  const p = findPath(g.x, g.y, d.c, d.r) || [];
  g.path = [...p, { c: d.c, r: d.r + 1 }];
  g.state = 'out';
}
function updateGuest(g, dt) {
  const arrived = stepMove(g, dt);
  const tb = itemById(g.table);
  if (g.state === 'in') {
    if (!tb) return leave(g);
    if (arrived) { g.state = 'wait'; g.patience = g.maxPat; }
  } else if (g.state === 'wait') {
    if (!tb) return leave(g);
    g.patience -= dt;
    if (g.patience <= 0) {
      S.sat = S.sat * 0.88;
      floaters.push({ ...tileCenter(g.x, g.y), text: '💢', t: 0, color: '#ff5f7a' });
      sfx('bad');
      leave(g);
    }
  } else if (g.state === 'eat') {
    g.timer -= dt;
    if (g.timer <= 0) {
      const r = RMAP[g.dish];
      const pay = Math.round(r.price * (1 + decorPoints() * 0.01) * (0.8 + 0.4 * g.patience / g.maxPat));
      const p = tileCenter(g.x, g.y);
      addCoins(pay, p.x, p.y - 20);
      addXp(1 + Math.floor(r.price / 5));
      S.served++;
      S.sat = S.sat * 0.9 + 0.1;
      sfx('coin');
      leave(g);
    }
  } else if (g.state === 'out') {
    if (arrived) g.dead = true;
  }
}

// ---------------------------------------------------------------- waiters
function syncWaiters() {
  while (waiters.length < S.staff) {
    const d = door(), f = freeTileNear(d.c, d.r - 1);
    waiters.push({ x: f.c, y: f.r, path: [], speed: 2.6, state: 'idle', face: 1, ph: Math.random() * 6 });
  }
}
function updateWaiter(w, dt) {
  const arrived = stepMove(w, dt);
  if (w.state === 'idle') {
    const waiting = guests.filter(g => g.state === 'wait' && !g.assigned);
    if (!waiting.length) return;
    const counters = S.items.filter(i => i.type === 'counter' && i.dish && i.n - (i.reserved || 0) > 0);
    if (!counters.length) return;
    let best = null;
    for (const c of counters) {
      const p = findPath(w.x, w.y, c.c, c.r);
      if (p && (!best || p.length < best.p.length)) best = { c, p };
    }
    if (!best) return;
    waiting.sort((a, b) => a.patience - b.patience);
    const g = waiting[0];
    g.assigned = true;
    best.c.reserved = (best.c.reserved || 0) + 1;
    Object.assign(w, { state: 'toCounter', counter: best.c.id, guest: g, path: best.p });
  } else if (w.state === 'toCounter') {
    const c = itemById(w.counter);
    if (!c || !c.dish) { if (w.guest) w.guest.assigned = false; return reset(w); }
    if (!arrived) return;
    c.n--; c.reserved = Math.max(0, (c.reserved || 0) - 1);
    w.dish = c.dish;
    if (c.n <= 0) { c.dish = null; c.n = 0; c.reserved = 0; }
    goToGuest(w);
  } else if (w.state === 'toGuest') {
    if (w.guest.state !== 'wait') { w.guest = null; return retarget(w); }
    if (!arrived) return;
    const g = w.guest;
    g.state = 'eat'; g.dish = w.dish; g.timer = 4 + Math.random() * 2;
    sfx('tap');
    reset(w);
  }
}
function goToGuest(w) {
  const tb = itemById(w.guest && w.guest.table);
  const p = tb && findPath(w.x, w.y, tb.c, tb.r);
  if (!p || w.guest.state !== 'wait') { if (w.guest) w.guest.assigned = false; w.guest = null; return retarget(w); }
  w.state = 'toGuest';
  w.path = p;
}
function retarget(w) {
  const g = guests.find(x => x.state === 'wait' && !x.assigned);
  if (g) { g.assigned = true; w.guest = g; return goToGuest(w); }
  // put the dish back on a matching/empty counter, otherwise it is lost
  const c = S.items.find(i => i.type === 'counter' && (i.dish === w.dish || !i.dish));
  if (c) { if (c.dish !== w.dish) { c.dish = w.dish; c.n = 0; } c.n++; }
  reset(w);
}
function reset(w) { Object.assign(w, { state: 'idle', dish: null, guest: null, counter: null, path: [] }); }

function stepMove(e, dt) {
  e.walking = false;
  if (!e.path || !e.path.length) return true;
  let budget = e.speed * dt;
  while (budget > 0 && e.path.length) {
    const tg = e.path[0];
    const dx = tg.c - e.x, dy = tg.r - e.y, d = Math.hypot(dx, dy);
    if (Math.abs(dx) > 0.01) e.face = Math.sign(dx);
    if (d <= budget) { e.x = tg.c; e.y = tg.r; e.path.shift(); budget -= d; }
    else { e.x += dx / d * budget; e.y += dy / d * budget; budget = 0; }
  }
  e.walking = true;
  return e.path.length === 0;
}

// ---------------------------------------------------------------- layout
let W = 0, H = 0, DPR = 1, L = { ts: 40, ox: 0, oy: 0, wall: 30 };
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2.5);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
  layout();
}
function layout() {
  const g = grid();
  const top = 64, bottom = mode === 'play' ? 86 : 150;
  const aw = W - 16, ah = H - top - bottom;
  const ts = Math.floor(Math.min(aw / g.w, ah / (g.h + 1.3)));
  const wall = ts * 0.9;
  L = { ts, wall, ox: Math.round((W - ts * g.w) / 2), oy: Math.round(top + (ah - ts * (g.h + 1.3)) / 2) };
}
function tileCenter(c, r) { return { x: L.ox + (c + 0.5) * L.ts, y: L.oy + L.wall + (r + 0.5) * L.ts }; }
function pxToTile(x, y) { return { c: Math.floor((x - L.ox) / L.ts), r: Math.floor((y - L.oy - L.wall) / L.ts) }; }

// ---------------------------------------------------------------- drawing: room
function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }
function drawRoom() {
  const g = grid(), { ts, ox, oy, wall } = L;
  // wall
  const wg = ctx.createLinearGradient(0, oy, 0, oy + wall);
  wg.addColorStop(0, '#1a1129'); wg.addColorStop(1, '#2c1e42');
  ctx.fillStyle = wg; ctx.fillRect(ox, oy, ts * g.w, wall);
  ctx.fillStyle = '#3d2c5a'; ctx.fillRect(ox, oy + wall - 5, ts * g.w, 5);
  // windows with moon
  for (let c = 0; c < g.w; c += 2) {
    const x = ox + (c + 0.5) * ts, y = oy + wall * 0.5;
    ctx.fillStyle = '#0b1530';
    roundRect(x - ts * 0.25, y - wall * 0.32, ts * 0.5, wall * 0.6, [ts * 0.25, ts * 0.25, 2, 2]); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,180,.85)';
    ctx.beginPath(); ctx.arc(x + ts * 0.08, y - wall * 0.08, ts * 0.08, 0, 7); ctx.fill();
    ctx.strokeStyle = '#4b3a6a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y - wall * 0.32); ctx.lineTo(x, y + wall * 0.28); ctx.stroke();
  }
  // floor
  for (let r = 0; r < g.h; r++) for (let c = 0; c < g.w; c++) {
    ctx.fillStyle = (r + c) % 2 ? '#2a2040' : '#322650';
    ctx.fillRect(ox + c * ts, oy + wall + r * ts, ts, ts);
  }
  // bottom wall with door
  const d = door(), by = oy + wall + g.h * ts;
  ctx.fillStyle = '#1a1129'; ctx.fillRect(ox, by, ts * g.w, ts * 0.4);
  ctx.fillStyle = '#5a3b22'; ctx.fillRect(ox + d.c * ts + 3, by, ts - 6, ts * 0.4);
  ctx.fillStyle = '#3e6b45'; ctx.fillRect(ox + d.c * ts + 6, by - ts * 0.15, ts - 12, ts * 0.12);
  // sign
  ctx.font = `bold ${Math.max(10, ts * 0.26)}px system-ui,sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#7dff9a'; ctx.shadowColor = '#7dff9a'; ctx.shadowBlur = 8;
  ctx.fillText(t('title'), ox + d.c * ts + ts / 2, by + ts * 0.22);
  ctx.shadowBlur = 0;
}

// ---------------------------------------------------------------- drawing: items
function emoji(ch, x, y, size) {
  ctx.font = `${size}px ${EMOJI}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(ch, x, y);
}
function ring(x, y, rad, frac, col) {
  ctx.lineWidth = Math.max(3, rad * 0.22);
  ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.stroke();
  ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(x, y, rad, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); ctx.stroke();
}
function drawItem(it, x, y, s, now, preview) {
  const tt = time;
  ctx.save();
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,.28)';
  ctx.beginPath(); ctx.ellipse(x, y + s * 0.33, s * 0.38, s * 0.1, 0, 0, 7); ctx.fill();
  switch (it.type) {
    case 'stove': {
      ctx.fillStyle = '#4a4458'; roundRect(x - s * .4, y - s * .3, s * .8, s * .62, 6); ctx.fill();
      ctx.fillStyle = '#5e5772'; roundRect(x - s * .4, y - s * .36, s * .8, s * .18, 5); ctx.fill();
      ctx.fillStyle = '#1b1724'; roundRect(x - s * .28, y - s * .08, s * .56, s * .3, 4); ctx.fill();
      ctx.fillStyle = '#9d93b8';
      for (let k = -1; k <= 1; k += 2) { ctx.beginPath(); ctx.arc(x + k * s * .2, y - s * .27, s * .05, 0, 7); ctx.fill(); }
      const st = preview ? 'idle' : stoveStatus(it, now);
      if (st === 'cooking') {
        for (let k = 0; k < 3; k++) {
          const fx = x + (k - 1) * s * .14, fh = s * (.14 + .05 * Math.sin(tt * 12 + k * 2));
          ctx.fillStyle = k % 2 ? '#7dff9a' : '#3fd36a';
          ctx.beginPath(); ctx.moveTo(fx - s * .06, y + s * .18); ctx.quadraticCurveTo(fx, y + s * .18 - fh * 2, fx + s * .06, y + s * .18); ctx.fill();
        }
        const r = RMAP[it.cook.rid];
        const frac = 1 - (it.cook.end - now) / (r.time * 1000);
        ring(x, y - s * .55, s * .2, Math.max(0, Math.min(1, frac)), '#7dff9a');
        emoji(r.icon, x, y - s * .55, s * .22);
      } else if (st === 'ready') {
        const b = Math.abs(Math.sin(tt * 4)) * s * .08;
        ctx.fillStyle = 'rgba(125,255,154,.25)'; ctx.beginPath(); ctx.arc(x, y - s * .55 - b, s * .3, 0, 7); ctx.fill();
        emoji(RMAP[it.ready.rid].icon, x, y - s * .55 - b, s * .38);
      } else if (st === 'spoiled') {
        emoji('🦠', x, y - s * .5 + Math.sin(tt * 3) * 3, s * .32);
      } else if (!preview && S.tut === 0) {
        emoji('👆', x, y - s * .55 + Math.sin(tt * 5) * 4, s * .34);
      }
      break;
    }
    case 'counter': {
      ctx.fillStyle = '#5b3a2e'; roundRect(x - s * .44, y - s * .2, s * .88, s * .5, 5); ctx.fill();
      ctx.fillStyle = '#8a5a44'; roundRect(x - s * .46, y - s * .28, s * .92, s * .14, 4); ctx.fill();
      ctx.fillStyle = '#3f2820'; ctx.fillRect(x - s * .36, y - s * .05, s * .72, s * .04);
      if (!preview && it.dish && it.n > 0) {
        emoji(RMAP[it.dish].icon, x, y - s * .38, s * .36);
        ctx.fillStyle = '#ffd25a'; ctx.beginPath(); ctx.arc(x + s * .3, y - s * .5, s * .15, 0, 7); ctx.fill();
        ctx.fillStyle = '#1a1129'; ctx.font = `bold ${s * .17}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(it.n, x + s * .3, y - s * .49);
      }
      break;
    }
    case 'table': case 'tableFancy': {
      const fancy = it.type === 'tableFancy';
      ctx.fillStyle = fancy ? '#3a1f4d' : '#4b3326'; // chair
      roundRect(x - s * .16, y - s * .44, s * .32, s * .3, 4); ctx.fill();
      ctx.fillStyle = fancy ? '#7a2d9a' : '#7a5238';
      ctx.beginPath(); ctx.ellipse(x, y, s * .36, s * .22, 0, 0, 7); ctx.fill();
      ctx.fillStyle = fancy ? '#a74ccc' : '#d9cfc0';
      ctx.beginPath(); ctx.ellipse(x, y - s * .03, s * .3, s * .16, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#3a271c'; ctx.fillRect(x - s * .03, y + s * .15, s * .06, s * .16);
      if (fancy) { ctx.fillStyle = '#fff2cf'; ctx.fillRect(x + s * .14, y - s * .17, s * .04, s * .1); ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.arc(x + s * .16, y - s * .19 + Math.sin(tt * 9) * 1, s * .03, 0, 7); ctx.fill(); }
      break;
    }
    case 'candle': {
      ctx.strokeStyle = '#c9a54a'; ctx.lineWidth = Math.max(2, s * .05);
      ctx.beginPath(); ctx.moveTo(x, y + s * .3); ctx.lineTo(x, y - s * .05); ctx.moveTo(x - s * .2, y - s * .1); ctx.quadraticCurveTo(x, y + s * .1, x + s * .2, y - s * .1); ctx.stroke();
      for (const k of [-1, 0, 1]) {
        const cx = x + k * s * .2, cy = y - (k ? s * .12 : s * .2);
        ctx.fillStyle = '#f6eedd'; ctx.fillRect(cx - s * .035, cy - s * .16, s * .07, s * .16);
        const fl = Math.sin(tt * 10 + k * 3) * s * .015;
        ctx.fillStyle = 'rgba(255,190,80,.35)'; ctx.beginPath(); ctx.arc(cx, cy - s * .22, s * .1, 0, 7); ctx.fill();
        ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.ellipse(cx + fl, cy - s * .21, s * .03, s * .06, 0, 0, 7); ctx.fill();
      }
      break;
    }
    case 'pumpkin': {
      ctx.fillStyle = '#e8741c';
      for (const k of [-1, 1, 0]) { ctx.beginPath(); ctx.ellipse(x + k * s * .13, y, s * .2, s * .24, 0, 0, 7); ctx.fill(); ctx.fillStyle = k ? '#e8741c' : '#f58a2c'; }
      ctx.fillStyle = '#3c7a2e'; ctx.fillRect(x - s * .03, y - s * .32, s * .06, s * .1);
      const glow = 0.7 + Math.sin(tt * 6) * 0.3;
      ctx.fillStyle = `rgba(255,230,90,${glow})`;
      ctx.beginPath(); ctx.moveTo(x - s * .16, y - s * .06); ctx.lineTo(x - s * .08, y - s * .14); ctx.lineTo(x - s * .04, y - s * .04); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + s * .16, y - s * .06); ctx.lineTo(x + s * .08, y - s * .14); ctx.lineTo(x + s * .04, y - s * .04); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - s * .16, y + s * .06); ctx.lineTo(x + s * .16, y + s * .06); ctx.lineTo(x + s * .08, y + s * .15); ctx.lineTo(x, y + s * .09); ctx.lineTo(x - s * .08, y + s * .15); ctx.fill();
      break;
    }
    case 'tomb': {
      ctx.fillStyle = '#6d6a7d'; roundRect(x - s * .25, y - s * .38, s * .5, s * .68, [s * .25, s * .25, 3, 3]); ctx.fill();
      ctx.fillStyle = '#85829a'; roundRect(x - s * .2, y - s * .33, s * .4, s * .58, [s * .2, s * .2, 2, 2]); ctx.fill();
      ctx.fillStyle = '#4a475a'; ctx.font = `bold ${s * .14}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('R.I.P', x, y - s * .08);
      ctx.fillStyle = '#3c7a2e'; ctx.fillRect(x - s * .3, y + s * .24, s * .6, s * .07);
      break;
    }
    case 'cauldron': {
      ctx.fillStyle = '#1c1a24'; ctx.beginPath(); ctx.ellipse(x, y + s * .02, s * .34, s * .28, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#5cff8d'; ctx.beginPath(); ctx.ellipse(x, y - s * .18, s * .3, s * .09, 0, 0, 7); ctx.fill();
      for (let k = 0; k < 3; k++) {
        const ph = (tt * 0.9 + k / 3) % 1;
        ctx.fillStyle = `rgba(125,255,154,${1 - ph})`;
        ctx.beginPath(); ctx.arc(x + (k - 1) * s * .12, y - s * .2 - ph * s * .4, s * .05 * (1 - ph * .5), 0, 7); ctx.fill();
      }
      ctx.fillStyle = '#ff7a2c'; ctx.beginPath(); ctx.ellipse(x, y + s * .3, s * .2, s * .05 + Math.sin(tt * 11) * 1, 0, 0, 7); ctx.fill();
      break;
    }
    case 'crystal': {
      ctx.fillStyle = '#5a3b22'; ctx.beginPath(); ctx.moveTo(x - s * .2, y + s * .3); ctx.lineTo(x + s * .2, y + s * .3); ctx.lineTo(x + s * .12, y + s * .1); ctx.lineTo(x - s * .12, y + s * .1); ctx.fill();
      const gl = ctx.createRadialGradient(x - s * .06, y - s * .12, 2, x, y - s * .06, s * .26);
      gl.addColorStop(0, '#f3d9ff'); gl.addColorStop(.5, '#b26cff'); gl.addColorStop(1, '#4b1d8a');
      ctx.shadowColor = '#b26cff'; ctx.shadowBlur = 10 + Math.sin(tt * 3) * 6;
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x, y - s * .06, s * .24, 0, 7); ctx.fill();
      ctx.shadowBlur = 0;
      break;
    }
    case 'gargoyle': {
      ctx.fillStyle = '#5d5b6b';
      roundRect(x - s * .22, y + s * .12, s * .44, s * .2, 3); ctx.fill();
      ctx.fillStyle = '#77748a';
      ctx.beginPath(); ctx.moveTo(x, y - s * .1); ctx.lineTo(x - s * .42, y - s * .36); ctx.lineTo(x - s * .3, y + s * .05); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x, y - s * .1); ctx.lineTo(x + s * .42, y - s * .36); ctx.lineTo(x + s * .3, y + s * .05); ctx.fill();
      ctx.fillStyle = '#8b889e'; ctx.beginPath(); ctx.ellipse(x, y - s * .02, s * .15, s * .18, 0, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(x, y - s * .25, s * .12, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - s * .1, y - s * .32); ctx.lineTo(x - s * .14, y - s * .44); ctx.lineTo(x - s * .03, y - s * .35); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + s * .1, y - s * .32); ctx.lineTo(x + s * .14, y - s * .44); ctx.lineTo(x + s * .03, y - s * .35); ctx.fill();
      ctx.fillStyle = '#ff5f7a'; ctx.fillRect(x - s * .06, y - s * .27, s * .03, s * .03); ctx.fillRect(x + s * .03, y - s * .27, s * .03, s * .03);
      break;
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- drawing: characters (original designs)
function eyes(x, y, s, sp, col = '#1a1129') {
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(x - sp, y, s, 0, 7); ctx.arc(x + sp, y, s, 0, 7); ctx.fill();
}
function drawGuest(g) {
  const p = tileCenter(g.x, g.y), s = L.ts;
  const sitting = g.state === 'wait' || g.state === 'eat';
  const bob = g.walking ? Math.abs(Math.sin(time * 9 + g.ph)) * s * .06 : Math.sin(time * 2 + g.ph) * s * .015;
  const x = p.x, y = p.y - (sitting ? s * .22 : 0) - bob;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(p.x, p.y + s * .3, s * .2, s * .06, 0, 0, 7); ctx.fill();
  switch (g.kind) {
    case 'ghost': {
      const fy = y - s * .1 + Math.sin(time * 3 + g.ph) * s * .04;
      ctx.fillStyle = 'rgba(238,244,255,.92)';
      ctx.beginPath(); ctx.moveTo(x - s * .2, fy + s * .25); ctx.lineTo(x - s * .2, fy - s * .1); ctx.arc(x, fy - s * .1, s * .2, Math.PI, 0); ctx.lineTo(x + s * .2, fy + s * .25);
      for (let k = 3; k >= 0; k--) ctx.lineTo(x - s * .2 + k * s * .1 + s * .05, fy + s * (k % 2 ? .18 : .25));
      ctx.fill();
      eyes(x + g.face * s * .03, fy - s * .1, s * .04, s * .07);
      ctx.beginPath(); ctx.ellipse(x + g.face * s * .03, fy + s * .02, s * .04, s * .03, 0, 0, 7); ctx.fill();
      break;
    }
    case 'vampire': {
      ctx.fillStyle = '#5c0f1f'; ctx.beginPath(); ctx.moveTo(x - s * .26, y + s * .3); ctx.lineTo(x - s * .14, y - s * .12); ctx.lineTo(x + s * .14, y - s * .12); ctx.lineTo(x + s * .26, y + s * .3); ctx.fill();
      ctx.fillStyle = '#20141c'; ctx.fillRect(x - s * .1, y - s * .1, s * .2, s * .38);
      ctx.fillStyle = '#d9d6e8'; ctx.beginPath(); ctx.arc(x, y - s * .24, s * .15, 0, 7); ctx.fill();
      ctx.fillStyle = '#20141c'; ctx.beginPath(); ctx.moveTo(x - s * .16, y - s * .26); ctx.quadraticCurveTo(x, y - s * .5, x + s * .16, y - s * .26); ctx.lineTo(x, y - s * .32); ctx.fill();
      eyes(x + g.face * s * .02, y - s * .23, s * .025, s * .055, '#c4122f');
      ctx.fillStyle = '#fff'; ctx.fillRect(x - s * .04, y - s * .15, s * .025, s * .04); ctx.fillRect(x + s * .015, y - s * .15, s * .025, s * .04);
      break;
    }
    case 'mummy': {
      ctx.fillStyle = '#e3d6b3'; roundRect(x - s * .16, y - s * .4, s * .32, s * .7, s * .14); ctx.fill();
      ctx.strokeStyle = '#b8a77f'; ctx.lineWidth = 2;
      for (let k = 0; k < 6; k++) { const yy = y - s * .32 + k * s * .1; ctx.beginPath(); ctx.moveTo(x - s * .16, yy + (k % 2 ? 3 : -2)); ctx.lineTo(x + s * .16, yy); ctx.stroke(); }
      ctx.fillStyle = '#1a1129'; ctx.fillRect(x - s * .12, y - s * .27, s * .24, s * .06);
      ctx.fillStyle = '#ffe94a'; ctx.beginPath(); ctx.arc(x + g.face * s * .05, y - s * .24, s * .025, 0, 7); ctx.fill();
      break;
    }
    case 'pumpkin': {
      ctx.fillStyle = '#3f6b2e'; roundRect(x - s * .13, y - s * .08, s * .26, s * .38, 6); ctx.fill();
      ctx.fillStyle = '#e8741c'; ctx.beginPath(); ctx.ellipse(x, y - s * .25, s * .2, s * .16, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#3c7a2e'; ctx.fillRect(x - s * .02, y - s * .45, s * .04, s * .07);
      ctx.fillStyle = '#ffe36b';
      ctx.beginPath(); ctx.moveTo(x - s * .1, y - s * .26); ctx.lineTo(x - s * .05, y - s * .32); ctx.lineTo(x - s * .02, y - s * .25); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + s * .1, y - s * .26); ctx.lineTo(x + s * .05, y - s * .32); ctx.lineTo(x + s * .02, y - s * .25); ctx.fill();
      ctx.fillRect(x - s * .08, y - s * .19, s * .16, s * .03);
      break;
    }
    case 'blob': {
      const sq = 1 + Math.sin(time * 6 + g.ph) * .06;
      ctx.fillStyle = 'rgba(110,230,120,.9)';
      ctx.beginPath(); ctx.ellipse(x, y + s * .08, s * .24 * sq, s * .22 / sq, 0, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(200,255,200,.6)'; ctx.beginPath(); ctx.arc(x - s * .08, y - s * .02, s * .05, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + g.face * s * .03, y + s * .02, s * .08, 0, 7); ctx.fill();
      ctx.fillStyle = '#1a1129'; ctx.beginPath(); ctx.arc(x + g.face * s * .06, y + s * .02, s * .04, 0, 7); ctx.fill();
      break;
    }
    case 'cyclops': {
      ctx.fillStyle = '#4b6bd6'; roundRect(x - s * .19, y - s * .38, s * .38, s * .66, s * .18); ctx.fill();
      ctx.fillStyle = '#f2d34a'; ctx.beginPath(); ctx.moveTo(x - s * .12, y - s * .36); ctx.lineTo(x - s * .08, y - s * .5); ctx.lineTo(x - s * .03, y - s * .37); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + s * .12, y - s * .36); ctx.lineTo(x + s * .08, y - s * .5); ctx.lineTo(x + s * .03, y - s * .37); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y - s * .2, s * .1, 0, 7); ctx.fill();
      ctx.fillStyle = '#1a1129'; ctx.beginPath(); ctx.arc(x + g.face * s * .04, y - s * .2, s * .05, 0, 7); ctx.fill();
      ctx.strokeStyle = '#1a1129'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - s * .02, s * .07, 0.2, Math.PI - 0.2); ctx.stroke();
      break;
    }
  }
  // bubbles
  if (g.state === 'wait') {
    const frac = Math.max(0, g.patience / g.maxPat);
    const bx = x + s * .28, by = y - s * .55;
    ctx.fillStyle = '#fff'; roundRect(bx - s * .17, by - s * .13, s * .34, s * .26, 6); ctx.fill();
    ctx.fillStyle = '#1a1129'; ctx.font = `bold ${s * .18}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(g.assigned ? '♥' : '…', bx, by);
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(bx - s * .17, by + s * .16, s * .34, 4);
    ctx.fillStyle = frac > .5 ? '#7dff9a' : frac > .25 ? '#ffd25a' : '#ff5f7a';
    ctx.fillRect(bx - s * .17, by + s * .16, s * .34 * frac, 4);
  } else if (g.state === 'eat') {
    emoji(RMAP[g.dish].icon, p.x, p.y - s * .1, s * .3);
  }
  ctx.restore();
}
function drawWaiter(w) {
  const p = tileCenter(w.x, w.y), s = L.ts;
  const bob = w.walking ? Math.abs(Math.sin(time * 10 + w.ph)) * s * .06 : 0;
  const x = p.x, y = p.y - bob;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, p.y + s * .3, s * .18, s * .05, 0, 0, 7); ctx.fill();
  // legs
  ctx.strokeStyle = '#ece6d6'; ctx.lineWidth = Math.max(2, s * .05);
  const sw = w.walking ? Math.sin(time * 10 + w.ph) * s * .06 : 0;
  ctx.beginPath(); ctx.moveTo(x - s * .05, y + s * .08); ctx.lineTo(x - s * .07 + sw, y + s * .3); ctx.moveTo(x + s * .05, y + s * .08); ctx.lineTo(x + s * .07 - sw, y + s * .3); ctx.stroke();
  // body: black vest + ribs
  ctx.fillStyle = '#1e1a28'; roundRect(x - s * .13, y - s * .16, s * .26, s * .26, 5); ctx.fill();
  ctx.strokeStyle = '#ece6d6'; ctx.lineWidth = 1.5;
  for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x - s * .07, y - s * .1 + k * s * .06); ctx.lineTo(x + s * .07, y - s * .1 + k * s * .06); ctx.stroke(); }
  // skull
  ctx.fillStyle = '#f4efe2'; ctx.beginPath(); ctx.arc(x, y - s * .3, s * .14, 0, 7); ctx.fill();
  ctx.fillRect(x - s * .07, y - s * .22, s * .14, s * .06);
  eyes(x + w.face * s * .02, y - s * .31, s * .035, s * .055);
  ctx.fillStyle = '#1a1129'; ctx.fillRect(x - s * .04, y - s * .19, s * .015, s * .03); ctx.fillRect(x + s * .025, y - s * .19, s * .015, s * .03);
  // bow tie
  ctx.fillStyle = '#e0304a';
  ctx.beginPath(); ctx.moveTo(x, y - s * .15); ctx.lineTo(x - s * .07, y - s * .19); ctx.lineTo(x - s * .07, y - s * .11); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x, y - s * .15); ctx.lineTo(x + s * .07, y - s * .19); ctx.lineTo(x + s * .07, y - s * .11); ctx.fill();
  // tray
  if (w.dish) {
    const tx = x + w.face * s * .2;
    ctx.fillStyle = '#c9c4d8'; ctx.beginPath(); ctx.ellipse(tx, y - s * .2, s * .14, s * .04, 0, 0, 7); ctx.fill();
    emoji(RMAP[w.dish].icon, tx, y - s * .3, s * .22);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- render
function render(now) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0d0817'); bg.addColorStop(1, '#1d1230');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  drawRoom();
  const { ts } = L;
  // placement / selection overlay
  if (mode !== 'play') {
    const g = grid(); ctx.strokeStyle = 'rgba(125,255,154,.12)'; ctx.lineWidth = 1;
    for (let r = 0; r < g.h; r++) for (let c = 0; c < g.w; c++) ctx.strokeRect(L.ox + c * ts + .5, L.oy + L.wall + r * ts + .5, ts - 1, ts - 1);
    const d = door(); ctx.fillStyle = 'rgba(255,95,122,.15)'; ctx.fillRect(L.ox + d.c * ts, L.oy + L.wall + d.r * ts, ts, ts);
  }
  if (selected) {
    ctx.strokeStyle = '#7dff9a'; ctx.lineWidth = 3; ctx.setLineDash([6, 4]);
    ctx.strokeRect(L.ox + selected.c * ts + 2, L.oy + L.wall + selected.r * ts + 2, ts - 4, ts - 4); ctx.setLineDash([]);
  }
  // depth-sorted drawables
  const list = [];
  for (const it of S.items) { if (placing && placing.item === it) continue; list.push({ y: it.r, f: () => { const p = tileCenter(it.c, it.r); drawItem(it, p.x, p.y, ts, now); } }); }
  for (const g of guests) list.push({ y: g.y + (g.state === 'wait' || g.state === 'eat' ? -0.1 : 0.05), f: () => drawGuest(g) });
  for (const w of waiters) list.push({ y: w.y + 0.06, f: () => drawWaiter(w) });
  list.sort((a, b) => a.y - b.y).forEach(d => d.f());
  // placement ghost
  if (mode === 'place' && hover) {
    const ok = canPlace(hover.c, hover.r);
    const p = tileCenter(hover.c, hover.r);
    ctx.fillStyle = ok ? 'rgba(125,255,154,.25)' : 'rgba(255,95,122,.3)';
    ctx.fillRect(L.ox + hover.c * ts, L.oy + L.wall + hover.r * ts, ts, ts);
    ctx.globalAlpha = .75;
    drawItem(placing.item || { type: placing.type }, p.x, p.y, ts, now, true);
    ctx.globalAlpha = 1;
  }
  // floaters
  for (const f of floaters) {
    ctx.globalAlpha = Math.max(0, 1 - f.t / 1.4);
    ctx.font = `bold ${Math.max(13, ts * .3)}px system-ui, ${EMOJI}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.strokeText(f.text, f.x, f.y - f.t * 40);
    ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y - f.t * 40);
  }
  ctx.globalAlpha = 1;
  for (const s of sparks) { ctx.fillStyle = s.col; ctx.fillRect(s.x * W, s.y * H, 6, 6); }
}

// ---------------------------------------------------------------- loop
let last = performance.now(), hudT = 0, saveT = 0;
function frame(ts) {
  const dt = Math.min(0.1, (ts - last) / 1000);
  last = ts; time += dt;
  const now = Date.now();
  for (const it of S.items) if (it.type === 'stove') stoveStatus(it, now);
  spawnT -= dt;
  if (spawnT <= 0) { spawnT = spawnInterval() * (0.7 + Math.random() * 0.6); trySpawn(); }
  for (const g of guests) updateGuest(g, dt);
  guests = guests.filter(g => !g.dead);
  syncWaiters();
  for (const w of waiters) updateWaiter(w, dt);
  for (const f of floaters) f.t += dt;
  floaters = floaters.filter(f => f.t < 1.4);
  for (const s of sparks) { s.t += dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 0.3 * dt; }
  sparks = sparks.filter(s => s.y < 1.1);
  render(now);
  hudT -= dt;
  if (hudT <= 0) { hudT = 0.2; updateHud(); }
  saveT -= dt;
  if (saveT <= 0) { saveT = 5; save(); }
  requestAnimationFrame(frame);
}
function updateHud() {
  $('#coins').textContent = Math.floor(S.coins).toLocaleString('en');
  $('#level').textContent = S.level;
  $('#lvlLabel').textContent = t('lv');
  $('#xpbar').style.width = Math.min(100, 100 * S.xp / xpNeed(S.level)) + '%';
  $('#rating').textContent = popularity();
}

// ---------------------------------------------------------------- input
let down = null;
canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; if (mode === 'place') hover = pxToTile(e.clientX, e.clientY); });
canvas.addEventListener('pointermove', e => { if (mode === 'place') hover = pxToTile(e.clientX, e.clientY); });
canvas.addEventListener('pointerup', e => {
  if (!down) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  down = null;
  if (mode === 'place') return; // placement confirmed with an explicit second tap (see below)
  if (moved > 14) return;
  onTap(pxToTile(e.clientX, e.clientY));
});
// in place mode, a tap on the highlighted tile places; first tap just moves the ghost
let lastPlaceTap = null;
canvas.addEventListener('click', e => {
  if (mode !== 'place') return;
  const tl = pxToTile(e.clientX, e.clientY);
  hover = tl;
  if (lastPlaceTap && lastPlaceTap.c === tl.c && lastPlaceTap.r === tl.r) { confirmPlace(tl); lastPlaceTap = null; }
  else { lastPlaceTap = tl; if (!canPlace(tl.c, tl.r)) sfx('bad'); else sfx('tap'); }
});

function onTap(tl) {
  if (!inGrid(tl.c, tl.r)) { if (mode === 'build') { selected = null; updateBuildBar(); } return; }
  const it = itemAt(tl.c, tl.r);
  if (mode === 'play') {
    if (!it) return;
    if (it.type === 'stove') tapStove(it);
    else if (it.type === 'counter') { if (it.dish && it.n > 0) toast(RMAP[it.dish].icon + ' ' + nm(RMAP[it.dish]) + ' ×' + it.n); }
    else if (ITEMS[it.type].rating) toast(nm(ITEMS[it.type]) + ' (+' + ITEMS[it.type].rating + ' ⭐)');
  } else if (mode === 'build') {
    selected = it || null;
    sfx('tap');
    updateBuildBar();
  }
}
function canPlace(c, r) {
  if (!inGrid(c, r)) return false;
  const d = door();
  if (c === d.c && r === d.r) return false;
  const o = itemAt(c, r);
  if (o && !(placing && placing.item === o)) return false;
  if (guests.some(g => Math.round(g.x) === c && Math.round(g.y) === r && (g.state === 'wait' || g.state === 'eat'))) return false;
  return true;
}
function confirmPlace(tl) {
  if (!canPlace(tl.c, tl.r)) { toast(t('cantPlace')); sfx('bad'); return; }
  if (placing.item) {
    placing.item.c = tl.c; placing.item.r = tl.r;
  } else {
    const cost = itemCost(placing.type);
    if (S.coins < cost) { toast(t('noCoins')); sfx('bad'); return; }
    addCoins(-cost);
    S.items.push({ id: nextId++, type: placing.type, c: tl.c, r: tl.r });
    S.nextId = nextId;
  }
  sfx('place');
  save();
  placing = null; hover = null;
  setMode('build');
}

// ---------------------------------------------------------------- modes & build bar
function setMode(m) {
  mode = m;
  if (m !== 'build') selected = null;
  document.querySelector('[data-act=build]').classList.toggle('active', m !== 'play');
  updateBuildBar();
  layout();
}
function updateBuildBar() {
  const bar = $('#buildbar');
  bar.hidden = mode === 'play';
  const mv = $('#bbMove'), sl = $('#bbSell'), dn = $('#bbDone');
  mv.textContent = t('move'); dn.textContent = mode === 'place' ? t('cancel') : t('done');
  if (mode === 'place') {
    $('#buildHint').textContent = placing.item ? t('moveHint') : t('placeHint') + ' (' + nm(ITEMS[placing.type]) + ' — 🪙' + itemCost(placing.type) + ')';
    mv.hidden = false; sl.hidden = true; mv.textContent = '✓ ' + t('place');
  } else if (mode === 'build') {
    mv.hidden = sl.hidden = !selected;
    if (selected) {
      $('#buildHint').textContent = nm(ITEMS[selected.type]);
      sl.textContent = t('sell', sellValue(selected));
    } else $('#buildHint').textContent = t('buildHint');
  }
}
const sellValue = it => Math.round(ITEMS[it.type].cost * 0.5);
const isOccupied = it => guests.some(g => g.table === it.id && g.state !== 'out');
$('#bbMove').onclick = () => {
  if (mode === 'place') { if (hover) confirmPlace(hover); return; }
  if (!selected) return;
  if (isOccupied(selected)) { toast(t('occupied')); return; }
  placing = { item: selected }; hover = { c: selected.c, r: selected.r }; lastPlaceTap = null;
  setMode('place');
};
$('#bbSell').onclick = () => {
  const it = selected;
  if (!it) return;
  if ((it.type === 'stove' || it.type === 'counter') && count(it.type) <= 1) { toast(t('lastOne')); return; }
  if (isOccupied(it)) { toast(t('occupied')); return; }
  S.items = S.items.filter(i => i !== it);
  const p = tileCenter(it.c, it.r);
  addCoins(sellValue(it), p.x, p.y);
  selected = null; sfx('coin'); save(); updateBuildBar();
};
$('#bbDone').onclick = () => {
  if (mode === 'place') { placing = null; hover = null; setMode('build'); }
  else setMode('play');
};

// ---------------------------------------------------------------- modals
function openModal(title, tabs, renderBody) {
  $('#mtitle').textContent = title;
  const tb = $('#mtabs'); tb.innerHTML = '';
  let cur = tabs ? tabs[0].id : null;
  const draw = () => { $('#mbody').innerHTML = ''; renderBody($('#mbody'), cur); };
  if (tabs) for (const tdef of tabs) {
    const b = document.createElement('button'); b.className = 'btn' + (tdef.id === cur ? ' on' : ''); b.textContent = tdef.label;
    b.onclick = () => { cur = tdef.id; [...tb.children].forEach(x => x.classList.remove('on')); b.classList.add('on'); draw(); };
    tb.appendChild(b);
  }
  draw();
  $('#modal').hidden = false;
  modalRefresh = draw;
}
let modalRefresh = null;
function closeModal() { $('#modal').hidden = true; modalRefresh = null; }
$('#mclose').onclick = closeModal;
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

function card({ icon, canvasDraw, title, sub, locked, btn, onBuy, disabled }) {
  const el = document.createElement('div');
  el.className = 'card' + (locked ? ' locked' : '');
  const ic = document.createElement('div'); ic.className = 'ic';
  if (canvasDraw) {
    const cv = document.createElement('canvas'); cv.width = 112; cv.height = 112;
    const keep = ctx; ctx = cv.getContext('2d');
    try { canvasDraw(); } finally { ctx = keep; }
    ic.appendChild(cv);
  } else ic.textContent = icon;
  const info = document.createElement('div'); info.className = 'info';
  info.innerHTML = `<b></b><small></small>`;
  info.querySelector('b').textContent = title;
  info.querySelector('small').textContent = sub;
  el.append(ic, info);
  if (btn) {
    const b = document.createElement('button'); b.className = 'btn primary'; b.textContent = btn; b.disabled = !!disabled || !!locked;
    b.onclick = onBuy; el.appendChild(b);
  }
  return el;
}
function openRecipes(st) {
  sfx('tap');
  openModal(t('recipes'), null, body => {
    for (const r of RECIPES) {
      const locked = S.level < r.lvl;
      body.appendChild(card({
        icon: locked ? '🔒' : r.icon, title: nm(r) + (locked ? ' — ' + t('lockedLv', r.lvl) : ''),
        sub: `🪙${r.cost} · ⏱${fmtTime(r.time)} · ${r.serv}× 🪙${r.price}`,
        locked, btn: '🪙 ' + r.cost, disabled: S.coins < r.cost,
        onBuy: () => { if (startCooking(st, r)) closeModal(); },
      }));
    }
  });
}
function openShop() {
  sfx('tap');
  openModal(t('shop'), [{ id: 'kitchen', label: t('kitchen') }, { id: 'dining', label: t('dining') }, { id: 'decor', label: t('decor') }, { id: 'expand', label: t('expand') }], (body, tab) => {
    if (tab === 'expand') {
      const next = SIZES[S.sizeIdx + 1];
      if (!next) { body.appendChild(card({ icon: '🏰', title: t('maxSize'), sub: `${grid().w}×${grid().h}` })); return; }
      const locked = S.level < next.lvl;
      body.appendChild(card({
        icon: '🧱', title: t('expandTo', next.w, next.h), sub: locked ? t('lockedLv', next.lvl) : `🪙${next.cost}`,
        locked, btn: '🪙 ' + next.cost, disabled: S.coins < next.cost,
        onBuy: () => {
          if (S.coins < next.cost) return toast(t('noCoins'));
          addCoins(-next.cost); S.sizeIdx++; layout(); sfx('level'); toast(t('expanded')); save(); modalRefresh();
        },
      }));
      return;
    }
    for (const [type, d] of Object.entries(ITEMS)) {
      if (d.cat !== tab) continue;
      const locked = S.level < d.lvl;
      const cost = itemCost(type);
      const max = d.max ? d.max(S.level) : Infinity;
      const full = count(type) >= max;
      const extras = [];
      if (d.rating) extras.push(`+${d.rating}⭐`);
      extras.push(t('owned', count(type)) + (d.max ? '/' + max : ''));
      body.appendChild(card({
        canvasDraw: () => drawItemPreview(type),
        title: nm(d) + (locked ? ' — ' + t('lockedLv', d.lvl) : ''), sub: `🪙${cost} · ` + extras.join(' · '),
        locked, btn: full ? '✓' : '🪙 ' + cost, disabled: full || S.coins < cost,
        onBuy: () => {
          if (full) return toast(t('maxReached', max));
          if (S.coins < cost) return toast(t('noCoins'));
          closeModal();
          placing = { type }; lastPlaceTap = null;
          const d0 = door(); hover = freeTileNear(d0.c, d0.r - 1);
          setMode('place');
        },
      }));
    }
  });
}
function drawItemPreview(type) { drawItem({ type }, 56, 66, 84, Date.now(), true); }
function openStaff() {
  sfx('tap');
  openModal(t('staff'), null, body => {
    const max = maxWaiters(S.level);
    const row = document.createElement('div'); row.className = 'row';
    row.innerHTML = `<div><b></b><div class="muted"></div></div>`;
    row.querySelector('b').textContent = t('waiters') + ': ' + S.staff + ' / ' + max;
    row.querySelector('.muted').textContent = t('stats', S.served);
    body.appendChild(row);
    if (S.staff < max) {
      const cost = waiterCost(S.staff);
      body.appendChild(card({
        icon: '💀', title: t('hire'), sub: '🪙' + cost, btn: '🪙 ' + cost, disabled: S.coins < cost,
        onBuy: () => { if (S.coins < cost) return toast(t('noCoins')); addCoins(-cost); S.staff++; syncWaiters(); toast(t('hired')); sfx('level'); save(); modalRefresh(); },
      }));
    } else body.appendChild(card({ icon: '🔒', title: t('nextWaiter'), sub: '' }));
  });
}
function openSettings() {
  sfx('tap');
  openModal(t('settings'), null, body => {
    const mk = (label, controls) => {
      const row = document.createElement('div'); row.className = 'row';
      const s = document.createElement('b'); s.textContent = label; row.appendChild(s);
      const box = document.createElement('div'); box.style.display = 'flex'; box.style.gap = '6px';
      controls.forEach(c => box.appendChild(c)); row.appendChild(box); body.appendChild(row);
    };
    const btn = (txt, on, fn, cls = '') => { const b = document.createElement('button'); b.className = 'btn ' + cls + (on ? ' primary' : ''); b.textContent = txt; b.onclick = fn; return b; };
    mk(t('lang'), [btn('کوردی', lang === 'ckb', () => setLang('ckb')), btn('English', lang === 'en', () => setLang('en'))]);
    mk(t('sound'), [btn(t('on'), S.sound, () => { S.sound = true; save(); modalRefresh(); }), btn(t('off'), !S.sound, () => { S.sound = false; save(); modalRefresh(); })]);
    mk(t('reset'), [btn('⟲', false, () => { if (confirm(t('confirmReset'))) { localStorage.removeItem(SAVE_KEY); location.reload(); } }, 'danger')]);
    const ab = document.createElement('div'); ab.className = 'muted'; ab.style.textAlign = 'center'; ab.textContent = t('title') + ' — ' + t('about');
    body.appendChild(ab);
  });
}
function setLang(l) {
  lang = l; S.lang = l; save();
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ckb' ? 'rtl' : 'ltr';
  document.title = t('title');
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
  updateBuildBar(); updateHud();
  if (modalRefresh) { $('#mtitle').textContent = t('settings'); modalRefresh(); }
}
document.querySelectorAll('#bottombar button').forEach(b => b.addEventListener('click', () => {
  const a = b.dataset.act;
  if (a === 'shop') openShop();
  else if (a === 'build') { setMode(mode === 'play' ? 'build' : 'play'); placing = null; sfx('tap'); }
  else if (a === 'staff') openStaff();
  else if (a === 'settings') openSettings();
}));

// ---------------------------------------------------------------- boot
window.addEventListener('resize', resize);
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
window.addEventListener('pagehide', save);
setLang(lang);
resize();
syncWaiters();
if (hadSave) {
  const away = Date.now() - (S.saved || Date.now());
  if (away > 60000) setTimeout(() => toast(t('welcome'), 3500), 600);
} else setTimeout(() => toast(t('tut0'), 4500), 600);
if (S.tut === 0 && hadSave) setTimeout(() => toast(t('tut0'), 4500), 600);
requestAnimationFrame(frame);
})();
