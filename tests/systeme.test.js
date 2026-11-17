// Simulation der drei Spielsysteme für drei Spielertypen, je 500 Durchgänge mit festem Startwert.
import test from 'node:test';
import assert from 'node:assert/strict';
import { zufall, spieleMarkt, spieleDruck, verteilung, mittel } from './helfer.js';
import { spieleDuell, deckFuer } from './duell-bot.js';
import { rules as druck } from '../js/puzzles/druckwelle.js';
import { rules as duell, K, wert, summe } from '../js/puzzles/duell-regeln.js';
import { marktplatz } from '../data/systems/marktplatz.js';
import { druckwelle } from '../data/systems/druckwelle.js';
import { disputation } from '../data/disputation.js';
import { cards } from '../data/cards.js';

const N = 500;
const laeufe = (fn) => Object.fromEntries(['sorgfaeltig', 'schwach', 'zufall'].map((typ) => { const rnd = zufall(1517); return [typ, Array.from({ length: N }, () => fn(typ, rnd))]; }));
// Mindestwissen: nur die Pflichtkarten der Stationen davor, dazu die zwei Thesen, die im Saal am wenigsten helfen.
const bisStation = (nr) => cards.filter((k) => k.art !== 'these' && !k.duell && Number(k.station.slice(1)) <= nr).map((k) => k.id);
const beutelMarkt = bisStation(4).filter((k) => k !== 'k6');

