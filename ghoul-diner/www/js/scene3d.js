// Ghoul Diner — Three.js isometric scene (orthographic camera, toon lighting, sprites for UI bubbles).
import * as THREE from '../vendor/three.module.min.js';
import { CHARACTERS, buildItem, animateItem, buildRoom, buildOutside, dishMesh, canvasTex } from './models.js';

const EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const ISO_DIR = new THREE.Vector3(1, 1.05, 1).normalize();

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0817);
  scene.fog = new THREE.Fog(0x0d0817, 48, 75);

  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 200);
  const target = new THREE.Vector3(3, 0, 4);
  const view = { zoom: 1.75, w: 6, h: 8 };

  // lights
  scene.add(new THREE.HemisphereLight(0xb8adff, 0x3a2a4a, 1.6));
  scene.add(new THREE.AmbientLight(0x40305a, 0.6));
  const moon = new THREE.DirectionalLight(0xd2dcff, 1.6);
  moon.castShadow = true;
  moon.shadow.mapSize.set(1536, 1536);
  moon.shadow.camera.left = -12; moon.shadow.camera.right = 12; moon.shadow.camera.top = 12; moon.shadow.camera.bottom = -12;
  moon.shadow.bias = -0.0008; moon.shadow.normalBias = 0.02;
  scene.add(moon, moon.target);

  scene.add(buildOutside());
  const roomRoot = new THREE.Group(); scene.add(roomRoot);
  const itemRoot = new THREE.Group(); scene.add(itemRoot);
  const actorRoot = new THREE.Group(); scene.add(actorRoot);
  const fxRoot = new THREE.Group(); scene.add(fxRoot);

  // tile highlight & build grid
  const hl = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.96), new THREE.MeshBasicMaterial({ color: 0x7dff9a, transparent: true, opacity: 0.45, depthWrite: false }));
  hl.rotation.x = -Math.PI / 2; hl.position.y = 0.012; hl.visible = false; scene.add(hl);
  const selHl = hl.clone(); selHl.material = hl.material.clone(); scene.add(selHl);
  const doorHl = hl.clone(); doorHl.material = new THREE.MeshBasicMaterial({ color: 0xff5f7a, transparent: true, opacity: 0.35, depthWrite: false }); scene.add(doorHl);
  let gridLines = null;

  let roomKey = '';
  function setRoom(w, h, doorC, title) {
    const key = [w, h, doorC, title].join('|');
    if (key === roomKey) return;
    roomKey = key;
    roomRoot.clear();
    roomRoot.add(buildRoom(w, h, doorC, title));
    view.w = w; view.h = h;
    if (gridLines) scene.remove(gridLines);
    const pts = [];
    for (let c = 0; c <= w; c++) pts.push(c - 0.5, 0.015, -0.5, c - 0.5, 0.015, h - 0.5);
    for (let r = 0; r <= h; r++) pts.push(-0.5, 0.015, r - 0.5, w - 0.5, 0.015, r - 0.5);
    const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    gridLines = new THREE.LineSegments(gg, new THREE.LineBasicMaterial({ color: 0x7dff9a, transparent: true, opacity: 0.5 }));
    gridLines.visible = false; scene.add(gridLines);
    target.set((w - 1) / 2, 0, (h - 1) / 2);
    resize();
  }

  function resize() {
    const W = window.innerWidth, H = window.innerHeight;
    renderer.setSize(W, H, false);
    const aspect = W / H;
    const span = (view.w + view.h) * 0.75 + 1.5;
    const vh = Math.max(span / aspect, span * 0.75);
    camera.left = -vh * aspect / 2; camera.right = vh * aspect / 2; camera.top = vh / 2; camera.bottom = -vh / 2;
    camera.zoom = view.zoom;
    camera.updateProjectionMatrix();
  }
  function placeCamera() {
    camera.position.copy(target).addScaledVector(ISO_DIR, 50);
    camera.lookAt(target);
    moon.position.set(target.x - 5, 12, target.z + 3);
    moon.target.position.copy(target);
  }

  // ---------------------------------------------------------------- sprites (bubbles, rings, badges, floaters)
  function bubbleTex(symbol, barFrac, barCol) {
    const key = `b|${symbol}|${barFrac}|${barCol}`;
    return canvasTex(key, 128, 150, (c) => {
      c.fillStyle = '#fff'; c.strokeStyle = '#1c1026'; c.lineWidth = 7;
      c.beginPath(); c.roundRect(8, 8, 112, 96, 30); c.moveTo(48, 100); c.lineTo(64, 128); c.lineTo(78, 100); c.fill(); c.stroke();
      c.fillStyle = '#fff'; c.fillRect(46, 92, 34, 12);
      c.font = /\p{Extended_Pictographic}/u.test(symbol) ? `60px ${EMOJI}` : `900 64px system-ui`;
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = barCol || '#2fae55';
      c.fillText(symbol, 64, 60);
      if (barFrac !== undefined && barFrac !== null) {
        c.fillStyle = '#1c1026'; c.beginPath(); c.roundRect(14, 132, 100, 16, 8); c.fill();
        c.fillStyle = barCol; c.beginPath(); c.roundRect(17, 135, Math.max(6, 94 * barFrac / 10), 10, 5); c.fill();
      }
    });
  }
  function ringTex(icon, step) {
    return canvasTex(`r|${icon}|${step}`, 128, 128, (c) => {
      c.fillStyle = 'rgba(28,16,38,.85)'; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill();
      c.lineCap = 'round'; c.lineWidth = 12;
      c.strokeStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.arc(64, 64, 46, 0, 7); c.stroke();
      c.strokeStyle = '#7dff9a'; c.beginPath(); c.arc(64, 64, 46, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * step / 24); c.stroke();
      c.font = `48px ${EMOJI}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(icon, 64, 68);
    });
  }
  function badgeTex(n) {
    return canvasTex(`n|${n}`, 96, 96, (c) => {
      c.fillStyle = '#ffd25a'; c.strokeStyle = '#1c1026'; c.lineWidth = 8;
      c.beginPath(); c.arc(48, 48, 38, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#1c1026'; c.font = '900 40px system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(n, 48, 51);
    });
  }
  function textTex(text, color) {
    return canvasTex(`t|${text}|${color}`, 256, 96, (c) => {
      c.font = `900 52px system-ui, ${EMOJI}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.lineWidth = 10; c.strokeStyle = '#1c1026'; c.lineJoin = 'round'; c.strokeText(text, 128, 50);
      c.fillStyle = color; c.fillText(text, 128, 50);
    });
  }
  function sprite(scale = 0.6) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthTest: false }));
    s.renderOrder = 10; s.scale.set(scale, scale, 1);
    return s;
  }
  function setSprite(s, tex, sx, sy) {
    if (s.material.map !== tex) { s.material.map = tex; s.material.needsUpdate = true; }
    if (sx) s.scale.set(sx, sy || sx, 1);
    s.visible = true;
  }

  // ---------------------------------------------------------------- items
  const itemMeshes = new Map(); // id -> group
  function syncItems(items, fc) {
    const seen = new Set();
    for (const it of items) {
      seen.add(it.id);
      let g = itemMeshes.get(it.id);
      if (!g || g.userData.type !== it.type) {
        if (g) itemRoot.remove(g);
        g = buildItem(it.type);
        g.userData.type = it.type; g.userData.itemId = it.id;
        g.userData.sprite = sprite(); g.add(g.userData.sprite);
        g.userData.badge = sprite(0.3); g.add(g.userData.badge);
        itemRoot.add(g); itemMeshes.set(it.id, g);
      }
      g.position.set(it.c, 0, it.r);
      g.visible = !(fc.placing && fc.placing.item === it);
      const ud = g.userData;
      const status = it.type === 'stove' ? fc.stoveStatus(it, fc.now) : null;
      animateItem(g, it, fc.t, status);
      ud.sprite.visible = false; ud.badge.visible = false;
      const top = (ud.height || 1) + 0.45;
      if (it.type === 'stove' && !fc.visiting) {
        if (status === 'cooking') {
          const r = fc.RMAP[it.cook.rid];
          const frac = 1 - (it.cook.end - fc.now) / (r.time * 1000);
          setSprite(ud.sprite, ringTex(r.icon, Math.max(0, Math.min(24, Math.floor(frac * 24)))), 0.62);
          ud.sprite.position.set(0, top + 0.1, 0);
        } else if (status === 'ready') {
          setSprite(ud.sprite, bubbleTex(fc.RMAP[it.ready.rid].icon), 0.62, 0.73);
          ud.sprite.position.set(0, top + 0.15 + Math.abs(Math.sin(fc.t * 4)) * 0.12, 0);
        } else if (status === 'spoiled') {
          setSprite(ud.sprite, bubbleTex('🦠'), 0.55, 0.64); ud.sprite.position.set(0, top + 0.1, 0);
        } else if (fc.tut === 0) {
          setSprite(ud.sprite, bubbleTex('👇'), 0.55, 0.64); ud.sprite.position.set(0, top + 0.1 + Math.sin(fc.t * 5) * 0.08, 0);
        }
      }
      if (it.type === 'counter') {
        const want = it.dish && it.n > 0 ? it.dish : null;
        if (ud.dishKey !== want) {
          ud.dishSpot.clear(); ud.dishKey = want;
          if (want) { const d = dishMesh(want); d.scale.setScalar(1.6); ud.dishSpot.add(d); }
        }
        if (want) { setSprite(ud.badge, badgeTex(it.n), 0.32); ud.badge.position.set(0.32, 1.15, 0.32); }
      }
      if (ud.seat) {
        const want = fc.eating.get(it.id) || null;
        if (ud.dishKey !== want) {
          ud.dishSpot.clear(); ud.dishKey = want;
          if (want) { const d = dishMesh(want); d.position.set(-0.05, 0, -0.05); ud.dishSpot.add(d); }
        }
      }
    }
    for (const [id, g] of itemMeshes) if (!seen.has(id)) { itemRoot.remove(g); itemMeshes.delete(id); }
  }

  // ---------------------------------------------------------------- actors
  const actorMeshes = new Map(); // obj -> group
  function syncActors(list, kindOf, fc, isWaiter) {
    for (const a of list) {
      let g = actorMeshes.get(a);
      if (!g) {
        g = CHARACTERS[kindOf(a)]();
        g.userData.bub = sprite(0.6); g.add(g.userData.bub);
        g.userData.last = new THREE.Vector3(a.x, 0, a.y);
        actorRoot.add(g); actorMeshes.set(a, g);
      }
      g.visible = !fc.visiting;
      const ud = g.userData;
      const seated = !isWaiter && (a.state === 'wait' || a.state === 'eat');
      if (seated) {
        const tm = itemMeshes.get(a.table);
        const seat = tm && tm.userData.seat;
        g.position.set(a.x + (seat ? seat.x : 0), seat ? seat.y : 0, a.y + (seat ? seat.z : 0));
        g.rotation.y = Math.PI / 4;
      } else {
        g.position.set(a.x, 0, a.y);
        const dx = a.x - ud.last.x, dz = a.y - ud.last.z;
        if (Math.abs(dx) + Math.abs(dz) > 0.001) {
          const want = Math.atan2(dx, dz);
          let d = want - g.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
          g.rotation.y += d * 0.3;
        }
      }
      ud.last.set(a.x, 0, a.y);
      ud.animate(fc.t, !!a.walking, seated, a.ph || 0);
      if (isWaiter) {
        ud.tray.visible = !!a.dish;
        if (ud.trayDish !== a.dish) {
          if (ud.trayMesh) ud.tray.remove(ud.trayMesh);
          ud.trayMesh = a.dish ? dishMesh(a.dish) : null;
          if (ud.trayMesh) { ud.trayMesh.position.y = 0.01; ud.tray.add(ud.trayMesh); }
          ud.trayDish = a.dish;
        }
        ud.arms.forEach(arm => { if (a.dish) arm.rotation.x = -1.2; });
        ud.bub.visible = false;
      } else {
        ud.bub.visible = false;
        if (a.state === 'wait') {
          const frac = Math.max(0, a.patience / a.maxPat);
          const col = frac > .5 ? '#2fae55' : frac > .25 ? '#e0a400' : '#e0304a';
          setSprite(ud.bub, bubbleTex(a.assigned ? '♥' : '?', Math.ceil(frac * 10), col), 0.5, 0.59);
          ud.bub.position.set(0, 1.55, 0);
        }
      }
    }
    return new Set(list);
  }

  // ---------------------------------------------------------------- floaters
  const floaters = [];
  function floater(c, r, text, color, y = 1.4) {
    const s = sprite(); s.material = s.material.clone();
    setSprite(s, textTex(text, color), 1.1, 0.41);
    s.position.set(c, y, r); fxRoot.add(s);
    floaters.push({ s, t: 0, y });
  }
  const confetti = [];
  function burst(c, r) {
    for (let i = 0; i < 40; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.05), new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.9, 0.6) }));
      m.position.set(c, 1.5, r);
      fxRoot.add(m);
      confetti.push({ m, v: new THREE.Vector3((Math.random() - .5) * 4, 3 + Math.random() * 3, (Math.random() - .5) * 4), t: 0 });
    }
  }

  // ---------------------------------------------------------------- ghost item for placement
  let ghost = null, ghostType = null;
  function ghostFor(type) {
    if (ghostType === type) return ghost;
    if (ghost) scene.remove(ghost);
    ghost = buildItem(type); ghostType = type;
    ghost.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = 0.6; o.castShadow = false; } if (o.isLight) o.intensity = 0; });
    scene.add(ghost);
    return ghost;
  }

  // ---------------------------------------------------------------- frame
  let lastT = 0;
  function render(fc) {
    const dt = Math.min(0.1, fc.t - lastT); lastT = fc.t;
    setRoom(fc.size.w, fc.size.h, fc.door.c, fc.title);
    placeCamera();
    syncItems(fc.items, fc);
    const alive = new Set([
      ...syncActors(fc.guests, g => g.kind, fc, false),
      ...syncActors(fc.waiters, () => 'waiter', fc, true),
    ]);
    for (const [a, g] of actorMeshes) if (!alive.has(a)) { actorRoot.remove(g); actorMeshes.delete(a); }
    // build-mode overlays
    gridLines.visible = fc.mode !== 'play';
    doorHl.visible = fc.mode !== 'play';
    doorHl.position.set(fc.door.c, 0.013, fc.door.r);
    selHl.visible = !!fc.selected;
    if (fc.selected) { selHl.position.set(fc.selected.c, 0.014, fc.selected.r); selHl.material.opacity = 0.35 + Math.sin(fc.t * 6) * 0.15; }
    const showGhost = fc.mode === 'place' && fc.hover;
    hl.visible = !!showGhost;
    if (ghost) ghost.visible = false;
    if (showGhost) {
      const ok = fc.canPlace(fc.hover.c, fc.hover.r);
      hl.material.color.setHex(ok ? 0x7dff9a : 0xff5f7a);
      hl.position.set(fc.hover.c, 0.016, fc.hover.r);
      const gh = ghostFor(fc.placing.item ? fc.placing.item.type : fc.placing.type);
      gh.visible = true; gh.position.set(fc.hover.c, 0, fc.hover.r);
    }
    // fx
    for (let i = floaters.length - 1; i >= 0; i--) {
      const f = floaters[i]; f.t += dt;
      f.s.position.y = f.y + f.t * 0.9; f.s.material.opacity = Math.max(0, 1 - f.t / 1.4);
      if (f.t > 1.4) { fxRoot.remove(f.s); f.s.material.dispose(); floaters.splice(i, 1); }
    }
    for (let i = confetti.length - 1; i >= 0; i--) {
      const p = confetti[i]; p.t += dt; p.v.y -= 9 * dt;
      p.m.position.addScaledVector(p.v, dt); p.m.rotation.x += dt * 8; p.m.rotation.z += dt * 6;
      if (p.t > 2.5) { fxRoot.remove(p.m); confetti.splice(i, 1); }
    }
    renderer.render(scene, camera);
  }

  // ---------------------------------------------------------------- picking & camera control
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  function setRay(x, y) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  }
  function groundAt(x, y) { setRay(x, y); const p = new THREE.Vector3(); return ray.ray.intersectPlane(ground, p) ? p : null; }
  function tileAt(x, y) { const p = groundAt(x, y); return p ? { c: Math.round(p.x), r: Math.round(p.z) } : { c: -99, r: -99 }; }
  function pickItemId(x, y) {
    setRay(x, y);
    const hits = ray.intersectObjects(itemRoot.children, true);
    for (const h of hits) {
      let o = h.object;
      while (o && o.userData.itemId === undefined) o = o.parent;
      if (o && o.visible) return o.userData.itemId;
    }
    return null;
  }
  let panPrev = null;
  function panStart(x, y) { panPrev = groundAt(x, y); }
  function panMove(x, y) {
    const p = groundAt(x, y);
    if (!p || !panPrev) return;
    target.x += panPrev.x - p.x; target.z += panPrev.z - p.z;
    target.x = Math.max(-2, Math.min(view.w + 1, target.x));
    target.z = Math.max(-2, Math.min(view.h + 1, target.z));
    placeCamera();
    panPrev = groundAt(x, y);
  }
  function zoomBy(f) { view.zoom = Math.max(0.6, Math.min(3, view.zoom * f)); camera.zoom = view.zoom; camera.updateProjectionMatrix(); }

  // ---------------------------------------------------------------- shop thumbnails
  let thumbR = null; const thumbs = new Map();
  function thumbnail(type) {
    if (thumbs.has(type)) return thumbs.get(type);
    if (!thumbR) {
      thumbR = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      thumbR.setSize(128, 128); thumbR.outputColorSpace = THREE.SRGBColorSpace;
      thumbR.toneMapping = THREE.ACESFilmicToneMapping;
    }
    const s = new THREE.Scene();
    s.add(new THREE.HemisphereLight(0xffffff, 0x443366, 2.2));
    const dl = new THREE.DirectionalLight(0xffffff, 1.5); dl.position.set(2, 4, 3); s.add(dl);
    const m = buildItem(type); s.add(m);
    const cam = new THREE.OrthographicCamera(-0.75, 0.75, 0.75, -0.75, 0.1, 20);
    cam.position.copy(new THREE.Vector3(0, 0.45, 0)).addScaledVector(ISO_DIR, 6); cam.lookAt(0, 0.45, 0);
    thumbR.render(s, cam);
    const url = thumbR.domElement.toDataURL();
    thumbs.set(type, url);
    return url;
  }

  window.addEventListener('resize', resize);
  resize();
  return { render, resize, tileAt, pickItemId, panStart, panMove, zoomBy, floater, burst, thumbnail };
}
