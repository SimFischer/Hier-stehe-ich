// Fortsetzungscode: Hin- und Rückweg für jeden erreichbaren Stand, Ablehnung bei Tippfehlern.
import test from 'node:test';
import assert from 'node:assert/strict';
import { kodiere, lies } from '../js/engine/code.js';
import { neuerStand, kartenAusStand } from '../js/engine/state.js';
import { game } from '../data/game.js';

const reihenfolgen = [['p', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 'f'], ['p', 's2', 's1', 's3', 's4', 's5', 's6', 's7', 'f']];
const paare = [['t27', 't32'], ['t36', 't86'], ['t43', 't86'], ['t27', 't43']];

function staende() {
  const liste = [neuerStand()];
  let n = 0;
  for (const folge of reihenfolgen) for (let i = 1; i <= folge.length; i++) {
    const s = neuerStand();
    s.done = folge.slice(0, i);
    if (s.done.includes('s4')) { s.rat = ['behalten', 'armen', 'kaufen'][n % 3]; s.stufen.markt = 1 + (n % 3); }
    if (s.done.includes('s5')) { s.thesen = [...paare[n % paare.length]]; s.stufen.druck = 1 + ((n + 1) % 3); }
    if (s.done.includes('s6')) s.stufen.verhoer = 1 + ((n + 2) % 3);
    s.hilfen = n % 20;
    s.cards = kartenAusStand(s);
    liste.push(s); n += 1;
  }
  return liste;
}

test('Code: Hin- und Rückweg für jeden Zwischenstand', () => {
  for (const s of staende()) {
    const code = kodiere(s);
    assert.match(code, /^[A-Z2-9]{4}-[A-Z2-9]{4}$/);
    const r = lies(code);
    assert.ok(r.stand, `Code ${code} wird gelesen`);
    assert.deepEqual([...r.stand.done].sort(), [...s.done].sort());
    assert.deepEqual(r.stand.thesen, [...s.thesen].sort());
    assert.equal(r.stand.rat, s.rat);
    assert.deepEqual(r.stand.stufen, s.stufen);
    assert.equal(r.stand.hilfen, Math.min(15, s.hilfen));
    assert.deepEqual([...r.stand.cards].sort(), [...s.cards].sort());
    assert.equal(r.stand.szene, game.start);
  }
});

test('Code: Kleinschreibung, Leerzeichen und fehlender Strich sind erlaubt', () => {
  const code = kodiere(staende()[5]);
  assert.ok(lies(code.toLowerCase().replace('-', ' ')).stand);
  assert.ok(lies(code.replace('-', '')).stand);
});

test('Code: Tippfehler werden erkannt', () => {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (const s of staende().slice(0, 8)) {
    const code = kodiere(s).replace('-', '');
    for (let i = 0; i < 8; i++) for (const c of abc) {
      if (c === code[i]) continue;
      const falsch = code.slice(0, i) + c + code.slice(i + 1);
      assert.ok(lies(falsch).fehler, `${falsch} muss abgelehnt werden`);
    }
  }
  assert.equal(lies('ABC').fehler, 'form');
  assert.equal(lies('ABCD-01IO').fehler, 'form');
});
