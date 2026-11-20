// Automatisches Deck gegen einen Gegner: nur eigene Karten, Kopien eingehalten, Konter zuerst
import test from 'node:test';
import assert from 'node:assert/strict';
import { deckGegen, anzahl, K } from '../js/puzzles/duell-regeln.js';
import { disputation } from '../data/disputation.js';
import { kampagne } from '../data/kampagne.js';
import { lutherKarten } from '../data/kartei.js';

const R = disputation.regeln;
const alleGegner = { ...disputation.gegner, ...kampagne.gegner };

test('deckGegen nutzt nur eigene Karten in eigener Anzahl', () => {
  const besitz = lutherKarten.slice(0, 20).map((k) => k.id);
  besitz.push(besitz[0]); // eine doppelte Kopie
  for (const g of Object.values(alleGegner)) {
    const { deck } = deckGegen(besitz, g, R);
    assert.ok(deck.length <= R.deckMax);
    for (const id of new Set(deck)) assert.ok(anzahl(deck, id) <= anzahl(besitz, id), `${id} zu oft`);
  }
});

test('deckGegen nimmt vorhandene Konter zuerst und meldet fehlende', () => {
  const besitz = lutherKarten.map((k) => k.id);
  for (const [name, g] of Object.entries(alleGegner)) {
    const { deck, abgedeckt, fehlt } = deckGegen(besitz, g, R);
    for (const a of abgedeckt) {
      assert.ok(deck.includes(a.karte));
      assert.ok(K(a.karte).entkraeftet.includes(a.kirche), `${name}: ${a.karte} kontert ${a.kirche} nicht`);
    }
    assert.equal(fehlt.length, 0, `${name}: mit allen Karten darf kein Konter fehlen`);
  }
  // Mit wenigen Karten: was fehlt, wird genannt
  const wenig = deckGegen(['t1', 't2', 't3'].filter((id) => K(id)), disputation.gegner.tetzel || Object.values(alleGegner)[0], R);
  assert.ok(Array.isArray(wenig.fehlt));
});

test('Startdeck: nur eigene Karten, die stärksten Gegnerkarten bleiben ohne Konter', async () => {
  const { startDeckGegen } = await import('../js/puzzles/duell-regeln.js');
  const { maxKopien } = await import('../js/puzzles/duell-regeln.js');
  const besitz = lutherKarten.flatMap((k) => Array(maxKopien(k.id)).fill(k.id));
  for (const [name, g] of Object.entries(kampagne.gegner)) {
    const r = startDeckGegen(besitz, g, R, { groesse: 10, offenLassen: 3 });
    assert.equal(r.deck.length, 10, name);
    for (const id of new Set(r.deck)) assert.ok(anzahl(r.deck, id) <= anzahl(besitz, id));
    assert.ok(r.offen.length >= 3, `${name}: mindestens drei Karten bleiben offen`);
    // Die stärksten Karten des Gegners bleiben offen (alle, die stärker sind als die drittstärkste)
    const kirche = [...new Set([...g.deck, g.anfuehrer].filter(Boolean))].filter((c) => lutherKarten.some((k) => (k.entkraeftet || []).includes(c)));
    const dritte = kirche.map((c) => K(c).staerke).sort((a, b) => b - a)[2];
    for (const c of kirche.filter((x) => K(x).staerke > dritte)) assert.ok(r.offen.includes(c), `${name}: ${c} (stark) bleibt offen`);
    assert.ok(r.abgedeckt.length > 0, `${name}: ein paar Konter sind drin`);
    // Das beste Deck kontert mehr
    assert.ok(deckGegen(besitz, g, R).abgedeckt.length > r.abgedeckt.length, `${name}: bestes Deck kontert mehr`);
  }
});

test('Kampagne: bestes Deck erst nach zwei Niederlagen oder einem Sieg', async () => {
  const { rules, neuerKampagnenStand } = await import('../js/puzzles/kampagne.js');
  const verloren = { sieger: 'kirche', runden: [{ sieger: 'kirche' }], log: [] };
  const gewonnen = { sieger: 'luther', runden: [{ sieger: 'luther' }, { sieger: 'luther' }], log: [] };
  let s = neuerKampagnenStand();
  assert.equal(rules.bestesDeckNoch(s, 'k-tetzel'), kampagne.bestesDeckNach);
  s = rules.eintragen(s, 'k-tetzel', verloren, 10).stand;
  assert.equal(rules.bestesDeckNoch(s, 'k-tetzel'), kampagne.bestesDeckNach - 1);
  assert.equal(rules.bestesDeckNoch(s, 'k-eck'), kampagne.bestesDeckNach, 'zählt je Gegner');
  s = rules.eintragen(s, 'k-tetzel', verloren, 10).stand;
  assert.equal(rules.bestesDeckNoch(s, 'k-tetzel'), 0);
  const s2 = rules.eintragen(neuerKampagnenStand(), 'k-eck', gewonnen, 12).stand;
  assert.equal(rules.bestesDeckNoch(s2, 'k-eck'), 0, 'nach einem Sieg frei');
  assert.equal(rules.startDeck('k-novize').groesse, kampagne.startDeck.groesse[0]);
  assert.equal(rules.startDeck('k-leo').groesse, kampagne.startDeck.groesse[3]);
});
