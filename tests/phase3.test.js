// Phase 3: Bonusspiele, Lehrkraftmodus, Lösungen für das Kompendium.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../js/engine/state.js';
import { kodiere, lies } from '../js/engine/code.js';
import { loesung, loesungen } from '../js/engine/loesungen.js';
import { silbenRules, presseRules, wegRules } from '../js/puzzles/bonus.js';
import { rules as zuordnen, aufbau } from '../js/puzzles/zuordnen.js';
import { wahlRules } from '../js/puzzles/schritte.js';
import { systeme, woerter } from './inhalt.js';
import { game } from '../data/game.js';
import { puzzles } from '../data/puzzles.js';
import { bonus } from '../data/bonus.js';
import { cards } from '../data/cards.js';
import { teacher } from '../data/teacher.js';

const daten = { cards, systeme, figuren: game.figuren };
const BONUS_ARTEN = ['silben', 'presse', 'weg', 'reflexion', 'zuordnen', 'wahl', 'text'];

test('Bonusspiele: Aufbau, Hilfen, Freischaltung', () => {
  for (const b of Object.values(bonus)) {
    assert.ok(game.stationen.some((st) => st.id === b.nach), `${b.id}: Station ${b.nach}`);
    assert.ok(b.titel && b.kurz && b.minuten > 0 && b.minuten <= 10, `${b.id}: Titel, Kurztext, Zeit`);
    for (const s of b.schritte) {
      assert.ok(BONUS_ARTEN.includes(s.art), `${b.id}: Art ${s.art}`);
      if (['silben', 'presse', 'weg', 'zuordnen'].includes(s.art)) assert.equal(s.hilfen?.length, 3, `${b.id}: drei Hilfen`);
      for (const text of [s.anweisung, s.ende, s.falsch, ...(s.absaetze || []).map((a) => a.text)].filter(Boolean)) {
        for (const satz of text.split(/(?<=[.!?:])\s+/)) assert.ok(woerter(satz) <= 19, `${b.id}: langer Satz: ${satz}`);
      }
    }
  }
  // Der Fortsetzungscode kennt genau die Bonusspiele, die gemerkt werden.
  const gemerkt = Object.values(bonus).filter((b) => !b.ohneMerker).map((b) => b.id);
  const s = S.neuerStand(); s.done = ['p']; s.bonus = [...gemerkt];
  assert.deepEqual([...lies(kodiere(s)).stand.bonus].sort(), [...gemerkt].sort());
});

test('Silbenrätsel: lösbar, Fehler setzen das Wort zurück', () => {
  const s = bonus.silben.schritte[0];
  const vorrat = silbenRules.vorrat(s);
  assert.equal(vorrat.length, s.fragen.reduce((n, f) => n + f.silben.length, 0));
  let z = silbenRules.start();
  for (const frage of s.fragen) {
    const falsch = vorrat.find((v) => v.text !== frage.silben[0] && !z.verbraucht.includes(v.id));
    if (falsch) { z = silbenRules.zug(z, s, falsch.id); assert.equal(z.letzte, 'falsch'); assert.deepEqual(z.gelegt, []); }
    for (const text of frage.silben) {
      const chip = vorrat.find((v) => v.text === text && !z.verbraucht.includes(v.id) && !z.gelegt.includes(v.id));
      assert.ok(chip, `Silbe ${text} ist da`);
      z = silbenRules.zug(z, s, chip.id);
    }
  }
  assert.ok(silbenRules.fertig(z, s));
});

test('Druckerpresse: vier Handgriffe ergeben ein Blatt, ein Fehler verdirbt den Bogen', () => {
  const s = bonus.presse.schritte[0];
  let z = presseRules.start();
  for (const g of s.handgriffe) z = presseRules.zug(z, s, g.id);
  assert.equal(z.blaetter, 1);
  z = presseRules.zug(z, s, s.handgriffe[0].id);
  z = presseRules.zug(z, s, s.handgriffe[2].id);
  assert.equal(z.i, 0); assert.equal(z.fehler, 1); assert.equal(z.blaetter, 1);
});

