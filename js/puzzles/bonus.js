// Schrittarten der Bonusspiele: Silbenrätsel, Druckerpresse, Weg durch den Wald, Nachdenken.
// Wie überall: oben die Regeln (in Node testbar), unten die Anzeige.
import { h, setzeInhalt, knopf, rich, fuelle } from '../engine/ui.js';

// ---------- Silbenrätsel ----------
export const silbenRules = {
  /** Alle Silben, alphabetisch gemischt. */
  vorrat: (s) => s.fragen.flatMap((f, fi) => f.silben.map((text, si) => ({ id: `${fi}-${si}`, text })))
    .sort((a, b) => a.text.localeCompare(b.text, 'de') || a.id.localeCompare(b.id)),
  start: () => ({ nr: 0, gelegt: [], verbraucht: [], fehler: 0, letzte: null }),
  zug(z, s, silbeId) {
    const silbe = silbenRules.vorrat(s).find((x) => x.id === silbeId);
    if (!silbe || z.verbraucht.includes(silbeId) || silbenRules.fertig(z, s)) return z;
    const frage = s.fragen[z.nr];
    if (silbe.text !== frage.silben[z.gelegt.length]) return { ...z, gelegt: [], fehler: z.fehler + 1, letzte: 'falsch' };
    const gelegt = [...z.gelegt, silbeId];
    if (gelegt.length < frage.silben.length) return { ...z, gelegt, letzte: 'gut' };
    return { ...z, nr: z.nr + 1, gelegt: [], verbraucht: [...z.verbraucht, ...gelegt], letzte: 'wort' };
  },
  fertig: (z, s) => z.nr >= s.fragen.length
};

export function silben(el, schritt, ctx, fertig) {
  let z = silbenRules.start();
  const vorrat = silbenRules.vorrat(schritt);
  const zeichne = () => {
    const ende = silbenRules.fertig(z, schritt);
    setzeInhalt(el,
      h('p', { class: 'anweisung' }, schritt.anweisung),
      h('ol', { class: 'silben-liste' }, schritt.fragen.map((f, i) => h('li', { class: i < z.nr ? 'fertig' : i === z.nr ? 'aktiv' : '' },
        h('span', {}, f.frage), ' ',
        h('strong', {}, i < z.nr ? f.silben.join('') : i === z.nr ? `${z.gelegt.map((id) => vorrat.find((v) => v.id === id).text).join('')} …` : ''))),
      ),
      h('div', { class: 'silben-vorrat' }, vorrat.map((v) => h('button', { type: 'button', class: 'wahlknopf silbe',
        disabled: ende || z.verbraucht.includes(v.id) || z.gelegt.includes(v.id), onclick: () => { z = silbenRules.zug(z, schritt, v.id); zeichne(); } }, v.text))),
      h('div', { class: 'reihe fuss' },
        h('p', { class: `rueck${z.letzte === 'falsch' ? ' offen' : ''}`, role: 'status' }, ende ? schritt.ende : z.letzte === 'falsch' ? schritt.falsch : ''),
        ende ? knopf(ctx.t.weiter, () => fertig({}), 'haupt') : null));
  };
  zeichne();
}

// ---------- Druckerpresse ----------
export const presseRules = {
  start: () => ({ i: 0, blaetter: 0, fehler: 0, letzte: null }),
  zug(z, s, id) {
    if (id !== s.handgriffe[z.i].id) return { ...z, i: 0, fehler: z.fehler + 1, letzte: 'falsch' };
    const i = z.i + 1;
    return i === s.handgriffe.length ? { ...z, i: 0, blaetter: z.blaetter + 1, letzte: 'blatt' } : { ...z, i, letzte: 'gut' };
  }
};

export function presse(el, schritt, ctx, fertig) {
  let z = presseRules.start();
  let rest = schritt.sekunden;
  let uhr = null;
  const zeichne = () => {
    const laeuft = uhr !== null && rest > 0;
    const vorbei = rest <= 0;
    setzeInhalt(el,
      h('p', { class: 'anweisung' }, schritt.anweisung),
      h('div', { class: 'zaehler' }, h('span', {}, fuelle(schritt.zeit, { n: Math.max(0, rest) })), h('strong', {}, fuelle(schritt.zaehler, { n: z.blaetter }))),
      h('div', { class: 'presse-stapel', 'aria-hidden': 'true' }, Array.from({ length: Math.min(z.blaetter, 30) }, () => h('span', {}))),
      uhr === null ? h('div', { class: 'reihe mitte' }, knopf(schritt.start, starte, 'haupt gross')) : null,
      h('div', { class: 'presse-knoepfe' }, schritt.handgriffe.map((g, i) => h('button', { type: 'button', class: `knopf gross${laeuft && i === z.i ? ' dran' : ''}`,
        disabled: !laeuft, onclick: () => { z = presseRules.zug(z, schritt, g.id); zeichne(); } }, g.label))),
      h('div', { class: 'reihe fuss' },
        h('p', { class: `rueck${z.letzte === 'falsch' && !vorbei ? ' offen' : ''}`, role: 'status' }, vorbei ? fuelle(schritt.ende, { n: z.blaetter }) : z.letzte === 'falsch' ? schritt.fehldruck : ''),
        vorbei ? knopf(ctx.t.weiter, () => fertig({}), 'haupt') : null));
  };
  function starte() {
    uhr = setInterval(() => {
      rest -= 1;
      // Die Uhr hört auf, wenn die Zeit um ist oder das Blatt geschlossen wurde.
      if (rest <= 0 || !el.isConnected) { clearInterval(uhr); if (el.isConnected) zeichne(); return; }
      const anzeige = el.querySelector('.zaehler span');
      if (anzeige) anzeige.textContent = fuelle(schritt.zeit, { n: rest });
    }, 1000);
    zeichne();
  }
  zeichne();
}

