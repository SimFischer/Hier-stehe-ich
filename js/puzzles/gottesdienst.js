// Bonusspiel „Gottesdienst damals und danach“: Suchbild mit Zeitregler und Reaktionsspiel mit aufsteigenden Blasen.
// Oben die Regeln (in Node testbar), unten die Anzeigen. Inhalte: data/bonus.js (gottesdienst).
import { h, setzeInhalt, knopf, rich, fuelle } from '../engine/ui.js';
import { bildHtml } from '../engine/bilder.js';

export const suchRules = {
  /** Welcher Unterschied liegt an der Stelle x, y (Prozent des Bildes)? */
  treffer: (s, x, y) => s.unterschiede.find((u) => u.orte.some((o) => Math.hypot(o.x - x, (o.y - y) * 0.75) <= o.r))?.id || null
};

export const blasenRules = {
  /** Punkte: passende Blase +1, unpassende −1. Nicht angetippte Blasen zählen nicht. */
  punkte: (getippt) => getippt.reduce((n, b) => n + (b.gut ? 1 : -1), 0),
  /** Satz zur Gemeinde: höchste Schwelle, die erreicht ist. */
  gemeinde: (s, punkte) => s.gemeinde[Object.keys(s.gemeinde).map(Number).filter((ab) => punkte >= ab).sort((a, b) => b - a)[0] ?? 0]
};

// ---------- Suchbild mit Zeitregler ----------
export function suchbild(el, schritt, ctx, fertig) {
  const t = ctx.t;
  let gefunden = [];
  let regler = 50;
  let zuletzt = null; // { id } oder { daneben: true }
  const bild = h('div', { class: 'gd-bild' });
  const zeichneBild = () => {
    setzeInhalt(bild,
      h('div', { class: 'gd-ebene nachher', html: bildHtml(schritt.nachher) }),
      h('div', { class: 'gd-ebene vorher', style: `clip-path: inset(0 ${100 - regler}% 0 0)`, html: bildHtml(schritt.vorher) }),
      h('span', { class: 'gd-etikett links' }, schritt.labelVorher), h('span', { class: 'gd-etikett rechts' }, schritt.labelNachher),
      schritt.unterschiede.filter((u) => gefunden.includes(u.id)).flatMap((u) => u.orte.map((o) =>
        h('span', { class: `gd-ring${zuletzt?.id === u.id ? ' neu' : ''}`, style: `left:${o.x}%;top:${o.y}%;width:${o.r * 2}%`, 'aria-hidden': 'true' }))),
      h('span', { class: 'gd-trenner', style: `left:${regler}%`, 'aria-hidden': 'true' }, h('span', { class: 'gd-griff' }, '⟷')));
  };
  // Ziehen: irgendwo auf dem Bild horizontal wischen bewegt den Regler; kurzes Tippen sucht einen Unterschied.
  let start = null;
  const lage = (e) => { const r = bild.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }; };
  bild.addEventListener('pointerdown', (e) => { bild.setPointerCapture(e.pointerId); start = { ...lage(e), weg: 0 }; });
  bild.addEventListener('pointermove', (e) => {
    if (!start) return;
    const p = lage(e); start.weg = Math.max(start.weg, Math.abs(p.x - start.x));
    if (start.weg > 3) { regler = Math.max(0, Math.min(100, p.x)); zeichneBild(); }
  });
  bild.addEventListener('pointerup', (e) => {
    if (!start) return;
    const p = lage(e); const getippt = start.weg <= 3; start = null;
    if (!getippt) return;
    const id = suchRules.treffer(schritt, p.x, p.y);
    if (id && !gefunden.includes(id)) { gefunden = [...gefunden, id]; zuletzt = { id }; } else if (!id) zuletzt = { daneben: true };
    zeichne();
  });
  bild.addEventListener('pointercancel', () => { start = null; });
  const schieber = h('input', { type: 'range', min: 0, max: 100, value: regler, class: 'gd-schieber', 'aria-label': schritt.regler,
    oninput: (e) => { regler = Number(e.target.value); zeichneBild(); } });

  function zeichne() {
    const alle = gefunden.length === schritt.unterschiede.length;
    const u = zuletzt?.id ? schritt.unterschiede.find((x) => x.id === zuletzt.id) : null;
    zeichneBild();
    schieber.value = regler;
    setzeInhalt(el,
      h('p', { class: 'anweisung' }, rich(schritt.anweisung)),
      h('div', { class: 'gd-suche' },
        h('div', { class: 'gd-links' }, bild, schieber),
        h('div', { class: 'gd-seite' },
          h('p', { class: 'gd-zaehler' }, fuelle(schritt.gefunden, { n: gefunden.length, von: schritt.unterschiede.length })),
          h('ol', { class: 'gd-liste' }, schritt.unterschiede.map((x) => h('li', { class: gefunden.includes(x.id) ? 'da' : '' }, gefunden.includes(x.id) ? x.titel : '?'))),
          u ? h('div', { class: 'gd-info', role: 'status' }, h('strong', {}, u.titel), h('p', {}, u.text))
            : zuletzt?.daneben ? h('p', { class: 'gd-daneben', role: 'status' }, schritt.daneben) : null,
          alle ? h('p', { class: 'gd-fertig' }, schritt.fertigText) : null,
          alle ? knopf(t.weiter, () => fertig({}), 'haupt') : null)));
  }
  zeichne();
}

