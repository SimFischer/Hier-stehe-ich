// Die eigene Flugschrift: Schlagzeile, drei Kernaussagen, ein Bild. Zum Schluss läuft sie durch die Presse (Animation)
// und erscheint groß in der Mitte: die Belohnung am Ende des Spiels.
import { h, setzeInhalt, knopf, rich, kartenChip, fuelle } from '../engine/ui.js';
import { motivHtml } from '../engine/bilder.js';

export const rules = {
  start: (s) => ({ schlagzeile: s.schlagzeilen[0], eigene: false, karten: [], motiv: s.motive[0].id }),
  kuerze: (text, max) => String(text).replace(/\s+/g, ' ').trimStart().slice(0, max),
  umschalten(f, id, s) {
    if (f.karten.includes(id)) return { ...f, karten: f.karten.filter((k) => k !== id) };
    return f.karten.length < s.karten ? { ...f, karten: [...f.karten, id] } : f;
  },
  gueltig: (f, s) => f.schlagzeile.trim().length > 0 && f.schlagzeile.length <= s.maxZeichen && f.karten.length === s.karten && s.motive.some((m) => m.id === f.motiv)
};

const PAUSE = (ms) => new Promise((r) => setTimeout(r, ms));

/** Die Presse: Der Tiegel senkt sich, die Flugschrift erscheint auf dem Bogen, Abzüge fliegen hinaus,
 *  dann liegt das Blatt groß in der Mitte. Ohne Bewegung (prefers-reduced-motion) gleich das Ergebnis. */
async function druckeAus(blatt, t, weiter) {
  const bogen = h('div', { class: 'pr-bogen' }, blatt());
  const buehne = h('div', { class: 'pr-buehne', role: 'dialog', 'aria-modal': 'true', 'aria-label': t.flugGedruckt },
    h('div', { class: 'pr-presse', 'aria-hidden': 'true' },
      h('span', { class: 'pr-balken' }), h('span', { class: 'pr-spindel' }), h('span', { class: 'pr-hebel' }),
      h('span', { class: 'pr-pfosten links' }), h('span', { class: 'pr-pfosten rechts' }),
      h('span', { class: 'pr-tiegel' }), h('span', { class: 'pr-bett' }, bogen)),
    h('div', { class: 'pr-abzuege', 'aria-hidden': 'true' }));
  document.body.append(buehne);
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!ruhig) {
    await PAUSE(500); buehne.classList.add('runter');
    await PAUSE(650); buehne.classList.add('gedruckt');
    await PAUSE(700); buehne.classList.remove('runter');
    const abzuege = buehne.querySelector('.pr-abzuege');
    // Abzüge fliegen in alle Richtungen: aus einem Bogen werden viele
    for (let i = 0; i < 12; i++) {
      const x = Math.round(Math.cos(i * 0.52) * 46), y = Math.round(Math.sin(i * 0.52) * 40 - 8), r = (i % 2 ? 1 : -1) * (20 + i * 9);
      abzuege.append(h('span', { class: 'pr-abzug', style: `--x:${x}vw;--y:${y}vh;--r:${r}deg;--v:${i * 45}ms` }));
    }
    await PAUSE(900);
  }
  buehne.classList.add('ende');
  buehne.append(h('div', { class: 'pr-ergebnis' },
    h('div', { class: 'pr-gross' }, blatt()),
    h('div', { class: 'pr-text' }, h('p', { class: 'kicker' }, t.flugGedrucktKicker), h('h2', {}, t.flugGedruckt), h('p', {}, t.flugGedrucktText),
      knopf(t.weiter, () => { buehne.remove(); weiter(); }, 'haupt gross'))));
  buehne.querySelector('.pr-text .knopf').focus();
}

export function view(el, schritt, ctx, fertig) {
  const t = ctx.t;
  let f = ctx.state.flug && rules.gueltig(ctx.state.flug, schritt) ? { ...ctx.state.flug } : rules.start(schritt);
  const beutel = ctx.karten();

  const blatt = () => h('div', { class: 'flugblatt' },
    h('p', { class: 'fb-kopf' }, schritt.kopf),
    h('h3', {}, f.schlagzeile || '…'),
    h('div', { class: 'fb-bild', html: motivHtml(schritt.motive.find((m) => m.id === f.motiv)) }),
    h('ul', {}, f.karten.map((id) => h('li', {}, ctx.karte(id).text))),
    h('p', { class: 'fb-fuss' }, schritt.fuss));

  const zeichne = () => {
    const ok = rules.gueltig(f, schritt);
    const vorschau = h('div', { class: 'fb-vorschau' }, blatt());
    const knoepfe = [knopf(t.flugFertig, () => druckeAus(blatt, t, () => fertig({ flug: f })), 'haupt gross', { disabled: !ok })];
    const eingabe = h('input', { type: 'text', maxlength: schritt.maxZeichen, value: f.eigene ? f.schlagzeile : '', placeholder: schritt.eigene, 'aria-label': schritt.eigene,
      oninput: (e) => {
        f = { ...f, eigene: true, schlagzeile: rules.kuerze(e.target.value, schritt.maxZeichen) };
        setzeInhalt(vorschau, blatt());
        for (const k of knoepfe) k.disabled = !rules.gueltig(f, schritt);
        for (const w of links.querySelectorAll('.schlagzeilen .gewaehlt')) w.classList.remove('gewaehlt');
      } });
    const links = h('div', { class: 'fb-form' },
      h('p', { class: 'anweisung' }, rich(schritt.anweisung)),
      h('fieldset', { class: 'schlagzeilen' }, h('legend', {}, t.flugSchlagzeile),
        schritt.schlagzeilen.map((sz) => h('button', { type: 'button', class: `wahlknopf${!f.eigene && f.schlagzeile === sz ? ' gewaehlt' : ''}`, onclick: () => { f = { ...f, eigene: false, schlagzeile: sz }; zeichne(); } }, sz)),
        eingabe, h('span', { class: 'klein' }, schritt.namenHinweis)),
      h('fieldset', {}, h('legend', {}, fuelle(t.flugKarten, { n: f.karten.length, von: schritt.karten })),
        h('div', { class: 'hand fb-karten' }, beutel.map((k) => kartenChip(k, { mini: true, gewaehlt: f.karten.includes(k.id), onclick: () => { f = rules.umschalten(f, k.id, schritt); zeichne(); } })))));
    const rechts = h('div', { class: 'fb-rechts' }, vorschau,
      h('fieldset', {}, h('legend', {}, t.flugBild),
        schritt.motive.map((m) => h('button', { type: 'button', class: `wahlknopf${f.motiv === m.id ? ' gewaehlt' : ''}`, onclick: () => { f = { ...f, motiv: m.id }; zeichne(); } }, m.label))),
      h('div', { class: 'reihe' }, knoepfe));
    setzeInhalt(el, h('div', { class: 'fb' }, links, rechts));
  };
  zeichne();
}