// ---------- Weg durch den Wald ----------
const feld = (s, x, y) => (s.karte[y] && s.karte[y][x]) || 'W';
const finde = (s, zeichen) => { for (let y = 0; y < s.karte.length; y++) { const x = s.karte[y].indexOf(zeichen); if (x >= 0) return { x, y }; } return null; };

export const wegRules = {
  feld, finde,
  start: (s) => ({ ...finde(s, 'S'), zuege: 0, ende: false, letzte: null }),
  kann: (z, s, x, y) => !z.ende && Math.abs(x - z.x) + Math.abs(y - z.y) === 1 && feld(s, x, y) !== 'W',
  zug(z, s, x, y) {
    if (!wegRules.kann(z, s, x, y)) return z;
    const zuege = z.zuege + 1;
    const f = feld(s, x, y);
    if (f === 'D') return { ...wegRules.start(s), letzte: 'gesehen' };
    if (f === 'Z') return { x, y, zuege, ende: true, letzte: 'ziel' };
    if (zuege >= s.maxZuege) return { ...wegRules.start(s), letzte: 'zuSpaet' };
    return { x, y, zuege, ende: false, letzte: null };
  },
  /** Kürzester Weg in Schritten (Breitensuche), oder -1. Für Tests. */
  kuerzester(s) {
    const start = finde(s, 'S'); const offen = [[start.x, start.y, 0]]; const war = new Set([`${start.x},${start.y}`]);
    while (offen.length) {
      const [x, y, n] = offen.shift();
      if (feld(s, x, y) === 'Z') return n;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const f = feld(s, x + dx, y + dy); const k = `${x + dx},${y + dy}`;
        if (f === 'W' || f === 'D' || war.has(k)) continue;
        war.add(k); offen.push([x + dx, y + dy, n + 1]);
      }
    }
    return -1;
  }
};

export function weg(el, schritt, ctx, fertig) {
  let z = wegRules.start(schritt);
  const zeichne = () => {
    const zellen = schritt.karte.flatMap((zeile, y) => [...zeile].map((f, x) => {
      const hier = z.x === x && z.y === y;
      const name = hier ? schritt.legende.R : schritt.legende[f] || '';
      return h('button', { type: 'button', class: `zelle f-${f}${hier ? ' hier' : ''}`, disabled: !wegRules.kann(z, schritt, x, y), 'aria-label': name || `${x + 1}, ${y + 1}`,
        onclick: () => { z = wegRules.zug(z, schritt, x, y); zeichne(); } }, hier || f !== '.' ? h('span', {}, name) : null);
    }));
    setzeInhalt(el,
      h('p', { class: 'anweisung' }, schritt.anweisung),
      h('div', { class: 'zaehler' }, h('span', {}, fuelle(schritt.zuege, { n: z.zuege, von: schritt.maxZuege }))),
      h('div', { class: 'wald', style: `--spalten:${schritt.karte[0].length}` }, zellen),
      h('div', { class: 'reihe fuss' },
        h('p', { class: `rueck${z.letzte && !z.ende ? ' offen' : ''}`, role: 'status' }, z.ende ? schritt.ende : z.letzte ? schritt[z.letzte] : ''),
        z.ende ? knopf(ctx.t.weiter, () => fertig({}), 'haupt') : null));
  };
  zeichne();
}

// ---------- Nachdenken ----------
export function reflexion(el, schritt, ctx, fertig) {
  setzeInhalt(el,
    h('p', { class: 'anweisung' }, rich(schritt.anweisung)),
    schritt.fragen.map((frage, i) => h('label', { class: 'nachdenken' }, h('strong', {}, `${i + 1}. ${frage}`),
      h('textarea', { rows: '4', placeholder: schritt.platzhalter }))),
    h('div', { class: 'reihe fuss' }, h('span', {}), knopf(ctx.t.weiter, () => fertig({}), 'haupt')));
}
