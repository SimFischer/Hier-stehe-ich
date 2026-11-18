// Schrittarten der Bonusspiele: Silbenrätsel, Druckerpresse, Fahrt durch den Wald, Lutherrose, Nachdenken.
// Wie überall: oben die Regeln (in Node testbar), unten die Anzeige.
import { h, setzeInhalt, knopf, rich, fuelle } from '../engine/ui.js';
import { bildHtml, bildUrl } from '../engine/bilder.js';

// ---------- Silbenrätsel ----------
export const silbenRules = {
  /** Alle Silben, alphabetisch gemischt. */
  vorrat: (s) => s.fragen.flatMap((f, fi) => f.silben.map((text, si) => ({ id: `${fi}-${si}`, text })))
    .sort((a, b) => a.text.localeCompare(b.text, 'de') || a.id.localeCompare(b.id)),
  start: () => ({ nr: 0, gelegt: [], verbraucht: [], fehler: 0, letzte: null }),
  zug(z, s, silbeId) {
    const silbe = silbenRules.vorrat(s).find((x) => x.id === silbeId);
    if (!silbe || z.verbraucht.includes(silbeId) || silbenRules.fertig(z, s)) return z;
    const frage = s.fragen[z.nr];
    if (silbe.text !== frage.silben[z.gelegt.length]) return { ...z, gelegt: [], fehler: z.fehler + 1, letzte: 'falsch' };
    const gelegt = [...z.gelegt, silbeId];
    if (gelegt.length < frage.silben.length) return { ...z, gelegt, letzte: 'gut' };
    return { ...z, nr: z.nr + 1, gelegt: [], verbraucht: [...z.verbraucht, ...gelegt], letzte: 'wort' };
  },
  fertig: (z, s) => z.nr >= s.fragen.length
};

export function silben(el, schritt, ctx, fertig) {
  let z = silbenRules.start();
  const vorrat = silbenRules.vorrat(schritt);
  const zeichne = () => {
    const ende = silbenRules.fertig(z, schritt);
    setzeInhalt(el,
      h('p', { class: 'anweisung' }, schritt.anweisung),
      h('ol', { class: 'silben-liste' }, schritt.fragen.map((f, i) => h('li', { class: i < z.nr ? 'fertig' : i === z.nr ? 'aktiv' : '' },
        h('span', {}, f.frage), ' ',
        h('strong', {}, i < z.nr ? f.silben.join('') : i === z.nr ? `${z.gelegt.map((id) => vorrat.find((v) => v.id === id).text).join('')} …` : ''))),
      ),
      h('div', { class: 'silben-vorrat' }, vorrat.map((v) => h('button', { type: 'button', class: 'wahlknopf silbe',
        disabled: ende || z.verbraucht.includes(v.id) || z.gelegt.includes(v.id), onclick: () => { z = silbenRules.zug(z, schritt, v.id); zeichne(); } }, v.text))),
      h('div', { class: 'reihe fuss' },
        h('p', { class: `rueck${z.letzte === 'falsch' ? ' offen' : ''}`, role: 'status' }, ende ? schritt.ende : z.letzte === 'falsch' ? schritt.falsch : ''),
        ende ? knopf(ctx.t.weiter, () => fertig({}), 'haupt') : null));
  };
  zeichne();
}

// ---------- Gemeinsam: Bestwerte auf diesem Gerät ----------
function bestwert(id, wert, kleinerBesser) {
  const schluessel = `hier-stehe-ich.best.${id}`;
  let alt = null;
  try { alt = JSON.parse(localStorage.getItem(schluessel)); } catch { /* privat: kein Bestwert */ }
  if (wert == null) return alt;
  const besser = alt == null || (kleinerBesser ? wert < alt : wert > alt);
  if (besser) try { localStorage.setItem(schluessel, JSON.stringify(wert)); } catch { /* egal */ }
  return besser ? wert : alt;
}
const ladeBild = (name) => { const url = bildUrl(name); if (!url) return null; const i = new Image(); i.src = url; return i; };

