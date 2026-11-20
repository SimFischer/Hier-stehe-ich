// Druckerwerkstatt: Siegellack für Siegelbriefe, Wunschkarten und Prachtausgaben.
import test from 'node:test';
import assert from 'node:assert/strict';
import { rules, neuerKampagnenStand, reihenfolge } from '../js/puzzles/kampagne.js';
import { K, maxKopien, anzahl } from '../js/puzzles/duell-regeln.js';
import { kampagne } from '../data/kampagne.js';
import { cards } from '../data/cards.js';

const story = cards.map((k) => k.id);
const W = kampagne.werkstatt;

test('Werkstatt: Siegelbrief kostet Siegellack, ohne genug geht nichts', () => {
  const s = { ...neuerKampagnenStand(), wachs: W.brief - 1 };
  assert.equal(rules.kaufe(s, { art: 'brief' }, story), null);
  const n = rules.kaufe({ ...s, wachs: W.brief + 2 }, { art: 'brief' }, story);
  assert.equal(n.wachs, 2); assert.equal(n.briefe.length, 1);
});

test('Werkstatt: Wunschkarten nur als Konter gegen bekannte Karten, nach Kapitel begrenzt, nicht über die Kopiengrenze', () => {
  const s = { ...neuerKampagnenStand(), wachs: 100 };
  assert.equal(rules.druckbar(s, story).length, 0, 'ohne bekannte Kirchenkarten nichts');
  const s1 = { ...s, gesehen: ['k-novize'] };
  const d = rules.druckbar(s1, story);
  assert.ok(d.length > 0);
  const bekannt = rules.bekannteKirche(s1);
  for (const id of d) {
    assert.ok(K(id).entkraeftet.some((c) => bekannt.has(c)), `${id} kontert eine bekannte Karte`);
    assert.ok(['gewoehnlich', 'selten'].includes(K(id).seltenheit), 'Kapitel 1: höchstens selten');
    assert.ok(anzahl(story, id) < maxKopien(id));
  }
  const id = d[0];
  const n = rules.kaufe(s1, { art: 'karte', id }, story);
  assert.equal(n.wachs, 100 - W.karte[K(id).seltenheit]); assert.ok(n.karten.includes(id));
  // Volle Kopien: nicht mehr druckbar
  const voll = Array(maxKopien(id)).fill(id);
  assert.ok(!rules.druckbar(s1, voll).includes(id));
  assert.equal(rules.kaufe(s1, { art: 'karte', id }, voll), null);
  // Weiter in der Kampagne: auch Legendäres
  const weit = { ...s1, sterne: Object.fromEntries(reihenfolge.slice(0, 7).map((x) => [x, 1])), gesehen: reihenfolge.slice(0, 8) };
  assert.equal(rules.hoechsteDruckbar(weit), 'legendaer');
});

test('Werkstatt: Prachtausgabe in zwei Stufen, nur für eigene Karten', () => {
  const s = { ...neuerKampagnenStand(), wachs: 20 };
  const id = story[0];
  assert.equal(rules.kaufe(s, { art: 'pracht', id: 'r17' }, story), null, 'nicht für fremde Karten');
  const a = rules.kaufe(s, { art: 'pracht', id }, story);
  assert.equal(a.pracht[id], 1); assert.equal(a.wachs, 20 - W.pracht[0]);
  const b = rules.kaufe(a, { art: 'pracht', id }, story);
  assert.equal(b.pracht[id], 2); assert.equal(b.wachs, 20 - W.pracht[0] - W.pracht[1]);
  assert.equal(rules.kaufe(b, { art: 'pracht', id }, story), null, 'höchste Stufe erreicht');
});

test('Abschluss: erster Sieg gegen den letzten Gegner zählt als durchgespielt, nur einmal', () => {
  const sieg = { sieger: 'luther', runden: [{ sieger: 'luther' }, { sieger: 'luther' }], log: [] };
  const verloren = { sieger: 'kirche', runden: [{ sieger: 'kirche' }], log: [] };
  const letzter = reihenfolge.at(-1);
  let s = neuerKampagnenStand();
  assert.equal(rules.eintragen(s, reihenfolge[0], sieg, 12).finale, false, 'andere Gegner: kein Abschluss');
  assert.equal(rules.eintragen(s, letzter, verloren, 12).finale, false, 'Niederlage: kein Abschluss');
  const r = rules.eintragen(s, letzter, sieg, 12, '2026-11-20');
  assert.equal(r.finale, true); assert.equal(r.stand.durchgespielt, '2026-11-20');
  const nochmal = rules.eintragen(r.stand, letzter, sieg, 12, '2026-12-01');
  assert.equal(nochmal.finale, false, 'nur beim ersten Mal'); assert.equal(nochmal.stand.durchgespielt, '2026-11-20');
  // Der Ausklang ordnet historisch ein und erfindet kein Zitat
  assert.ok(kampagne.finale.ausklang.join(' ').includes('nicht'), 'Ausklang sagt, dass Luther Rom nicht besiegt hat');
});

test('Kapitel-Abschluss: genau dann, wenn der dritte Gegner eines Kapitels zum ersten Mal besiegt ist', () => {
  const sieg = { sieger: 'luther', runden: [{ sieger: 'luther' }, { sieger: 'luther' }], log: [] };
  const [a, b, c] = kampagne.kapitel[0].gegner;
  let s = neuerKampagnenStand();
  let r = rules.eintragen(s, a, sieg, 12); assert.equal(r.kapitelFertig, null); s = r.stand;
  r = rules.eintragen(s, b, sieg, 12); assert.equal(r.kapitelFertig, null); s = r.stand;
  r = rules.eintragen(s, c, sieg, 12); assert.equal(r.kapitelFertig, 0, 'Kapitel 1 geschafft'); s = r.stand;
  assert.equal(rules.eintragen(s, c, sieg, 12).kapitelFertig, null, 'nur beim ersten Mal');
  // Letztes Kapitel: kein kleiner Abschluss, sondern das Finale
  const letztes = kampagne.kapitel.at(-1).gegner;
  const fast = { ...s, sterne: Object.fromEntries(reihenfolge.slice(0, -1).map((x) => [x, 1])) };
  const ende = rules.eintragen(fast, letztes.at(-1), sieg, 12);
  assert.equal(ende.kapitelFertig, null); assert.equal(ende.finale, true);
  for (const k of kampagne.kapitel.slice(0, -1)) assert.ok(k.geschafft && k.weiter, `${k.titel}: Texte für den Abschluss`);
});
