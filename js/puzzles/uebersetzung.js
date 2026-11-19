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
    // Links das alte Blatt (und darunter Luthers Fassung, sobald gelöst), rechts zwei Schritte: Leute fragen, dann Fassung wählen.
    const noch = Math.max(0, schritt.fragen - z.gefragt.length);
    setzeInhalt(el,
      z.vers === 0 && !z.gefragt.length ? h('p', { class: 'anweisung' }, rich(schritt.anweisung)) : h('p', { class: 'kicker' }, fuelle(t.versNr, { n: z.vers + 1, von: schritt.verse.length })),
      h('div', { class: 'ue-werkstatt' },
        h('div', { class: 'ue-links' },
          h('blockquote', { class: 'ue-blatt alt' }, h('cite', {}, schritt.altLabel), h('p', {}, v.alt)),
          z.geloest ? h('blockquote', { class: 'ue-blatt luther' }, h('cite', {}, schritt.lutherLabel), h('p', {}, v.luther)) : null),
        h('div', { class: 'ue-rechts' },
          h('p', { class: `ue-schritt${noch ? ' jetzt' : ' erledigt'}` }, h('span', { class: 'ue-nr' }, noch ? '1' : '✓'), fuelle(t.ratFragen, { n: schritt.fragen })),
          h('div', { class: 'ratgeber' }, schritt.ratgeber.map((id) => h('button', { type: 'button', class: `ratgeber-knopf${z.gefragt.includes(id) ? ' gefragt' : ''}${stimme === id ? ' gewaehlt' : ''}`,
            onclick: () => { z = rules.frage(z, schritt, id); stimme = id; rueck = ''; zeichne(); } },
            h('span', { class: 'figur', html: figurHtml(ctx.figuren[id]) }), h('span', { class: 'ue-name' }, ctx.figuren[id].name)))),
          h('p', { class: `stimme${stimme ? ' spricht' : ''}`, role: 'status' }, stimme ? [h('strong', {}, `${ctx.figuren[stimme].name}: `), v.stimmen[stimme]] : ''),
          h('p', { class: `ue-schritt${darf && !z.geloest ? ' jetzt' : ''}${z.geloest ? ' erledigt' : ''}` }, h('span', { class: 'ue-nr' }, z.geloest ? '✓' : '2'), t.uebWaehle,
            noch ? h('em', {}, fuelle(t.uebNochFragen, { n: noch })) : null),
          h('div', { class: `optionen${darf ? '' : ' wartet'}` }, v.optionen.map((o, i) => h('button', { type: 'button', class: `option${z.geloest && o.richtig ? ' richtig' : ''}`, disabled: !darf || z.geloest,
            onclick: () => { const vor = z; z = rules.waehle(z, schritt, i); rueck = z.geloest ? '' : (z !== vor ? o.rueck : ''); zeichne(); } }, o.text))))),
      h('div', { class: 'reihe fuss' },
        h('p', { class: `rueck${rueck ? ' offen' : ''}`, role: 'status' }, rueck || (z.geloest ? t.uebGut : '')),
        z.geloest ? knopf(t.weiter, () => { if (rules.fertig(z, schritt)) fertig({}); else { z = rules.weiter(z, schritt); stimme = null; rueck = ''; zeichne(); } }, 'haupt') : null));
  };
  zeichne();
}
