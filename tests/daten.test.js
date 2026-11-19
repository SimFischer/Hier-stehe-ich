// Datenprüfung: Alle Zahlen kommen aus data/. Nichts ist hier fest eingetragen außer den Regeln selbst.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { game } from '../data/game.js';
import { scenes } from '../data/scenes.js';
import { dialogs } from '../data/dialogs.js';
import { cards } from '../data/cards.js';
import { glossary } from '../data/glossary.js';
import { puzzles } from '../data/puzzles.js';
import { t } from '../data/ui.js';
import { assets } from '../data/assets.js';
import { bonus } from '../data/bonus.js';
import { disputation } from '../data/disputation.js';
import { existsSync } from 'node:fs';
import { systeme, texte, woerter, zeitJeStation } from './inhalt.js';

const wurzel = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const ARTEN = ['zuordnen', 'waage', 'standbild', 'markt', 'druck', 'auswahl', 'duell', 'wahl', 'text', 'gespraech', 'uebersetzung', 'flugschrift', 'falle'];
const MIT_HILFEN = ['zuordnen', 'waage', 'standbild', 'markt', 'druck', 'duell', 'uebersetzung'];
const karte = (id) => cards.find((k) => k.id === id);
const szene = (id) => scenes.find((s) => s.id === id);
const dialog = (id) => dialogs.find((d) => d.id === id);

function flagGibtEs(flag) {
  const [art, rest] = [flag.slice(0, flag.indexOf(':')), flag.slice(flag.indexOf(':') + 1)];
  if (art === 'g') return Boolean(dialog(rest));
  if (art === 'r') return Boolean(puzzles[rest]);
  if (art === 'duell') return Boolean(disputation.gegner[rest]);
  if (art === 'h') { const [sz, hs] = rest.split('.'); return Boolean(szene(sz)?.hotspots.some((h) => h.id === hs)); }
  return false;
}
function pruefeBedingung(w, wo) {
  if (!w) return;
  for (const d of [w.done, w.nichtDone].flat().filter(Boolean)) assert.ok(game.stationen.some((s) => s.id === d), `${wo}: Station ${d}`);
  for (const f of [w.flag, w.nichtFlag].flat().filter(Boolean)) assert.ok(flagGibtEs(f), `${wo}: Merker ${f} verweist ins Leere`);
  for (const k of [w.karte].flat().filter(Boolean)) assert.ok(karte(k), `${wo}: Karte ${k}`);
}

test('Stationen: Szene, Rätsel, Karten, Platte, Begründung', () => {
  const ids = new Set();
  for (const st of game.stationen) {
    assert.ok(!ids.has(st.id)); ids.add(st.id);
    assert.ok(szene(st.szene), `${st.id}: Szene ${st.szene}`);
    assert.ok(st.abschluss && st.minuten > 0, `${st.id}: Abschlusstext und Zeit`);
    for (const d of st.offen) assert.ok(ids.has(d), `${st.id}: Voraussetzung ${d} liegt davor`);
    if (st.fertigWenn) { pruefeBedingung(st.fertigWenn, st.id); continue; }
    const r = puzzles[st.raetsel];
    assert.ok(r, `${st.id}: Rätsel ${st.raetsel}`);
    assert.equal(r.station, st.id);
    assert.ok(r.lernziel.length > 0, `${st.id}: Lernziel`);
    if (st.id !== 'f') {
      assert.ok(st.platte || st.ohnePlatte, `${st.id}: Druckplatte`);
      assert.ok(st.karten.length > 0, `${st.id}: Argumentkarte`);
      const letzter = r.schritte.at(-1);
      assert.ok(letzter.art === 'wahl' && letzter.begruendung, `${st.id}: endet mit der Begründungsauswahl`);
    }
    for (const k of st.karten || []) { assert.ok(karte(k), `${st.id}: Karte ${k}`); assert.equal(karte(k).station, st.id); }
  }
  for (const nr of [1, 2, 3, 4, 5, 6, 7]) assert.ok(Object.values(puzzles).some((r) => r.lernziel.includes(nr)), `Lernziel ${nr} wird abgedeckt`);
});

