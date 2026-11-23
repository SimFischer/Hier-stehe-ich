// Hammer-&-Siegel-Code: Fortschritt der Kampagne auf ein anderes Gerät mitnehmen.
import test from 'node:test';
import assert from 'node:assert/strict';
import { kodiereKampagne, liesKampagne } from '../js/puzzles/kampagnen-code.js';
import { maxKopien, anzahl } from '../js/puzzles/duell-regeln.js';
import { lutherKarten } from '../data/kartei.js';
import { kampagne } from '../data/kampagne.js';
import { zufall } from './helfer.js';

const reihenfolge = kampagne.kapitel.flatMap((k) => k.gegner);
const paare = lutherKarten.flatMap((k) => (k.entkraeftet || []).map((c) => `${k.id}>${c}`));
const pool = lutherKarten.filter((k) => k.seltenheit);
const sortiert = (l) => [...l].sort();

function zufallsStand(rnd) {
  const waehle = (liste, p) => liste.filter(() => rnd() < p);
  const karten = pool.flatMap((k) => Array(Math.floor(rnd() * (maxKopien(k.id) + 1))).fill(k.id));
  return {
    sterne: Object.fromEntries(waehle(reihenfolge, 0.6).map((id) => [id, 1 + Math.floor(rnd() * 3)])),
    kircheSiege: waehle(kampagne.kirchenSeite.gegner, 0.5), durchgespielt: rnd() < 0.3 ? '2026-11-01' : null,
    abzeichen: waehle(kampagne.abzeichen.map((a) => a.id), 0.4), lexikon: waehle(paare, 0.4),
    wachs: Math.floor(rnd() * 40), briefe: [], anfuehrer: kampagne.anfuehrer[Math.floor(rnd() * 4)].id, karten
  };
}

test('Hammer-&-Siegel-Code: 45 Zeichen, Hin- und Rückweg erhalten den Fortschritt', () => {
  const rnd = zufall(1521);
  for (let i = 0; i < 200; i++) {
    const s = zufallsStand(rnd);
    const code = kodiereKampagne(s);
    assert.equal(code.replace(/-/g, '').length, 45);
    assert.match(code, /^([A-Z2-9]{5}-){8}[A-Z2-9]{5}$/);
    const r = liesKampagne(code.toLowerCase().replace(/-/g, ' '), '2026-11-23');
    assert.ok(r.stand, `Code ${i} lesbar`);
    assert.deepEqual(r.stand.sterne, s.sterne);
    assert.deepEqual(sortiert(r.stand.kircheSiege), sortiert(s.kircheSiege));
    assert.equal(Boolean(r.stand.durchgespielt), Boolean(s.durchgespielt));
    assert.deepEqual(sortiert(r.stand.abzeichen), sortiert(s.abzeichen));
    assert.deepEqual(sortiert(r.stand.lexikon), sortiert(s.lexikon));
    assert.equal(r.stand.wachs, s.wachs);
    assert.equal(r.stand.anfuehrer, s.anfuehrer);
    assert.deepEqual(sortiert(r.stand.karten), sortiert(s.karten));
    assert.deepEqual(sortiert(r.stand.gesehen), sortiert(Object.keys(s.sterne)));
  }
});

test('Hammer-&-Siegel-Code: volle Sammlung, Briefe als Siegellack, Obergrenze', () => {
  const alle = pool.flatMap((k) => Array(maxKopien(k.id)).fill(k.id));
  const r = liesKampagne(kodiereKampagne({ karten: alle, wachs: 3, briefe: [{ art: 'klein' }, { art: 'gross' }] }));
  for (const k of pool) assert.equal(anzahl(r.stand.karten, k.id), maxKopien(k.id));
  assert.equal(r.stand.wachs, 3 + 5 + 10, 'ungeöffnete Briefe werden zu Siegellack');
  assert.equal(liesKampagne(kodiereKampagne({ wachs: 999 })).stand.wachs, 127, 'Siegellack bis 127');
});

test('Hammer-&-Siegel-Code: Tippfehler und falsche Länge werden erkannt', () => {
  const rnd = zufall(7);
  const code = kodiereKampagne(zufallsStand(rnd)).replace(/-/g, '');
  let erkannt = 0;
  for (let i = 0; i < code.length; i++) {
    const anders = code[i] === 'A' ? 'B' : 'A';
    if (liesKampagne(code.slice(0, i) + anders + code.slice(i + 1)).fehler) erkannt += 1;
  }
  assert.equal(erkannt, code.length, 'jedes einzelne falsche Zeichen fällt auf');
  assert.equal(liesKampagne(code.slice(1)).fehler, 'form');
  assert.equal(liesKampagne('').fehler, 'form');
});
