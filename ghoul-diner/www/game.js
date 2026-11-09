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

// ---------------------------------------------------------------- layout (isometric 2.5D camera)
let W = 0, H = 0, DPR = 1;
let L = { tw: 64, th: 32, ox: 0, oy: 0, wall: 60 };
const ISO = 0.6; // tile height / width ratio
const cam = { x: 0, y: 0, zoom: 1.2 };
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2.5);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
  layout();
}
function layout() {
  const g = grid();
  const top = 70, bottom = mode === 'play' ? 92 : 160;
  const ah = H - top - bottom;
  const fitW = (W - 12) * 2 / (g.w + g.h);
  const fitH = ah / ((g.w + g.h) * ISO / 2 + 1.35);
  const tw = Math.max(24, Math.min(fitW, fitH) * cam.zoom);
  const th = tw * ISO, wall = tw * 1.05;
  const roomH = (g.w + g.h) * th / 2 + wall;
  // clamp camera so the room cannot be dragged off-screen
  const spanX = Math.max(0, ((g.w + g.h) * tw / 2 - W) / 2 + tw), spanY = Math.max(0, (roomH - ah) / 2 + tw);
  cam.x = Math.max(-spanX, Math.min(spanX, cam.x));
  cam.y = Math.max(-spanY, Math.min(spanY, cam.y));
  L = { tw, th, wall,
    ox: W / 2 + (g.h - g.w) * tw / 4 + cam.x,
    oy: top + wall + (ah - roomH) / 2 + cam.y };
}
// ground point (centre) of a tile; works for fractional tiles
function tileCenter(c, r) { return { x: L.ox + (c - r) * L.tw / 2, y: L.oy + (c + r + 1) * L.th / 2 }; }
function pxToTile(x, y) {
  const a = (x - L.ox) / (L.tw / 2), b = (y - L.oy) / (L.th / 2);
  return { c: Math.floor((a + b) / 2), r: Math.floor((b - a) / 2) };
}

