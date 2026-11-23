// Spielstand und „Hammer & Siegel“ gehören zusammen: Nach „Neu beginnen“ oder mit einem anderen Code
// beginnt die Kampagne leer (geteilte Schul-iPads), ein älterer Fortschritt ohne Kennung wird einmal übernommen.
import test from 'node:test';
import assert from 'node:assert/strict';

// Browser-Speicher nachbauen, bevor die Module geladen werden
const daten = new Map();
globalThis.localStorage = { getItem: (k) => (daten.has(k) ? daten.get(k) : null), setItem: (k, v) => daten.set(k, String(v)), removeItem: (k) => daten.delete(k) };
const { store, ersetze, start } = await import('../js/engine/save.js');
const { neuerStand } = await import('../js/engine/state.js');
const { ladeStand, neuerKampagnenStand } = await import('../js/puzzles/kampagne.js');
const { kodiere, lies } = await import('../js/engine/code.js');
const KAMP = 'hier-stehe-ich.kampagne.v1';

test('Speicher: Kampagne gehört zum Spielstand, nach Neubeginn oder fremdem Code leer', () => {
  ersetze(neuerStand());
  const meins = store.state.spielId;
  assert.ok(meins, 'Spielstand hat eine Kennung');
  daten.set(KAMP, JSON.stringify({ ...neuerKampagnenStand(), spielId: meins, karten: ['r17'], lexikon: ['k3>c-brief'], wachs: 7 }));
  assert.deepEqual(ladeStand().karten, ['r17'], 'eigener Fortschritt wird geladen');

  // Neu beginnen: neue Kennung, Kampagne leer
  ersetze(neuerStand());
  assert.notEqual(store.state.spielId, meins);
  const neu = ladeStand();
  assert.deepEqual(neu.karten, []); assert.deepEqual(neu.lexikon, []); assert.equal(neu.wachs, 0);

  // Code eines anderen eingeben (anderes iPad): ebenfalls leer, nie der Fortschritt des Vorgängers
  daten.set(KAMP, JSON.stringify({ ...neuerKampagnenStand(), spielId: store.state.spielId, karten: ['r24'] }));
  const r = lies(kodiere(store.state));
  ersetze(r.stand);
  assert.deepEqual(ladeStand().karten, [], 'fremder Fortschritt wird nicht übernommen');
});

test('Speicher: älterer Fortschritt ohne Kennung bleibt erhalten und bekommt sie', () => {
  const alt = { ...neuerStand(), szene: 'druckerei' }; delete alt.spielId;
  daten.set('hier-stehe-ich.stand.v1', JSON.stringify(alt));
  daten.set(KAMP, JSON.stringify({ ...neuerKampagnenStand(), karten: ['r5'] }));
  start();
  assert.ok(store.state.spielId, 'alter Spielstand bekommt eine Kennung');
  assert.equal(JSON.parse(daten.get('hier-stehe-ich.stand.v1')).spielId, store.state.spielId, 'und behält sie');
  assert.deepEqual(ladeStand().karten, ['r5'], 'alter Kampagnen-Fortschritt bleibt');
  // Danach neu beginnen: Der alte Fortschritt gehört jetzt fest zum alten Spielstand
  ersetze(neuerStand());
  assert.deepEqual(ladeStand().karten, [], 'nach Neubeginn leer, keine zweite Übernahme');
});
