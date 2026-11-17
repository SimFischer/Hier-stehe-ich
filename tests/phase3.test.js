// Phase 3: Bonusspiele, Lehrkraftmodus, Lösungen für das Kompendium.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../js/engine/state.js';
import { kodiere, lies } from '../js/engine/code.js';
import { loesung, loesungen } from '../js/engine/loesungen.js';
import { disputation } from '../data/disputation.js';
import { silbenRules, presseRules, fahrtRules, roseRules } from '../js/puzzles/bonus.js';
import { rules as zuordnen, aufbau } from '../js/puzzles/zuordnen.js';
import { wahlRules } from '../js/puzzles/schritte.js';
import { systeme, woerter } from './inhalt.js';
import { game } from '../data/game.js';
import { puzzles } from '../data/puzzles.js';
import { bonus } from '../data/bonus.js';
import { cards } from '../data/cards.js';
import { teacher } from '../data/teacher.js';

const daten = { cards, systeme, figuren: game.figuren, disputation };
const BONUS_ARTEN = ['silben', 'presse', 'fahrt', 'rose', 'reflexion', 'zuordnen', 'wahl', 'text'];

test('Bonusspiele: Aufbau, Hilfen, Freischaltung', () => {
  for (const b of Object.values(bonus)) {
    assert.ok(game.stationen.some((st) => st.id === b.nach), `${b.id}: Station ${b.nach}`);
    assert.ok(b.titel && b.kurz && b.minuten > 0 && b.minuten <= 10, `${b.id}: Titel, Kurztext, Zeit`);
    for (const s of b.schritte) {
      assert.ok(BONUS_ARTEN.includes(s.art), `${b.id}: Art ${s.art}`);
      if (['silben', 'presse', 'fahrt', 'rose', 'zuordnen'].includes(s.art)) assert.equal(s.hilfen?.length, 3, `${b.id}: drei Hilfen`);
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

test('Druckerpresse: Treffer nur in der Zone, vier Treffer ergeben ein Blatt, es wird schwerer', () => {
  const s = bonus.presse.schritte[0];
  assert.ok(presseRules.treffer(0.5, 0.5, 20)); assert.ok(presseRules.treffer(0.59, 0.5, 20)); assert.ok(!presseRules.treffer(0.62, 0.5, 20));
  let z = presseRules.start();
  for (let i = 0; i < s.schritte.length; i++) z = presseRules.druecke(z, s, true);
  assert.equal(z.blaetter, 1); assert.equal(z.schritt, 0);
  z = presseRules.druecke(z, s, true); z = presseRules.druecke(z, s, false);
  assert.equal(z.schritt, 0); assert.equal(z.fehler, 1);
  assert.ok(presseRules.zone(s, 10) < presseRules.zone(s, 0) && presseRules.zone(s, 99) === s.zone.min);
  assert.ok(presseRules.takt(s, 10) > presseRules.takt(s, 0) && presseRules.takt(s, 99) === s.takt.max);
  assert.equal(presseRules.zeiger(0.25), 0.25); assert.equal(presseRules.zeiger(1.75), 0.25);
});

test('Entführung: Blickkegel, Rastplätze sicher, ein vorsichtiger Fahrer kommt an', () => {
  const s = bonus.entfuehrung.schritte.find((x) => x.art === 'fahrt');
  const w0 = { x: 0, y: 0, a: 0 };
  assert.ok(fahrtRules.gesehen({ x: 100, y: 0 }, w0, s.sicht), 'vor der Wache');
  assert.ok(!fahrtRules.gesehen({ x: -100, y: 0 }, w0, s.sicht), 'hinter der Wache');
  assert.ok(!fahrtRules.gesehen({ x: s.sicht.weite + 10, y: 0 }, w0, s.sicht), 'zu weit weg');
  const gesehen = (p, t) => s.wachen.some((w) => fahrtRules.gesehen(p, fahrtRules.wachePos(w, t), s.sicht));
  for (let t = 0; t < 90; t += 0.1) for (const r of s.rast) assert.ok(!gesehen(r, t), `Rastplatz ${r.x},${r.y} wird zur Zeit ${t.toFixed(1)} gesehen`);
  // Ein Fahrer, der auf dem Weg zum nächsten Ziel wartet, wenn der nächste Schritt gesehen würde
  const ziele = [...s.rast.slice(1), s.ziel];
  let p = { ...s.start }, t = 0, n = 0, rast = 0, erwischt = 0;
  const dt = 0.05;
  while (!fahrtRules.amZiel(p, s.ziel) && t < 240) {
    const z = ziele[n];
    const weiter = fahrtRules.bewege(p, z.x - p.x, z.y - p.y, s.tempo * dt, s.welt);
    if (!gesehen(weiter, t + dt)) p = weiter;
    t += dt;
    if (gesehen(p, t)) { erwischt += 1; p = { ...s.rast[rast] }; }
    if (n < s.rast.length - 1 && Math.hypot(p.x - z.x, p.y - z.y) < 20) { rast = n + 1; n += 1; }
  }
  assert.ok(fahrtRules.amZiel(p, s.ziel), `Ziel nach ${t.toFixed(0)} s nicht erreicht`);
  assert.ok(t < 150, `zu lang: ${t.toFixed(0)} s`);
});

test('Lutherrose: Schichten nur von außen nach innen', () => {
  const s = bonus.lutherrose.schritte.find((x) => x.art === 'rose');
  let z = roseRules.start();
  z = roseRules.zug(z, s, 'kreuz'); assert.equal(z.letzte, 'falsch'); assert.equal(z.gelegt.length, 0);
  for (const sch of s.schichten) z = roseRules.zug(z, s, sch.id);
  assert.ok(roseRules.fertig(z, s));
  for (let i = 1; i < s.schichten.length; i++) assert.ok(s.schichten[i].groesse < s.schichten[i - 1].groesse, 'jede Schicht kleiner als die davor');
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
  assert.ok(loesung(puzzles.marktplatz.schritte[0], daten).some((z) => z.includes('wohin dein Geld geht')));
  assert.ok(teacher.faq.length >= 10 && teacher.fach.length >= 8);
});
