// Durchspieltest: Ein Skript spielt den Kernpfad Station für Station ab, mit denselben Regeln wie das Spiel.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../js/engine/state.js';
import { kodiere, lies } from '../js/engine/code.js';
import { rules as zuordnen, aufbau } from '../js/puzzles/zuordnen.js';
import { rules as waage } from '../js/puzzles/waage.js';
import { rules as standbild } from '../js/puzzles/standbild.js';
import { rules as markt } from '../js/puzzles/marktplatz.js';
import { rules as druck } from '../js/puzzles/druckwelle.js';
import { rules as duell } from '../js/puzzles/duell-regeln.js';
import { spieleDuell, deckFuer } from './duell-bot.js';
import { disputation } from '../data/disputation.js';
import { rules as auswahl } from '../js/puzzles/auswahl.js';
import { rules as ueb } from '../js/puzzles/uebersetzung.js';
import { rules as flug } from '../js/puzzles/flugschrift.js';
import { wahlRules, zeilenFuer } from '../js/puzzles/schritte.js';
import { zufall, spieleMarkt, spieleDruck } from './helfer.js';
import { systeme } from './inhalt.js';
import { game } from '../data/game.js';
import { scenes } from '../data/scenes.js';
import { dialogs } from '../data/dialogs.js';
import { cards } from '../data/cards.js';
import { puzzles } from '../data/puzzles.js';

const dialog = (id) => dialogs.find((d) => d.id === id);