test('Rätsel: Schritte, Lösungen, drei Hilfen', () => {
  for (const r of Object.values(puzzles)) {
    assert.ok(game.stationen.some((s) => s.raetsel === r.id), `${r.id} gehört zu einer Station`);
    r.schritte.forEach((s, i) => {
      const wo = `${r.id}[${i}]`;
      assert.ok(ARTEN.includes(s.art), `${wo}: Art ${s.art}`);
      // Die geführte Übung braucht keine Hilfen: Bruder Johannes erklärt jeden Schritt.
      if ((MIT_HILFEN.includes(s.art) && s.gegner !== 'uebung') || s.erinnerung) assert.equal(s.hilfen?.length, 3, `${wo}: drei Hilfen`);
      if (s.system) assert.ok(systeme[s.system], `${wo}: System ${s.system}`);
      if (s.szene) assert.ok(szene(s.szene), `${wo}: Szene ${s.szene}`);
      if (s.art === 'gespraech') assert.ok(dialog(s.dialog), `${wo}: Gespräch ${s.dialog}`);
      if (s.art === 'wahl') {
        if (s.wer) assert.ok(game.figuren[s.wer], `${wo}: Figur ${s.wer}`);
        if (s.frei) assert.ok(s.optionen.every((o) => o.wert && o.rueck), `${wo}: freie Wahl braucht Wert und Rückmeldung`);
        else { assert.equal(s.optionen.filter((o) => o.richtig).length, 1, `${wo}: genau eine richtige Antwort`); assert.ok(s.optionen.every((o) => o.rueck), `${wo}: Rückmeldung zu jeder Antwort`); }
      }
      if (s.art === 'zuordnen' && !s.quelle) for (const it of s.items) assert.ok(s.ziele.some((z) => z.id === it.ziel), `${wo}: Ziel ${it.ziel}`);
      if (s.art === 'uebersetzung') for (const v of s.verse) {
        assert.equal(v.optionen.filter((o) => o.richtig).length, 1, `${wo}: eine richtige Fassung`);
        for (const g of s.ratgeber) assert.ok(v.stimmen[g] && game.figuren[g], `${wo}: Stimme ${g}`);
      }
      if (s.art === 'standbild') for (const st of s.strophen) for (const k of Object.keys(s.regler)) {
        assert.ok(st.passt[k].every((w) => s.regler[k].werte.some((x) => x.id === w)), `${wo}: Strophe ${st.nr}, Regler ${k}`);
        assert.ok(st.rueck[k].ja && st.rueck[k].nein);
      }
    });
  }
});

test('Szenen, Gespräche, Karten: alle Verweise existieren', () => {
  for (const sz of scenes) {
    if (sz.film) { assert.ok(szene(sz.weiter), `${sz.id}: Folgeszene`); continue; }
    for (const hs of sz.hotspots) {
      const wo = `${sz.id}.${hs.id}`;
      assert.ok(hs.x >= 5 && hs.x <= 95 && hs.y >= 20 && hs.y <= (hs.figur ? 95 : 82), `${wo}: Lage im sichtbaren Bereich`);
      for (const b of [hs.zeigt, hs.objekt?.bild].filter(Boolean)) assert.ok(assets[b], `${wo}: Bild ${b}`);
      if (hs.figur) assert.ok(game.figuren[hs.figur], `${wo}: Figur`);
      if (hs.art === 'ansehen') assert.ok(hs.text, `${wo}: Text`);
      if (hs.art === 'gespraech') assert.ok(dialog(hs.ziel), `${wo}: Gespräch ${hs.ziel}`);
      if (hs.art === 'raetsel') { assert.ok(puzzles[hs.ziel] || disputation.raetsel[hs.ziel], `${wo}: Rätsel ${hs.ziel}`); assert.ok(!hs.wenn || hs.gesperrt, `${wo}: Text für „noch gesperrt“`); }
      if (hs.gibt) assert.ok(karte(hs.gibt), `${wo}: Karte ${hs.gibt}`);
      pruefeBedingung(hs.wenn, wo); pruefeBedingung(hs.zeigtWenn, wo);
    }
    for (const e of [...(sz.einstieg || []), ...(sz.ziel || [])]) pruefeBedingung(e.wenn, sz.id);
  }
  for (const d of dialogs) for (const z of d.zeilen) {
    assert.ok(game.figuren[z.wer], `${d.id}: Figur ${z.wer}`);
    if (z.gibt) assert.ok(karte(z.gibt), `${d.id}: Karte ${z.gibt}`);
    pruefeBedingung(z.wenn, d.id);
  }
  assert.equal(new Set(cards.map((k) => k.id)).size, cards.length, 'Karten-IDs sind eindeutig');
  for (const k of cards) assert.ok(k.art === 'these' || game.stationen.some((s) => (s.karten || []).includes(k.id)) || disputation.gegner[k.duell]?.belohnung === k.id, `Karte ${k.id} ist erreichbar`);
  for (const k of cards.filter((c) => c.art === 'these')) assert.ok(k.alt && k.frage.optionen.filter((o) => o.richtig).length === 1, `${k.id}: alte Fassung und Erinnerungsfrage`);
});

