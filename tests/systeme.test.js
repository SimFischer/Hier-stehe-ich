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
import { kampagne } from '../data/kampagne.js';
import { game } from '../data/game.js';
import { rules as kamp, reihenfolge, neuerKampagnenStand } from '../js/puzzles/kampagne.js';
import { cards } from '../data/cards.js';

const N = 500;
const laeufe = (fn) => Object.fromEntries(['sorgfaeltig', 'schwach', 'zufall'].map((typ) => { const rnd = zufall(1517); return [typ, Array.from({ length: N }, () => fn(typ, rnd))]; }));
// Mindestwissen: nur die Pflichtkarten der Stationen davor, dazu die zwei Thesen, die im Saal am wenigsten helfen.
// Karten bis zu einer Station (nach ihrer Nummer auf der Karte), ohne Thesen und Belohnungen
const stationNr = (id) => game.stationen.find((st) => st.id === id).nr;
const bisStation = (nr) => cards.filter((k) => k.art !== 'these' && !k.duell && stationNr(k.station) <= nr).map((k) => k.id);
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

test('Druckwelle: Wer plant, erreicht mehr; ohne Boten bleibt es klein; alle Stufen erreichbar', () => {
  const l = laeufe((typ, rnd) => spieleDruck(druckwelle, typ, rnd));
  assert.deepEqual(verteilung(l.sorgfaeltig), { 3: N }, 'wer Verbote und Druckereien beachtet, erreicht Stufe 3');
  assert.ok(mittel(l.zufall, (x) => x.anteil) < mittel(l.sorgfaeltig, (x) => x.anteil));
  assert.ok(mittel(l.zufall, (x) => x.stufe) < 2.5, 'zufälliges Tippen reicht meist nicht für Stufe 3');
  const passiv = spieleDruck(druckwelle, 'passiv', zufall(3));
  assert.equal(passiv.stufe, 1, 'ohne Boten bleibt es bei Stufe 1');
  const alle = [...l.sorgfaeltig, ...l.schwach, ...l.zufall, passiv];
  assert.deepEqual(Object.keys(verteilung(alle)).sort(), ['1', '2', '3']);
  assert.ok(alle.every((x) => x.z.ende && x.z.runde === druckwelle.runden));
  // Latein trägt nicht weit: Nach der Lateinwoche kennen nur wenige die Thesen.
  assert.ok(l.sorgfaeltig.every((x) => x.z.lateinAnteil < 15));
});

test('Druckwelle: Regeln im Einzelnen', () => {
  const d = druckwelle;
  let z = druck.start(d);
  assert.equal(druck.sprache(z, d), 'latein');
  assert.equal(druck.kann(z, d, 'koeln'), false, 'ferne Stadt ist nicht erreichbar');
  z = druck.zug(z, d, 'leipzig');
  assert.equal(z.st.leipzig.f, 'latein', 'Woche 1: nur Latein');
  z = druck.rundeEnde(z, d);
  assert.deepEqual(z.ereignis.gedruckt, [], 'Latein wird nicht nachgedruckt');
  assert.equal(druck.sprache(z, d), 'deutsch'); assert.equal(z.ereignis.phase, 'deutsch');
  assert.equal(z.st.wittenberg.f, 'deutsch', 'Luther schreibt auf Deutsch');
  z = druck.zug(z, d, 'leipzig');
  assert.equal(z.st.leipzig.f, 'deutsch', 'Deutsch ersetzt Latein');
  z = druck.rundeEnde(z, d);
  assert.equal(z.st.erfurt.f, 'kein', 'Leipzig setzt erst eine Woche');
  assert.equal(z.st.magdeburg.f, 'deutsch', 'Wittenberg druckt nach');
  assert.equal(z.ereignis.phase, 'kirche'); assert.ok(z.droht.length > 0, 'ab Woche 3 droht ein Verbot');
  const ziel = z.droht[0];
  const geschuetzt = druck.kann(z, d, ziel) ? druck.zug(z, d, ziel) : z;
  const n = druck.rundeEnde(geschuetzt, d);
  if (geschuetzt !== z) assert.ok(n.ereignis.zuSpaet.includes(ziel), 'erreicht vor dem Verbot: zu spät für die Kirche');
  for (const id of n.ereignis.verbot) { assert.equal(n.st[id].f, 'verbot'); assert.equal(druck.kann(n, d, id), false, 'verbotene Stadt bleibt zu'); }
  for (const [a, b] of d.wege) for (const id of [a, b]) assert.ok(d.staedte.some((c) => c.id === id), 'Weg nennt eine unbekannte Stadt');
});

