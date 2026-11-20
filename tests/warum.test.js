// „Warum?“-Moment: Für jeden Konter gibt es eine eindeutige Frage, und der Bonus gilt nur für diese Runde.
import test from 'node:test';
import assert from 'node:assert/strict';
import { warumFrage, belohne, WARUM_BONUS } from '../js/puzzles/warum.js';
import { rules, K, wert } from '../js/puzzles/duell-regeln.js';
import { lutherKarten } from '../data/kartei.js';
import { warum } from '../data/warum.js';
import { zufall } from './helfer.js';

const paare = lutherKarten.flatMap((l) => (l.entkraeftet || []).map((c) => [l.id, c]));

test('Warum-Frage: für jeden Konter Erklärung, richtige Antwort und zwei falsche zum selben Thema', () => {
  const rnd = zufall(95);
  for (const [l, c] of paare) {
    const info = warum.kirche[c];
    assert.ok(info?.erklaerung && info.erklaerung.length > 40, `${c}: Sacherklärung`);
    assert.equal(info.falsch.length, 2, `${c}: zwei falsche Antworten`);
    assert.ok(warum.antwort[`${l}>${c}`], `${l}>${c}: richtige Antwort`);
    assert.ok(warum.antwort[`${l}>${c}`].includes(`„${K(l).titel}“`), `${l}>${c}: Antwort nennt die Karte`);
    const f = warumFrage(l, c, rnd);
    assert.equal(f.optionen.length, 3);
    assert.equal(new Set(f.optionen.map((o) => o.text)).size, 3, 'keine doppelten Texte');
    assert.equal(f.optionen.filter((o) => o.id === l).length, 1, 'die richtige ist dabei');
    assert.ok(f.erklaerung);
    assert.ok(f.optionen.every((o) => !o.text.startsWith('„')), 'keine Antwort beginnt mit einem Kartennamen (würde die Lösung verraten)');
  }
  // Keine überflüssigen Einträge (Tippfehler in Schlüsseln)
  const gibt = new Set(paare.map(([l, c]) => `${l}>${c}`));
  for (const p of Object.keys(warum.antwort)) assert.ok(gibt.has(p), `${p} ist kein Konter-Paar`);
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