test('Entführung: Weg ist in der erlaubten Zeit zu schaffen, Dörfer werfen zurück', () => {
  const s = bonus.entfuehrung.schritte.find((x) => x.art === 'weg');
  assert.ok(new Set(s.karte.map((z) => z.length)).size === 1, 'alle Zeilen gleich lang');
  const kurz = wegRules.kuerzester(s);
  assert.ok(kurz > 0 && kurz < s.maxZuege, `kürzester Weg ${kurz}, erlaubt ${s.maxZuege}`);
  // Die dritte Hilfe beschreibt einen Weg, der wirklich ankommt.
  let z = wegRules.start(s);
  const schritte = { rechts: [1, 0], runter: [0, 1] };
  for (const m of s.hilfen[2].toLowerCase().matchAll(/(ein|zwei)mal (rechts|runter)/g)) {
    for (let i = 0; i < (m[1] === 'zwei' ? 2 : 1); i++) z = wegRules.zug(z, s, z.x + schritte[m[2]][0], z.y + schritte[m[2]][1]);
  }
  assert.ok(z.ende, 'Hilfe 3 führt zur Wartburg');
  // Ein Dorf wirft an den Start zurück.
  let w = wegRules.start(s);
  const dorf = wegRules.finde(s, 'D');
  w = { ...w, x: dorf.x - 1, y: dorf.y };
  w = wegRules.zug(w, s, dorf.x, dorf.y);
  assert.equal(w.letzte, 'gesehen'); assert.equal(w.zuege, 0);
});

test('Bonus-Zuordnungen und Fragen sind lösbar', () => {
  for (const b of Object.values(bonus)) for (const s of b.schritte) {
    if (s.art === 'zuordnen') {
      const a = aufbau(s, cards); let z = zuordnen.start(a);
      for (const it of a.items) z = zuordnen.zug(z, a, { item: it.id, ziel: it.ziel });
      assert.ok(zuordnen.fertig(z, a), `${b.id}: Zuordnung`);
    }
    if (s.art === 'wahl') assert.ok(wahlRules.loesung(s) >= 0, `${b.id}: richtige Antwort`);
  }
});

test('Lehrkraftmodus: Hinspringen und Lösen ergeben gültige Stände', () => {
  for (const st of game.stationen) {
    const s = S.neuerStand();
    S.springeZu(s, st.id);
    assert.equal(s.szene, st.szene);
    assert.ok(S.stationOffen(s, st), `${st.id} ist nach dem Hinspringen offen`);
    assert.ok(!s.done.includes(st.id));
    assert.ok(lies(kodiere(s)).stand, `Code nach Sprung zu ${st.id}`);
    S.loeseStation(s, st.id);
    assert.ok(s.done.includes(st.id));
    for (const k of st.karten || []) assert.ok(s.cards.includes(k), `Karte ${k}`);
    assert.ok(lies(kodiere(s)).stand, `Code nach Lösen von ${st.id}`);
  }
  const alles = S.neuerStand();
  S.loeseStation(alles, 'f');
  assert.equal(alles.done.length, game.stationen.length);
  assert.equal(alles.thesen.length, 2);
});

test('Kompendium: Lösungen entstehen aus den Daten, Leitfaden ist vollständig', () => {
  for (const st of game.stationen) {
    assert.ok(teacher.stationen[st.id]?.material && teacher.stationen[st.id]?.hinweis, `Leitfaden für ${st.id}`);
    if (!st.raetsel) continue;
    const l = loesungen(puzzles[st.raetsel], daten);
    assert.ok(l.length > 0, `Lösungen für ${st.id}`);
    for (const x of l) for (const zeile of x.zeilen) assert.ok(typeof zeile === 'string' && zeile.length > 3 && !zeile.includes('undefined'), `${st.id}: ${zeile}`);
  }
  for (const b of Object.values(bonus).filter((x) => !x.ohneMerker)) assert.ok(loesungen(b, daten).length > 0, `Lösungen für ${b.id}`);
  assert.equal(teacher.lernziele.length, 7);
  for (const r of Object.values(puzzles)) for (const n of r.lernziel) assert.ok(teacher.lernziele[n - 1], `Lernziel ${n}`);
  // Stichprobe: Die Lösung nennt wirklich die richtige Antwort aus den Daten.
  const wahl = puzzles.waage.schritte.find((s) => s.art === 'wahl');
  assert.deepEqual(loesung(wahl, daten), [wahl.optionen.find((o) => o.richtig).text]);
  assert.ok(loesung(puzzles.marktplatz.schritte[0], daten).some((z) => z.includes('Weg des Geldes')));
  assert.ok(teacher.faq.length >= 10 && teacher.fach.length >= 8);
});
