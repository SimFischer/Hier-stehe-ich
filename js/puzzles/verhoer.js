// Spielsystem „Das Verhör“. Oben die Regeln (in Node testbar), unten die Anzeige.
import { h, setzeInhalt, knopf, rich, kartenChip, fuelle } from '../engine/ui.js';
import { kopfSvg } from '../engine/platzhalter.js';

export const rules = {
  start: (d, hand) => ({ runde: 0, hand: [...hand], stimmung: 0, ende: false, letzte: null }),
  /** Bewertet eine Karte gegen einen Einwand: 'gut', 'halb' oder 'sonst'. */
  bewerte(einwand, karte) { return karte in einwand.gut ? 'gut' : karte in (einwand.halb || {}) ? 'halb' : 'sonst'; },
  zug(z, d, { karte }) {
    if (z.ende || !z.hand.includes(karte)) return z;
    const e = d.einwaende[z.runde];
    const wert = rules.bewerte(e, karte);
    const n = structuredClone(z);
    n.hand = n.hand.filter((k) => k !== karte);
    n.stimmung += wert === 'gut' ? d.punkteGut : wert === 'halb' ? d.punkteHalb : 0;
    n.letzte = { karte, wert, text: wert === 'sonst' ? e.sonst : e[wert][karte] };
    n.runde += 1;
    n.ende = n.runde >= d.einwaende.length;
    return n;
  },
  max: (d) => d.einwaende.length * d.punkteGut,
  stufe: (z, d) => [...d.stufen].reverse().find((s) => z.stimmung >= s.ab).stufe
};

export function view(el, schritt, ctx, fertig) {
  const d = ctx.systeme[schritt.system];
  const t = ctx.t;
  let z = rules.start(d, ctx.sammel.hand || []);

  const zeichne = () => {
    const dafuer = Math.round((z.stimmung / rules.max(d)) * d.saalFiguren);
    const saal = h('div', { class: 'saal', role: 'img', 'aria-label': fuelle(t.verhoerSaal, { n: dafuer, von: d.saalFiguren }) },
      Array.from({ length: d.saalFiguren }, (_, i) => h('span', { class: `kopf ${i < dafuer ? 'nickt' : ''}`, html: kopfSvg(i < dafuer) })));
    const kopf = h('div', { class: 'zaehler' },
      h('span', {}, fuelle(t.verhoerEinwand, { n: Math.min(z.runde + (z.letzte ? 0 : 1), d.einwaende.length), von: d.einwaende.length })),
      h('strong', {}, fuelle(t.verhoerSaal, { n: dafuer, von: d.saalFiguren })));

    let mitte;
    if (z.letzte) {
      const gespielt = ctx.karte(z.letzte.karte);
      mitte = h('div', { class: 'verhoer-mitte' },
        h('div', { class: 'reihe' }, kartenChip(gespielt, { klein: true }), h('span', { class: `urteil w-${z.letzte.wert}` }, t[`verhoer_${z.letzte.wert}`])),
        h('p', { class: 'antwort' }, rich(z.letzte.text)),
        knopf(t.weiter, () => { if (z.ende) fertig({ stufe: { verhoer: rules.stufe(z, d) } }); else { z = { ...z, letzte: null }; zeichne(); } }, 'haupt'));
    } else {
      const e = d.einwaende[z.runde];
      mitte = h('div', { class: 'verhoer-mitte' },
        h('p', { class: 'einwand' }, h('strong', {}, `${ctx.figuren.sprecher.name}: `), rich(e.text)),
        h('p', { class: 'klein' }, t.verhoerWaehle),
        h('div', { class: 'hand gross' }, z.hand.map((id) => kartenChip(ctx.karte(id), { onclick: () => { z = rules.zug(z, d, { karte: id }); zeichne(); } }))));
    }
    setzeInhalt(el, kopf, saal, mitte);
  };
  zeichne();
}
