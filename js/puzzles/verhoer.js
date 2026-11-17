// Spielsystem „Das Verhör“ als Kartenduell. Oben die Regeln (in Node testbar), unten die Anzeige.
import { h, setzeInhalt, knopf, rich, kartenChip, fuelle } from '../engine/ui.js';
import { standHtmlSaal, bildHtml, figurHtml } from '../engine/bilder.js';
import { cards } from '../../data/cards.js';

const karte = (id) => cards.find((k) => k.id === id);

export const rules = {
  start: (d, hand) => ({ runde: 0, hand: [...hand], stimmung: 0, ende: false, letzte: null }),
  /** Kraft einer Karte gegen einen Einwand: Grundstärke plus Bonus gegen dessen Art. */
  kraft: (einwand, id) => { const k = karte(id); return (k?.staerke || 0) + (k?.gegen?.[einwand.art] || 0); },
  /** 'gut' (Treffer), 'halb' (Unentschieden) oder 'sonst' (Einwand bleibt stehen). */
  bewerte(einwand, id) {
    const kraft = rules.kraft(einwand, id);
    return kraft > einwand.staerke ? 'gut' : kraft === einwand.staerke ? 'halb' : 'sonst';
  },
  /** Karten, die einen Einwand schlagen. */
  passend: (einwand, ids = cards.map((k) => k.id)) => ids.filter((id) => rules.bewerte(einwand, id) === 'gut'),
  zug(z, d, { karte: id }) {
    if (z.ende || !z.hand.includes(id)) return z;
    const e = d.einwaende[z.runde];
    const wert = rules.bewerte(e, id);
    const n = structuredClone(z);
    n.hand = n.hand.filter((k) => k !== id);
    n.stimmung += wert === 'gut' ? d.punkteGut : wert === 'halb' ? d.punkteHalb : 0;
    n.letzte = { karte: id, wert, kraft: rules.kraft(e, id), einwand: e.id, text: e.antworten[id] || e.sonst };
    n.runde += 1;
    n.ende = n.runde >= d.einwaende.length;
    return n;
  },
  max: (d) => d.einwaende.length * d.punkteGut,
  stufe: (z, d) => [...d.stufen].reverse().find((s) => z.stimmung >= s.ab).stufe
};

function einwandKarte(e, t) {
  return h('div', { class: 'karte sammel einwand' },
    h('span', { class: 'k-kopf' }, h('strong', {}, e.titel), h('span', { class: 'k-staerke' }, String(e.staerke))),
    h('span', { class: 'k-bild', 'aria-hidden': 'true', html: bildHtml(e.bild) }),
    h('span', { class: 'k-typ' }, t.einwandArten[e.art]));
}

export function view(el, schritt, ctx, fertig) {
  const d = ctx.systeme[schritt.system];
  const t = ctx.t;
  let z = rules.start(d, ctx.sammel.hand || []);

  const zeichne = () => {
    const dafuer = Math.round((z.stimmung / rules.max(d)) * d.saalFiguren);
    const e = d.einwaende[z.letzte ? z.runde - 1 : z.runde];
    const saal = h('div', { class: 'saal', role: 'img', 'aria-label': fuelle(t.verhoerSaal, { n: dafuer, von: d.saalFiguren }) },
      Array.from({ length: d.saalFiguren }, (_, i) => h('span', { class: `kopf ${i < dafuer ? 'nickt' : ''}`, html: standHtmlSaal(i, i < dafuer) })));
    const kopf = h('div', { class: 'zaehler' },
      h('span', {}, fuelle(t.verhoerEinwand, { n: Math.min(z.runde + (z.letzte ? 0 : 1), d.einwaende.length), von: d.einwaende.length })),
      h('strong', {}, fuelle(t.verhoerSaal, { n: dafuer, von: d.saalFiguren })));
    const gegner = h('div', { class: 'duell-gegner' },
      h('span', { class: 'duell-sprecher', 'aria-hidden': 'true', html: figurHtml(ctx.figuren.sprecher) }),
      h('div', { class: 'sprechblase' }, h('strong', { class: 'sprecher' }, ctx.figuren.sprecher.name, h('em', {}, ` ${t.nacherzaehltKurz}`)), h('p', {}, '„', rich(e.text), '“')));
    let tisch, unten;
    if (z.letzte) {
      const w = z.letzte.wert;
      tisch = h('div', { class: `duell-tisch ergebnis w-${w}` },
        einwandKarte(e, t),
        h('div', { class: 'duell-vergleich' },
          h('span', { class: 'zahl' }, String(z.letzte.kraft)), h('span', {}, w === 'gut' ? '>' : w === 'halb' ? '=' : '<'), h('span', { class: 'zahl' }, String(e.staerke)),
          h('strong', {}, t[`duell_${w}`])),
        kartenChip(ctx.karte(z.letzte.karte), { extra: 'gespielt' }));
      unten = h('div', { class: 'duell-unten' }, h('p', { class: 'antwort' }, rich(z.letzte.text)),
        knopf(t.weiter, () => { if (z.ende) fertig({ stufe: { verhoer: rules.stufe(z, d) } }); else { z = { ...z, letzte: null }; zeichne(); } }, 'haupt'));
    } else {
      tisch = h('div', { class: 'duell-tisch' }, einwandKarte(e, t), h('div', { class: 'duell-platz' }, t.duellPlatz));
      unten = h('div', { class: 'duell-unten' }, h('p', { class: 'kicker' }, d.duellEinleitung),
        h('div', { class: 'hand duell-hand' }, z.hand.map((id) => kartenChip(ctx.karte(id), { klein: true, onclick: () => { z = rules.zug(z, d, { karte: id }); zeichne(); } }))));
    }
    setzeInhalt(el, kopf, saal, h('div', { class: 'duell' }, gegner, tisch), unten);
  };
  zeichne();
}
