// Gemeinsame Helfer für die Tests: fester Zufall und drei Spielertypen für die Spielsysteme.
import { rules as markt } from '../js/puzzles/marktplatz.js';
import { rules as druck } from '../js/puzzles/druckwelle.js';

/** Zufall mit Startwert: Jeder Testlauf ist gleich. */
export function zufall(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const aus = (rnd, liste) => liste[Math.floor(rnd() * liste.length)];

// typ: 'sorgfaeltig' | 'zufall' | 'schwach' (liest ungenau: trifft nur manchmal die passende Wahl)
const kenntEs = (typ, rnd) => typ === 'sorgfaeltig' || (typ === 'schwach' && rnd() < 0.5);

export function spieleMarkt(d, typ, rnd) {
  let z = markt.start(d); let zuege = 0;
  while (!z.ende) {
    const offen = d.figuren.filter((f) => markt.kann(z, f.id));
    const klug = kenntEs(typ, rnd);
    const f = klug ? [...offen].sort((a, b) => z.fig[b.id].pos - z.fig[a.id].pos)[0] : aus(rnd, offen);
    const richtig = f.antworten.findIndex((a) => a.passt);
    const antwort = klug ? richtig : Math.floor(rnd() * f.antworten.length);
    z = markt.zug(z, d, { figur: f.id, antwort });
    if (++zuege > 50) throw new Error('Marktplatz endet nicht');
  }
  return { z, zuege, stufe: markt.stufe(z, d) };
}

// Druckwelle: 'passiv' schickt keine Boten (nur die Kettenreaktion ab Wittenberg wirkt).
// Wer es kennt, schickt Boten zuerst dorthin, wo ein Verbot droht, dann zu Druckereien und großen Städten.
export function spieleDruck(d, typ, rnd) {
  let z = druck.start(d); let schritte = 0;
  const C = (id) => d.staedte.find((c) => c.id === id);
  while (!z.ende) {
    const ziele = druck.ziele(z, d);
    if (typ === 'passiv' || !ziele.length || z.boten === 0) { z = druck.rundeEnde(z, d); continue; }
    const wert = (id) => (z.droht.includes(id) ? 100 : 0) + (C(id).druckerei ? 30 : 0) + C(id).volk;
    const id = kenntEs(typ, rnd) ? [...ziele].sort((a, b) => wert(b) - wert(a))[0] : aus(rnd, ziele);
    z = druck.zug(z, d, id);
    if (++schritte > 200) throw new Error('Druckwelle endet nicht');
  }
  return { z, anteil: druck.anteil(z, d), stufe: druck.stufe(z, d) };
}


export const verteilung = (laeufe) => laeufe.reduce((v, l) => { v[l.stufe] = (v[l.stufe] || 0) + 1; return v; }, {});
export const mittel = (laeufe, f) => laeufe.reduce((s, l) => s + f(l), 0) / laeufe.length;
