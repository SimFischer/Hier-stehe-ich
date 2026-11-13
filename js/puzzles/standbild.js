// Digitales Standbild: Es gibt Rückmeldung in Worten, aber nicht nur eine einzige Lösung.
import { h, setzeInhalt, knopf, rich, fuelle } from '../engine/ui.js';
import { standSvg } from '../engine/platzhalter.js';

export const rules = {
  startStellung: (s) => Object.fromEntries(Object.entries(s.regler).map(([k, r]) => [k, r.werte[Math.floor(r.werte.length / 2)].id])),
  /** Vergleicht eine Stellung mit der Strophe. Gibt Treffer und einen Satz je Regler zurück. */
  bewerte(s, strophe, stellung) {
    const rueck = Object.keys(s.regler).map((k) => {
      const ja = strophe.passt[k].includes(stellung[k]);
      return { regler: k, ja, text: strophe.rueck[k][ja ? 'ja' : 'nein'] };
    });
    const treffer = rueck.filter((r) => r.ja).length;
    return { treffer, rueck, passt: treffer >= s.genug };
  }
};

export function view(el, schritt, ctx, fertig) {
  const t = ctx.t;
  let nr = 0;
  let stellung = rules.startStellung(schritt);
  let ergebnis = null;
  let versuche = 0;

  const zeichne = () => {
    const strophe = schritt.strophen[nr];
    const buehne = h('div', { class: `buehne abstand-${stellung.abstand}`, role: 'img',
      'aria-label': Object.entries(schritt.regler).map(([k, r]) => `${r.label}: ${r.werte.find((w) => w.id === stellung[k]).label}`).join(', ') },
      h('div', { class: 'stand-figur luther', html: standSvg('luther', stellung.luther) }, h('span', {}, schritt.figuren.luther)),
      h('div', { class: `stand-figur gott blick-${stellung.blick}`, html: standSvg('gott', stellung.gott) }, h('span', {}, schritt.figuren.gott)));
    const regler = h('div', { class: 'regler' }, Object.entries(schritt.regler).map(([k, r]) =>
      h('fieldset', {}, h('legend', {}, r.label), r.werte.map((w) =>
        h('button', { type: 'button', class: `wahlknopf${stellung[k] === w.id ? ' gewaehlt' : ''}`, 'aria-pressed': String(stellung[k] === w.id),
          onclick: () => { stellung = { ...stellung, [k]: w.id }; ergebnis = null; zeichne(); } }, w.label)))));
    const letzte = nr === schritt.strophen.length - 1;
    const weiter = () => { if (letzte) fertig({}); else { nr += 1; ergebnis = null; versuche = 0; zeichne(); } };
    const rechts = h('div', { class: 'stand-rechts' },
      h('p', { class: 'strophe' }, h('strong', {}, fuelle(t.standStrophe, { n: strophe.nr })), ' ', strophe.text),
      regler,
      ergebnis ? h('ul', { class: 'stand-rueck', role: 'status' }, ergebnis.rueck.map((r) => h('li', { class: r.ja ? 'gut' : 'offen' }, r.text))) : null,
      h('div', { class: 'reihe' },
        knopf(t.standPruefen, () => { ergebnis = rules.bewerte(schritt, strophe, stellung); versuche += 1; zeichne(); }, ergebnis?.passt ? 'still' : 'haupt'),
        ergebnis && (ergebnis.passt || versuche >= 2) ? knopf(letzte ? t.weiter : t.standNaechste, weiter, ergebnis.passt ? 'haupt' : 'still') : null));
    setzeInhalt(el, h('p', { class: 'anweisung' }, rich(schritt.anweisung)), h('div', { class: 'stand' }, buehne, rechts));
  };
  zeichne();
}
