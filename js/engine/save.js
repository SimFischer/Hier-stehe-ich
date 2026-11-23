// Hält den Spielstand und speichert ihn lokal im Browser. Es wird nichts versendet.
import { neuerStand } from './state.js';

const SCHLUESSEL = 'hier-stehe-ich.stand.v1';
const hoerer = new Set();

function laden() {
  try {
    const roh = JSON.parse(localStorage.getItem(SCHLUESSEL));
    return roh && roh.v === 1 ? { ...neuerStand(), ...roh, stufen: { ...neuerStand().stufen, ...roh.stufen } } : null;
  } catch { return null; }
}

export const store = { state: neuerStand(), vorhanden: false };

export function start() {
  const s = laden(); store.vorhanden = Boolean(s && s.szene);
  // Gleich speichern: So behält ein älterer Spielstand ohne spielId die Kennung, die er gerade bekommen hat.
  if (s) { store.state = s; speichern(); }
}
function speichern() { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(store.state)); } catch { /* privater Modus: Spiel läuft trotzdem */ } }

/** Ändert den Spielstand, speichert und meldet es allen Anzeigen. */
export function aendere(fn) { const r = fn(store.state); speichern(); hoerer.forEach((f) => f(store.state)); return r; }
export function ersetze(stand) { store.state = stand; speichern(); hoerer.forEach((f) => f(store.state)); }
export const beiAenderung = (fn) => hoerer.add(fn);