/** Löst einen Schritt. gut = false spielt bewusst schwach (falsche Karten, falsche Antworten zuerst). */
function loeseSchritt(s, schritt, sammel, gut) {
  const beutel = () => cards.filter((k) => s.cards.includes(k.id) || (sammel.thesen || []).includes(k.id));
  switch (schritt.art) {
    case 'zuordnen': {
      const a = aufbau(schritt, cards);
      let z = zuordnen.start(a);
      for (const it of a.items) {
        if (!gut) { const falsch = a.ziele.find((x) => x.id !== it.ziel); z = zuordnen.zug(z, a, { item: it.id, ziel: falsch.id }); assert.equal(z.letzte.richtig, false); }
        z = zuordnen.zug(z, a, { item: it.id, ziel: it.ziel });
      }
      assert.ok(zuordnen.fertig(z, a));
      return {};
    }
    case 'waage': {
      let z = waage.start(schritt);
      let klicks = 0;
      while (!waage.fertig(z, schritt)) {
        z = waage.zug(z, schritt, { werk: schritt.werke[klicks % schritt.werke.length].id });
        assert.equal(waage.kippt(z, schritt), false, 'Die Waage kippt nie');
        assert.ok(++klicks < 40, 'Die Waage endet nach wenigen Klicks');
      }
      assert.equal(z.gefallen, schritt.suenden.length, 'Alle Sünden sind gefallen');
      return {};
    }
    case 'standbild': {
      for (const st of schritt.strophen) {
        const richtig = Object.fromEntries(Object.keys(schritt.regler).map((k) => [k, st.passt[k][0]]));
        assert.ok(standbild.bewerte(schritt, st, richtig).passt);
        const falsch = Object.fromEntries(Object.entries(schritt.regler).map(([k, r]) => [k, r.werte.find((w) => !st.passt[k].includes(w.id)).id]));
        const r = standbild.bewerte(schritt, st, falsch);
        assert.equal(r.passt, false); assert.equal(r.rueck.length, Object.keys(schritt.regler).length);
      }
      return {};
    }
    case 'markt': {
      const r = spieleMarkt(systeme.marktplatz, gut ? 'sorgfaeltig' : 'zufall', zufall(4));
      assert.ok(r.z.ende);
      return { stufe: { markt: r.stufe } };
    }
    case 'druck': {
      const r = spieleDruck(systeme.druckwelle, gut ? 'sorgfaeltig' : 'latein', zufall(5));
      assert.ok(r.z.ende);
      return { stufe: { druck: r.stufe } };
    }
    case 'auswahl': {
      const vorrat = auswahl.vorrat(schritt, cards, beutel()).map((k) => k.id);
      if (schritt.erinnerung) {
        const fehlt = auswahl.fehlend(cards, beutel())[0];
        assert.ok(fehlt, 'Es gibt eine These zum Erinnern');
        assert.ok(auswahl.erinnert(fehlt, wahlRules.loesung(fehlt.frage)));
        S.gibKarte(s, fehlt.id);
      }
      const wunsch = ['k1', 'k2', 'w1', 'w2', 'k6'];
      let wahl = [];
      for (const k of [...wunsch.filter((x) => vorrat.includes(x)), ...vorrat]) wahl = wahl.includes(k) ? wahl : auswahl.umschalten(wahl, k, schritt.anzahl);
      assert.ok(auswahl.fertig(wahl, schritt.anzahl));
      return { [schritt.ergebnis]: wahl };
    }
    case 'duell': {
      // Gut: Deck passend zum Gegner, klug gespielt, bei Niederlage noch einmal (wie ein Kind, das es erneut versucht).
      const g = disputation.gegner[schritt.gegner];
      const besitz = beutel().map((k) => k.id);
      const rnd = zufall(9);
      let z;
      for (let versuch = 0; versuch < 12; versuch++) {
        z = spieleDuell(g, gut ? deckFuer(besitz, g) : besitz.slice(0, 12), gut ? 'klug' : 'zufall', rnd);
        assert.equal(z.phase, 'ende');
        S.duellEnde(s, g.id, z.sieger === 'luther');
        if (!gut || z.sieger === 'luther') break;
      }
      if (gut) assert.equal(z.sieger, 'luther', `${g.id}: klug gespielt gewinnbar`);
      return g.id === 'worms' ? { stufe: { verhoer: duell.stufe(z) } } : {};
    }
    case 'wahl': {
      const i = wahlRules.loesung(schritt);
      if (!schritt.frei) schritt.optionen.forEach((o, n) => assert.equal(wahlRules.pruefe(schritt, n), n === i));
      return schritt.speichert ? { [schritt.speichert]: schritt.optionen[i].wert } : {};
    }
    case 'gespraech': {
      const d = dialog(schritt.dialog);
      assert.ok(zeilenFuer(s, d).length > 0, `Gespräch ${d.id} hat Zeilen für diesen Stand`);
      S.gespraechEnde(s, d);
      return {};
    }
    case 'text': return {};
    case 'uebersetzung': {
      let z = ueb.start();
      for (let v = 0; v < schritt.verse.length; v++) {
        const richtig = schritt.verse[v].optionen.findIndex((o) => o.richtig);
        assert.equal(ueb.waehle(z, schritt, richtig), z, 'Erst fragen, dann wählen');
        for (const r of schritt.ratgeber.slice(0, schritt.fragen)) z = ueb.frage(z, schritt, r);
        if (!gut) { z = ueb.waehle(z, schritt, (richtig + 1) % 3); assert.equal(z.geloest, false); }
        z = ueb.waehle(z, schritt, richtig);
        assert.ok(z.geloest);
        if (v < schritt.verse.length - 1) z = ueb.weiter(z, schritt);
      }
      assert.ok(ueb.fertig(z, schritt));
      return {};
    }
    case 'flugschrift': {
      let f = flug.start(schritt);
      assert.equal(flug.gueltig(f, schritt), false);
      for (const k of beutel().slice(0, schritt.karten + 1)) f = flug.umschalten(f, k.id, schritt);
      assert.equal(f.karten.length, schritt.karten);
      f = { ...f, eigene: true, schlagzeile: flug.kuerze('x'.repeat(200), schritt.maxZeichen) };
      assert.ok(flug.gueltig(f, schritt));
      return { flug: f };
    }
    default: throw new Error(`Unbekannte Schrittart ${schritt.art}`);
  }
}

