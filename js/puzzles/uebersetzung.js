// Übersetzungswerkstatt: erst zuhören, dann die Fassung wählen, die jeder versteht.
import { h, setzeInhalt, knopf, rich, fuelle } from '../engine/ui.js';
import { figurHtml } from '../engine/bilder.js';

export const rules = {
  start: () => ({ vers: 0, gefragt: [], geloest: false, fehler: 0 }),
  frage(z, s, ratgeber) { return z.gefragt.includes(ratgeber) ? z : { ...z, gefragt: [...z.gefragt, ratgeber] }; },
  darfWaehlen: (z, s) => z.gefragt.length >= s.fragen,
  waehle(z, s, index) {
    if (!rules.darfWaehlen(z, s) || z.geloest) return z;
    return s.verse[z.vers].optionen[index].richtig ? { ...z, geloest: true } : { ...z, fehler: z.fehler + 1 };
  },
  weiter: (z, s) => (z.geloest && z.vers < s.verse.length - 1 ? { ...z, vers: z.vers + 1, gefragt: [], geloest: false } : z),
  fertig: (z, s) => z.geloest && z.vers === s.verse.length - 1
};

export function view(el, schritt, ctx, fertig) {
  const t = ctx.t;
  let z = rules.start();
  let stimme = null;
  let rueck = '';
  const zeichne = () => {
    const v = schritt.verse[z.vers];
    const darf = rules.darfWaehlen(z, schritt);
    setzeInhalt(el, 
      z.vers === 0 && !z.gefragt.length ? h('p', { class: 'anweisung' }, rich(schritt.anweisung)) : h('p', { class: 'kicker' }, fuelle(t.versNr, { n: z.vers + 1, von: schritt.verse.length })),
      h('blockquote', { class: 'alt' }, h('cite', {}, schritt.altLabel), v.alt),
      h('div', { class: 'ratgeber' }, schritt.ratgeber.map((id) => h('button', { type: 'button', class: `ratgeber-knopf${z.gefragt.includes(id) ? ' gefragt' : ''}${stimme === id ? ' gewaehlt' : ''}`,
        onclick: () => { z = rules.frage(z, schritt, id); stimme = id; rueck = ''; zeichne(); } },
        h('span', { class: 'figur', html: figurHtml(ctx.figuren[id]) }), h('span', {}, ctx.figuren[id].name)))),
      h('p', { class: 'stimme', role: 'status' }, stimme ? h('span', {}, h('strong', {}, `${ctx.figuren[stimme].name}: `), v.stimmen[stimme]) : fuelle(t.ratFragen, { n: schritt.fragen })),
      h('div', { class: 'optionen' }, v.optionen.map((o, i) => h('button', { type: 'button', class: `option${z.geloest && o.richtig ? ' richtig' : ''}`, disabled: !darf || z.geloest,
        onclick: () => { const vor = z; z = rules.waehle(z, schritt, i); rueck = z.geloest ? '' : (z !== vor ? o.rueck : ''); zeichne(); } }, o.text))),
      z.geloest ? h('blockquote', { class: 'luther' }, h('cite', {}, schritt.lutherLabel), v.luther) : null,
      h('div', { class: 'reihe fuss' },
        h('p', { class: `rueck${rueck ? ' offen' : ''}`, role: 'status' }, rueck || (z.geloest ? t.uebGut : darf ? t.uebWaehle : '')),
        z.geloest ? knopf(t.weiter, () => { if (rules.fertig(z, schritt)) fertig({}); else { z = rules.weiter(z, schritt); stimme = null; rueck = ''; zeichne(); } }, 'haupt') : null));
  };
  zeichne();
}
