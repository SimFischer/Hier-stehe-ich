// „Warum?“-Moment in „Hammer & Siegel“: Wirkt ein Konter zum ersten Mal, fragt das Spiel, welches Argument auf die Aussage der Kirche antwortet.
// Gezeigt werden die Aussage der Kirchenkarte und drei Aussagen von Luthers Karten (ohne Titel): die richtige und zwei andere Argumente,
// die gegen diese Kirchenkarte nicht helfen. Wer richtig wählt, bekommt für diese Runde einen Bonus auf die Konterkarte.
import { K } from './duell-regeln.js';
import { lutherKarten } from '../../data/kartei.js';

export const WARUM_BONUS = 2;

/** Frage zu einem Konter. rnd: Zufall (0–1), für Tests festlegbar. */
export function warumFrage(lutherId, kircheId, rnd = Math.random) {
  const richtig = K(lutherId);
  // Ablenker: andere Argumente, die etwas anderes entkräften (klingen plausibel), aber zu einem anderen Thema gehören.
  // Argumente gegen Karten derselben Themengruppe (zum Beispiel „ablass“) würden sonst womöglich auch passen.
  const thema = K(kircheId).gruppe;
  const gleichesThema = (k) => (k.entkraeftet || []).some((c) => c === kircheId || (thema && K(c)?.gruppe === thema));
  // Auch Argumente derselben Kartenart (zum Beispiel „gnade“) klingen oft wie eine zweite richtige Antwort.
  const passt = (k) => k.id !== lutherId && k.text && k.text !== richtig.text && !gleichesThema(k) && k.typ !== richtig.typ;
  const kandidaten = lutherKarten.filter((k) => passt(k) && (k.entkraeftet || []).length);
  const ablenker = [];
  const pool = [...kandidaten];
  while (ablenker.length < 2 && pool.length) ablenker.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  const optionen = [richtig, ...ablenker].map((k) => ({ id: k.id, text: k.text }));
  // mischen
  for (let i = optionen.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [optionen[i], optionen[j]] = [optionen[j], optionen[i]]; }
  return { luther: lutherId, kirche: kircheId, frageText: K(kircheId).text, optionen };
}

/** Bonus für diese Runde auf ein Exemplar in der Reihe (z ist der Spielstand des Duells). */
export function belohne(z, seite, uid, plus = WARUM_BONUS) {
  const n = structuredClone(z);
  const inst = n.seiten[seite].reihe.find((x) => x.uid === uid);
  if (inst) inst.plus = (inst.plus || 0) + plus;
  return n;
}
