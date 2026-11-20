// „Warum?“-Moment: Für jeden Konter gibt es eine eindeutige Frage, und der Bonus gilt nur für diese Runde.
import test from 'node:test';
import assert from 'node:assert/strict';
import { warumFrage, belohne, WARUM_BONUS } from '../js/puzzles/warum.js';
import { rules, K, wert } from '../js/puzzles/duell-regeln.js';
import { lutherKarten } from '../data/kartei.js';
import { zufall } from './helfer.js';

const paare = lutherKarten.flatMap((l) => (l.entkraeftet || []).map((c) => [l.id, c]));

test('Warum-Frage: drei verschiedene Antworten, genau eine passt, falsche gehören zu anderen Themen', () => {
  const rnd = zufall(95);
  for (const [l, c] of paare) for (let i = 0; i < 3; i++) {
    const f = warumFrage(l, c, rnd);
    assert.equal(f.optionen.length, 3, `${l}>${c}`);
    assert.equal(new Set(f.optionen.map((o) => o.text)).size, 3, 'keine doppelten Texte');
    assert.equal(f.optionen.filter((o) => o.id === l).length, 1, 'die richtige ist dabei');
    const thema = K(c).gruppe;
    for (const o of f.optionen.filter((x) => x.id !== l)) {
      assert.ok(!(K(o.id).entkraeftet || []).includes(c), `${o.id} entkräftet ${c} nicht`);
      assert.ok(!(K(o.id).entkraeftet || []).some((x) => K(x).gruppe === thema), `${o.id}: anderes Thema als ${c}`);
      assert.notEqual(K(o.id).typ, K(l).typ, `${o.id}: andere Kartenart als ${l}`);
    }
  }
});

test('Warum-Bonus: +2 auf das Exemplar in der Reihe, nach der Runde vorbei', () => {
  const gegner = { id: 'probe', deck: ['c-werke', 'c-brief', 'c-ablass', 'c-predigt', 'c-papst', 'c-konzil', 'c-hus', 'c-bann', 'c-tradition', 'c-kurie'] };
  let z = rules.beginne(rules.start(gegner, lutherKarten.slice(0, 12).map((k) => k.id), 7));
  const inst = z.seiten.luther.hand[0];
  z = rules.spiele(z, 'luther', inst.uid);
  const vorher = wert(z, 'luther', z.seiten.luther.reihe.find((x) => x.uid === inst.uid));
  const n = belohne(z, 'luther', inst.uid);
  assert.equal(wert(n, 'luther', n.seiten.luther.reihe.find((x) => x.uid === inst.uid)), vorher + WARUM_BONUS);
  assert.equal(z.seiten.luther.reihe[0].plus, undefined, 'der alte Stand bleibt unverändert');
  assert.doesNotThrow(() => belohne(z, 'luther', 99999), 'unbekannte Karte: kein Fehler');
});