// ---------- Druckerpresse: Taktspiel ----------
export const presseRules = {
  /** Liegt der Zeiger (0–1) in der grünen Zone? */
  treffer: (zeiger, mitte, breite) => Math.abs(zeiger - mitte) <= breite / 200,
  takt: (s, blaetter) => Math.min(s.takt.max, s.takt.start + s.takt.plus * blaetter),
  zone: (s, blaetter) => Math.max(s.zone.min, s.zone.start - s.zone.minus * blaetter),
  /** Zeiger läuft hin und her: Phase 0–1 vorwärts, 1–2 zurück. */
  zeiger: (phase) => { const p = phase % 2; return p <= 1 ? p : 2 - p; },
  start: () => ({ schritt: 0, blaetter: 0, fehler: 0 }),
  druecke(z, s, getroffen) {
    if (!getroffen) return { ...z, schritt: 0, fehler: z.fehler + 1, letzte: 'daneben' };
    const schritt = z.schritt + 1;
    return schritt >= s.schritte.length ? { ...z, schritt: 0, blaetter: z.blaetter + 1, letzte: 'blatt' } : { ...z, schritt, letzte: 'treffer' };
  }
};

export function presse(el, schritt, ctx, fertig) {
  const t = ctx.t;
  let z = presseRules.start();
  let rest = schritt.sekunden, phase = 0, mitte = 0.5, laeuft = false, vorbei = false, letzt = 0, raf = 0;
  const bild = h('div', { class: 'presse-bild', 'aria-hidden': 'true' });
  const zone = h('span', { class: 'p-zone' });
  const zeigerEl = h('span', { class: 'p-zeiger' });
  const leiste = h('div', { class: 'p-leiste', 'aria-hidden': 'true' }, zone, zeigerEl);
  const info = h('div', { class: 'zaehler' });
  const meldung = h('p', { class: 'rueck', role: 'status' });
  const stapel = h('div', { class: 'presse-stapel', 'aria-hidden': 'true' });
  const druck = knopf(schritt.knopf, () => tippe(), 'haupt gross p-knopf', { disabled: true });
  const startKnopf = knopf(schritt.start, () => los(), 'haupt gross');
  const unten = h('div', { class: 'reihe fuss' }, meldung);
  const zeigeInfo = () => {
    setzeInhalt(info, h('span', {}, fuelle(schritt.zeit, { n: Math.max(0, Math.ceil(rest)) })), h('span', {}, fuelle(schritt.jetzt, { schritt: schritt.schritte[z.schritt] })),
      h('strong', {}, fuelle(schritt.zaehler, { n: z.blaetter })));
    bild.innerHTML = bildHtml(schritt.bilder[z.schritt]);
    const breite = presseRules.zone(schritt, z.blaetter);
    zone.style.left = `${(mitte * 100) - breite / 2}%`; zone.style.width = `${breite}%`;
  };
  function tippe() {
    if (!laeuft) return;
    const breite = presseRules.zone(schritt, z.blaetter);
    const getroffen = presseRules.treffer(presseRules.zeiger(phase), mitte, breite);
    const vorher = z.blaetter;
    z = presseRules.druecke(z, schritt, getroffen);
    if (!getroffen) { rest -= schritt.strafe; meldung.textContent = schritt.fehldruck; meldung.className = 'rueck offen'; leiste.classList.remove('wackeln'); void leiste.offsetWidth; leiste.classList.add('wackeln'); }
    else { meldung.textContent = ''; meldung.className = 'rueck'; mitte = 0.2 + Math.random() * 0.6; }
    if (z.blaetter > vorher) stapel.append(h('span', { class: 'neu' }));
    zeigeInfo();
  }
  const taste = (e) => { if (e.code === 'Space' && laeuft) { e.preventDefault(); tippe(); } };
  function schleife(ms) {
    if (!el.isConnected) { stop(); return; }
    const dt = letzt ? (ms - letzt) / 1000 : 0; letzt = ms;
    if (laeuft) {
      phase += dt * presseRules.takt(schritt, z.blaetter) * 2;
      rest -= dt;
      zeigerEl.style.left = `${presseRules.zeiger(phase) * 100}%`;
      if (Math.ceil(rest) !== Math.ceil(rest + dt)) zeigeInfo();
      if (rest <= 0) return ende();
    }
    raf = requestAnimationFrame(schleife);
  }
  function stop() { laeuft = false; cancelAnimationFrame(raf); document.removeEventListener('keydown', taste); }
  function los() { startKnopf.remove(); druck.disabled = false; druck.focus(); laeuft = true; letzt = 0; document.addEventListener('keydown', taste); raf = requestAnimationFrame(schleife); }
  function ende() {
    stop(); vorbei = true; rest = 0; druck.disabled = true; zeigeInfo();
    const best = bestwert('presse', z.blaetter, false);
    meldung.className = 'rueck'; setzeInhalt(meldung, fuelle(schritt.ende, { n: z.blaetter }), ' ', h('strong', {}, fuelle(schritt.bestwert, { n: best })));
    unten.append(knopf(t.nochmal, () => presse(el, schritt, ctx, fertig), 'still'), knopf(t.weiter, () => fertig({}), 'haupt'));
  }
  const best = bestwert('presse');
  zeigeInfo();
  setzeInhalt(el, h('p', { class: 'anweisung' }, schritt.anweisung), info,
    h('div', { class: 'presse-feld' }, bild, h('div', { class: 'presse-steuer' }, leiste, h('div', { class: 'reihe mitte' }, startKnopf, druck),
      best != null ? h('p', { class: 'klein' }, fuelle(schritt.bestwert, { n: best })) : null, stapel)), unten);
  if (vorbei) ende();
}