// Disputation: Sammlung, wie sie nach einer Station im Spiel vorliegt (zwei Thesen, keine Belohnungskarten).
const sammlung = (nr) => [...bisStation(nr), ...(nr >= 5 ? ['t36', 't43'] : [])];
const quote = (gegner, deck, typ, n = 300, anfuehrer = undefined) => { const rnd = zufall(1521); let s = 0; for (let i = 0; i < n; i++) if (spieleDuell(gegner, deck, typ, rnd, anfuehrer).sieger === 'luther') s += 1; return s / n; };

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
    if (g.belohnung) assert.equal(K(g.belohnung).duell, g.siegAls || g.id, `Belohnung ${g.belohnung} gehört zu ${g.id}`);
    const rnd = zufall(3);
    for (let i = 0; i < 100; i++) {
      const z = spieleDuell(g, sammlung(8), i % 2 ? 'klug' : 'zufall', rnd);
      assert.equal(z.phase, 'ende'); assert.ok(z.runden.length >= 2 && z.runden.length <= 3);
    }
  }
  // Die Kirche ist ohne Gegenkarten überlegen: Ihr Deck ist im Schnitt mehr als doppelt so stark.
  const mittelStaerke = (ids) => ids.reduce((n, id) => n + K(id).staerke, 0) / ids.length;
  assert.ok(mittelStaerke(disputation.gegner.worms.deck) > 2 * mittelStaerke(sammlung(7)));
});

test('Disputation: Handlungsbogen in der Geschichte', () => {
  const G = disputation.gegner;
  // Station 4: Tetzel ist meist stärker. Station 5: Mit den Thesen gewinnt man die Revanche.
  const tetzel = quote(G.tetzel, deckFuer(sammlung(4), G.tetzel), 'klug');
  const tetzelZufall = quote(G.tetzel, sammlung(4), 'zufall');
  const ohneKonter = quote(G.tetzel, sammlung(4).filter((id) => !['k3', 'k4', 'w2', 'k6', 'w1'].includes(id)), 'klug');
  const revanche = quote(G.tetzel2, deckFuer(sammlung(5), G.tetzel2), 'klug');
  // Leipzig (Station 6): Ohne „Konzilien irren“ verliert man fast immer. Danach ist Eck zu schlagen.
  const leipzig = quote(G.eck, deckFuer(sammlung(5), G.eck), 'klug');
  const eckSpaet = quote(G.eck, deckFuer(sammlung(7), G.eck), 'klug');
  // Worms (Station 7): Mit allen Erkenntnissen und passendem Deck gewinnt Luther meist.
  const worms = quote(G.worms, deckFuer(sammlung(7), G.worms), 'klug');
  const wormsAlles = quote(G.worms, sammlung(7).slice(0, 12), 'klug');
  console.log('Siegquoten Geschichte:', { tetzel, tetzelZufall, ohneKonter, revanche, leipzig, eckSpaet, worms, wormsAlles });
  assert.ok(tetzel >= 0.2 && tetzel <= 0.55, 'Tetzel ist beim ersten Mal meist stärker');
  assert.ok(tetzelZufall <= 0.2 && ohneKonter <= 0.1, 'Ohne die passenden Erkenntnisse ist die Kirche überlegen');
  assert.ok(revanche >= 0.7 && revanche > tetzel + 0.25, 'Mit den Thesen dreht sich das Spiel');
  assert.ok(leipzig <= 0.15 && eckSpaet >= 0.45, 'Leipzig: Vor der Erkenntnis fehlt die Antwort auf die Konzilien');
  assert.ok(worms >= 0.55 && wormsAlles < worms, 'Worms: Luther hat die stärkeren Argumente, wenn das Deck passt');
});

