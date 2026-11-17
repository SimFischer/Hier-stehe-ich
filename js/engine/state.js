// Spielstand und reine Spiellogik. Kein Zugriff auf den Bildschirm: Node kann alles hier testen.
import { game } from '../../data/game.js';
import { scenes } from '../../data/scenes.js';
import { puzzles } from '../../data/puzzles.js';

export const neuerStand = () => ({
  v: 1, szene: null, done: [], flags: [], cards: [], thesen: [], rat: '',
  stufen: { markt: 0, druck: 0, verhoer: 0 }, bonus: [], hilfen: 0, zuZweit: false, flug: null
});

const liste = (x) => (Array.isArray(x) ? x : [x]);

/** Prüft eine Bedingung aus den Daten gegen den Spielstand. */
export function erfuellt(s, w) {
  if (!w) return true;
  if (w.done && !liste(w.done).every((d) => s.done.includes(d))) return false;
  if (w.nichtDone && liste(w.nichtDone).some((d) => s.done.includes(d))) return false;
  if (w.flag && !liste(w.flag).every((f) => s.flags.includes(f))) return false;
  if (w.nichtFlag && liste(w.nichtFlag).some((f) => s.flags.includes(f))) return false;
  if (w.rat && !liste(w.rat).includes(s.rat)) return false;
  if (w.stufe && !Object.entries(w.stufe).every(([k, v]) => liste(v).includes(s.stufen[k]))) return false;
  if (w.karte && !liste(w.karte).every((k) => s.cards.includes(k))) return false;
  return true;
}

export const station = (id) => game.stationen.find((st) => st.id === id);
export const szene = (id) => scenes.find((sz) => sz.id === id);
export const stationOffen = (s, st) => st.offen.every((d) => s.done.includes(d));
export const hotspotFlag = (szId, hsId) => `h:${szId}.${hsId}`;

export function setze(s, flag) { if (!s.flags.includes(flag)) s.flags.push(flag); }
export function gibKarte(s, id) { if (id && !s.cards.includes(id)) { s.cards.push(id); return true; } return false; }

export function schliesseStation(s, id) {
  if (s.done.includes(id)) return false;
  s.done.push(id);
  for (const k of station(id).karten || []) gibKarte(s, k);
  return true;
}

/** Stationen ohne Rätsel (Prolog) schließen sich über eine Bedingung. */
export function pruefeStationen(s) {
  const neu = [];
  for (const st of game.stationen) {
    if (st.fertigWenn && !s.done.includes(st.id) && stationOffen(s, st) && erfuellt(s, st.fertigWenn)) {
      schliesseStation(s, st.id); neu.push(st.id);
    }
  }
  return neu;
}

export const hotspotSichtbar = (s, hs) => erfuellt(s, hs.zeigtWenn);
export const hotspotAktiv = (s, hs) => erfuellt(s, hs.wenn);

/** Benutzt einen Hotspot vom Typ „ansehen“. Gespräche und Rätsel melden ihr Ende selbst. */
export function ansehen(s, szId, hs) {
  setze(s, hotspotFlag(szId, hs.id));
  const neu = gibKarte(s, hs.gibt);
  return { karte: neu ? hs.gibt : null, stationen: pruefeStationen(s) };
}

export function gespraechEnde(s, dialog) {
  setze(s, `g:${dialog.id}`);
  const karten = dialog.zeilen.filter((z) => z.gibt && erfuellt(s, z.wenn)).map((z) => z.gibt).filter((k) => gibKarte(s, k));
  return { karten, stationen: pruefeStationen(s) };
}

/** Schließt ein Rätsel ab und übernimmt, was die Schritte ergeben haben. */
export function raetselEnde(s, id, ergebnis = {}) {
  setze(s, `r:${id}`);
  if (ergebnis.stufe) Object.assign(s.stufen, ergebnis.stufe);
  if (ergebnis.rat) s.rat = ergebnis.rat;
  if (ergebnis.thesen) { s.thesen = [...ergebnis.thesen].sort(); ergebnis.thesen.forEach((k) => gibKarte(s, k)); }
  if (ergebnis.flug) s.flug = ergebnis.flug;
  for (const k of puzzles[id].gibt || []) gibKarte(s, k);
  const st = game.stationen.find((x) => x.raetsel === id);
  const neu = st && schliesseStation(s, st.id) ? [st.id] : [];
  return { stationen: neu };
}

/** Lehrkraftmodus: markiert eine Station samt ihren Voraussetzungen als gelöst. */
export function loeseStation(s, id) {
  const st = station(id);
  for (const d of st.offen) loeseStation(s, d);
  if (s.done.includes(id)) return;
  if (st.raetsel) setze(s, `r:${st.raetsel}`);
  if (id === 's5' && s.thesen.length !== 2) { s.thesen = ['t36', 't43']; s.thesen.forEach((k) => gibKarte(s, k)); }
  schliesseStation(s, id);
}

/** Lehrkraftmodus: springt zu einer Station. Alles davor gilt als gelöst. */
export function springeZu(s, id) {
  for (const d of station(id).offen) loeseStation(s, d);
  s.szene = station(id).szene;
}

export function bonusEnde(s, id) { if (!s.bonus.includes(id)) s.bonus.push(id); }

/** Karten, die sich allein aus erledigten Stationen ergeben (für den Fortsetzungscode). */
export function kartenAusStand(s) {
  const karten = [];
  for (const st of game.stationen) if (s.done.includes(st.id)) karten.push(...(st.karten || []));
  return [...karten, ...s.thesen];
}

export function zielText(s, sz) {
  const z = (sz.ziel || []).find((e) => erfuellt(s, e.wenn));
  return z ? z.text : '';
}

export const platten = (s) => game.stationen.filter((st) => st.platte).map((st) => ({ ...st, da: s.done.includes(st.id) }));