// ---------------------------------------------------------------- drawing helpers
const INK = '#1c1026';
function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }
function poly(pts) { ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); }
function fs(fill, lw) { ctx.fillStyle = fill; ctx.fill(); if (lw !== 0) { ctx.lineWidth = lw || Math.max(1.2, L.tw * 0.022); ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke(); } }
function ell(x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, 7); }
function circ(x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.max(.1, r), 0, 7); }
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const m = v => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)));
  return '#' + ((1 << 24) | (m(r) << 16) | (m(g) << 8) | m(b)).toString(16).slice(1);
}
// isometric box standing on ground point (x,y). hw/hh = half extents of footprint diamond, h = height.
function isoBox(x, y, hw, h, col, opt = {}) {
  const hh = hw * ISO;
  poly([x - hw, y, x, y + hh, x, y + hh - h, x - hw, y - h]); fs(opt.left || shade(col, -0.25));
  poly([x, y + hh, x + hw, y, x + hw, y - h, x, y + hh - h]); fs(opt.right || shade(col, -0.45));
  poly([x, y - hh - h, x + hw, y - h, x, y + hh - h, x - hw, y - h]); fs(opt.top || col);
}
function groundShadow(x, y, rx) { ctx.fillStyle = 'rgba(10,4,20,.35)'; ell(x, y, rx, rx * 0.5); ctx.fill(); }
function emoji(ch, x, y, size) {
  ctx.font = `${size}px ${EMOJI}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(ch, x, y);
}
function ring(x, y, rad, frac, col) {
  ctx.fillStyle = 'rgba(20,10,30,.75)'; circ(x, y, rad * 1.35); ctx.fill();
  ctx.lineWidth = Math.max(3, rad * 0.28); ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255,255,255,.15)'; circ(x, y, rad); ctx.stroke();
  ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(x, y, rad, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); ctx.stroke();
  ctx.lineCap = 'butt';
}
function bubble(x, y, s) {
  ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = Math.max(1.5, s * .03);
  roundRect(x - s * .24, y - s * .2, s * .48, s * .36, s * .12); ctx.fill(); ctx.stroke();
  poly([x - s * .06, y + s * .15, x + s * .02, y + s * .15, x - s * .1, y + s * .28]); ctx.fill();
}

// ---------------------------------------------------------------- drawing: room
function drawRoom() {
  const g = grid(), { tw, th, wall, ox, oy } = L;
  const P = (c, r) => [ox + (c - r) * tw / 2, oy + (c + r) * th / 2];
  // outside ground glow
  const d = door();
  // back-left wall (along c = 0) and back-right wall (along r = 0)
  const [x0, y0] = P(0, 0), [xl, yl] = P(0, g.h), [xr, yr] = P(g.w, 0);
  const wl = ctx.createLinearGradient(0, y0 - wall, 0, yl);
  wl.addColorStop(0, '#3b2459'); wl.addColorStop(1, '#2a1942');
  poly([x0, y0, xl, yl, xl, yl - wall, x0, y0 - wall]); fs(wl);
  const wr = ctx.createLinearGradient(0, y0 - wall, 0, yr);
  wr.addColorStop(0, '#4c2f72'); wr.addColorStop(1, '#382257');
  poly([x0, y0, xr, yr, xr, yr - wall, x0, y0 - wall]); fs(wr);
  // wallpaper stripes + wainscot
  ctx.save();
  poly([x0, y0, xl, yl, xl, yl - wall, x0, y0 - wall]); ctx.clip();
  for (let r = 0; r < g.h * 4; r++) { const [a, b] = P(0, r / 4); ctx.fillStyle = r % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.06)'; poly([a, b, a - tw / 8, b + th / 8, a - tw / 8, b + th / 8 - wall, a, b - wall]); ctx.fill(); }
  ctx.restore();
  ctx.save();
  poly([x0, y0, xr, yr, xr, yr - wall, x0, y0 - wall]); ctx.clip();
  for (let c = 0; c < g.w * 4; c++) { const [a, b] = P(c / 4, 0); ctx.fillStyle = c % 2 ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.05)'; poly([a, b, a + tw / 8, b + th / 8, a + tw / 8, b + th / 8 - wall, a, b - wall]); ctx.fill(); }
  ctx.restore();
  const wh = wall * 0.28;
  poly([x0, y0, xl, yl, xl, yl - wh, x0, y0 - wh]); fs('#2a1532', 0);
  poly([x0, y0, xr, yr, xr, yr - wh, x0, y0 - wh]); fs('#341a3e', 0);
  ctx.strokeStyle = '#6d4a3a'; ctx.lineWidth = Math.max(2, tw * .04);
  ctx.beginPath(); ctx.moveTo(xl, yl - wh); ctx.lineTo(x0, y0 - wh); ctx.lineTo(xr, yr - wh); ctx.stroke();
  // top trim
  ctx.strokeStyle = '#7a5bb0'; ctx.lineWidth = Math.max(3, tw * .07);
  ctx.beginPath(); ctx.moveTo(xl, yl - wall); ctx.lineTo(x0, y0 - wall); ctx.lineTo(xr, yr - wall); ctx.stroke();
  // windows (right wall) with moon & night sky
  for (let c = 1; c < g.w; c += 2) {
    const [a, b] = P(c + 0.5, 0);
    const wy = b - wall * 0.42, ww = tw * .36, wh2 = wall * .42;
    ctx.save();
    poly([a - ww / 2, wy - ww / 4 + wh2 / 2, a + ww / 2, wy + ww / 4 + wh2 / 2, a + ww / 2, wy + ww / 4 - wh2 / 2, a - ww / 2, wy - ww / 4 - wh2 / 2]);
    const sky = ctx.createLinearGradient(0, wy - wh2, 0, wy + wh2); sky.addColorStop(0, '#0d1b48'); sky.addColorStop(1, '#3c2a7a');
    fs(sky, Math.max(2, tw * .05)); ctx.clip();
    ctx.fillStyle = '#fff6c9'; circ(a + ww * .12, wy - wh2 * .15, tw * .07); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.7)'; for (let k = 0; k < 4; k++) { circ(a - ww * .3 + k * ww * .2, wy - wh2 * .3 + (k % 2) * wh2 * .3, 1); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = Math.max(1.5, tw * .025);
    ctx.beginPath(); ctx.moveTo(a, wy - wh2 / 2 - 1); ctx.lineTo(a, wy + wh2 / 2 + 1); ctx.stroke();
  }
  // picture frames / bat shelf (left wall)
  for (let r = 1; r < g.h; r += 3) {
    const [a, b] = P(0, r + 0.5);
    const fy = b - wall * .55, fw = tw * .3, fh = wall * .3;
    poly([a + fw / 2, fy - fw / 4 - fh / 2, a + fw / 2, fy - fw / 4 + fh / 2, a - fw / 2, fy + fw / 4 + fh / 2, a - fw / 2, fy + fw / 4 - fh / 2]);
    fs('#8b5a2b', Math.max(2, tw * .03));
    poly([a + fw * .36, fy - fw * .18 - fh * .36, a + fw * .36, fy - fw * .18 + fh * .36, a - fw * .36, fy + fw * .18 + fh * .36, a - fw * .36, fy + fw * .18 - fh * .36]);
    fs('#2b5d4a', 0);
    ctx.fillStyle = '#e9f0d0'; circ(a, fy, fh * .16); ctx.fill();
    ctx.fillStyle = INK; circ(a - fh * .05, fy - fh * .02, fh * .04); circ(a + fh * .05, fy - fh * .02, fh * .04); ctx.fill();
  }
  // floor tiles (checker diner floor)
  for (let r = 0; r < g.h; r++) for (let c = 0; c < g.w; c++) {
    const [a, b] = P(c, r);
    poly([a, b, a + tw / 2, b + th / 2, a, b + th, a - tw / 2, b + th / 2]);
    ctx.fillStyle = (r + c) % 2 ? '#d9cbe8' : '#3a2752'; ctx.fill();
  }
  // subtle floor lighting
  const [cx, cy] = P(g.w / 2, g.h / 2);
  const fl = ctx.createRadialGradient(cx, cy, tw, cx, cy, (g.w + g.h) * tw / 2);
  fl.addColorStop(0, 'rgba(255,220,180,0.05)'); fl.addColorStop(1, 'rgba(20,5,40,0.45)');
  poly([...P(0, 0), ...P(g.w, 0), ...P(g.w, g.h), ...P(0, g.h)]); ctx.fillStyle = fl; ctx.fill();
  // floor edge (thickness)
  const ft = th * .35;
  poly([...P(0, g.h), ...P(g.w, g.h), P(g.w, g.h)[0], P(g.w, g.h)[1] + ft, P(0, g.h)[0], P(0, g.h)[1] + ft]); fs('#24163a');
  poly([...P(g.w, 0), ...P(g.w, g.h), P(g.w, g.h)[0], P(g.w, g.h)[1] + ft, P(g.w, 0)[0], P(g.w, 0)[1] + ft]); fs('#1a1029');
  // entrance mat + neon sign outside the door
  const [mx, my] = P(d.c + 0.5, g.h + 0.5);
  poly([mx, my - th * .45, mx + tw * .45, my, mx, my + th * .45, mx - tw * .45, my]); fs('#7a2f3f');
  ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 1; poly([mx, my - th * .3, mx + tw * .3, my, mx, my + th * .3, mx - tw * .3, my]); ctx.stroke();
  const sx = mx + tw * .2, sy = my + tw * 1.25;
  ctx.fillStyle = '#2a1d38'; ctx.fillRect(sx - 2, sy - tw * .55, 4, tw * .55);
  ctx.font = `900 ${Math.max(11, tw * .26)}px system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const tw2 = ctx.measureText(t('title')).width + tw * .3;
  roundRect(sx - tw2 / 2, sy - tw * .95, tw2, tw * .42, tw * .1); fs('#1d0f2b', Math.max(2, tw * .035));
  ctx.shadowColor = '#7dff9a'; ctx.shadowBlur = 12 + Math.sin(time * 3) * 4;
  ctx.fillStyle = '#9dffb2'; ctx.fillText(t('title'), sx, sy - tw * .74);
  ctx.shadowBlur = 0;
}

