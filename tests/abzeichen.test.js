// Siegel-Abzeichen: Bedingungen, Belohnung, und dass jedes Abzeichen mit der vollen Sammlung erreichbar ist.
import test from 'node:test';
import assert from 'node:assert/strict';
import { rules, neuerKampagnenStand, ABZEICHEN_WACHS } from '../js/puzzles/kampagne.js';
import { K, maxKopien, deckGegen } from '../js/puzzles/duell-regeln.js';
import { kampagne } from '../data/kampagne.js';
import { lutherKarten } from '../data/kartei.js';
import { spieleDuell } from './duell-bot.js';
import { zufall } from './helfer.js';

const A = (id) => kampagne.abzeichen.find((a) => a.id === id);
const sieg = { sieger: 'luther', log: [], runden: [{ sieger: 'luther' }, { sieger: 'luther' }] };
const thesen = ['t27', 't27', 't32', 't32', 't36', 'k1', 'k2', 'k3'];

test('Abzeichen: Daten vollständig, Symbole vorhanden, Ziele existieren', () => {
  const ids = new Set();
  for (const a of kampagne.abzeichen) {
    assert.ok(a.id && a.titel && a.text && a.symbol && a.bed, a.id);
    assert.ok(!ids.has(a.id), `doppelt: ${a.id}`); ids.add(a.id);
    for (const g of [a.bed.gegner, a.bed.durchschaut].filter(Boolean)) assert.ok(kampagne.gegner[g], `${a.id}: Gegner ${g}`);
  }
  assert.ok(kampagne.abzeichen.length >= 12);
});

test('Abzeichen: Bedingungen werden genau geprüft', () => {
  const s = neuerKampagnenStand();
  assert.equal(rules.abzeichenErfuellt(A('thesen'), s, { gegner: 'k-tetzel', z: sieg, deck: thesen }), true);
  assert.equal(rules.abzeichenErfuellt(A('thesen'), s, { gegner: 'k-novize', z: sieg, deck: thesen }), false, 'falscher Gegner');
  assert.equal(rules.abzeichenErfuellt(A('thesen'), s, { gegner: 'k-tetzel', z: { ...sieg, sieger: 'kirche' }, deck: thesen }), false, 'nur bei Sieg');
  assert.equal(rules.abzeichenErfuellt(A('thesen'), s, { gegner: 'k-tetzel', z: sieg, deck: thesen.slice(1) }), false, 'zu wenige Thesen');
  const bibel = lutherKarten.find((k) => k.typ === 'bibel').id;
  assert.equal(rules.abzeichenErfuellt(A('ohne-bibel'), s, { gegner: 'k-eck', z: sieg, deck: thesen }), true);
  assert.equal(rules.abzeichenErfuellt(A('ohne-bibel'), s, { gegner: 'k-eck', z: sieg, deck: [...thesen, bibel] }), false);
  // Ohne Kratzer: keine Runde verloren, Gegner ab Kapitel 3
  const knapp = { ...sieg, runden: [{ sieger: 'kirche' }, { sieger: 'luther' }, { sieger: 'luther' }] };
  assert.equal(rules.abzeichenErfuellt(A('ohne-kratzer'), s, { gegner: 'k-emser', z: sieg, deck: thesen }), true);
  assert.equal(rules.abzeichenErfuellt(A('ohne-kratzer'), s, { gegner: 'k-emser', z: knapp, deck: thesen }), false);
  assert.equal(rules.abzeichenErfuellt(A('ohne-kratzer'), s, { gegner: 'k-tetzel', z: sieg, deck: thesen }), false, 'Kapitel 1 zählt nicht');
  // Auf eigenen Füßen: Anführer ausgespielt zählt nicht
  const mitFuehrer = { ...sieg, log: [{ seite: 'luther', art: 'spiel', id: 'a-luther' }] };
  assert.equal(rules.abzeichenErfuellt(A('allein'), s, { gegner: 'k-emser', z: mitFuehrer, deck: thesen }), false);
  // Kontermeister: Treffer aus dem Log zählen
  const treffer = { ...sieg, log: [{ seite: 'luther', art: 'spiel', id: 'k3', treffer: ['c-werke', 'c-ablass'] }, { seite: 'luther', art: 'spiel', id: 'k6', treffer: ['c-predigt', 'c-brief'] }] };
  assert.equal(rules.abzeichenErfuellt(A('kontermeister'), s, { gegner: 'k-novize', z: treffer, deck: thesen }), true);
  // Durchschaut: für jede Karte Tetzels ein entdeckter Konter, ganz ohne Partie
  const paare = lutherKarten.flatMap((k) => (k.entkraeftet || []).map((c) => `${k.id}>${c}`));
  const tetzel = [...new Set(kampagne.gegner['k-tetzel'].deck)];
  const lexikon = tetzel.map((c) => paare.find((p) => p.endsWith(`>${c}`)));
  assert.equal(rules.abzeichenErfuellt(A('tetzel-durchschaut'), { ...s, lexikon }, null), true);
  assert.equal(rules.abzeichenErfuellt(A('tetzel-durchschaut'), { ...s, lexikon: lexikon.slice(1) }, null), false);
});

