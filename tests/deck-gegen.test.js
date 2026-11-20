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
