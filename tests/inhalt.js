// Liest Textmengen aus den Daten: für die Sprachprüfung und die Zeitschätzung.
import { game } from '../data/game.js';
import { scenes } from '../data/scenes.js';
import { dialogs } from '../data/dialogs.js';
import { cards } from '../data/cards.js';
import { glossary } from '../data/glossary.js';
import { puzzles } from '../data/puzzles.js';
import { marktplatz } from '../data/systems/marktplatz.js';
import { druckwelle } from '../data/systems/druckwelle.js';
import { verhoer } from '../data/systems/verhoer.js';
import { disputation } from '../data/disputation.js';

export const systeme = { marktplatz, druckwelle, verhoer };
export const woerter = (text) => text.split(/\s+/).filter((w) => /[A-Za-zÄÖÜäöüß0-9]/.test(w)).length;

// Schlüssel, die keinen Lesetext enthalten.
const KEIN_TEXT = new Set(['id', 'art', 'ziel', 'wer', 'figur', 'szene', 'dialog', 'system', 'station', 'layout', 'quelle', 'ergebnis', 'speichert', 'wert', 'gibt', 'raetsel', 'bild', 'farbe', 'platte', 'start', 'weiter', 'gegner', 'deck', 'entkraeftet', 'gruppe', 'typ', 'seltenheit', 'duell', 'belohnung', 'liste']);
// Historische Originaltexte werden nicht an der Satzlänge gemessen.
const ORIGINAL = new Set(['alt', 'luther']);

function sammle(wert, aus, schluessel = '') {
  if (typeof wert === 'string') { if (!KEIN_TEXT.has(schluessel) && !ORIGINAL.has(schluessel) && /\s/.test(wert)) aus.push(wert); }
  else if (Array.isArray(wert)) wert.forEach((w) => sammle(w, aus, schluessel));
  else if (wert && typeof wert === 'object') for (const [k, v] of Object.entries(wert)) { if (k !== 'wenn' && k !== 'zeigtWenn' && k !== 'fertigWenn' && k !== 'passt') sammle(v, aus, k); }
}

/** Alle Texte, die Schülerinnen und Schüler lesen. */
export function texte() {
  const aus = [];
  for (const quelle of [game.stationen, scenes, dialogs, cards.map(({ alt, ...rest }) => rest), glossary.map((g) => g.text), puzzles, marktplatz, druckwelle, verhoer, disputation]) sammle(quelle, aus);
  return aus;
}

// Sekunden je Rätselschritt: Bedienzeit zusätzlich zum Lesen.
const BEDIENZEIT = {
  zuordnen: (s) => 7 * (s.items?.length || 5), waage: () => 50, standbild: (s) => 40 * s.strophen.length, markt: () => 90, druck: () => 150,
  auswahl: (s) => 12 * s.anzahl, duell: (s) => (s.gegner === 'uebung' ? 150 : 300), wahl: () => 15, text: () => 0, gespraech: () => 0, uebersetzung: (s) => 35 * s.verse.length, flugschrift: () => 100
};
// Welcher Teil eines Spielsystems in einem Durchgang gelesen wird.
const SYSTEMANTEIL = { marktplatz: 0.75, druckwelle: 0.8, verhoer: 1 };

/** Geschätzte Spielzeit in Minuten je Station: Lesetext plus Bedienzeit. */
/** Wörter und Bedienzeit je Station, gefüllt von zeitJeStation(). */
export const detail = {};

export function zeitJeStation() {
  const wpm = game.zeit.woerterProMinute;
  const zeiten = {};
  const zaehle = (wert) => { const aus = []; sammle(wert, aus); return aus.reduce((n, x) => n + woerter(x), 0); };
  // Gelesen wird nur ein Weg: Rückmeldungen zu falschen Antworten und Erklärungen zu Fehlern zählen nicht mit.
  const gelesen = (wert) => JSON.parse(JSON.stringify(wert, (k, v) => {
    if (k === 'falsch' || k === 'nein' || k === 'namenHinweis') return undefined;
    if (v && typeof v === 'object' && typeof v.rueck === 'string' && !v.richtig) return { text: v.text };
    return v;
  }));
  for (const st of game.stationen) {
    let w = zaehle(st.abschluss); let sek = 0;
    const eigene = scenes.filter((sz) => sz.id === st.szene || scenes.find((x) => x.id === st.szene)?.weiter === sz.id);
    for (const sz of eigene) {
      if (st.id === 'f') continue; // Die Druckerei wird im Prolog gezählt.
      w += zaehle([sz.einstieg?.at(-1), sz.film]);
      for (const hs of sz.hotspots || []) {
        if (hs.art === 'ansehen' && (!hs.zeigtWenn?.done)) w += zaehle(hs.text) * (hs.optional ? 0.5 : 1);
        if (hs.art === 'gespraech' && !hs.zeigtWenn?.done) w += zaehle(dialogs.find((d) => d.id === hs.ziel));
        sek += 4;
      }
    }
    const r = puzzles[st.raetsel];
    for (const s of r?.schritte || []) {
      const { hilfen, system, ...rest } = s;
      w += zaehle(gelesen(rest)) * (s.art === 'uebersetzung' ? 0.85 : 1);
      if (s.art === 'gespraech') w += zaehle(dialogs.find((d) => d.id === s.dialog)) * 0.8;
      if (system && s.art !== 'text') w += zaehle(systeme[system]) * (s.art === 'auswahl' ? 0.1 : SYSTEMANTEIL[system]);
      if (s.quelle === 'thesen') w += zaehle(cards.filter((k) => k.art === 'these').map((k) => [k.alt, k.text]));
      sek += BEDIENZEIT[s.art](s);
    }
    zeiten[st.id] = w / wpm + sek / 60;
    detail[st.id] = { woerter: Math.round(w), bedienSekunden: sek };
  }
  return zeiten;
}