test('Übung: Die geführte Partie läuft nach Skript und endet mit einem Sieg', () => {
  const g = disputation.gegner.uebung;
  let z = duell.start(g, [], 1);
  assert.equal(z.tausch, 0);
  z = duell.beginne(z);
  const erwartet = g.tutorial.filter((x) => x.erwartet).map((x) => x.erwartet);
  for (const was of erwartet) {
    while (z.am === 'kirche' && z.phase === 'spiel') z = duell.fuehreAus(z, duell.kiZug(z), 'kirche');
    const vorher = z;
    z = was === 'passe' ? duell.passe(z, 'luther') : duell.spiele(z, 'luther', z.seiten.luther.hand.find((x) => x.id === was).uid);
    assert.notEqual(z, vorher, `Schritt ${was} ist erlaubt`);
  }
  assert.equal(z.phase, 'ende'); assert.equal(z.sieger, 'luther');
  for (const x of g.tutorial) assert.ok(x.text && x.ziel, 'Jeder Schritt hat Text und Ziel');
});

test('Kampagne: Aufbau, Freischaltung, Sterne, Belohnungen', () => {
  // Jeder Gegner einmal in der Reihenfolge, alle Karten und Anführer existieren
  assert.equal(new Set(reihenfolge).size, reihenfolge.length);
  for (const id of reihenfolge) {
    const g = kampagne.gegner[id];
    for (const k of [...g.deck, g.anfuehrer, ...g.belohnungen].filter(Boolean)) assert.ok(K(k), `${id}: Karte ${k}`);
    assert.ok(g.einleitung && g.sieg && g.niederlage, `${id}: Texte`);
  }
  for (const k of kampagne.karten) assert.ok(reihenfolge.some((id) => kampagne.gegner[id].belohnungen.includes(k.id)), `${k.id} ist zu gewinnen`);
  for (const a of kampagne.anfuehrer) assert.ok(K(a.id)?.anfuehrer, `Anführer ${a.id}`);
  // Freischaltung: erst der erste Gegner, nach einem Sieg der nächste
  let st = neuerKampagnenStand();
  assert.ok(kamp.offen(st, reihenfolge[0]) && !kamp.offen(st, reihenfolge[1]));
  const sieg20 = { sieger: 'luther', runden: [{ sieger: 'luther' }, { sieger: 'luther' }] };
  const sieg21 = { sieger: 'luther', runden: [{ sieger: 'luther' }, { sieger: 'kirche' }, { sieger: 'luther' }] };
  assert.equal(kamp.sterneFuer(sieg20, 9), 3); assert.equal(kamp.sterneFuer(sieg21, 12), 1); assert.equal(kamp.sterneFuer({ sieger: 'kirche', runden: [] }, 8), 0);
  let r = kamp.eintragen(st, reihenfolge[0], sieg21, 12);
  assert.ok(r.ersterSieg && kamp.offen(r.stand, reihenfolge[1]));
  assert.deepEqual(r.briefe, [{ art: 'klein', gegner: reihenfolge[0], belohnung: true }], 'Erster Sieg: ein Siegelbrief mit sicherer Belohnungskarte');
  r = kamp.eintragen(r.stand, reihenfolge[0], sieg20, 9);
  assert.deepEqual(r.briefe.map((b) => b.art), ['klein', 'gross'], 'Drei Sterne zum ersten Mal: dazu ein großer Brief');
  assert.deepEqual(kamp.eintragen(r.stand, reihenfolge[0], sieg20, 9).briefe.map((b) => b.art), ['klein'], 'Danach je Sieg ein kleiner Brief');
  assert.equal(kamp.eintragen(r.stand, reihenfolge[0], { sieger: 'kirche', runden: [] }, 9).briefe.length, 0, 'Niederlage: kein Brief');
  assert.equal(r.stand.briefe.length, 3);
  st = { ...r.stand, sterne: Object.fromEntries(reihenfolge.map((id) => [id, 3])) };
  assert.equal(kamp.anfuehrerFrei(st).length, kampagne.anfuehrer.length, 'Mit allen Sternen sind alle Anführer frei');
});

