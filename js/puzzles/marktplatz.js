// Spielsystem „Der Marktplatz“. Oben die Regeln (ohne Bildschirm, in Node testbar), unten die Anzeige.
import { h, setzeInhalt, knopf, rich, kartenChip, fuelle } from '../engine/ui.js';
import { figurSvg } from '../engine/platzhalter.js';

export const rules = {
  start(d) {
    return { runde: 1, rest: d.gespraecheJeRunde, muenzen: 0, ende: false, letzte: null,
      fig: Object.fromEntries(d.figuren.map((f) => [f.id, { pos: f.start, st: 'offen' }])) };
  },
  kann: (z, figur) => !z.ende && z.fig[figur]?.st === 'offen',
  /** Ein Gespräch: Karte passt → nachdenklich. Nach dem letzten Gespräch der Runde schlägt die Glocke. */
  zug(z, d, { figur, karte }) {
    if (!rules.kann(z, figur)) return z;
    const n = structuredClone(z);
    const f = d.figuren.find((x) => x.id === figur);
    const passt = karte in f.ja;
    if (passt) n.fig[figur].st = 'nachdenklich';
    n.letzte = { figur, karte, passt, text: passt ? f.ja[karte] : (d.sonderNein[karte] || f.nein), glocke: false };
    n.rest -= 1;
    if (n.rest === 0 || !Object.values(n.fig).some((x) => x.st === 'offen')) { rules.glocke(n, d); n.letzte.glocke = true; }
    return n;
  },
  glocke(n, d) {
    const schluss = n.runde >= d.runden;
    for (const f of Object.values(n.fig)) {
      if (f.st !== 'offen') continue;
      f.pos += 1;
      if (schluss || f.pos >= d.kaufenAb) { f.st = 'gekauft'; f.pos = d.kaufenAb; n.muenzen += 1; }
    }
    // Schluss nach der letzten Runde oder wenn niemand mehr unentschlossen ist.
    if (schluss || !Object.values(n.fig).some((x) => x.st === 'offen')) { n.ende = true; n.muenzen += Math.max(0, d.statisten - rules.nachdenklich(n)); }
    else { n.runde += 1; n.rest = d.gespraecheJeRunde; }
  },
  nachdenklich: (z) => Object.values(z.fig).filter((f) => f.st === 'nachdenklich').length,
  stufe(z, d) { const n = rules.nachdenklich(z); return [...d.stufen].reverse().find((s) => n >= s.ab).stufe; }
};

export function view(el, schritt, ctx, fertig) {
  const d = ctx.systeme[schritt.system];
  const t = ctx.t;
  let z = rules.start(d);
  let wahl = null;
  const beutel = ctx.karten().filter((k) => k.art !== 'these');

  const zeichne = () => {
    const nachd = rules.nachdenklich(z);
    const statWeg = Math.min(d.statisten, nachd);
    const feld = h('div', { class: 'markt-feld' },
      h('div', { class: 'markt-kasten', 'aria-hidden': 'true' }, h('span', {}, t.marktKasten)),
      ...Array.from({ length: d.statisten }, (_, i) => h('div', { class: `markt-statist ${i < statWeg ? 'weg' : ''}`, style: `--i:${i}`, 'aria-hidden': 'true', html: figurSvg('#8c8272') })),
      ...d.figuren.map((f, i) => {
        const st = z.fig[f.id];
        const name = ctx.figuren[f.id].name;
        const zustand = st.st === 'nachdenklich' ? t.marktNachdenklich : st.st === 'gekauft' ? t.marktGekauft : (st.pos >= d.kaufenAb - 1 ? d.nahAmKasten : '');
        return h('button', { type: 'button', class: `markt-figur st-${st.st}${wahl === f.id ? ' gewaehlt' : ''}`, style: `--i:${i};--pos:${st.pos}`,
          disabled: !rules.kann(z, f.id), 'aria-label': `${name}${zustand ? ', ' + zustand : ''}`,
          onclick: () => { wahl = f.id; z = { ...z, letzte: null }; zeichne(); } },
          h('span', { class: 'figur', html: figurSvg(ctx.figuren[f.id].farbe) }), h('span', { class: 'schild' }, name), zustand ? h('span', { class: 'zustand' }, zustand) : null);
      }));

    const kopf = h('div', { class: 'zaehler' },
      h('span', {}, fuelle(t.marktRunde, { n: Math.min(z.runde, d.runden), von: d.runden })),
      h('span', {}, fuelle(t.marktGespraeche, { n: z.ende ? 0 : z.rest })),
      h('span', {}, fuelle(t.marktMuenzen, { n: z.muenzen })),
      h('span', {}, fuelle(t.marktNachd, { n: nachd, von: d.figuren.length })));

    let unten;
    if (z.letzte) {
      const f = ctx.figuren[z.letzte.figur];
      unten = h('div', { class: 'markt-unten' },
        h('p', { class: `antwort ${z.letzte.passt ? 'gut' : 'offen'}` }, h('strong', {}, `${f.name}: `), rich(z.letzte.text)),
        z.letzte.glocke && !z.ende ? h('p', { class: 'glocke' }, d.glocke) : null,
        z.ende ? h('p', { class: 'auswertung' }, d.auswertung[rules.stufe(z, d)]) : null,
        h('div', { class: 'reihe' },
          z.ende ? knopf(t.nochmal, () => { z = rules.start(d); wahl = null; zeichne(); }, 'still') : null,
          knopf(t.weiter, () => { if (z.ende) fertig({ stufe: { markt: rules.stufe(z, d) } }); else { z = { ...z, letzte: null }; wahl = null; zeichne(); } }, 'haupt')));
    } else if (wahl) {
      const f = d.figuren.find((x) => x.id === wahl);
      unten = h('div', { class: 'markt-unten' },
        h('p', { class: 'anliegen' }, h('strong', {}, `${ctx.figuren[wahl].name}: `), rich(f.anliegen)),
        h('p', { class: 'klein' }, t.marktKarteWaehlen),
        h('div', { class: 'hand' }, beutel.map((k) => kartenChip(k, { klein: true, onclick: () => { z = rules.zug(z, d, { figur: wahl, karte: k.id }); zeichne(); } }))));
    } else {
      unten = h('div', { class: 'markt-unten' }, h('p', {}, z.runde === 1 && z.rest === d.gespraecheJeRunde ? d.einleitung : t.marktWaehle));
    }
    setzeInhalt(el, kopf, feld, unten);
  };
  zeichne();
}