test('Abzeichen: Belohnung mit Siegellack, jedes nur einmal', () => {
  const s = { ...neuerKampagnenStand(), wachs: 4 };
  const r = rules.vergebeAbzeichen(s, { gegner: 'k-tetzel', z: sieg, deck: thesen });
  assert.ok(r.neue.some((a) => a.id === 'thesen'));
  assert.equal(r.stand.wachs, 4 + r.neue.length * ABZEICHEN_WACHS, 'Siegellack bleibt stehen');
  assert.equal(r.stand.briefe.length, 0, 'keine automatischen Briefe');
  const nochmal = rules.vergebeAbzeichen(r.stand, { gegner: 'k-tetzel', z: sieg, deck: thesen });
  assert.equal(nochmal.neue.length, 0);
  assert.equal(nochmal.stand, r.stand);
});

test('Abzeichen: jedes Sieg-Abzeichen ist mit der vollen Sammlung erreichbar', () => {
  const besitz = lutherKarten.flatMap((k) => Array(maxKopien(k.id)).fill(k.id));
  const regeln = kampagne.regeln;
  for (const a of kampagne.abzeichen.filter((x) => !x.bed.durchschaut && !x.bed.lexikonMin)) {
    const b = a.bed;
    const gegnerId = b.gegner || (b.abKapitel ? kampagne.kapitel[b.abKapitel - 1].gegner[0] : 'k-tetzel');
    const g = kampagne.gegner[gegnerId];
    // Deck: zuerst die verlangten Karten, dann das beste Deck gegen den Gegner aus dem Rest
    const pflicht = [];
    for (const [art, n] of Object.entries(b.typMin || {})) pflicht.push(...besitz.filter((id) => K(id).typ === art).sort((x, y) => K(y).staerke - K(x).staerke).slice(0, n));
    if (b.bundMin) pflicht.push(...besitz.filter((id) => K(id).bund).sort((x, y) => K(y).staerke - K(x).staerke).slice(0, b.bundMin));
    const rest = [...besitz];
    for (const id of pflicht) rest.splice(rest.indexOf(id), 1);
    const erlaubt = rest.filter((id) => Object.entries(b.typMax || {}).every(([art, n]) => n > 0 || K(id).typ !== art));
    const max = b.deckMax || regeln.deckMax;
    const deck = [...pflicht, ...deckGegen(erlaubt, g, { ...regeln, deckMax: max - pflicht.length }).deck].slice(0, max);
    const rnd = zufall(1517);
    let geschafft = 0;
    for (let i = 0; i < 150; i++) {
      const z = spieleDuell(g, deck, 'klug', rnd);
      if (rules.abzeichenErfuellt(a, neuerKampagnenStand(), { gegner: gegnerId, z, deck })) geschafft += 1;
    }
    assert.ok(geschafft / 150 >= 0.1, `${a.id} gegen ${gegnerId}: nur ${geschafft}/150`);
  }
});
