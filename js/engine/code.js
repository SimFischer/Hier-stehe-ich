// Fortsetzungscode: 32 Bit Spielstand + 8 Bit Prüfsumme = 8 Zeichen. Kein Server nötig.
import { game } from '../../data/game.js';
import { neuerStand, kartenAusStand, station } from './state.js';

const ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const VERSION = 1;
const THESEN = ['t27', 't32', 't36', 't43', 't86'];
const PAARE = [];
for (let a = 0; a < THESEN.length; a++) for (let b = a + 1; b < THESEN.length; b++) PAARE.push([THESEN[a], THESEN[b]]);
const RAT = ['', 'behalten', 'armen', 'kaufen'];
const BONUS = ['entfuehrung', 'presse', 'lutherrose', 'gottesdienst', 'silben'];
const ids = game.stationen.map((st) => st.id);

// Felder in fester Reihenfolge: [Name, Bitbreite]
const FELDER = [['version', 2], ['done', 9], ['thesen', 4], ['rat', 2], ['markt', 2], ['druck', 2], ['verhoer', 2], ['bonus', 5], ['hilfen', 4]];

function crc8(bits) {
  let crc = 0x5a;
  for (let i = 0; i < bits.length; i += 8) {
    crc ^= parseInt(bits.slice(i, i + 8), 2);
    for (let k = 0; k < 8; k++) crc = crc & 0x80 ? ((crc << 1) ^ 0x07) & 0xff : (crc << 1) & 0xff;
  }
  return crc;
}

const maske = (liste, alle) => alle.reduce((m, id, i) => m | (liste.includes(id) ? 1 << i : 0), 0);
const ausMaske = (m, alle) => alle.filter((_, i) => m & (1 << i));

export function kodiere(s) {
  const paar = PAARE.findIndex((p) => p.every((t) => s.thesen.includes(t)));
  const werte = {
    version: VERSION, done: maske(s.done, ids), thesen: s.thesen.length === 2 ? paar + 1 : 0,
    rat: Math.max(0, RAT.indexOf(s.rat)), markt: s.stufen.markt, druck: s.stufen.druck, verhoer: s.stufen.verhoer,
    bonus: maske(s.bonus, BONUS), hilfen: Math.min(15, s.hilfen)
  };
  let bits = FELDER.map(([name, breite]) => werte[name].toString(2).padStart(breite, '0')).join('');
  bits += crc8(bits).toString(2).padStart(8, '0');
  let code = '';
  for (let i = 0; i < 40; i += 5) code += ABC[parseInt(bits.slice(i, i + 5), 2)];
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

/** Liest einen Code. Gibt { stand } oder { fehler: 'form' | 'pruefsumme' | 'inhalt' } zurück. */
export function lies(eingabe) {
  const code = String(eingabe).toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length !== 8 || [...code].some((c) => !ABC.includes(c))) return { fehler: 'form' };
  const bits = [...code].map((c) => ABC.indexOf(c).toString(2).padStart(5, '0')).join('');
  if (crc8(bits.slice(0, 32)) !== parseInt(bits.slice(32), 2)) return { fehler: 'pruefsumme' };
  const w = {}; let pos = 0;
  for (const [name, breite] of FELDER) { w[name] = parseInt(bits.slice(pos, pos + breite), 2); pos += breite; }
  if (w.version !== VERSION || w.thesen > PAARE.length) return { fehler: 'inhalt' };
  const s = neuerStand();
  s.done = ausMaske(w.done, ids);
  // Ein Stand ist nur gültig, wenn die Voraussetzungen jeder Station erfüllt sind.
  if (!s.done.every((id) => station(id).offen.every((d) => s.done.includes(d)))) return { fehler: 'inhalt' };
  if ((w.thesen > 0) !== s.done.includes('s5')) return { fehler: 'inhalt' };
  s.thesen = w.thesen ? [...PAARE[w.thesen - 1]] : [];
  s.rat = RAT[w.rat];
  s.stufen = { markt: w.markt, druck: w.druck, verhoer: w.verhoer };
  s.bonus = ausMaske(w.bonus, BONUS);
  s.hilfen = w.hilfen;
  s.cards = kartenAusStand(s);
  s.flags = s.done.map((id) => station(id).raetsel).filter(Boolean).map((r) => `r:${r}`);
  s.szene = game.start;
  return { stand: s };
}