test('Bilder: Register und Dateien stimmen, alle Verweise existieren', () => {
  for (const [name, b] of Object.entries(assets)) {
    assert.ok(existsSync(join(wurzel, 'assets', b.datei)), `Datei ${b.datei} liegt in assets/`);
    assert.ok(b.w > 0 && b.h > 0, `${name}: Maße`);
  }
  const dateien = readdirSync(join(wurzel, 'assets'));
  assert.equal(dateien.length, Object.keys(assets).length, 'keine Datei ohne Eintrag im Register');
  // Jeder Verweis auf ein Bild in den Daten zeigt auf einen Eintrag im Register.
  const verweise = [];
  const suche = (wert, schluessel) => {
    if (typeof wert === 'string') { if (['bild', 'datei', 'zeigt', 'lastBild', 'kastenBild', 'startBild', 'ersatz'].includes(schluessel)) verweise.push(wert); }
    else if (Array.isArray(wert)) wert.forEach((w) => suche(w, schluessel === 'bilder' ? 'bild' : schluessel));
    else if (wert && typeof wert === 'object') for (const [k, v] of Object.entries(wert)) suche(v, k);
  };
  for (const quelle of [game, scenes, puzzles, bonus, systeme, cards, disputation]) suche(quelle, '');
  assert.ok(verweise.length > 60, `${verweise.length} Bildverweise gefunden`);
  const wartet = [...scenes.map((sz) => sz.bild), ...Object.values(game.figuren)].filter((b) => b?.ersatz && !assets[b.datei || b.bild]).map((b) => b.datei || b.bild);
  for (const v of verweise) assert.ok(assets[v] || wartet.includes(v), `Bild ${v} steht im Register`);
  // Jede Szene, jede Figur und jede Druckplatte hat ein Bild.
  // Eine Szene darf auf ihr eigenes Bild warten, wenn ein Ersatzbild eingetragen ist (Leipzig).
  for (const sz of scenes) assert.ok(assets[sz.bild?.datei] || assets[sz.bild?.ersatz], `Szene ${sz.id}: Hintergrund`);
  for (const [id, f] of Object.entries(game.figuren)) if (f.farbe && id !== 'ich') assert.ok(assets[f.bild] || assets[f.ersatz], `Figur ${id}: Bild`);
  for (const st of game.stationen.filter((x) => x.platte)) assert.ok(assets[st.bild], `Platte ${st.id}`);
});

test('Glossar enthält die Pflichtbegriffe', () => {
  const formen = glossary.flatMap((g) => g.formen);
  for (const w of ['Ablass', 'Fegefeuer', 'Gnade', 'Reichsacht', 'Bann', 'These', 'Reformation']) assert.ok(formen.includes(w), `Glossar: ${w}`);
});

test('Inhalt und Logik sind getrennt: kein Lesetext in js/, alle Bedientexte in data/ui.js', () => {
  const dateien = ['js', 'js/engine', 'js/puzzles'].flatMap((o) => readdirSync(join(wurzel, o)).filter((f) => f.endsWith('.js')).map((f) => join(o, f)));
  for (const datei of dateien) {
    const code = readFileSync(join(wurzel, datei), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
    for (const m of code.matchAll(/'([^'\n]*)'|"([^"\n]*)"/g)) {
      const s = m[1] ?? m[2];
      if (/[<=]|^\.\.?\/|\d+px|^[a-z0-9 -]+$/.test(s)) continue; // Markup, Attribute, Importpfade, Schriftangaben, Klassennamen
      const worte = s.split(/\s+/).filter((w) => /^[A-Za-zÄÖÜäöüß]{3,}[.,!?:]?$/.test(w));
      assert.ok(worte.length < 3, `${datei}: Text gehört nach data/: „${s}“`);
    }
    for (const m of code.matchAll(/\bt\.([A-Za-z_][A-Za-z_0-9]*)/g)) assert.ok(m[1] in t, `${datei}: Bedientext t.${m[1]} fehlt in data/ui.js`);
  }
});

test('Sprache: kurze Sätze für Klasse 7', () => {
  const lang = [];
  for (const text of texte()) for (const satz of text.split(/(?<=[.!?:][“”"’]?)\s+/)) {
    const n = woerter(satz);
    if (n > 15) lang.push(`${n}: ${satz}`);
    assert.ok(n <= 19, `Satz mit ${n} Wörtern: ${satz}`);
  }
  if (lang.length) console.log(`Hinweis: ${lang.length} Sätze haben 16 bis 19 Wörter:\n  ${lang.join('\n  ')}`);
});

test('Zeit: Kernpfad liegt bei rund 40 Minuten', () => {
  const zeiten = zeitJeStation();
  const summe = Object.values(zeiten).reduce((a, b) => a + b, 0);
  console.log('Geschätzte Minuten je Station:', Object.entries(zeiten).map(([k, v]) => `${k} ${v.toFixed(1)}`).join(' · '), `· Summe ${summe.toFixed(1)}`);
  // Ziel laut Konzept: rund 40 Minuten. Überarbeitung 1 und 2 (Kartenspiel Disputation) machen das Spiel bewusst länger,
  // siehe docs/UEBERARBEITUNG-2.md. Mit Übung und Leipzig sind bis 75 Minuten erlaubt (Doppelstunde). Die Tetzel-Revanche ist freiwillig.
  assert.ok(summe >= 34 && summe <= 75, `Kernpfad ${summe.toFixed(1)} Minuten`);
  for (const st of game.stationen) assert.ok(Math.abs(zeiten[st.id] - st.minuten) <= 2.5, `${st.id}: geplant ${st.minuten}, geschätzt ${zeiten[st.id].toFixed(1)} Minuten`);
});
