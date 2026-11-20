// „Warum?“-Moment in „Hammer & Siegel“: Wirkt ein Konter zum ersten Mal, fragt das Spiel, welches Argument auf die Aussage der Kirche antwortet.
// Inhalte aus data/warum.js: eine Sacherklärung zur Kirchenkarte, die richtige Antwort (je Konter-Paar) und zwei falsche Antworten
// zum selben Thema (typische Missverständnisse). Wer richtig wählt, bekommt einen Bonus (als Luther +2 Stärke in dieser Runde).
// Fehlt ein Text in den Daten, entsteht die Frage wie früher aus den Kartentexten (andere Themen als Ablenker).
import { K } from './duell-regeln.js';
import { lutherKarten } from '../../data/kartei.js';
import { warum } from '../../data/warum.js';

export const WARUM_BONUS = 2;

/** Frage zu einem Konter. rnd: Zufall (0–1), für Tests festlegbar. */
export function warumFrage(lutherId, kircheId, rnd = Math.random) {
  const richtig = K(lutherId);
  const info = warum.kirche[kircheId];
  const antwort = warum.antwort[`${lutherId}>${kircheId}`];
  let optionen;
  if (info && antwort) {
    // Der Kartenname vorne („Titel“: …) würde die richtige Antwort verraten. Er erscheint erst in der Rückmeldung.
    optionen = [{ id: lutherId, text: antwort.replace(/^„[^“]+“:\s*/, '') }, ...info.falsch.map((text, i) => ({ id: `falsch-${i}`, text }))];
  } else {
    // Rückfall: Kartentexte; Ablenker aus anderen Themen und anderen Kartenarten, damit nur eine Antwort passt
    const thema = K(kircheId).gruppe;
    const gleichesThema = (k) => (k.entkraeftet || []).some((c) => c === kircheId || (thema && K(c)?.gruppe === thema));
    const passt = (k) => k.id !== lutherId && k.text && k.text !== richtig.text && !gleichesThema(k) && k.typ !== richtig.typ;
    const pool = lutherKarten.filter((k) => passt(k) && (k.entkraeftet || []).length);
    const ablenker = [];
    while (ablenker.length < 2 && pool.length) ablenker.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
    optionen = [richtig, ...ablenker].map((k) => ({ id: k.id, text: k.text }));
  }
  for (let i = optionen.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [optionen[i], optionen[j]] = [optionen[j], optionen[i]]; }
  return { luther: lutherId, kirche: kircheId, frageText: K(kircheId).text, erklaerung: info?.erklaerung || null, optionen };
}

/** Bonus für diese Runde auf ein Exemplar in der Reihe (z ist der Spielstand des Duells). */
export function belohne(z, seite, uid, plus = WARUM_BONUS) {
  const n = structuredClone(z);
  const inst = n.seiten[seite].reihe.find((x) => x.uid === uid);
  if (inst) inst.plus = (inst.plus || 0) + plus;
  return n;
}
