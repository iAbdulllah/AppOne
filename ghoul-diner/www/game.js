/* Ghoul Diner — an original monster-restaurant management game.
 * All code, 3D models (built from primitives) and design are original to this project. */
import { createScene } from './js/scene3d.js';
import * as net from './js/net.js';
const $ = s => document.querySelector(s);
const canvas = $('#game');
const scene = createScene(canvas);
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
    welcome: 'Welcome back! Your stoves kept cooking.', about: 'An original game. All 3D art is built in code.',
    stats: 'Guests served: {0}', ready: 'Ready!',
    online: 'Online', offlineTitle: 'Online mode is not set up yet', offlineSub: 'Add your Supabase URL and key in js/config.js',
    yourName: 'Your diner name', save: 'Save', onlineNow: '🟢 {0} players online now', connecting: 'Connecting…', you: 'you',
    visit: 'Visit', netError: 'Connection problem', visitingX: "Visiting {0}'s diner", tipped: 'You left a tip for {0}! +5 XP',
    alreadyTipped: 'You already tipped this diner today', gotTips: 'You received {0} coins in tips from: {1}', home: 'Home', tip: 'Tip 💰'
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
    stats: 'میوانی خزمەتکراو: {0}', ready: 'ئامادەیە!',
    online: 'ئۆنلاین', offlineTitle: 'دۆخی ئۆنلاین هێشتا ڕێک نەخراوە', offlineSub: 'URL و کلیلی Supabase لە js/config.js دابنێ',
    yourName: 'ناوی چێشتخانەکەت', save: 'پاشەکەوت', onlineNow: '🟢 ئێستا {0} یاریزان ئۆنلاینن', connecting: 'پەیوەستبوون…', you: 'تۆ',
    visit: 'سەردان', netError: 'کێشەی پەیوەندی', visitingX: 'سەردانی چێشتخانەی {0}', tipped: 'بەخشیشت دا بە {0}! ‎+5 XP',
    alreadyTipped: 'ئەمڕۆ پێشتر بەخشیشت داوە بەم چێشتخانەیە', gotTips: '{0} پارەت وەک بەخشیش وەرگرت لە: {1}', home: 'ماڵەوە', tip: 'بەخشیش 💰'
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
let guests = [], waiters = [];
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
  if (x !== undefined) scene.floater(x, y, (n > 0 ? '+' : '') + n + ' 🪙', '#ffd25a');
}
function addXp(n) {
  S.xp += n;
  while (S.xp >= xpNeed(S.level)) {
    S.xp -= xpNeed(S.level);
    S.level++;
    const un = [...RECIPES.filter(r => r.lvl === S.level), ...Object.values(ITEMS).filter(i => i.lvl === S.level)].map(nm);
    toast(t('levelUp', S.level) + (un.length ? ' — ' + t('unlocked', un.join('، ')) : ''), 4000);
    sfx('level');
    scene.burst(grid().w / 2, grid().h / 2);
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
  scene.floater(st.c, st.r, r.icon + ' ×' + r.serv, '#7dff9a', 1.7);
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
      scene.floater(g.x, g.y, '💢', '#ff5f7a', 1.7);
      sfx('bad');
      leave(g);
    }
  } else if (g.state === 'eat') {
    g.timer -= dt;
    if (g.timer <= 0) {
      const r = RMAP[g.dish];
      const pay = Math.round(r.price * (1 + decorPoints() * 0.01) * (0.8 + 0.4 * g.patience / g.maxPat));
      addCoins(pay, g.x, g.y);
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
      if (p) p.pop(); // stop beside the counter
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
  if (p) p.pop(); // serve from the neighbouring tile
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
function layout() { scene.resize(); }
function resize() { scene.resize(); }

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
  const lay = visiting ? visiting.layout : S;
  const size = SIZES[lay.sizeIdx];
  const eating = new Map();
  if (!visiting) for (const g of guests) if (g.state === 'eat') eating.set(g.table, g.dish);
  scene.render({
    items: lay.items, size, door: { c: Math.floor(size.w / 2), r: size.h - 1 }, title: t('title'),
    guests, waiters, mode, placing, hover, selected, now, t: time, eating,
    stoveStatus, RMAP, canPlace, tut: S.tut, visiting: !!visiting,
  });
  hudT -= dt;
  if (hudT <= 0) { hudT = 0.2; updateHud(); }
  saveT -= dt;
  if (saveT <= 0) { saveT = 5; save(); publishProfile(false); }
  requestAnimationFrame(frame);
startNet();
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
const dist2 = () => { const [a, b] = [...ptrs.values()]; return Math.hypot(a.x - b.x, a.y - b.y) || 1; };
canvas.addEventListener('pointerdown', e => {
  try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 2) { pinch = { d: dist2() }; down = null; return; }
  down = { x: e.clientX, y: e.clientY, moved: 0 };
  scene.panStart(e.clientX, e.clientY);
  if (mode === 'place') hover = scene.tileAt(e.clientX, e.clientY);
});
canvas.addEventListener('pointermove', e => {
  if (!ptrs.has(e.pointerId)) { if (mode === 'place' && e.pointerType === 'mouse') hover = scene.tileAt(e.clientX, e.clientY); return; }
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && ptrs.size >= 2) { const d = dist2(); scene.zoomBy(d / pinch.d); pinch.d = d; return; }
  if (!down) return;
  down.moved = Math.max(down.moved, Math.hypot(e.clientX - down.x, e.clientY - down.y));
  if (mode === 'place') { hover = scene.tileAt(e.clientX, e.clientY); return; }
  if (down.moved > 8) scene.panMove(e.clientX, e.clientY);
});
canvas.addEventListener('pointerup', e => {
  ptrs.delete(e.pointerId);
  if (pinch) { if (ptrs.size < 2) pinch = null; down = null; return; }
  if (!down) return;
  const d = down; down = null;
  if (visiting) return;
  const tl = scene.tileAt(e.clientX, e.clientY);
  if (mode === 'place') {
    hover = tl;
    if (d.moved < 10 && lastPlaceTap && lastPlaceTap.c === tl.c && lastPlaceTap.r === tl.r) { confirmPlace(tl); lastPlaceTap = null; }
    else { lastPlaceTap = tl; sfx(canPlace(tl.c, tl.r) ? 'tap' : 'bad'); }
    return;
  }
  if (d.moved > 10) return;
  const id = scene.pickItemId(e.clientX, e.clientY);
  onTap(tl, (id !== null && itemById(id)) || (inGrid(tl.c, tl.r) ? itemAt(tl.c, tl.r) : null));
});
canvas.addEventListener('pointercancel', e => { ptrs.delete(e.pointerId); down = null; pinch = null; });
canvas.addEventListener('wheel', e => { e.preventDefault(); scene.zoomBy(e.deltaY < 0 ? 1.1 : 0.9); }, { passive: false });

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
  addCoins(sellValue(it), it.c, it.r);
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