// ---------- Blasen: Was hilft der Gemeinde? ----------
function bestwert(id, wert) {
  const schluessel = `hier-stehe-ich.best.${id}`;
  let alt = null;
  try { alt = JSON.parse(localStorage.getItem(schluessel)); } catch { /* privat */ }
  if (wert == null) return alt;
  if (alt == null || wert > alt) { try { localStorage.setItem(schluessel, JSON.stringify(wert)); } catch { /* egal */ } return wert; }
  return alt;
}

export function blasen(el, schritt, ctx, fertig) {
  const t = ctx.t;
  const feld = h('div', { class: 'gd-feld' });
  const info = h('div', { class: 'gd-kopf' });
  let laeuft = false, zeit = schritt.dauer, letzt = 0, raf = 0, bisNeu = 0, nr = 0, startMs = 0;
  let getippt = [];
  let aktiv = []; // { el, x, y, v, gut, eintrag }
  const stapel = { gut: [], schlecht: [] };
  const ziehe = (art) => { if (!stapel[art].length) stapel[art] = [...schritt[art]].sort(() => Math.random() - 0.5); return stapel[art].pop(); };

  const zeigeKopf = () => setzeInhalt(info,
    h('strong', {}, fuelle(schritt.punkte, { n: blasenRules.punkte(getippt) })),
    h('span', {}, fuelle(schritt.zeit, { n: Math.ceil(zeit) })),
    bestwert('gottesdienst') != null ? h('span', {}, fuelle(schritt.bestwert, { n: bestwert('gottesdienst') })) : null);

  function neueBlase() {
    const gut = Math.random() < 0.55;
    const eintrag = ziehe(gut ? 'gut' : 'schlecht');
    const b = { x: 8 + Math.random() * 74, y: 105, v: 9 + Math.random() * 5 + (schritt.dauer - zeit) * 0.12, gut, eintrag, id: (nr += 1) };
    b.el = h('button', { type: 'button', class: 'gd-blase', style: `left:${b.x}%;top:${b.y}%`, onclick: () => tippe(b) }, eintrag.text);
    feld.append(b.el); aktiv.push(b);
  }
  function tippe(b) {
    if (!laeuft || b.weg) return;
    b.weg = true; getippt.push({ gut: b.gut });
    b.el.classList.add(b.gut ? 'richtig' : 'falsch');
    b.el.textContent = `${b.gut ? '+1' : '−1'} ${b.eintrag.warum}`;
    if (b.gut) { const note = h('span', { class: 'gd-note', style: `left:${b.x + 8}%;top:${b.y}%`, 'aria-hidden': 'true' }, '♪'); feld.append(note); setTimeout(() => note.remove(), 1200); }
    setTimeout(() => { b.el.remove(); aktiv = aktiv.filter((x) => x !== b); }, 900);
    zeigeKopf();
  }
  function schleife(ms) {
    if (!el.isConnected) { cancelAnimationFrame(raf); return; }
    const dt = letzt ? Math.min(0.05, (ms - letzt) / 1000) : 0; letzt = ms;
    if (laeuft) {
      // Die Uhr läuft nach echter Zeit, die Blasen nach Bildern (gedeckelt), damit nichts springt.
      const vorher = zeit; zeit = schritt.dauer - (ms - startMs) / 1000; bisNeu -= dt;
      if (bisNeu <= 0) { neueBlase(); bisNeu = Math.max(0.75, 1.3 - (schritt.dauer - zeit) * 0.012); }
      for (const b of aktiv) if (!b.weg) { b.y -= b.v * dt; b.el.style.top = `${b.y}%`; if (b.y < -15) { b.weg = true; b.el.remove(); } }
      aktiv = aktiv.filter((b) => b.el.isConnected);
      if (Math.ceil(zeit) !== Math.ceil(vorher)) zeigeKopf();
      if (zeit <= 0) return ende();
    }
    raf = requestAnimationFrame(schleife);
  }
  function ende() {
    laeuft = false; zeit = 0;
    for (const b of aktiv) b.el.remove(); aktiv = [];
    const p = blasenRules.punkte(getippt);
    const best = bestwert('gottesdienst', p);
    zeigeKopf();
    setzeInhalt(feld, h('div', { class: 'gd-ende' },
      h('p', {}, fuelle(schritt.ende, { n: p, gemeinde: blasenRules.gemeinde(schritt, p) })),
      h('strong', {}, fuelle(schritt.bestwert, { n: best })),
      h('div', { class: 'reihe mitte' }, knopf(schritt.nochmal, () => blasen(el, schritt, ctx, fertig), 'still'), knopf(t.weiter, () => fertig({}), 'haupt'))));
  }
  zeigeKopf();
  feld.append(h('div', { class: 'gd-start' }, knopf(schritt.start, () => { feld.querySelector('.gd-start').remove(); laeuft = true; letzt = 0; startMs = performance.now(); }, 'haupt gross')));
  setzeInhalt(el, h('p', { class: 'anweisung' }, rich(schritt.anweisung)), info, h('div', { class: 'gd-buehne', html: '' }, feld));
  const hinter = el.querySelector('.gd-buehne');
  hinter.insertAdjacentHTML('afterbegin', `<div class="gd-hintergrund" aria-hidden="true">${bildHtml('bonus-gottesdienst-1522')}</div>`);
  raf = requestAnimationFrame(schleife);
}
