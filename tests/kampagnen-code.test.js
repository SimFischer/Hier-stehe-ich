// Hammer-&-Siegel-Code (20 Zeichen): Fortschritt der Kampagne auf ein anderes Gerät mitnehmen.
import test from 'node:test';
import assert from 'node:assert/strict';
import { kodiereKampagne, liesKampagne } from '../js/puzzles/kampagnen-code.js';
import { rules, neuerKampagnenStand, LEXIKON_JE_BRIEF } from '../js/puzzles/kampagne.js';
import { maxKopien, anzahl, K } from '../js/puzzles/duell-regeln.js';
import { lutherKarten } from '../data/kartei.js';
import { cards } from '../data/cards.js';
import { kampagne } from '../data/kampagne.js';
import { zufall } from './helfer.js';

const reihenfolge = kampagne.kapitel.flatMap((k) => k.gegner);
const paare = lutherKarten.flatMap((k) => (k.entkraeftet || []).map((c) => `${k.id}>${c}`));
const pool = lutherKarten.filter((k) => k.seltenheit);
const story = cards.map((k) => k.id);
const sortiert = (l) => [...l].sort();
const jeSeltenheit = (liste) => { const n = {}; for (const id of liste) n[K(id).seltenheit] = (n[K(id).seltenheit] || 0) + 1; return n; };

function zufallsStand(rnd) {
  const waehle = (liste, p) => liste.filter(() => rnd() < p);
  // Kampagnenkarten wie im Spiel: höchstens so viele Kopien, wie man zusätzlich zur Geschichte haben darf
  const karten = pool.flatMap((k) => Array(Math.floor(rnd() * (maxKopien(k.id) - anzahl(story, k.id) + 1))).fill(k.id));
  return {
    sterne: Object.fromEntries(waehle(reihenfolge, 0.6).map((id) => [id, 1 + Math.floor(rnd() * 3)])),
    kircheSiege: waehle(kampagne.kirchenSeite.gegner, 0.5), durchgespielt: rnd() < 0.3 ? '2026-11-01' : null,
    abzeichen: waehle(kampagne.abzeichen.map((a) => a.id), 0.4), lexikon: waehle(paare, 0.4),
    wachs: Math.floor(rnd() * 40), briefe: [], anfuehrer: kampagne.anfuehrer[Math.floor(rnd() * 4)].id, karten
  };
}

test('Hammer-&-Siegel-Code: 20 Zeichen, Fortschritt genau, Karten gleich viele je Seltenheit', () => {
  const rnd = zufall(1521);
  for (let i = 0; i < 200; i++) {
    const s = zufallsStand(rnd);
    const code = kodiereKampagne(s);
    assert.match(code, /^([A-Z2-9]{5}-){3}[A-Z2-9]{5}$/);
    const r = liesKampagne(code.toLowerCase().replace(/-/g, ' '), { heute: '2026-11-23', storyKarten: story });
    assert.ok(r.stand, `Code ${i} lesbar`);
    assert.deepEqual(r.stand.sterne, s.sterne);
    assert.deepEqual(sortiert(r.stand.kircheSiege), sortiert(s.kircheSiege));
    assert.equal(Boolean(r.stand.durchgespielt), Boolean(s.durchgespielt));
    assert.deepEqual(sortiert(r.stand.abzeichen), sortiert(s.abzeichen));
    assert.equal(r.stand.wachs, s.wachs);
    assert.equal(r.stand.anfuehrer, s.anfuehrer);
    assert.equal(r.stand.lexikonGutschrift, s.lexikon.length);
    assert.deepEqual(r.stand.lexikon, []);
    assert.deepEqual(jeSeltenheit(r.stand.karten), jeSeltenheit(s.karten), 'gleich viele Karten je Seltenheit');
    for (const id of new Set(r.stand.karten)) assert.ok(anzahl(r.stand.karten, id) + anzahl(story, id) <= maxKopien(id), `${id} nicht über die Grenze`);
    assert.deepEqual(liesKampagne(code, { storyKarten: story }).stand.karten, r.stand.karten, 'gleicher Code, gleiche Karten');
  }
});

test('Hammer-&-Siegel-Code: Briefe als Siegellack, Obergrenzen, volle Sammlung', () => {
  const r = liesKampagne(kodiereKampagne({ wachs: 3, briefe: [{ art: 'klein' }, { art: 'gross' }] }));
  assert.equal(r.stand.wachs, 18);
  assert.equal(liesKampagne(kodiereKampagne({ wachs: 999 })).stand.wachs, 127);
  const alle = pool.flatMap((k) => Array(maxKopien(k.id)).fill(k.id));
  const voll = liesKampagne(kodiereKampagne({ karten: alle }));
  for (const k of pool) assert.equal(anzahl(voll.stand.karten, k.id), maxKopien(k.id));
});

test('Hammer-&-Siegel-Code: Lexikon-Gutschrift verhindert doppelte Siegelbriefe', () => {
  const s = { ...neuerKampagnenStand(), lexikonGutschrift: 7 };
  let st = s; let briefe = 0;
  for (const p of paare.slice(0, 10)) { const [l, c] = p.split('>'); const r = rules.entdecke(st, l, c, 'k-novize'); st = r.stand; if (r.brief) briefe += 1; }
  assert.equal(briefe, 1, 'Brief erst beim 10. Eintrag (5 war schon belohnt)');
  assert.equal(LEXIKON_JE_BRIEF, 5);
  assert.equal(liesKampagne(kodiereKampagne({ lexikon: ['k3>c-brief'], lexikonGutschrift: 12 })).stand.lexikonGutschrift, 12, 'Gutschrift bleibt bei erneutem Umzug');
});

test('Hammer-&-Siegel-Code: Tippfehler und falsche Länge werden erkannt', () => {
  const code = kodiereKampagne(zufallsStand(zufall(7))).replace(/-/g, '');
  for (let i = 0; i < code.length; i++) {
    const anders = code[i] === 'A' ? 'B' : 'A';
    assert.ok(liesKampagne(code.slice(0, i) + anders + code.slice(i + 1)).fehler, `Zeichen ${i + 1} falsch fällt auf`);
  }
  assert.equal(liesKampagne(code.slice(1)).fehler, 'form');
  assert.equal(liesKampagne('').fehler, 'form');
});