function card({ icon, thumb, title, sub, locked, btn, onBuy, disabled }) {
  const el = document.createElement('div');
  el.className = 'card' + (locked ? ' locked' : '');
  const ic = document.createElement('div'); ic.className = 'ic';
  if (thumb) {
    const im = document.createElement('img'); im.src = thumb; im.alt = ''; im.width = 56; im.height = 56;
    ic.appendChild(im);
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
        thumb: scene.thumbnail(type),
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
  else if (a === 'online') openOnline();
}));

// ---------------------------------------------------------------- multiplayer
let visiting = null; // { id, name, layout }
function profile() {
  return { name: S.name || 'Ghoul', level: S.level, popularity: popularity(), served: S.served,
    layout: { sizeIdx: S.sizeIdx, items: S.items.map(({ id, type, c, r }) => ({ id, type, c, r })) } };
}
const publishProfile = force => net.publish(profile(), force).catch(() => {});
async function claimTips() {
  try {
    const r = await net.claimGifts();
    if (r && r.coins > 0) { addCoins(r.coins); toast(t('gotTips', r.coins, (r.names || []).join('، ')), 4000); sfx('coin'); save(); }
  } catch (e) { /* ignore */ }
}
async function startNet() {
  if (!net.enabled()) return;
  if (!S.name) { S.name = 'Ghoul' + Math.floor(1000 + Math.random() * 9000); save(); }
  const ok = await net.init(S.name);
  if (!ok) return;
  net.on('online', n => { const el = $('#onlineCount'); if (el) el.textContent = n; });
  net.on('tip', () => claimTips());
  await publishProfile(true);
  claimTips();
}
function sanitizeLayout(l) {
  const sizeIdx = Math.max(0, Math.min(SIZES.length - 1, (l && l.sizeIdx) | 0));
  const { w, h } = SIZES[sizeIdx];
  const items = ((l && Array.isArray(l.items)) ? l.items : []).slice(0, 200)
    .filter(i => i && ITEMS[i.type] && Number.isInteger(i.c) && Number.isInteger(i.r) && i.c >= 0 && i.r >= 0 && i.c < w && i.r < h)
    .map((i, k) => ({ id: 100000 + k, type: i.type, c: i.c, r: i.r }));
  return { sizeIdx, items };
}
function openOnline() {
  sfx('tap');
  openModal(t('online'), null, async body => {
    if (!net.enabled()) { body.appendChild(card({ icon: '🔌', title: t('offlineTitle'), sub: t('offlineSub') })); return; }
    const row = document.createElement('div'); row.className = 'row';
    const inp = document.createElement('input'); inp.className = 'inp'; inp.maxLength = 24; inp.value = S.name || ''; inp.placeholder = t('yourName');
    const sv = document.createElement('button'); sv.className = 'btn primary'; sv.textContent = t('save');
    sv.onclick = () => { const v = inp.value.trim().slice(0, 24); if (!v) return; S.name = v; save(); publishProfile(true); toast('✓ ' + v); };
    row.append(inp, sv); body.appendChild(row);
    const info = document.createElement('div'); info.className = 'muted';
    info.innerHTML = net.ready() ? t('onlineNow', '<b id="onlineCount">' + net.onlineCount() + '</b>') : t('connecting');
    body.appendChild(info);
    if (!net.ready()) return;
    try {
      const list = await net.leaderboard();
      list.forEach((d, i) => {
        const mine = d.id === net.myId();
        body.appendChild(card({
          icon: ['🥇', '🥈', '🥉'][i] || '🏚️', title: `${i + 1}. ${d.name}` + (mine ? ' (' + t('you') + ')' : ''),
          sub: `${t('lv')} ${d.level} · ⭐${d.popularity} · ❤️${d.likes}`,
          btn: mine ? null : t('visit'), onBuy: () => visit(d.id),
        }));
      });
    } catch (e) { body.appendChild(card({ icon: '⚠️', title: t('netError'), sub: String(e.message || e) })); }
  });
}
async function visit(id) {
  try {
    const d = await net.fetchDiner(id);
    closeModal(); setMode('play');
    visiting = { id, name: d.name, layout: sanitizeLayout(d.layout) };
    $('#visitName').textContent = t('visitingX', d.name);
    $('#visitbar').hidden = false;
    document.body.classList.add('visiting');
    sfx('place');
  } catch (e) { toast(t('netError')); }
}
function goHome() { visiting = null; $('#visitbar').hidden = true; document.body.classList.remove('visiting'); sfx('tap'); }
$('#vbHome').onclick = goHome;
$('#vbTip').onclick = async () => {
  if (!visiting) return;
  try {
    const n = await net.sendTip(visiting.id);
    if (n > 0) { addXp(5); toast(t('tipped', visiting.name)); sfx('coin'); const d = door(); scene.floater(d.c, d.r - 1, '❤️ +5 XP', '#ff9eb5'); }
    else toast(t('alreadyTipped'));
  } catch (e) { toast(t('netError')); }
};

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
window.__ghoulDebug = () => ({ guests, waiters, S, mode });
requestAnimationFrame(frame);
startNet();

