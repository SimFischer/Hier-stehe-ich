// Perspektivwechsel: Man spielt die Kirche gegen einen Computer-Luther.
import test from 'node:test';
import assert from 'node:assert/strict';
import { rules, K } from '../js/puzzles/duell-regeln.js';
import { rules as kamp, neuerKampagnenStand, reihenfolge } from '../js/puzzles/kampagne.js';
import { kampagne } from '../data/kampagne.js';
import { disputation } from '../data/disputation.js';

const R = { ...disputation.regeln, ...kampagne.regeln };
const nachKapitel = (n) => { const ids = kampagne.kapitel.slice(0, n).flatMap((k) => k.gegner); return { ...neuerKampagnenStand(), sterne: Object.fromEntries(ids.map((x) => [x, 2])), gesehen: ids }; };

test('Kirchen-Modus: frei nach Kapitel 3, Karten und Anführer aus der Kampagne, Luther nacheinander', () => {
  assert.equal(kamp.kircheFrei(nachKapitel(2)), false);
  const s = nachKapitel(3);
  assert.equal(kamp.kircheFrei(s), true);
  const besitz = kamp.kircheBesitz(s);
  assert.ok(besitz.length >= R.deckMin, 'genug Karten für ein Deck');
  assert.ok(besitz.every((c) => !K(c).anfuehrer && !K(c).entkraeftet), 'nur Kirchenkarten, keine Anführer');
  const fuehrer = kamp.kircheAnfuehrerFrei(s);
  assert.equal(fuehrer.length, s.gesehen.filter((id) => kampagne.gegner[id].anfuehrer).length, 'je besiegtem Gegner mit Anführer einer'); assert.ok(fuehrer.every((a) => K(a).anfuehrer));
  const [a, b] = kampagne.kirchenSeite.gegner;
  assert.equal(kamp.kircheOffen(s, a), true); assert.equal(kamp.kircheOffen(s, b), false);
  const sieg = { sieger: 'kirche', runden: [], log: [] };
  const r = kamp.eintragenKirche(s, a, sieg);
  assert.ok(r.ersterSieg); assert.equal(r.stand.wachs, kampagne.kirchenSeite.lackJeSieg); assert.equal(kamp.kircheOffen(r.stand, b), true);
  assert.equal(kamp.eintragenKirche(r.stand, a, sieg).ersterSieg, false, 'Siegellack nur beim ersten Sieg');
});

test('Kirchen-Modus: Luthers Decks ohne Anachronismen-Lücken, Züge sind gültig, kluge Kirchendecks schlagen naive', () => {
  const s = nachKapitel(3);
  const besitz = kamp.kircheBesitz(s);
  const spiel = (g, deck, seed) => {
    let z = rules.start({ id: g.id, deck, anfuehrer: 'a-cajetan', regeln: g.regeln }, g.deck, seed, R, { anfuehrer: g.anfuehrer || null });
    z = rules.beginne(z);
    for (let i = 0; i < 300 && z.phase === 'spiel'; i++) {
      const vorher = z;
      z = z.am === 'kirche' ? rules.fuehreAus(z, rules.kiZug(z), 'kirche') : rules.fuehreAus(z, rules.kiZugLuther(z), 'luther');
      assert.notEqual(z, vorher, 'jeder Zug ändert den Stand');
    }
    assert.equal(z.phase, 'ende');
    return z.sieger;
  };
  for (const id of kampagne.kirchenSeite.gegner) {
    const g = kampagne.lutherGegner[id];
    for (const l of g.deck) assert.ok(K(l) && !K(l).anfuehrer, `${id}: ${l} ist eine Karte Luthers`);
    const gefahr = (c) => g.deck.some((l) => (K(l).entkraeftet || []).includes(c));
    const naiv = [...besitz].sort((a, b) => K(b).staerke - K(a).staerke).slice(0, 12);
    const klug = [...besitz].sort((a, b) => (gefahr(a) - gefahr(b)) || K(b).staerke - K(a).staerke).slice(0, 12);
    const q = (d) => { let n = 0; for (let i = 1; i <= 80; i++) if (spiel(g, d, i * 7919) === 'kirche') n++; return n / 80; };
    const qn = q(naiv), qk = q(klug);
    assert.ok(qk >= 0.25, `${id}: kluges Kirchendeck gewinnt oft genug (${qk})`);
    assert.ok(qk > qn || qk === 1, `${id}: Nachdenken lohnt sich (klug ${qk}, naiv ${qn})`);
  }
});

test('Kirchen-Modus: Abzeichen und großer Siegelbrief nach dem letzten Luther', () => {
  const sieg = { sieger: 'kirche', runden: [], log: [] };
  let s = nachKapitel(3);
  const [a, b, c] = kampagne.kirchenSeite.gegner;
  const A = (id) => kampagne.abzeichen.find((x) => x.id === id);
  assert.equal(kamp.abzeichenErfuellt(A('anwalt'), s, null), false);
  let r = kamp.eintragenKirche(s, a, sieg); s = r.stand;
  assert.equal(r.preis, false); assert.equal(kamp.abzeichenErfuellt(A('anwalt'), s, null), true);
  assert.equal(kamp.abzeichenErfuellt(A('beide-seiten'), s, null), false);
  s = kamp.eintragenKirche(s, b, sieg).stand;
  r = kamp.eintragenKirche(s, c, sieg); s = r.stand;
  assert.equal(r.preis, true, 'Preis nach dem letzten Luther');
  assert.equal(s.briefe.filter((x) => x.art === 'gross').length, 1, 'ein großer Siegelbrief');
  assert.equal(kamp.abzeichenErfuellt(A('beide-seiten'), s, null), true);
  assert.equal(kamp.eintragenKirche(s, c, sieg).preis, false, 'Preis nur einmal');
});
