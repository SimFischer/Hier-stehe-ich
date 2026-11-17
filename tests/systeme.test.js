// Simulation der drei Spielsysteme für drei Spielertypen, je 500 Durchgänge mit festem Startwert.
import test from 'node:test';
import assert from 'node:assert/strict';
import { zufall, spieleMarkt, spieleDruck, spieleVerhoer, verteilung, mittel } from './helfer.js';
import { rules as druck } from '../js/puzzles/druckwelle.js';
import { rules as duell } from '../js/puzzles/verhoer.js';
import { marktplatz } from '../data/systems/marktplatz.js';
import { druckwelle } from '../data/systems/druckwelle.js';
import { verhoer } from '../data/systems/verhoer.js';
import { cards } from '../data/cards.js';

const N = 500;
const laeufe = (fn) => Object.fromEntries(['sorgfaeltig', 'schwach', 'zufall'].map((typ) => { const rnd = zufall(1517); return [typ, Array.from({ length: N }, () => fn(typ, rnd))]; }));
// Mindestwissen: nur die Pflichtkarten der Stationen davor, dazu die zwei Thesen, die im Saal am wenigsten helfen.
const bisStation = (nr) => cards.filter((k) => k.art !== 'these' && Number(k.station.slice(1)) <= nr).map((k) => k.id);
const beutelMarkt = bisStation(4).filter((k) => k !== 'k6');
const beutelVerhoer = [...bisStation(6).filter((k) => k !== 'k10'), 't27', 't32'];

test('Marktplatz: lösbar, ausgewogen, endet immer', () => {
  const l = laeufe((typ, rnd) => spieleMarkt(marktplatz, beutelMarkt, typ, rnd));
  assert.deepEqual(verteilung(l.sorgfaeltig), { 3: N }, 'sorgfältig erreicht mit dem Mindestwissen immer die beste Stufe');
  assert.ok(mittel(l.zufall, (x) => x.stufe) < 1.5, 'zufälliges Tippen bleibt meist auf Stufe 1');
  assert.ok(mittel(l.schwach, (x) => x.stufe) > mittel(l.zufall, (x) => x.stufe));
  const alle = [...l.sorgfaeltig, ...l.schwach, ...l.zufall];
  assert.deepEqual(Object.keys(verteilung(alle)).sort(), ['1', '2', '3'], 'jede Auswertung ist erreichbar');
  assert.ok(alle.every((x) => x.zuege <= marktplatz.runden * marktplatz.gespraecheJeRunde), 'Rundenzahl hält');
  for (const f of marktplatz.figuren) assert.ok(Object.keys(f.ja).some((k) => beutelMarkt.includes(k)), `${f.id} ist mit dem Mindestwissen zu überzeugen`);
});

test('Druckwelle: Deutsch schlägt Latein, alle Stufen erreichbar', () => {
  const l = laeufe((typ, rnd) => spieleDruck(druckwelle, typ, rnd));
  assert.deepEqual(verteilung(l.sorgfaeltig), { 3: N });
  assert.ok(mittel(l.zufall, (x) => x.anteil) < mittel(l.schwach, (x) => x.anteil));
  assert.ok(mittel(l.zufall, (x) => x.stufe) < 2.5);
  const latein = spieleDruck(druckwelle, 'latein', zufall(3));
  assert.equal(latein.stufe, 1, 'nur Latein bleibt auf Stufe 1');
  assert.ok(latein.anteil < 20);
  const alle = [...l.sorgfaeltig, ...l.schwach, ...l.zufall, latein];
  assert.deepEqual(Object.keys(verteilung(alle)).sort(), ['1', '2', '3']);
  assert.ok(alle.every((x) => x.z.ende && x.z.runde === druckwelle.runden));
});

test('Druckwelle: Regeln im Einzelnen', () => {
  let z = druck.start(druckwelle);
  assert.equal(druck.kann(z, druckwelle, { stadt: 'koeln', fassung: 'latein' }), false, 'ferne Stadt ist nicht erreichbar');
  z = druck.zug(z, druckwelle, { stadt: 'leipzig', fassung: 'deutsch' });
  assert.equal(druck.kann(z, druckwelle, { stadt: 'magdeburg', fassung: 'deutsch' }), false, 'nur ein deutsches Blatt pro Woche');
  z = druck.rundeEnde(z, druckwelle);
  for (const n of ['wittenberg', 'magdeburg', 'erfurt']) assert.equal(z.st[n].f, 'deutsch', `Knoten Leipzig beliefert ${n}`);
  assert.equal(z.st.nuernberg.f, 'kein');
  for (const [a, b] of druckwelle.wege) for (const id of [a, b]) assert.ok(druckwelle.staedte.some((c) => c.id === id), `Weg nennt unbekannte Stadt ${id}`);
});

test('Verhör: lösbar, ausgewogen, vier Runden', () => {
  const l = laeufe((typ, rnd) => spieleVerhoer(verhoer, beutelVerhoer, typ, rnd));
  assert.deepEqual(verteilung(l.sorgfaeltig), { 3: N });
  assert.ok(mittel(l.zufall, (x) => x.stufe) < 1.5);
  const alle = [...l.sorgfaeltig, ...l.schwach, ...l.zufall];
  assert.deepEqual(Object.keys(verteilung(alle)).sort(), ['1', '2', '3']);
  assert.ok(alle.every((x) => x.z.runde === verhoer.einwaende.length));
  for (const e of verhoer.einwaende) {
    assert.ok(duell.passend(e).some((k) => beutelVerhoer.includes(k)), `Einwand ${e.id} hat eine Pflichtkarte als gute Antwort`);
    for (const k of Object.keys(e.antworten)) assert.ok(cards.some((c) => c.id === k), `Karte ${k} existiert`);
    // Keine Karte ohne Bonus schlägt einen Einwand: Es kommt auf das passende Argument an.
    for (const c of cards) if (!c.gegen?.[e.art]) assert.notEqual(duell.bewerte(e, c.id), 'gut', `${c.id} schlägt ${e.id} ohne Bonus`);
  }
});