// ---------- Entführung: Steuerspiel von oben ----------
const RAD = Math.PI / 180;
export const fahrtRules = {
  /** Lage und Blickrichtung einer Wache zur Zeit t (Sekunden). */
  wachePos(w, t) {
    if (w.posten) {
      const mitte = (w.von + w.bis) / 2, halb = (w.bis - w.von) / 2;
      return { x: w.posten[0], y: w.posten[1], a: (mitte + halb * Math.sin(t * w.schwenk)) * RAD };
    }
    const p = w.weg; const laengen = []; let gesamt = 0;
    for (let i = 0; i < p.length - 1; i++) { const l = Math.hypot(p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1]); laengen.push(l); gesamt += l; }
    let d = (t * w.tempo) % (2 * gesamt); const zurueck = d > gesamt; if (zurueck) d = 2 * gesamt - d;
    for (let i = 0; i < laengen.length; i++) {
      if (d <= laengen[i] || i === laengen.length - 1) {
        const f = laengen[i] ? Math.min(1, d / laengen[i]) : 0;
        const [ax, ay] = p[i], [bx, by] = p[i + 1];
        const a = Math.atan2(by - ay, bx - ax) + (zurueck ? Math.PI : 0);
        return { x: ax + (bx - ax) * f, y: ay + (by - ay) * f, a };
      }
      d -= laengen[i];
    }
    return { x: p[0][0], y: p[0][1], a: 0 };
  },
  /** Steht der Wagen im Blickkegel der Wache? Ganz nah wird man immer gesehen. */
  gesehen(p, w, sicht) {
    const dx = p.x - w.x, dy = p.y - w.y, d = Math.hypot(dx, dy);
    if (d > sicht.weite) return false;
    if (d < 45) return true;
    let diff = Math.atan2(dy, dx) - w.a;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    return Math.abs(diff) <= sicht.winkel * RAD;
  },
  /** Nächster Punkt auf einer Strecke. */
  aufStrecke(p, [[ax, ay], [bx, by]]) {
    const vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy;
    const f = l2 ? Math.max(0, Math.min(1, ((p.x - ax) * vx + (p.y - ay) * vy) / l2)) : 0;
    return { x: ax + vx * f, y: ay + vy * f };
  },
  /** Nächster Punkt auf dem ganzen Wegenetz und wie weit er entfernt ist. */
  naechster(p, wege) {
    let best = null;
    for (const w of wege) { const q = fahrtRules.aufStrecke(p, w); const d = Math.hypot(q.x - p.x, q.y - p.y); if (!best || d < best.d) best = { ...q, d, weg: w }; }
    return best;
  },
  /** Ein Schritt in Richtung dx, dy. Mit Wegen: Wer vom Weg abkommt, wird auf den Weg zurückgeschoben (gleitet an der Kante entlang). */
  bewege(p, dx, dy, weite, welt, wege = null, breite = 0) {
    const l = Math.hypot(dx, dy); if (!l) return p;
    const s = Math.min(weite, l);
    let n = { x: Math.max(30, Math.min(welt.w - 30, p.x + (dx / l) * s)), y: Math.max(30, Math.min(welt.h - 30, p.y + (dy / l) * s)) };
    if (wege) {
      const q = fahrtRules.naechster(n, wege);
      const rand = breite / 2 - 8;
      if (q.d > rand) { const f = rand / q.d; n = { x: q.x + (n.x - q.x) * f, y: q.y + (n.y - q.y) * f }; }
    }
    if (Math.hypot(n.x - p.x, n.y - p.y) < 0.01) return p;
    return { ...n, a: Math.atan2(n.y - p.y, n.x - p.x) };
  },
  /** Nächster Wegpunkt auf dem kürzesten Weg über das Wegenetz zum Ziel (für Finger und Testfahrer). */
  naechsterZiel(p, ziel, wege) {
    const key = ([x, y]) => `${x},${y}`;
    const knoten = new Map();
    const kante = (a, b) => { const d = Math.hypot(a[0] - b[0], a[1] - b[1]); for (const [u, v] of [[a, b], [b, a]]) { if (!knoten.has(key(u))) knoten.set(key(u), { pt: u, nb: [] }); knoten.get(key(u)).nb.push({ k: key(v), d }); } };
    for (const [a, b] of wege) kante(a, b);
    const von = fahrtRules.naechster(p, wege); const nach = fahrtRules.naechster(ziel, wege);
    const P = [von.x, von.y], Z = [nach.x, nach.y];
    if (von.weg === nach.weg) return { x: Z[0], y: Z[1] };
    kante(P, von.weg[0]); kante(P, von.weg[1]); kante(Z, nach.weg[0]); kante(Z, nach.weg[1]);
    // Dijkstra
    const dist = new Map([[key(P), 0]]); const vor = new Map(); const offen = new Set([key(P)]);
    while (offen.size) {
      let u = null; for (const k of offen) if (u == null || dist.get(k) < dist.get(u)) u = k;
      offen.delete(u); if (u === key(Z)) break;
      for (const { k, d } of knoten.get(u).nb) { const nd = dist.get(u) + d; if (nd < (dist.get(k) ?? Infinity)) { dist.set(k, nd); vor.set(k, u); offen.add(k); } }
    }
    let k = key(Z); if (!vor.has(k)) return { x: Z[0], y: Z[1] };
    while (vor.get(k) !== key(P)) k = vor.get(k);
    const pt = knoten.get(k).pt; return { x: pt[0], y: pt[1] };
  },
  /** Fahre auf den Wegen in Richtung Ziel. */
  fahreZu(p, ziel, weite, s) {
    if (!s.wege) return fahrtRules.bewege(p, ziel.x - p.x, ziel.y - p.y, weite, s.welt);
    const z = fahrtRules.naechsterZiel(p, ziel, s.wege);
    return fahrtRules.bewege(p, z.x - p.x, z.y - p.y, weite, s.welt, s.wege, s.wegBreite);
  },
  amZiel: (p, ziel) => Math.hypot(p.x - ziel.x, p.y - ziel.y) <= ziel.r
};

