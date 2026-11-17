// Gemeinsame Helfer für die Tests: fester Zufall und drei Spielertypen für die Spielsysteme.
import { rules as markt } from '../js/puzzles/marktplatz.js';
import { rules as druck } from '../js/puzzles/druckwelle.js';
import { rules as verhoer } from '../js/puzzles/verhoer.js';

/** Zufall mit Startwert: Jeder Testlauf ist gleich. */
export function zufall(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const aus = (rnd, liste) => liste[Math.floor(rnd() * liste.length)];

// typ: 'sorgfaeltig' | 'zufall' | 'schwach' (liest ungenau: trifft nur manchmal die passende Wahl)
const kenntEs = (typ, rnd) => typ === 'sorgfaeltig' || (typ === 'schwach' && rnd() < 0.5);

export function spieleMarkt(d, beutel, typ, rnd) {
  let z = markt.start(d); let zuege = 0;
  while (!z.ende) {
    const offen = d.figuren.filter((f) => markt.kann(z, f.id));
    const klug = kenntEs(typ, rnd);
    const f = klug ? [...offen].sort((a, b) => z.fig[b.id].pos - z.fig[a.id].pos)[0] : aus(rnd, offen);
    const passend = beutel.filter((k) => k in f.ja);
    const karte = klug && passend.length ? passend[0] : aus(rnd, beutel);
    z = markt.zug(z, d, { figur: f.id, karte });
    if (++zuege > 50) throw new Error('Marktplatz endet nicht');
  }
  return { z, zuege, stufe: markt.stufe(z, d) };
}

export function spieleDruck(d, typ, rnd) {
  let z = druck.start(d); let schritte = 0;
  while (!z.ende) {
    const zuege = [];
    for (const c of d.staedte) for (const fassung of ['deutsch', 'latein']) if (druck.kann(z, d, { stadt: c.id, fassung })) zuege.push({ stadt: c.id, fassung, c });
    if (!zuege.length || z.boten === 0) { z = druck.rundeEnde(z, d); continue; }
    let zug;
    if (kenntEs(typ, rnd)) {
      // Deutsch zuerst, am liebsten in Knotenpunkte und große Städte; Latein dorthin, wo es neue Wege öffnet.
      const wert = (m) => (m.fassung === 'deutsch' ? 100 + (m.c.knoten ? 50 : 0) + m.c.volk : druck.nachbarn(d, m.stadt).filter((n) => z.st[n].f === 'kein').length);
      zug = [...zuege].sort((a, b) => wert(b) - wert(a))[0];
    } else zug = aus(rnd, typ === 'latein' ? zuege.filter((m) => m.fassung === 'latein').concat(zuege.filter((m) => m.fassung === 'latein').length ? [] : [null]) : zuege);
    if (!zug) { z = druck.rundeEnde(z, d); continue; }
    z = druck.zug(z, d, zug);
    if (++schritte > 200) throw new Error('Druckwelle endet nicht');
  }
  return { z, anteil: druck.anteil(z, d), stufe: druck.stufe(z, d) };
}

export function spieleVerhoer(d, beutel, typ, rnd) {
  const gute = d.einwaende.map((e) => verhoer.passend(e)[0]);
  const klugDeck = kenntEs(typ, rnd);
  let hand = klugDeck ? gute.filter((k) => beutel.includes(k)) : [];
  const rest = beutel.filter((k) => !hand.includes(k)).sort(() => rnd() - 0.5);
  hand = [...hand, ...rest].slice(0, d.handGroesse);
  let z = verhoer.start(d, hand);
  while (!z.ende) {
    const e = d.einwaende[z.runde];
    const beste = z.hand.find((k) => verhoer.bewerte(e, k) === 'gut') || z.hand.find((k) => verhoer.bewerte(e, k) === 'halb');
    z = verhoer.zug(z, d, { karte: kenntEs(typ, rnd) && beste ? beste : aus(rnd, z.hand) });
  }
  return { z, stufe: verhoer.stufe(z, d) };
}

export const verteilung = (laeufe) => laeufe.reduce((v, l) => { v[l.stufe] = (v[l.stufe] || 0) + 1; return v; }, {});
export const mittel = (laeufe, f) => laeufe.reduce((s, l) => s + f(l), 0) / laeufe.length;
