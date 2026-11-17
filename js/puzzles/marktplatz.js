// Spielsystem „Der Marktplatz“. Oben die Regeln (ohne Bildschirm, in Node testbar), unten die Anzeige.
import { h, setzeInhalt, knopf, rich, fuelle } from '../engine/ui.js';
import { figurHtml, statistHtml, bildHtml } from '../engine/bilder.js';

export const rules = {
  start(d) {
    return { runde: 1, rest: d.gespraecheJeRunde, muenzen: 0, ende: false, letzte: null,
      fig: Object.fromEntries(d.figuren.map((f) => [f.id, { pos: f.start, st: 'offen' }])) };
  },
  kann: (z, figur) => !z.ende && z.fig[figur]?.st === 'offen',
  /** Ein Gespräch: Die gewählte Antwort passt → nachdenklich. Nach dem letzten Gespräch der Runde schlägt die Glocke. */
  zug(z, d, { figur, antwort }) {
    if (!rules.kann(z, figur)) return z;
    const n = structuredClone(z);
    const f = d.figuren.find((x) => x.id === figur);
    const a = f.antworten[antwort];
    if (!a) return z;
    const passt = Boolean(a.passt);
    if (passt) n.fig[figur].st = 'nachdenklich';
    n.letzte = { figur, antwort, passt, text: a.rueck, glocke: false };
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

// Bühne: Lage der Figuren in Prozent des Feldes. Grundlinie unten, je näher am Kasten, desto weiter hinten und kleiner.
const BASIS = [9, 25, 41, 59, 75, 91];
const KASTEN = { x: 50, unten: 36 };
function lage(i, pos, max) {
  const t = pos / max;
  const zielX = KASTEN.x + (i - 2.5) * 6;
  return { x: BASIS[i] + (zielX - BASIS[i]) * t, unten: 2 + (KASTEN.unten - 6) * t, mass: 1 - 0.3 * t };
}

export function view(el, schritt, ctx, fertig) {
  const d = ctx.systeme[schritt.system];
  const t = ctx.t;
  let z = rules.start(d);
  let wahl = null;

  const zeichne = () => {
    const nachd = rules.nachdenklich(z);
    const statWeg = Math.min(d.statisten, nachd);
    const feld = h('div', { class: 'markt-feld' },
      h('div', { class: 'markt-kasten', style: `left:${KASTEN.x}%;bottom:${KASTEN.unten}%`, 'aria-hidden': 'true', html: bildHtml(d.kastenBild) }, h('span', {}, t.marktKasten)),
      ...Array.from({ length: d.statisten }, (_, i) => h('div', { class: `markt-statist${i < statWeg ? ' weg' : ''}`,
        style: `left:${[30, 35, 66, 71][i]}%;bottom:${KASTEN.unten + 2}%`, 'aria-hidden': 'true', html: statistHtml(i) })),
      ...d.figuren.map((f, i) => {
        const st = z.fig[f.id];
        const name = ctx.figuren[f.id].name;
        const l = st.st === 'nachdenklich' ? { x: BASIS[i], unten: 1, mass: 1 } : lage(i, st.pos, d.kaufenAb);
        const zustand = st.st === 'nachdenklich' ? t.marktNachdenklich : st.st === 'gekauft' ? t.marktGekauft : (st.pos >= d.kaufenAb - 1 ? d.nahAmKasten : '');
        return h('button', { type: 'button', class: `markt-figur st-${st.st}${wahl === f.id ? ' gewaehlt' : ''}`,
          style: `left:${l.x}%;bottom:${l.unten}%;--mass:${l.mass};z-index:${10 - st.pos}`,
          disabled: !rules.kann(z, f.id), 'aria-label': `${name}${zustand ? ', ' + zustand : ''}`,
          onclick: () => { wahl = f.id; z = { ...z, letzte: null }; zeichne(); } },
          h('span', { class: 'schild' }, name), h('span', { class: 'figur', html: figurHtml(ctx.figuren[f.id]) }), zustand ? h('span', { class: 'zustand' }, zustand) : null);
      }));

    const kopf = h('div', { class: 'zaehler' },
      h('span', {}, fuelle(t.marktRunde, { n: Math.min(z.runde, d.runden), von: d.runden })),
      h('span', {}, fuelle(t.marktGespraeche, { n: z.ende ? 0 : z.rest })),
      h('span', {}, fuelle(t.marktMuenzen, { n: z.muenzen })),
      h('strong', {}, fuelle(t.marktNachd, { n: nachd, von: d.figuren.length })));

    let seite;
    if (z.letzte) {
      const f = ctx.figuren[z.letzte.figur];
      seite = h('div', { class: 'markt-seite' },
        h('div', { class: `sprechblase antwort ${z.letzte.passt ? 'gut' : 'offen'}` }, h('strong', { class: 'sprecher' }, f.name), h('p', {}, '„', rich(z.letzte.text), '“')),
        z.letzte.glocke && !z.ende ? h('p', { class: 'glocke' }, d.glocke) : null,
        z.ende ? h('p', { class: 'auswertung' }, d.auswertung[rules.stufe(z, d)]) : null,
        h('div', { class: 'reihe' },
          z.ende ? knopf(t.nochmal, () => { z = rules.start(d); wahl = null; zeichne(); }, 'still') : null,
          knopf(t.weiter, () => { if (z.ende) fertig({ stufe: { markt: rules.stufe(z, d) } }); else { z = { ...z, letzte: null }; wahl = null; zeichne(); } }, 'haupt')));
    } else if (wahl) {
      const f = d.figuren.find((x) => x.id === wahl);
      seite = h('div', { class: 'markt-seite' },
        h('div', { class: 'sprechblase' }, h('strong', { class: 'sprecher' }, ctx.figuren[wahl].name), h('p', {}, '„', rich(f.anliegen), '“')),
        h('p', { class: 'kicker' }, t.marktKarteWaehlen),
        h('div', { class: 'optionen' }, f.antworten.map((a, i) => h('button', { type: 'button', class: 'option', onclick: () => { z = rules.zug(z, d, { figur: wahl, antwort: i }); zeichne(); } }, a.text))));
    } else {
      seite = h('div', { class: 'markt-seite' }, h('p', {}, z.runde === 1 && z.rest === d.gespraecheJeRunde ? d.einleitung : t.marktWaehle));
    }
    setzeInhalt(el, kopf, h('div', { class: 'markt-rahmen' }, feld, seite));
  };
  zeichne();
}