export function fahrt(el, basis, ctx, fertig) {
  const t = ctx.t, W = basis.welt;
  // Stufe: Leicht nimmt den Schritt, wie er ist; Schwer legt die Werte aus basis.schwer darüber.
  let schritt = basis, stufe = 'leicht';
  const bestId = () => (stufe === 'leicht' ? 'fahrt' : `fahrt-${stufe}`);
  const bilder = { wald: ladeBild(W.bild), wagen: ladeBild(schritt.wagen), spitzel: ladeBild(schritt.spitzel), burg: ladeBild(schritt.burg) };
  const leinwand = h('canvas', { width: W.w, height: W.h, class: 'fahrt-leinwand', 'aria-label': schritt.anweisung });
  const g = leinwand.getContext('2d');
  const info = h('div', { class: 'zaehler' });
  const meldung = h('p', { class: 'rueck', role: 'status' });
  const unten = h('div', { class: 'reihe fuss' }, meldung);
  // Vor dem Start: Wahl der Stufe (ohne Stufen nur ein Los-Knopf)
  const startKnopf = basis.stufen
    ? h('div', { class: 'fahrt-start fahrt-stufen' }, h('p', {}, basis.stufeFrage),
      h('div', { class: 'reihe mitte' }, ...basis.stufen.map((s) => h('button', { type: 'button', class: `knopf ${s.id === 'leicht' ? 'still' : 'haupt'} fahrt-stufe`, onclick: () => los(s.id) },
        h('strong', {}, s.knopf), h('span', {}, s.kurz),
        bestwert(s.id === 'leicht' ? 'fahrt' : `fahrt-${s.id}`) != null ? h('small', {}, fuelle(basis.bestwert, { n: bestwert(s.id === 'leicht' ? 'fahrt' : `fahrt-${s.id}`) })) : null))))
    : knopf(schritt.startKnopf, () => los(), 'haupt gross fahrt-start');
  let p = { ...schritt.start, a: 0 }, rast = 0, zeit = 0, erwischt = 0, laeuft = false, fertigGefahren = false, letzt = 0, raf = 0, blitz = 0;
  const tasten = new Set(); let ziel = null;
  const zeigeInfo = () => setzeInhalt(info, laeuft && basis.stufeName ? h('span', {}, basis.stufeName[stufe]) : null,
    h('span', {}, fuelle(schritt.zeit, { n: Math.floor(zeit) })), h('span', {}, fuelle(schritt.erwischt, { n: erwischt })),
    laeuft && bestwert(bestId()) != null ? h('strong', {}, fuelle(schritt.bestwert, { n: bestwert(bestId()) })) : null);
  const weltPunkt = (e) => { const r = leinwand.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W.w, y: ((e.clientY - r.top) / r.height) * W.h }; };
  leinwand.addEventListener('pointerdown', (e) => { if (!laeuft) return; leinwand.setPointerCapture(e.pointerId); ziel = weltPunkt(e); });
  leinwand.addEventListener('pointermove', (e) => { if (ziel) ziel = weltPunkt(e); });
  const loslassen = () => { ziel = null; };
  leinwand.addEventListener('pointerup', loslassen); leinwand.addEventListener('pointercancel', loslassen);
  const PFEILE = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1], KeyA: [-1, 0], KeyD: [1, 0], KeyW: [0, -1], KeyS: [0, 1] };
  const runter = (e) => { if (PFEILE[e.code] && laeuft) { e.preventDefault(); tasten.add(e.code); } };
  const hoch = (e) => tasten.delete(e.code);

  function bildMittig(img, x, y, b, winkel = 0) {
    if (!img?.complete || !img.naturalWidth) return false;
    const hgt = (b * img.naturalHeight) / img.naturalWidth;
    g.save(); g.translate(x, y); g.rotate(winkel); g.drawImage(img, -b / 2, -hgt / 2, b, hgt); g.restore(); return true;
  }
  // Ring als Markierung: Was wichtig ist, leuchtet vor dem gedämpften Wald.
  function ring(x, y, r, farbe, breite = 6) { g.beginPath(); g.arc(x, y, r, 0, 2 * Math.PI); g.lineWidth = breite; g.strokeStyle = farbe; g.stroke(); }
  function male() {
    // Wald blasser zeichnen (Graufilter, wo das Gerät ihn kann), dann abdunkeln
    if (bilder.wald?.complete && bilder.wald.naturalWidth) { g.save(); g.filter = 'saturate(0.3) brightness(0.9)'; g.drawImage(bilder.wald, 0, 0, W.w, W.h); g.restore(); } else { g.fillStyle = '#3e5b45'; g.fillRect(0, 0, W.w, W.h); }
    // Der Wald tritt zurück: dunkler und blasser, damit Wagen und Spitzel klar zu sehen sind.
    g.fillStyle = 'rgba(24, 30, 22, 0.5)'; g.fillRect(0, 0, W.w, W.h);
    // Die Wege: heller Sandweg mit dunklem Rand, gut zu sehen
    if (schritt.wege) {
      g.lineCap = 'round'; g.lineJoin = 'round';
      for (const [breite, farbe] of [[schritt.wegBreite + 14, '#3a2717'], [schritt.wegBreite, '#d9c08a']]) {
        g.lineWidth = breite; g.strokeStyle = farbe;
        for (const [a, b] of schritt.wege) { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
      }
      // Routen der Spitzel: rot gestrichelt auf dem Weg
      g.save(); g.setLineDash([22, 18]); g.lineWidth = 6; g.strokeStyle = 'rgba(192, 57, 43, 0.85)';
      for (const w of schritt.wachen) if (w.weg) { g.beginPath(); w.weg.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); }
      g.restore();
    }
    schritt.rast.forEach((r, i) => {
      g.beginPath(); g.arc(r.x, r.y, 48, 0, 2 * Math.PI); g.fillStyle = i <= rast ? 'rgba(243, 210, 122, 0.75)' : 'rgba(240, 217, 166, 0.45)'; g.fill();
      ring(r.x, r.y, 48, '#fff3c4', 5);
    });
    ring(schritt.ziel.x, schritt.ziel.y, 96, 'rgba(255, 243, 196, 0.9)', 8);
    if (!bildMittig(bilder.burg, schritt.ziel.x, schritt.ziel.y, 170)) { g.fillStyle = '#3f5870'; g.fillRect(schritt.ziel.x - 50, schritt.ziel.y - 50, 100, 100); }
    for (const w of schritt.wachen) {
      const wp = fahrtRules.wachePos(w, zeit);
      g.beginPath(); g.moveTo(wp.x, wp.y); g.arc(wp.x, wp.y, schritt.sicht.weite, wp.a - schritt.sicht.winkel * RAD, wp.a + schritt.sicht.winkel * RAD); g.closePath();
      g.fillStyle = 'rgba(230, 70, 50, 0.38)'; g.fill(); g.lineWidth = 4; g.strokeStyle = 'rgba(255, 120, 100, 0.95)'; g.stroke();
      g.beginPath(); g.arc(wp.x, wp.y, 50, 0, 2 * Math.PI); g.fillStyle = 'rgba(255, 220, 210, 0.85)'; g.fill();
      ring(wp.x, wp.y, 50, '#c0392b', 7);
      if (!bildMittig(bilder.spitzel, wp.x, wp.y, 95, wp.a + Math.PI / 2)) { g.beginPath(); g.arc(wp.x, wp.y, 26, 0, 2 * Math.PI); g.fillStyle = '#7f2f1f'; g.fill(); }
    }
    // Der eigene Wagen: heller Kreis mit goldenem, pulsierendem Ring
    const puls = 6 + 4 * Math.sin(zeit * 6);
    g.beginPath(); g.arc(p.x, p.y, 64, 0, 2 * Math.PI); g.fillStyle = 'rgba(255, 250, 230, 0.9)'; g.fill();
    ring(p.x, p.y, 64 + puls, 'rgba(243, 200, 74, 0.95)', 8);
    if (!bildMittig(bilder.wagen, p.x, p.y, 110, p.a + Math.PI / 2)) { g.fillStyle = '#c8963e'; g.fillRect(p.x - 30, p.y - 45, 60, 90); }
    if (blitz > 0) { g.fillStyle = `rgba(166,67,46,${Math.min(0.5, blitz)})`; g.fillRect(0, 0, W.w, W.h); }
  }
  function schleife(ms) {
    if (!el.isConnected) { stop(); return; }
    const dt = letzt ? Math.min(0.05, (ms - letzt) / 1000) : 0; letzt = ms;
    if (laeuft) {
      zeit += dt; blitz = Math.max(0, blitz - dt);
      let dx = 0, dy = 0;
      for (const k of tasten) { dx += PFEILE[k][0]; dy += PFEILE[k][1]; }
      if (dx || dy) p = fahrtRules.bewege(p, dx, dy, schritt.tempo * dt, W, schritt.wege, schritt.wegBreite);
      else if (ziel && Math.hypot(ziel.x - p.x, ziel.y - p.y) > 8) p = fahrtRules.fahreZu(p, ziel, schritt.tempo * dt, schritt);
      schritt.rast.forEach((r, i) => { if (i > rast && Math.hypot(p.x - r.x, p.y - r.y) < 46) { rast = i; meldung.textContent = schritt.rastErreicht; meldung.className = 'rueck'; } });
      if (schritt.wachen.some((w) => fahrtRules.gesehen(p, fahrtRules.wachePos(w, zeit), schritt.sicht))) {
        erwischt += 1; blitz = 0.6; p = { ...schritt.rast[rast], a: 0 }; meldung.textContent = schritt.gesehen; meldung.className = 'rueck offen';
      }
      if (fahrtRules.amZiel(p, schritt.ziel)) { male(); return ende(); }
      if (Math.floor(zeit) !== Math.floor(zeit - dt)) zeigeInfo();
    }
    male();
    raf = requestAnimationFrame(schleife);
  }
  function stop() { laeuft = false; cancelAnimationFrame(raf); document.removeEventListener('keydown', runter); document.removeEventListener('keyup', hoch); }
  function los(id = 'leicht') {
    stufe = id; schritt = id !== 'leicht' && basis[id] ? { ...basis, ...basis[id] } : basis;
    startKnopf.remove(); laeuft = true; letzt = 0; zeigeInfo(); leinwand.focus();
  }
  function ende() {
    stop(); fertigGefahren = true;
    const best = bestwert(bestId(), Math.floor(zeit), true);
    meldung.className = 'rueck'; setzeInhalt(meldung, schritt.ende, ' ', h('strong', {}, fuelle(schritt.bestwert, { n: best })));
    unten.append(knopf(t.nochmal, () => fahrt(el, basis, ctx, fertig), 'still'), knopf(t.weiter, () => fertig({}), 'haupt'));
  }
  document.addEventListener('keydown', runter); document.addEventListener('keyup', hoch);
  zeigeInfo();
  setzeInhalt(el, h('p', { class: 'anweisung' }, schritt.anweisung), info, h('div', { class: 'fahrt-rahmen' }, leinwand, startKnopf), unten);
  leinwand.tabIndex = 0;
  raf = requestAnimationFrame(schleife);
  void fertigGefahren;
}