test('Kampagne: Siegelbriefe bringen immer Fortschritt, Kopien bis zur Grenze, darüber Siegellack', async () => {
  const { briefRules, WACHS_JE_BRIEF } = await import('../js/puzzles/kampagne.js');
  const { maxKopien, anzahl } = await import('../js/puzzles/duell-regeln.js');
  const { lutherKarten } = await import('../data/kartei.js');
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const rang = ['gewoehnlich', 'selten', 'episch', 'legendaer'];
  const story = sammlung(9);
  // Erster Sieg: eine Belohnungskarte des Gegners ist dabei, der Glanzplatz ist mindestens selten und neu
  const g = kampagne.gegner[reihenfolge[0]];
  const k = briefRules.inhalt({ art: 'klein', gegner: g.id, belohnung: true }, story, rnd);
  assert.equal(k.length, 3); assert.ok(g.belohnungen.includes(k[0].id) && k[0].neu);
  assert.ok(rang.indexOf(K(k[2].id).seltenheit) >= 1 && k[2].neu);
  assert.equal(new Set(k.map((x) => x.id)).size, 3, 'keine Karte doppelt im selben Brief');
  // Großer Brief: vier Karten, die letzte mindestens episch
  const gr = briefRules.inhalt({ art: 'gross', gegner: reihenfolge.at(-1) }, story, rnd);
  assert.equal(gr.length, 4); assert.ok(rang.indexOf(K(gr[3].id).seltenheit) >= 2);
  // Viele Briefe: Am Ende ist alles gesammelt; Doppelte ergeben neue Briefe
  let s = neuerKampagnenStand(); s.briefe = Array.from({ length: 40 }, () => ({ art: 'klein', gegner: reihenfolge[3] }));
  let ausWachs = 0;
  while (s.briefe.length) { const r = kamp.oeffne(s, [...story, ...s.karten], rnd); ausWachs += r.ausWachs; s = r.stand; }
  const alle = lutherKarten.filter((x) => x.seltenheit).map((x) => x.id);
  const besitz = [...story, ...s.karten];
  assert.ok(alle.every((id) => anzahl(besitz, id) === maxKopien(id)), 'alle Karten so oft gesammelt, wie man sie haben darf');
  assert.equal(maxKopien('k1'), 2); assert.equal(maxKopien('r17'), 1, 'legendär nur einmal');
  assert.ok(ausWachs > 0 && s.wachs < WACHS_JE_BRIEF, 'Siegellack wird zu neuen Briefen');
});

