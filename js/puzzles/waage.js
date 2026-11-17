// Die Waage der Werke: Gute Werke darf man mehrfach legen. Ist die Waage fast im Gleichgewicht,
// fällt eine neue Sünde in die linke Schale. Sie kippt nie zur Seite der Werke.
import { h, setzeInhalt, knopf, rich } from '../engine/ui.js';
import { bildHtml } from '../engine/bilder.js';

export const rules = {
  start: (s) => ({ links: s.start, rechts: 0, gefallen: 0, gelegt: [], letzte: null }),
  zug(z, s, { werk }) {
    const w = s.werke.find((x) => x.id === werk);
    if (!w || rules.fertig(z, s) && z.letzte?.art === 'ende') return z;
    const n = { ...z, gelegt: [...z.gelegt, werk], rechts: z.rechts + w.gewicht, letzte: { art: 'werk', text: w.text } };
    if (n.gefallen < s.suenden.length && n.links - n.rechts <= s.schwelle) {
      const sd = s.suenden[n.gefallen];
      n.links += sd.gewicht; n.gefallen += 1; n.letzte = { art: 'suende', text: sd.text };
    } else if (n.gefallen >= s.suenden.length && n.links - n.rechts < s.rest) {
      // Nach der letzten Sünde: Die Waage rührt sich kaum noch.
      n.rechts = n.links - s.rest; n.letzte = { art: 'ende', text: s.ende };
    }
    return n;
  },
  kippt: (z) => z.rechts >= z.links,
  fertig: (z, s) => z.gefallen >= s.suenden.length && z.letzte?.art === 'ende',
  /** Neigung des Balkens in Grad. Negativ: links unten. */
  winkel: (z, s) => -Math.max(2, Math.min(16, (z.links - z.rechts) * (16 / s.start)))
};

// Lage der Teile in Bruchteilen der Breite (Höhe = 0,75 × Breite). Gemessen an den Bildern waage-*.
const ACHSE = { x: 0.5, y: 0.32 };
const ENDE = { x: 0.312, y: 0.066 }; // Aufhängung rechts, vom Drehpunkt aus
const SCHALE = { b: 0.36, haken: { x: 0.5, y: 0.05 }, h: 0.27 };

function haken(seite, grad) {
  const a = (grad * Math.PI) / 180;
  const x = seite * ENDE.x, y = ENDE.y;
  return { x: ACHSE.x + x * Math.cos(a) - y * Math.sin(a), y: ACHSE.y + x * Math.sin(a) + y * Math.cos(a) };
}

export function view(el, schritt, ctx, fertig) {
  const t = ctx.t;
  let z = rules.start(schritt);
  const zeichne = () => {
    const grad = rules.winkel(z, schritt);
    const schale = (seite, inhalt, name) => {
      const p = haken(seite, grad);
      const links = (p.x - SCHALE.b * SCHALE.haken.x) * 100;
      const oben = ((p.y - SCHALE.h * SCHALE.haken.y) / 0.75) * 100;
      return h('div', { class: `w-schale ${name}`, style: `left:${links}%;top:${oben}%;width:${SCHALE.b * 100}%` },
        h('span', { html: bildHtml('waage-schale') }), h('span', { class: 'w-inhalt' }, inhalt));
    };
    const steine = Array.from({ length: 1 + z.gefallen }, () => h('span', { class: 'w-stein', html: bildHtml(schritt.lastBild) }));
    const werke = z.gelegt.slice(-8).map((id) => h('span', { class: 'w-werk', html: bildHtml(schritt.werke.find((w) => w.id === id).bild) }));
    const waage = h('div', { class: 'waage2', role: 'img', 'aria-label': t.waageBild },
      h('span', { class: 'w-staender', html: bildHtml('waage-staender') }),
      h('span', { class: 'w-balken', style: `transform:rotate(${grad}deg)`, html: bildHtml('waage-balken') }),
      schale(-1, steine, 'links'), schale(1, werke, 'rechts'),
      h('span', { class: 'w-name links' }, t.waageLast), h('span', { class: 'w-name rechts' }, t.waageWerke));
    const letzte = z.letzte;
    setzeInhalt(el,
      h('p', { class: 'anweisung' }, rich(schritt.anweisung)),
      h('div', { class: 'waage-feld' }, waage,
        h('div', { class: 'waage-seite' },
          h('div', { class: 'werk-knoepfe' }, schritt.werke.map((w) => knopf([h('span', { class: 'icon', 'aria-hidden': 'true', html: bildHtml(w.bild) }), w.label],
            () => { z = rules.zug(z, schritt, { werk: w.id }); zeichne(); }, '', { disabled: rules.fertig(z, schritt) }))),
          h('p', { class: `w-meldung art-${letzte?.art || 'leer'}`, role: 'status' }, letzte ? (letzte.art === 'suende' ? [h('strong', {}, t.waageNeueLast), ' ', letzte.text] : letzte.text) : t.waageStart),
          rules.fertig(z, schritt) ? knopf(t.weiter, () => fertig({}), 'haupt') : null)));
  };
  zeichne();
}