// ---------------------------------------------------------------- drawing: items (s = tile width)
function drawItem(it, x, y, s, now, preview) {
  const tt = time;
  ctx.save();
  switch (it.type) {
    case 'stove': {
      groundShadow(x, y + s * .02, s * .42);
      isoBox(x, y, s * .4, s * .36, '#8d8aa6', { left: '#5c5975', right: '#46435c' });
      // oven door with glow
      const st = preview ? 'idle' : stoveStatus(it, now);
      const glow = st === 'cooking' ? `rgba(125,255,154,${.55 + .25 * Math.sin(tt * 8)})` : '#262236';
      poly([x - s * .32, y - s * .04, x - s * .06, y + s * .09, x - s * .06, y - s * .14, x - s * .32, y - s * .27]); fs(glow);
      ctx.fillStyle = '#c9c4dc'; ctx.fillRect(x - s * .25, y - s * .27, s * .14, s * .025);
      // burners
      const top = y - s * .36;
      for (const [bx, by] of [[-.12, 0], [.12, 0], [0, -.07], [0, .07]].slice(0, 2)) { ctx.fillStyle = '#2a2638'; ell(x + bx * s, top + by * s, s * .1, s * .05); ctx.fill(); }
      if (st === 'cooking') {
        // pot + green flames
        for (let k = 0; k < 4; k++) {
          const fx = x - s * .12 + (k % 2) * s * .06 - s * .03, fh = s * (.06 + .03 * Math.sin(tt * 14 + k));
          ctx.fillStyle = k % 2 ? '#b6ff5c' : '#3fd36a'; ell(fx, top - fh / 2, s * .03, fh); ctx.fill();
        }
        poly([x + s * .03, top - s * .02, x + s * .21, top - s * .02, x + s * .19, top - s * .16, x + s * .05, top - s * .16]); fs('#3a3550');
        ctx.fillStyle = '#7dff9a'; ell(x + s * .12, top - s * .16, s * .07, s * .025); ctx.fill();
        for (let k = 0; k < 3; k++) { const ph = (tt * .7 + k / 3) % 1; ctx.fillStyle = `rgba(230,255,235,${.5 * (1 - ph)})`; circ(x + s * .12 + Math.sin(ph * 6 + k) * s * .04, top - s * .2 - ph * s * .35, s * .04 * (1 + ph)); ctx.fill(); }
        const r = RMAP[it.cook.rid];
        const frac = 1 - (it.cook.end - now) / (r.time * 1000);
        ring(x, y - s * .95, s * .16, Math.max(0, Math.min(1, frac)), '#7dff9a');
        emoji(r.icon, x, y - s * .95, s * .18);
      } else if (st === 'ready') {
        const b = Math.abs(Math.sin(tt * 4)) * s * .08;
        ctx.globalCompositeOperation = 'lighter';
        const gr = ctx.createRadialGradient(x, y - s * .9 - b, 0, x, y - s * .9 - b, s * .35);
        gr.addColorStop(0, 'rgba(255,230,120,.6)'); gr.addColorStop(1, 'rgba(255,230,120,0)');
        ctx.fillStyle = gr; circ(x, y - s * .9 - b, s * .35); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        bubble(x, y - s * .9 - b, s * 1.1);
        emoji(RMAP[it.ready.rid].icon, x, y - s * .93 - b, s * .3);
      } else if (st === 'spoiled') {
        bubble(x, y - s * .85, s);
        emoji('🦠', x, y - s * .88 + Math.sin(tt * 3) * 2, s * .26);
      } else if (!preview && S.tut === 0) {
        emoji('👇', x, y - s * .85 + Math.sin(tt * 5) * 5, s * .34);
      }
      break;
    }
    case 'counter': {
      groundShadow(x, y + s * .02, s * .44);
      isoBox(x, y, s * .42, s * .32, '#a8693f', { left: '#7c4a2b', right: '#5f3720' });
      // panel inset
      poly([x - s * .36, y - s * .03, x - s * .05, y + s * .12, x - s * .05, y - s * .16, x - s * .36, y - s * .29]); fs('#6a3d22', 0);
      // marble top
      const tp = y - s * .32;
      poly([x, tp - s * .23, x + s * .44, tp, x, tp + s * .23, x - s * .44, tp]); fs('#efe4f5');
      if (!preview && it.dish && it.n > 0) {
        ctx.fillStyle = '#fff'; ell(x, tp, s * .2, s * .09); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.stroke();
        emoji(RMAP[it.dish].icon, x, tp - s * .1, s * .3);
        ctx.fillStyle = '#ffd25a'; circ(x + s * .3, tp - s * .28, s * .13); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = INK; ctx.font = `900 ${s * .15}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(it.n, x + s * .3, tp - s * .27);
      }
      break;
    }
    case 'table': case 'tableFancy': {
      const fancy = it.type === 'tableFancy';
      groundShadow(x, y + s * .02, s * .36);
      // chair (behind the table, toward the back wall)
      const chx = x - s * .2, chy = y - s * .1;
      ctx.fillStyle = INK; ctx.fillRect(chx - s * .1, chy - s * .02, s * .025, s * .12); ctx.fillRect(chx + s * .08, chy - s * .02, s * .025, s * .12);
      isoBox(chx, chy, s * .14, s * .14, fancy ? '#9b3fc2' : '#b07a4a');
      poly([chx - s * .14, chy - s * .14, chx - s * .02, chy - s * .08, chx - s * .02, chy - s * .5, chx - s * .14, chy - s * .56]); fs(fancy ? '#6d2590' : '#7c5230');
      if (it._drawGuest) it._drawGuest();
      // pedestal + round top
      ctx.fillStyle = '#2b1c22'; ctx.fillRect(x - s * .03, y - s * .26, s * .06, s * .26);
      ell(x, y + s * .02, s * .12, s * .05); fs('#2b1c22');
      const ty = y - s * .3;
      ell(x, ty + s * .035, s * .36, s * .19); fs(fancy ? '#5d1f7c' : '#6b4128');
      ell(x, ty, s * .36, s * .19); fs(fancy ? '#b25bd8' : '#f1e3cf');
      if (fancy) {
        ctx.fillStyle = '#5d1f7c'; ell(x, ty, s * .2, s * .1); ctx.fill();
        ctx.fillStyle = '#fff2cf'; ctx.fillRect(x + s * .14, ty - s * .17, s * .045, s * .14);
        ctx.fillStyle = '#ffb347'; ell(x + s * .162, ty - s * .2 + Math.sin(tt * 9), s * .025, s * .045); ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(200,60,80,.5)'; ctx.lineWidth = s * .03; ell(x, ty, s * .25, s * .13); ctx.stroke();
      }
      if (it._drawFood) it._drawFood(x, ty);
      break;
    }
    case 'candle': {
      groundShadow(x, y, s * .2);
      ell(x, y, s * .14, s * .07); fs('#b8913a');
      ctx.fillStyle = '#d9b24e'; ctx.fillRect(x - s * .025, y - s * .5, s * .05, s * .5);
      ctx.strokeStyle = '#d9b24e'; ctx.lineWidth = Math.max(2, s * .045);
      ctx.beginPath(); ctx.moveTo(x - s * .2, y - s * .62); ctx.quadraticCurveTo(x - s * .2, y - s * .42, x, y - s * .44); ctx.quadraticCurveTo(x + s * .2, y - s * .42, x + s * .2, y - s * .62); ctx.stroke();
      for (const k of [-1, 0, 1]) {
        const cx = x + k * s * .2, cy = y - (k ? s * .62 : s * .72);
        roundRect(cx - s * .035, cy - s * .16, s * .07, s * .16, 2); fs('#fbf3e3', 1);
        const fl = Math.sin(tt * 10 + k * 3) * s * .015;
        ctx.fillStyle = '#ffb347'; ell(cx + fl, cy - s * .21, s * .03, s * .06); ctx.fill();
        ctx.fillStyle = '#fff3b0'; ell(cx + fl, cy - s * .2, s * .014, s * .03); ctx.fill();
      }
      break;
    }
    case 'pumpkin': {
      groundShadow(x, y, s * .3);
      const py = y - s * .2;
      for (const k of [-1, 1, 0]) { ell(x + k * s * .13, py, s * .2, s * .21); fs(k ? '#d9661a' : '#f2862e'); }
      roundRect(x - s * .03, py - s * .3, s * .06, s * .12, 2); fs('#3c7a2e');
      const glow = 0.75 + Math.sin(tt * 6) * 0.25;
      ctx.fillStyle = `rgba(255,236,110,${glow})`;
      poly([x - s * .15, py - s * .03, x - s * .08, py - s * .12, x - s * .03, py - s * .02]); ctx.fill();
      poly([x + s * .15, py - s * .03, x + s * .08, py - s * .12, x + s * .03, py - s * .02]); ctx.fill();
      poly([x - s * .15, py + s * .06, x + s * .15, py + s * .06, x + s * .08, py + s * .14, x, py + s * .09, x - s * .08, py + s * .14]); ctx.fill();
      break;
    }
    case 'tomb': {
      groundShadow(x, y, s * .32);
      ell(x, y, s * .3, s * .14); fs('#3d7a3a');
      isoBox(x, y - s * .02, s * .22, s * .1, '#77748c');
      roundRect(x - s * .19, y - s * .66, s * .38, s * .58, [s * .19, s * .19, 2, 2]); fs('#9a97b0');
      ctx.fillStyle = '#7e7b94'; ctx.fillRect(x + s * .1, y - s * .55, s * .06, s * .45);
      ctx.fillStyle = '#4a475a'; ctx.font = `900 ${s * .12}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('R.I.P', x - s * .02, y - s * .4);
      break;
    }
    case 'cauldron': {
      groundShadow(x, y, s * .36);
      ctx.fillStyle = '#ff7a2c'; ell(x, y - s * .02, s * .2, s * .06 + Math.sin(tt * 11) * 1.2); ctx.fill();
      ell(x, y - s * .28, s * .34, s * .27); fs('#2a2734');
      ctx.fillStyle = 'rgba(255,255,255,.12)'; ell(x - s * .14, y - s * .32, s * .06, s * .12); ctx.fill();
      ell(x, y - s * .48, s * .3, s * .1); fs('#5cff8d');
      for (let k = 0; k < 3; k++) {
        const ph = (tt * 0.9 + k / 3) % 1;
        ctx.fillStyle = `rgba(160,255,180,${1 - ph})`;
        circ(x + (k - 1) * s * .12, y - s * .5 - ph * s * .45, s * .05 * (1 - ph * .5)); ctx.fill();
      }
      break;
    }
    case 'crystal': {
      groundShadow(x, y, s * .26);
      poly([x - s * .2, y, x + s * .2, y, x + s * .12, y - s * .2, x - s * .12, y - s * .2]); fs('#7a4a2a');
      const gl = ctx.createRadialGradient(x - s * .07, y - s * .5, 2, x, y - s * .42, s * .26);
      gl.addColorStop(0, '#f6e3ff'); gl.addColorStop(.5, '#b26cff'); gl.addColorStop(1, '#4b1d8a');
      ctx.shadowColor = '#b26cff'; ctx.shadowBlur = 14 + Math.sin(tt * 3) * 6;
      circ(x, y - s * .42, s * .24); fs(gl);
      ctx.shadowBlur = 0;
      break;
    }
    case 'gargoyle': {
      groundShadow(x, y, s * .34);
      isoBox(x, y, s * .26, s * .2, '#6b6880');
      const gy = y - s * .2;
      poly([x, gy - s * .3, x - s * .44, gy - s * .62, x - s * .36, gy - s * .2]); fs('#77748a');
      poly([x, gy - s * .3, x + s * .44, gy - s * .62, x + s * .36, gy - s * .2]); fs('#77748a');
      ell(x, gy - s * .2, s * .15, s * .2); fs('#8e8ba3');
      circ(x, gy - s * .46, s * .13); fs('#8e8ba3');
      poly([x - s * .1, gy - s * .54, x - s * .15, gy - s * .7, x - s * .03, gy - s * .58]); fs('#8e8ba3');
      poly([x + s * .1, gy - s * .54, x + s * .15, gy - s * .7, x + s * .03, gy - s * .58]); fs('#8e8ba3');
      ctx.fillStyle = '#ff5f7a'; circ(x - s * .05, gy - s * .47, s * .022); circ(x + s * .05, gy - s * .47, s * .022); ctx.fill();
      break;
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- drawing: characters (original chibi designs)
function eyePair(x, y, r, sp, look, col = INK) {
  for (const k of [-1, 1]) {
    ctx.fillStyle = '#fff'; circ(x + k * sp, y, r); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = Math.max(1, r * .3); ctx.stroke();
    ctx.fillStyle = col; circ(x + k * sp + look * r * .35, y + r * .1, r * .55); ctx.fill();
    ctx.fillStyle = '#fff'; circ(x + k * sp + look * r * .35 - r * .2, y - r * .15, r * .18); ctx.fill();
  }
}
function drawMonster(kind, x, y, s, face, ph, seated) {
  const hop = seated ? 0 : 0;
  y -= hop;
  switch (kind) {
    case 'ghost': {
      const fy = y - s * .12 + Math.sin(time * 3 + ph) * s * .04;
      ctx.beginPath();
      ctx.moveTo(x - s * .22, fy + s * .1); ctx.lineTo(x - s * .22, fy - s * .3); ctx.arc(x, fy - s * .3, s * .22, Math.PI, 0); ctx.lineTo(x + s * .22, fy + s * .1);
      for (let k = 0; k < 4; k++) { const wx = x + s * .22 - (k + 1) * s * .11; ctx.quadraticCurveTo(wx + s * .055, fy + s * (k % 2 ? .02 : .2) + Math.sin(time * 6 + k) * 2, wx, fy + s * .1); }
      ctx.closePath(); fs('rgba(240,246,255,.95)');
      ctx.fillStyle = 'rgba(160,180,230,.35)'; ell(x + s * .1, fy - s * .1, s * .07, s * .16); ctx.fill();
      eyePair(x + face * s * .03, fy - s * .32, s * .055, s * .085, face, '#2a3a7a');
      ctx.fillStyle = '#ff9eb5'; ell(x - s * .13, fy - s * .22, s * .035, s * .02); ell(x + s * .13, fy - s * .22, s * .035, s * .02); ctx.fill();
      ell(x + face * s * .03, fy - s * .2, s * .035, s * .03); fs(INK, 0);
      break;
    }
    case 'vampire': {
      poly([x - s * .26, y, x - s * .14, y - s * .42, x + s * .14, y - s * .42, x + s * .26, y]); fs('#8a1730');
      poly([x - s * .1, y, x - s * .08, y - s * .4, x + s * .08, y - s * .4, x + s * .1, y]); fs('#2b1a2a');
      poly([x - s * .05, y - s * .4, x + s * .05, y - s * .4, x, y - s * .3]); fs('#f4f0ff', 0);
      poly([x - s * .24, y - s * .42, x - s * .12, y - s * .62, x, y - s * .44]); fs('#5d0d20');
      poly([x + s * .24, y - s * .42, x + s * .12, y - s * .62, x, y - s * .44]); fs('#5d0d20');
      circ(x, y - s * .58, s * .19); fs('#dcd8ef');
      ctx.beginPath(); ctx.moveTo(x - s * .2, y - s * .6); ctx.quadraticCurveTo(x - s * .18, y - s * .82, x, y - s * .8); ctx.quadraticCurveTo(x + s * .18, y - s * .82, x + s * .2, y - s * .6); ctx.lineTo(x + s * .08, y - s * .68); ctx.lineTo(x, y - s * .62); ctx.lineTo(x - s * .08, y - s * .68); ctx.closePath(); fs('#241428');
      eyePair(x + face * s * .02, y - s * .56, s * .045, s * .07, face, '#c4122f');
      ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y - s * .47, s * .05, 0.3, Math.PI - .3); ctx.stroke();
      ctx.fillStyle = '#fff'; poly([x - s * .035, y - s * .45, x - s * .015, y - s * .45, x - s * .025, y - s * .41]); ctx.fill(); poly([x + s * .015, y - s * .45, x + s * .035, y - s * .45, x + s * .025, y - s * .41]); ctx.fill();
      break;
    }
    case 'mummy': {
      roundRect(x - s * .17, y - s * .42, s * .34, s * .42, s * .1); fs('#e8dcbc');
      circ(x, y - s * .58, s * .2); fs('#e8dcbc');
      ctx.strokeStyle = '#b8a77f'; ctx.lineWidth = Math.max(1.2, s * .02);
      for (let k = 0; k < 8; k++) { const yy = y - s * .74 + k * s * .09; ctx.beginPath(); ctx.moveTo(x - s * .17, yy + (k % 2 ? 3 : -2)); ctx.lineTo(x + s * .17, yy - (k % 2 ? 1 : -2)); ctx.stroke(); }
      ctx.fillStyle = '#3a2a1a'; roundRect(x - s * .15, y - s * .64, s * .3, s * .09, s * .04); ctx.fill();
      ctx.fillStyle = '#ffe94a'; circ(x - s * .06 + face * s * .02, y - s * .595, s * .03); circ(x + s * .07 + face * s * .02, y - s * .595, s * .022); ctx.fill();
      ctx.strokeStyle = '#e8dcbc'; ctx.lineWidth = s * .03; ctx.beginPath(); ctx.moveTo(x + s * .17, y - s * .3); ctx.quadraticCurveTo(x + s * .3, y - s * .2 + Math.sin(time * 4 + ph) * 3, x + s * .26, y - s * .08); ctx.stroke();
      break;
    }
    case 'pumpkin': {
      roundRect(x - s * .14, y - s * .38, s * .28, s * .38, s * .08); fs('#4b7a32');
      ctx.fillStyle = '#3a5f26'; ctx.fillRect(x - s * .02, y - s * .38, s * .04, s * .38);
      for (const k of [-1, 1, 0]) { ell(x + k * s * .1, y - s * .58, s * .16, s * .17); fs(k ? '#d9661a' : '#f2862e'); }
      roundRect(x - s * .025, y - s * .82, s * .05, s * .1, 2); fs('#3c7a2e');
      ctx.fillStyle = '#ffe36b';
      poly([x - s * .12, y - s * .6, x - s * .05, y - s * .68, x - s * .02, y - s * .58]); ctx.fill();
      poly([x + s * .12, y - s * .6, x + s * .05, y - s * .68, x + s * .02, y - s * .58]); ctx.fill();
      poly([x - s * .1, y - s * .52, x + s * .1, y - s * .52, x + s * .05, y - s * .46, x, y - s * .5, x - s * .05, y - s * .46]); ctx.fill();
      break;
    }
    case 'blob': {
      const sq = 1 + Math.sin(time * 6 + ph) * .07;
      ctx.beginPath(); ctx.moveTo(x - s * .28 * sq, y);
      ctx.bezierCurveTo(x - s * .3 * sq, y - s * .5 / sq, x + s * .3 * sq, y - s * .5 / sq, x + s * .28 * sq, y);
      ctx.closePath(); fs('rgba(120,235,130,.95)');
      ctx.fillStyle = 'rgba(220,255,220,.55)'; ell(x - s * .1, y - s * .28 / sq, s * .05, s * .03); ctx.fill();
      ctx.fillStyle = 'rgba(70,170,80,.7)'; circ(x + s * .12, y - s * .08, s * .03); circ(x - s * .16, y - s * .06, s * .02); ctx.fill();
      eyePair(x + face * s * .02, y - s * .22 / sq, s * .065, 0, face, '#2a5a1a');
      ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x + face * s * .02, y - s * .12, s * .05, 0.2, Math.PI - .2); ctx.stroke();
      break;
    }
    case 'cyclops': {
      roundRect(x - s * .2, y - s * .44, s * .4, s * .44, s * .14); fs('#5476e0');
      ctx.fillStyle = '#7f9cf0'; ell(x, y - s * .2, s * .12, s * .14); ctx.fill();
      circ(x, y - s * .6, s * .21); fs('#5476e0');
      poly([x - s * .14, y - s * .74, x - s * .1, y - s * .92, x - s * .03, y - s * .78]); fs('#f2d34a');
      poly([x + s * .14, y - s * .74, x + s * .1, y - s * .92, x + s * .03, y - s * .78]); fs('#f2d34a');
      circ(x, y - s * .62, s * .1); fs('#fff');
      ctx.fillStyle = '#3a1a5a'; circ(x + face * s * .04, y - s * .61, s * .055); ctx.fill();
      ctx.fillStyle = '#fff'; circ(x + face * s * .04 - s * .02, y - s * .63, s * .015); ctx.fill();
      ctx.fillStyle = INK; ell(x, y - s * .48, s * .06, s * .025); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillRect(x - s * .04, y - s * .5, s * .02, s * .025); ctx.fillRect(x + s * .02, y - s * .5, s * .02, s * .025);
      break;
    }
  }
}
function guestDrawFor(g, s) {
  return () => {
    const p = tileCenter(g.x, g.y);
    drawMonster(g.kind, p.x - s * .2, p.y - s * .2, s * .95, g.face, g.ph, true);
  };
}
function drawGuestOverlay(g) {
  const p = tileCenter(g.x, g.y), s = L.tw;
  if (g.state === 'wait') {
    const frac = Math.max(0, g.patience / g.maxPat);
    const bx = p.x + s * .18, by = p.y - s * 1.15;
    bubble(bx, by, s * 1.05);
    ctx.fillStyle = frac > .5 ? '#2fae55' : frac > .25 ? '#e0a400' : '#e0304a';
    ctx.font = `900 ${s * .22}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(g.assigned ? '♥' : '?', bx, by - s * .02);
    ctx.fillStyle = 'rgba(20,10,30,.6)'; roundRect(bx - s * .2, by + s * .22, s * .4, s * .06, 3); ctx.fill();
    ctx.fillStyle = frac > .5 ? '#7dff9a' : frac > .25 ? '#ffd25a' : '#ff5f7a';
    roundRect(bx - s * .2, by + s * .22, s * .4 * frac, s * .06, 3); ctx.fill();
  }
}
function drawWalker(g) {
  const p = tileCenter(g.x, g.y), s = L.tw;
  const bob = g.walking ? Math.abs(Math.sin(time * 9 + g.ph)) * s * .06 : Math.sin(time * 2 + g.ph) * s * .01;
  groundShadow(p.x, p.y, s * .2);
  drawMonster(g.kind, p.x, p.y - bob, s * .95, g.face, g.ph, false);
}
function drawWaiter(w) {
  const p = tileCenter(w.x, w.y), s = L.tw * .95;
  const bob = w.walking ? Math.abs(Math.sin(time * 10 + w.ph)) * s * .05 : 0;
  const x = p.x, y = p.y - bob;
  ctx.save();
  groundShadow(p.x, p.y, s * .2);
  const sw = w.walking ? Math.sin(time * 10 + w.ph) * s * .06 : 0;
  ctx.strokeStyle = INK; ctx.lineWidth = Math.max(3, s * .07); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * .06, y - s * .2); ctx.lineTo(x - s * .07 + sw, y - s * .01); ctx.moveTo(x + s * .06, y - s * .2); ctx.lineTo(x + s * .07 - sw, y - s * .01); ctx.stroke();
  ctx.strokeStyle = '#f4efe2'; ctx.lineWidth = Math.max(1.5, s * .035);
  ctx.beginPath(); ctx.moveTo(x - s * .06, y - s * .2); ctx.lineTo(x - s * .07 + sw, y - s * .01); ctx.moveTo(x + s * .06, y - s * .2); ctx.lineTo(x + s * .07 - sw, y - s * .01); ctx.stroke();
  ctx.lineCap = 'butt';
  // vest body
  roundRect(x - s * .15, y - s * .46, s * .3, s * .28, s * .07); fs('#22202e');
  poly([x - s * .05, y - s * .46, x + s * .05, y - s * .46, x, y - s * .36]); fs('#f4efe2', 0);
  ctx.strokeStyle = '#f4efe2'; ctx.lineWidth = 1.5;
  for (let k = 0; k < 2; k++) { ctx.beginPath(); ctx.moveTo(x - s * .1, y - s * .32 + k * s * .06); ctx.lineTo(x - s * .03, y - s * .32 + k * s * .06); ctx.moveTo(x + s * .03, y - s * .32 + k * s * .06); ctx.lineTo(x + s * .1, y - s * .32 + k * s * .06); ctx.stroke(); }
  // skull head
  circ(x, y - s * .64, s * .19); fs('#f6f1e4');
  roundRect(x - s * .1, y - s * .52, s * .2, s * .08, s * .03); fs('#f6f1e4');
  ctx.fillStyle = INK; ell(x - s * .07 + w.face * s * .02, y - s * .65, s * .05, s * .06); ell(x + s * .07 + w.face * s * .02, y - s * .65, s * .05, s * .06); ctx.fill();
  ctx.fillStyle = '#7dff9a'; circ(x - s * .07 + w.face * s * .03, y - s * .65, s * .015); circ(x + s * .07 + w.face * s * .03, y - s * .65, s * .015); ctx.fill();
  ctx.fillStyle = INK; poly([x - s * .015, y - s * .57, x + s * .015, y - s * .57, x, y - s * .6]); ctx.fill();
  for (let k = -1; k <= 1; k++) ctx.fillRect(x + k * s * .035 - 1, y - s * .51, 2, s * .05);
  // tall hat
  roundRect(x - s * .12, y - s * .97, s * .24, s * .16, 4); fs('#ffffff');
  ell(x, y - s * .8, s * .16, s * .04); fs('#ffffff');
  // bow tie
  poly([x, y - s * .44, x - s * .08, y - s * .49, x - s * .08, y - s * .39]); fs('#e0304a', 1);
  poly([x, y - s * .44, x + s * .08, y - s * .49, x + s * .08, y - s * .39]); fs('#e0304a', 1);
  // tray
  if (w.dish) {
    const tx = x + w.face * s * .22;
    ctx.strokeStyle = '#f4efe2'; ctx.lineWidth = Math.max(2, s * .04);
    ctx.beginPath(); ctx.moveTo(x + w.face * s * .12, y - s * .38); ctx.lineTo(tx, y - s * .5); ctx.stroke();
    ell(tx, y - s * .52, s * .16, s * .05); fs('#d6d0e6');
    emoji(RMAP[w.dish].icon, tx, y - s * .64, s * .24);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- render
function render(now) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const bg = ctx.createRadialGradient(W / 2, H * .45, 10, W / 2, H * .45, Math.max(W, H) * .8);
  bg.addColorStop(0, '#2a1a45'); bg.addColorStop(1, '#08040f');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  drawRoom();
  const { tw, th } = L;
  const tileDiamond = (c, r, fill, stroke) => {
    const p = tileCenter(c, r);
    poly([p.x, p.y - th / 2, p.x + tw / 2, p.y, p.x, p.y + th / 2, p.x - tw / 2, p.y]);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
  };
  if (mode !== 'play') {
    const g = grid();
    for (let r = 0; r < g.h; r++) for (let c = 0; c < g.w; c++) tileDiamond(c, r, null, 'rgba(125,255,154,.25)');
    const d = door(); tileDiamond(d.c, d.r, 'rgba(255,95,122,.3)');
  }
  if (selected) tileDiamond(selected.c, selected.r, 'rgba(125,255,154,.3)', '#7dff9a');
  // depth-sorted drawables
  const list = [];
  const seated = new Map();
  for (const g of guests) if (g.state === 'wait' || g.state === 'eat') seated.set(g.table, g);
  for (const it of S.items) {
    if (placing && placing.item === it) continue;
    const g = seated.get(it.id);
    list.push({ d: it.c + it.r, f: () => {
      const p = tileCenter(it.c, it.r);
      if (g) {
        it._drawGuest = guestDrawFor(g, tw);
        it._drawFood = g.state === 'eat' ? (x, y) => { ctx.fillStyle = '#fff'; ell(x - tw * .06, y, tw * .13, tw * .06); ctx.fill(); emoji(RMAP[g.dish].icon, x - tw * .06, y - tw * .06, tw * .22); } : null;
      }
      drawItem(it, p.x, p.y, tw, now);
      it._drawGuest = it._drawFood = null;
    } });
  }
  for (const g of guests) if (!seated.has(g.table) || seated.get(g.table) !== g) list.push({ d: g.x + g.y + .5, f: () => drawWalker(g) });
  for (const w of waiters) list.push({ d: w.x + w.y + .5, f: () => drawWaiter(w) });
  list.sort((a, b) => a.d - b.d).forEach(d => d.f());
  // lighting pass: warm glows
  ctx.globalCompositeOperation = 'lighter';
  for (const it of S.items) {
    const glow = { candle: ['255,170,70', 1.3], pumpkin: ['255,150,40', 1], crystal: ['180,110,255', 1.4], cauldron: ['90,255,140', 1.1], tableFancy: ['255,170,80', .7] }[it.type];
    if (!glow) continue;
    const p = tileCenter(it.c, it.r), rad = tw * glow[1] * (1 + Math.sin(time * 5 + it.id) * .04);
    const gr = ctx.createRadialGradient(p.x, p.y - tw * .4, 0, p.x, p.y - tw * .4, rad);
    gr.addColorStop(0, `rgba(${glow[0]},.28)`); gr.addColorStop(1, `rgba(${glow[0]},0)`);
    ctx.fillStyle = gr; circ(p.x, p.y - tw * .4, rad); ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  for (const g of guests) drawGuestOverlay(g);
  // placement ghost
  if (mode === 'place' && hover) {
    const ok = canPlace(hover.c, hover.r);
    tileDiamond(hover.c, hover.r, ok ? 'rgba(125,255,154,.35)' : 'rgba(255,95,122,.4)', ok ? '#7dff9a' : '#ff5f7a');
    if (inGrid(hover.c, hover.r)) {
      const p = tileCenter(hover.c, hover.r);
      ctx.globalAlpha = .8;
      drawItem(placing.item || { type: placing.type }, p.x, p.y, tw, now, true);
      ctx.globalAlpha = 1;
    }
  }
  // floaters
  for (const f of floaters) {
    ctx.globalAlpha = Math.max(0, 1 - f.t / 1.4);
    ctx.font = `900 ${Math.max(15, tw * .32)}px system-ui, ${EMOJI}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.strokeText(f.text, f.x, f.y - f.t * 45);
    ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y - f.t * 45);
  }
  ctx.globalAlpha = 1;
  // vignette
  const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .75);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  for (const s of sparks) { ctx.fillStyle = s.col; ctx.save(); ctx.translate(s.x * W, s.y * H); ctx.rotate(s.t * 8); ctx.fillRect(-4, -2, 8, 4); ctx.restore(); }
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
  layout();
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

// ---------------------------------------------------------------- input (tap, drag-to-pan, pinch-to-zoom)
const ptrs = new Map();
let down = null, pinch = null, lastPlaceTap = null;
function pickItem(px, py) {
  let best = null;
  for (const it of S.items) {
    const p = tileCenter(it.c, it.r);
    if (Math.abs(px - p.x) < L.tw * .45 && py < p.y + L.th * .5 && py > p.y - L.tw * .95)
      if (!best || it.c + it.r > best.c + best.r) best = it;
  }
  return best;
}
canvas.addEventListener('pointerdown', e => {
  try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 2) {
    const [a, b] = [...ptrs.values()];
    pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, z: cam.zoom }; down = null; return;
  }
  down = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: 0 };
  if (mode === 'place') hover = pxToTile(e.clientX, e.clientY);
});
canvas.addEventListener('pointermove', e => {
  if (!ptrs.has(e.pointerId)) { if (mode === 'place' && e.pointerType === 'mouse') hover = pxToTile(e.clientX, e.clientY); return; }
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && ptrs.size >= 2) {
    const [a, b] = [...ptrs.values()];
    cam.zoom = Math.max(0.8, Math.min(2.6, pinch.z * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d));
    layout(); return;
  }
  if (!down) return;
  const dx = e.clientX - down.x, dy = e.clientY - down.y;
  down.moved = Math.max(down.moved, Math.hypot(dx, dy));
  if (mode === 'place') { hover = pxToTile(e.clientX, e.clientY); return; }
  if (down.moved > 10) { cam.x = down.cx + dx; cam.y = down.cy + dy; layout(); }
});
canvas.addEventListener('pointerup', e => {
  ptrs.delete(e.pointerId);
  if (pinch) { if (ptrs.size < 2) pinch = null; down = null; return; }
  if (!down) return;
  const d = down; down = null;
  if (mode === 'place') {
    const tl = pxToTile(e.clientX, e.clientY);
    hover = tl;
    if (d.moved < 10 && lastPlaceTap && lastPlaceTap.c === tl.c && lastPlaceTap.r === tl.r) { confirmPlace(tl); lastPlaceTap = null; }
    else { lastPlaceTap = tl; sfx(canPlace(tl.c, tl.r) ? 'tap' : 'bad'); }
    return;
  }
  if (d.moved > 10) return;
  const tl = pxToTile(e.clientX, e.clientY);
  onTap(tl, pickItem(e.clientX, e.clientY) || (inGrid(tl.c, tl.r) ? itemAt(tl.c, tl.r) : null));
});
canvas.addEventListener('pointercancel', e => { ptrs.delete(e.pointerId); down = null; pinch = null; });
canvas.addEventListener('wheel', e => { e.preventDefault(); cam.zoom = Math.max(0.8, Math.min(2.6, cam.zoom * (e.deltaY < 0 ? 1.1 : 0.9))); layout(); }, { passive: false });

function onTap(tl, it) {
  if (mode === 'build') { selected = it || null; sfx('tap'); updateBuildBar(); return; }
  if (!it) return;
  if (it.type === 'stove') tapStove(it);
  else if (it.type === 'counter') { if (it.dish && it.n > 0) toast(RMAP[it.dish].icon + ' ' + nm(RMAP[it.dish]) + ' ×' + it.n); }
  else if (ITEMS[it.type].rating) toast(nm(ITEMS[it.type]) + ' (+' + ITEMS[it.type].rating + ' ⭐)');
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
function drawItemPreview(type) { const k = L; L = { ...L, tw: 70, th: 42 }; drawItem({ type }, 56, 84, 70, Date.now(), true); L = k; }
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