// ---------- Lutherrose: Schichten zusammensetzen ----------
export const roseRules = {
  start: () => ({ gelegt: [], fehler: 0, letzte: null }),
  zug(z, s, id) {
    if (roseRules.fertig(z, s)) return z;
    const naechste = s.schichten[z.gelegt.length];
    return id === naechste.id ? { ...z, gelegt: [...z.gelegt, id], letzte: 'gut' } : { ...z, fehler: z.fehler + 1, letzte: 'falsch' };
  },
  fertig: (z, s) => z.gelegt.length === s.schichten.length
};
// Feste, gemischte Reihenfolge im Vorrat, damit die Lösung nicht einfach von links nach rechts geht.
const MISCHUNG = [2, 4, 0, 3, 1];

export function rose(el, schritt, ctx, fertig) {
  const t = ctx.t;
  let z = roseRules.start();
  const zeichne = () => {
    const vorrat = MISCHUNG.map((i) => schritt.schichten[i]).filter((s) => s && !z.gelegt.includes(s.id));
    const bild = h('div', { class: 'rose-bild', role: 'img', 'aria-label': z.gelegt.map((id) => schritt.schichten.find((s) => s.id === id).label).join(', ') },
      z.gelegt.map((id) => { const s = schritt.schichten.find((x) => x.id === id); return h('span', { class: 'rose-schicht', style: `width:${s.groesse}%`, html: bildHtml(s.bild) }); }));
    setzeInhalt(el, h('p', { class: 'anweisung' }, schritt.anweisung),
      h('div', { class: 'rose-feld' }, bild,
        h('div', { class: 'rose-vorrat' }, vorrat.map((s) => h('button', { type: 'button', class: 'teil mit-bild rose-teil', onclick: () => { z = roseRules.zug(z, schritt, s.id); zeichne(); } },
          h('span', { class: 'zu-bild', 'aria-hidden': 'true', html: bildHtml(s.bild) }), h('span', {}, s.label))))),
      h('div', { class: 'reihe fuss' },
        h('p', { class: `rueck${z.letzte === 'falsch' ? ' offen' : ''}`, role: 'status' }, roseRules.fertig(z, schritt) ? schritt.ende : z.letzte === 'falsch' ? schritt.falsch : ''),
        roseRules.fertig(z, schritt) ? knopf(t.weiter, () => fertig({}), 'haupt') : null));
  };
  zeichne();
}

// ---------- Nachdenken ----------
export function reflexion(el, schritt, ctx, fertig) {
  setzeInhalt(el,
    h('p', { class: 'anweisung' }, rich(schritt.anweisung)),
    schritt.fragen.map((frage, i) => h('label', { class: 'nachdenken' }, h('strong', {}, `${i + 1}. ${frage}`),
      h('textarea', { rows: '4', placeholder: schritt.platzhalter }))),
    h('div', { class: 'reihe fuss' }, h('span', {}), knopf(ctx.t.weiter, () => fertig({}), 'haupt')));
}