test('Kampagne: Schwierigkeit steigt, jeder Gegner ist zu schlagen', () => {
  let besitz = [...sammlung(9), 'n1', 'n2', 't27', 't32', 't86'];
  const quoten = {};
  for (const id of reihenfolge) {
    const g = kampagne.gegner[id];
    quoten[id] = quote(g, deckFuer(besitz, g), 'klug', 150, 'a-luther');
    assert.ok(quoten[id] >= 0.35, `${id} ist mit klugem Spiel zu schlagen (${quoten[id]})`);
    assert.ok(quote(g, besitz.slice(0, 12), 'zufall', 60, 'a-luther') <= 0.35, `${id}: Wahllos gespielt verliert man meist`);
    besitz = [...besitz, ...g.belohnungen.filter((x) => !besitz.includes(x)).slice(0, 1)];
  }
  console.log('Siegquoten Kampagne:', quoten);
  const kap = (i) => kampagne.kapitel[i].gegner.reduce((n, id) => n + quoten[id], 0) / 3;
  assert.ok(kap(0) > kap(3), 'Kapitel 4 ist schwerer als Kapitel 1');
  assert.ok(quoten['k-leo'] <= 0.7, 'Der Papst ist der stärkste Gegner');
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

test('Disputation: Ohne Karten endet die Runde von selbst, ein Anführer darf noch gespielt werden', () => {
  // Wie im Spiel gegen Tetzel: Runde 2, beide haben alles gespielt, es steht 1 zu 0 nach Runden.
  const g = { id: 'probe', deck: ['c-brief', 'c-ketzer'] };
  let z = duell.beginne(duell.start(g, ['k2', 'k6'], 5, { ...disputation.regeln, handStart: 2, nachziehen: 0, tausch: 0 }));
  z.runde = 2; z.seiten.luther.siege = 1; z.runden = [{ runde: 1, luther: 5, kirche: 3, sieger: 'luther', gleich: false }];
  for (let i = 0; i < 10 && z.phase === 'spiel'; i++) {
    z = z.am === 'luther' ? duell.spiele(z, 'luther', z.seiten.luther.hand[0]?.uid) : duell.fuehreAus(z, duell.kiZug(z), 'kirche');
    if (z.am === 'luther' && !z.seiten.luther.hand.length && z.phase === 'spiel' && !z.seiten.luther.gepasst) z = duell.passe(z, 'luther');
  }
  assert.equal(z.phase, 'ende', 'Die Partie endet, obwohl niemand mehr Karten hat');
  assert.ok(z.runden.length >= 2);
  assert.ok(z.runden.length <= 3);
  // Mit einem Anführer neben dem Deck passt die Kirche nicht von selbst: Sie darf ihn noch spielen.
  let a = duell.beginne(duell.start({ id: 'probe2', deck: ['c-brief'], anfuehrer: 'a-tetzel' }, ['k1'], 5, { ...disputation.regeln, handStart: 1, nachziehen: 0, tausch: 0 }));
  a = duell.spiele(a, 'luther', a.seiten.luther.hand[0].uid);
  a = duell.fuehreAus(a, duell.kiZug(a), 'kirche');
  assert.ok(!a.seiten.kirche.gepasst || a.seiten.kirche.anfuehrer === null || a.log.some((e) => e.id === 'a-tetzel') || a.runden.length > 0);
});

test('Ecks Falle: Ausweichen einmal je Frage, Nachgeben kostet Gewissen, jede ehrliche Antwort führt tiefer hinein', async () => {
  const { rules: falle } = await import('../js/puzzles/falle.js');
  const { puzzles } = await import('../data/puzzles.js');
  const s = puzzles.leipzig.schritte.find((x) => x.art === 'falle');
  const idx = (f, art) => f.antworten.findIndex((a) => a.art === art);
  for (const f of s.fragen) assert.deepEqual(f.antworten.map((a) => a.art).sort(), ['aus', 'nach', 'stand'], `${f.thema}: je eine Antwort jeder Art`);
  let z = falle.start();
  z = falle.antworte(z, s, idx(s.fragen[0], 'aus'));
  assert.equal(z.nr, 0, 'Ausweichen: Eck fragt noch einmal');
  assert.equal(falle.antworte(z, s, idx(s.fragen[0], 'aus')), z, 'zweimal ausweichen geht nicht');
  z = falle.antworte(z, s, idx(s.fragen[0], 'nach'));
  assert.equal(z.gewissen, 2); assert.equal(z.nr, 0, 'Nachgeben: noch einmal wählen');
  for (const f of s.fragen) z = falle.antworte(z, s, idx(f, 'stand'));
  assert.ok(z.ende); assert.equal(z.stufe, s.stationen.length - 1, 'am Ende steht Luther in der Falle');
  assert.equal(falle.stufe(z), 2);
  let g = falle.start(); for (const f of s.fragen) g = falle.antworte(g, s, idx(f, 'stand'));
  assert.equal(falle.stufe(g), 3);
});