/** Benutzt in einer Szene alles, was geht, und löst dann das Rätsel. */
function spieleSzene(s, sz, gut) {
  if (sz.film) { S.setze(s, `film:${sz.id}`); return spieleSzene(s, S.szene(sz.weiter), gut); }
  s.szene = sz.id;
  let weiter = true; let runden = 0;
  while (weiter) {
    weiter = false;
    for (const hs of sz.hotspots.filter((h) => S.hotspotSichtbar(s, h) && S.hotspotAktiv(s, h))) {
      if (hs.art === 'ansehen' && !s.flags.includes(S.hotspotFlag(sz.id, hs.id))) { S.ansehen(s, sz.id, hs); weiter = true; }
      if (hs.art === 'gespraech' && !s.flags.includes(`g:${hs.ziel}`)) { assert.ok(zeilenFuer(s, dialog(hs.ziel)).length > 0); S.gespraechEnde(s, dialog(hs.ziel)); weiter = true; }
    }
    assert.ok(++runden < 20, `Szene ${sz.id} hängt`);
  }
  for (const hs of sz.hotspots.filter((h) => h.art === 'raetsel' && S.hotspotSichtbar(s, h))) {
    assert.ok(S.hotspotAktiv(s, hs), `Rätsel ${hs.ziel} in ${sz.id} ist nach dem Umsehen offen`);
    const sammel = {};
    for (const schritt of puzzles[hs.ziel].schritte) {
      let ergebnis = loeseSchritt(s, schritt, sammel, gut);
      if (ergebnis.stufe) ergebnis = { ...ergebnis, stufe: { ...(sammel.stufe || {}), ...ergebnis.stufe } };
      Object.assign(sammel, ergebnis);
    }
    S.raetselEnde(s, hs.ziel, sammel);
  }
}

function durchspielen(folge, gut) {
  const s = S.neuerStand();
  const codes = [];
  for (const id of folge) {
    const st = S.station(id);
    assert.ok(S.stationOffen(s, st), `Station ${id} ist offen, wenn sie an der Reihe ist`);
    spieleSzene(s, S.szene(st.szene), gut);
    assert.ok(s.done.includes(id), `Station ${id} ist abgeschlossen`);
    for (const k of st.karten || []) assert.ok(s.cards.includes(k), `Karte ${k} liegt nach Station ${id} im Beutel`);
    // Der Fortsetzungscode stellt genau diesen Stand wieder her.
    const r = lies(kodiere(s));
    assert.ok(r.stand, `Code nach Station ${id}`);
    assert.deepEqual([...r.stand.done].sort(), [...s.done].sort());
    for (const k of S.kartenAusStand(s)) assert.ok(r.stand.cards.includes(k), `Karte ${k} nach Code (${id})`);
    codes.push(kodiere(s));
  }
  return { s, codes };
}

test('Kernpfad: sorgfältig gespielt, Station 1 vor 2', () => {
  const { s } = durchspielen(game.stationen.map((st) => st.id), true);
  assert.equal(s.done.length, game.stationen.length);
  assert.deepEqual(s.stufen, { markt: 3, druck: 3, verhoer: 3 });
  assert.equal(S.platten(s).filter((p) => p.da).length, S.platten(s).length);
  assert.equal(s.thesen.length, 2);
  assert.ok(s.rat && s.flug);
});

test('Kernpfad: schwach gespielt, Station 2 vor 1, falsche Karten in Worms', () => {
  const { s, codes } = durchspielen(['p', 's2', 's1', 's3', 's4', 's5', 'sl', 's6', 's7', 'f'], false);
  assert.equal(s.done.length, game.stationen.length, 'Auch ein schwacher Durchgang kommt ans Ende');
  assert.equal(s.stufen.druck, 1);
  assert.ok(s.stufen.verhoer < 3);
  assert.equal(new Set(codes).size, codes.length, 'Jeder Zwischenstand hat einen eigenen Code');
});

test('Nach einem Code geht es an jeder Stelle weiter', () => {
  const folge = game.stationen.map((st) => st.id);
  for (let i = 1; i < folge.length; i++) {
    const vor = S.neuerStand();
    vor.done = folge.slice(0, i);
    if (vor.done.includes('s5')) vor.thesen = ['t27', 't36'];
    vor.cards = S.kartenAusStand(vor);
    const s = lies(kodiere(vor)).stand;
    const st = S.station(folge[i]);
    spieleSzene(s, S.szene(st.szene), true);
    assert.ok(s.done.includes(st.id), `Station ${st.id} ist nach dem Laden lösbar`);
  }
});

test('Jede Szene ist von einer Station aus erreichbar', () => {
  const erreichbar = new Set(game.stationen.map((st) => st.szene));
  for (const sz of scenes) if (sz.weiter && erreichbar.has(sz.id)) erreichbar.add(sz.weiter);
  for (const r of Object.values(puzzles)) for (const schritt of r.schritte) if (schritt.szene) erreichbar.add(schritt.szene);
  for (const r of Object.values(disputation.raetsel)) if (r.szene) erreichbar.add(r.szene);
  for (const sz of scenes) assert.ok(erreichbar.has(sz.id), `Szene ${sz.id}`);
});