test('Marktplatz: lösbar, ausgewogen, endet immer', () => {
  const l = laeufe((typ, rnd) => spieleMarkt(marktplatz, typ, rnd));
  assert.deepEqual(verteilung(l.sorgfaeltig), { 3: N }, 'sorgfältig erreicht mit dem Mindestwissen immer die beste Stufe');
  assert.ok(mittel(l.zufall, (x) => x.stufe) < 1.5, 'zufälliges Tippen bleibt meist auf Stufe 1');
  assert.ok(mittel(l.schwach, (x) => x.stufe) > mittel(l.zufall, (x) => x.stufe));
  const alle = [...l.sorgfaeltig, ...l.schwach, ...l.zufall];
  assert.deepEqual(Object.keys(verteilung(alle)).sort(), ['1', '2', '3'], 'jede Auswertung ist erreichbar');
  assert.ok(alle.every((x) => x.zuege <= marktplatz.runden * marktplatz.gespraecheJeRunde), 'Rundenzahl hält');
  for (const f of marktplatz.figuren) { assert.equal(f.antworten.length, 3, `${f.id}: drei Antworten`); assert.ok(f.antworten.some((a) => a.passt) && f.antworten.some((a) => !a.passt), `${f.id}: richtige und falsche Antworten`); }
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

// Disputation: Sammlung, wie sie nach einer Station im Spiel vorliegt (zwei Thesen, keine Belohnungskarten).
const sammlung = (nr) => [...bisStation(nr), ...(nr >= 5 ? ['t36', 't43'] : [])];
const quote = (gegner, deck, typ, n = 300) => { const rnd = zufall(1521); let s = 0; for (let i = 0; i < n; i++) if (spieleDuell(gegner, deck, typ, rnd).sieger === 'luther') s += 1; return s / n; };

test('Disputation: Regeln für Entkräften, Stärken, Bann, Gleichstand', () => {
  const g = { id: 'probe', deck: ['c-richter', 'c-predigt', 'c-ablass', 'c-bann'] };
  let z = duell.beginne(duell.start(g, ['k4', 'k3', 'k10', 'k2'], 7, { ...disputation.regeln, handStart: 4 }));
  z.seiten.luther.deck.push({ uid: 99, id: 'k6' }); // eine Karte zum Nachziehen
  const uid = (seite, id) => z.seiten[seite].hand.find((x) => x.id === id).uid;
  z = duell.spiele(z, 'luther', uid('luther', 'k2'));
  z = duell.spiele(z, 'kirche', uid('kirche', 'c-richter'));
  assert.equal(summe(z, 'kirche'), 9, 'Der strenge Richter zählt 9');
  const hand = z.seiten.luther.hand.length;
  z = duell.spiele(z, 'luther', uid('luther', 'k4'));
  assert.equal(summe(z, 'kirche'), 1, '„Wie der Vater“ entkräftet den Richter auf 1');
  assert.equal(z.log.at(-1).treffer[0], 'c-richter');
  assert.equal(z.seiten.luther.hand.length, hand - 1 + disputation.regeln.trefferZieht, 'Treffer: eine Karte nachziehen (wenn das Deck noch Karten hat)');
  z = duell.spiele(z, 'kirche', uid('kirche', 'c-predigt'));
  z = duell.spiele(z, 'luther', uid('luther', 'k10'));
  z = duell.spiele(z, 'kirche', uid('kirche', 'c-ablass'));
  const ablass = z.seiten.kirche.reihe.find((x) => x.id === 'c-ablass');
  assert.equal(wert(z, 'kirche', ablass), 10, 'Tetzels Predigt stärkt den Ablass um 2');
  z = duell.spiele(z, 'luther', uid('luther', 'k3'));
  assert.equal(wert(z, 'kirche', ablass), 1, '„Gnade ist ein Geschenk“ entkräftet den Ablass, Stärkungen fallen weg');
  z = duell.spiele(z, 'kirche', uid('kirche', 'c-bann'));
  assert.ok(z.seiten.luther.reihe.some((x) => x.id === 'k10'), 'Das standhafte Gewissen bleibt liegen');
  assert.ok(!z.seiten.luther.reihe.some((x) => x.id === 'k3'), 'Der Bann trifft die stärkste andere Karte');
  // Gleichstand: Die Kirche gewinnt die Runde.
  const gleich = { ...z, seiten: { luther: { ...z.seiten.luther, reihe: [{ uid: 900, id: 'k1' }], hand: [], gepasst: false }, kirche: { ...z.seiten.kirche, reihe: [{ uid: 901, id: 'c-ketzer' }], hand: [], gepasst: false } } };
  gleich.seiten.luther.reihe = [{ uid: 900, id: 'k5' }];
  const n = duell.passe(duell.passe({ ...gleich, am: 'luther' }, 'luther'), 'kirche');
  assert.equal(n.runden.at(-1).gleich, true);
  assert.equal(n.runden.at(-1).sieger, 'kirche', 'Bei Gleichstand hat die Kirche die Argumenthoheit');
});

test('Disputation: Jede starke Kirchenkarte hat eine Antwort, jedes Spiel endet', () => {
  for (const k of disputation.kirche) if (k.staerke >= 6) assert.ok(cards.some((c) => (c.entkraeftet || []).includes(k.id)), `${k.id} kann entkräftet werden`);
  for (const c of cards) for (const id of c.entkraeftet || []) assert.ok(K(id), `${c.id}: ${id} gibt es`);
  for (const g of Object.values(disputation.gegner)) {
    if (g.belohnung) assert.equal(K(g.belohnung).duell, g.id, `Belohnung ${g.belohnung} gehört zu ${g.id}`);
    const rnd = zufall(3);
    for (let i = 0; i < 100; i++) {
      const z = spieleDuell(g, sammlung(7), i % 2 ? 'klug' : 'zufall', rnd);
      assert.equal(z.phase, 'ende'); assert.ok(z.runden.length >= 2 && z.runden.length <= 3);
    }
  }
  // Die Kirche ist ohne Gegenkarten überlegen: Ihr Deck ist im Schnitt mehr als doppelt so stark.
  const mittelStaerke = (ids) => ids.reduce((n, id) => n + K(id).staerke, 0) / ids.length;
  assert.ok(mittelStaerke(disputation.gegner.worms.deck) > 2 * mittelStaerke(sammlung(6)));
});

test('Disputation: Balance je Gegner und Zeitpunkt', () => {
  const G = disputation.gegner;
  const tetzel = quote(G.tetzel, deckFuer(sammlung(4), G.tetzel), 'klug');
  const tetzelZufall = quote(G.tetzel, sammlung(4), 'zufall');
  const ohneKonter = quote(G.tetzel, sammlung(4).filter((id) => !['k3', 'k4', 'w2', 'k6', 'w1'].includes(id)), 'klug');
  const eckFrueh = quote(G.eck, deckFuer(sammlung(5), G.eck), 'klug');
  const eckSpaet = quote(G.eck, deckFuer(sammlung(6), G.eck), 'klug');
  const worms = quote(G.worms, deckFuer(sammlung(6), G.worms), 'klug');
  const wormsAlles = quote(G.worms, sammlung(6), 'klug');
  const frei = quote(G.frei, deckFuer([...sammlung(7), 'n1', 'n2', 't27', 't86'], G.frei), 'klug');
  console.log('Siegquoten:', { tetzel, tetzelZufall, ohneKonter, eckFrueh, eckSpaet, worms, wormsAlles, frei });
  assert.ok(tetzel >= 0.65, 'Tetzel ist klug gespielt meist zu schlagen');
  assert.ok(tetzelZufall <= 0.3, 'Wahllos gespielt verliert man meist');
  assert.ok(ohneKonter <= 0.1, 'Ohne die passenden Erkenntnisse ist die Kirche überlegen');
  assert.ok(eckFrueh <= 0.2 && eckSpaet >= 0.45, 'Leipzig: Vor Worms fehlt die Antwort auf die Konzilien');
  assert.ok(worms >= 0.55, 'Worms ist mit passendem Deck gut zu schlagen');
  assert.ok(wormsAlles < worms, 'Ein Deck passend zum Gegner hilft');
  assert.ok(frei >= 0.35 && frei <= 0.85, 'Die große Disputation ist eine Herausforderung');
});

test('Disputation: Lernhinweis nach einer Niederlage nennt fehlende Karten und wo es sie gibt', () => {
  const g = disputation.gegner.eck;
  const deck = deckFuer(sammlung(5), g);
  const rnd = zufall(8);
  let z; do z = spieleDuell(g, deck, 'klug', rnd); while (z.sieger === 'luther');
  const tipps = duell.verpasst(z, sammlung(5), deck);
  assert.ok(tipps.length > 0);
  for (const x of tipps) { assert.ok(K(x.kirche) && K(x.karte)); assert.ok(['runde', 'hand', 'deck', 'besitz', 'fehlt'].includes(x.ort)); }
  if (tipps.some((x) => x.kirche === 'c-konzil')) assert.equal(tipps.find((x) => x.kirche === 'c-konzil').ort, 'fehlt', 'Konzilien irren gibt es erst in Worms');
});
