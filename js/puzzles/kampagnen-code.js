// Hammer-&-Siegel-Code: nimmt den Fortschritt in der Kampagne auf ein anderes Gerät mit (zum Beispiel ein anderes Schul-iPad).
// 20 Zeichen in 4 Fünfergruppen, kein Server nötig, mit 16-Bit-Prüfsumme (jeder Tippfehler fällt auf).
// Genau übertragen: Sterne, Siege als Kirche, durchgespielt, Abzeichen, Siegellack (ungeöffnete Briefe zählen als Siegellack), Anführer.
// Verkürzt übertragen, damit der Code kurz bleibt:
//   Karten: nur wie viele man je Seltenheit hat. Beim Einlesen werden so viele Karten derselben Seltenheit neu verteilt
//           (gleich groß und gleich wertvoll, aber teils andere Karten).
//   Konter-Lexikon: nur die Zahl der entdeckten Konter (als Gutschrift: keine doppelten Siegelbriefe). Die Einträge füllen sich neu.
// Nicht enthalten: Prachtausgaben, gespeicherte Decks, Niederlagen.
import { kampagne } from '../../data/kampagne.js';
import { lutherKarten } from '../../data/kartei.js';
import { maxKopien, anzahl } from './duell-regeln.js';

const ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const VERSION = 2;
const GRUPPE = 5;
const reihenfolge = kampagne.kapitel.flatMap((k) => k.gegner);
const SELTEN = ['gewoehnlich', 'selten', 'episch', 'legendaer'];
const pool = (sel) => lutherKarten.filter((k) => k.seltenheit === sel);
const kopienMax = (sel) => pool(sel).reduce((n, k) => n + maxKopien(k.id), 0);
const breite = (max) => Math.max(1, Math.ceil(Math.log2(max + 1)));
const MAX_LACK = 127;
const MAX_LEX = 127;

/** Felder in fester Reihenfolge: [Name, Bitbreite] */
const felder = () => [['version', 2], ['sterne', reihenfolge.length * 2], ['kirche', kampagne.kirchenSeite.gegner.length], ['durch', 1],
  ['abzeichen', kampagne.abzeichen.length], ['lack', 7], ['anfuehrer', 2], ['lexikon', 7],
  ...SELTEN.map((s) => [`karten-${s}`, breite(kopienMax(s))])];

function crc16(bits) {
  let crc = 0xffff;
  for (let i = 0; i < bits.length; i++) {
    const oben = (crc >> 15) & 1;
    crc = (crc << 1) & 0xffff;
    if (oben ^ (bits[i] === '1' ? 1 : 0)) crc ^= 0x1021;
  }
  return crc;
}
const zahlBits = (n, b) => n.toString(2).padStart(b, '0');
const datenBits = () => felder().reduce((n, [, b]) => n + b, 0);
const gesamtBits = () => Math.ceil((datenBits() + 16) / (5 * GRUPPE)) * 5 * GRUPPE;
// Kleiner Zufall mit Startwert (gleicher Code, gleiche Karten)
const zufall = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

/** Kodiert den Kampagnen-Fortschritt. */
export function kodiereKampagne(s) {
  const lack = Math.min(MAX_LACK, (s.wachs || 0) + (s.briefe || []).reduce((n, b) => n + (b.art === 'gross' ? 10 : 5), 0));
  const maske = (liste, alle) => alle.map((x) => (liste.includes(x) ? '1' : '0')).join('');
  const karten = s.karten || [];
  const werte = {
    version: zahlBits(VERSION, 2),
    sterne: reihenfolge.map((id) => zahlBits(Math.min(3, s.sterne?.[id] || 0), 2)).join(''),
    kirche: maske(s.kircheSiege || [], kampagne.kirchenSeite.gegner),
    durch: s.durchgespielt ? '1' : '0',
    abzeichen: maske(s.abzeichen || [], kampagne.abzeichen.map((a) => a.id)),
    lack: zahlBits(lack, 7),
    anfuehrer: zahlBits(Math.max(0, kampagne.anfuehrer.findIndex((a) => a.id === s.anfuehrer)), 2),
    lexikon: zahlBits(Math.min(MAX_LEX, Math.max((s.lexikon || []).length, s.lexikonGutschrift || 0)), 7)
  };
  for (const sel of SELTEN) {
    const n = pool(sel).reduce((m, k) => m + Math.min(maxKopien(k.id), anzahl(karten, k.id)), 0);
    werte[`karten-${sel}`] = zahlBits(n, breite(kopienMax(sel)));
  }
  let bits = felder().map(([name]) => werte[name]).join('');
  bits += zahlBits(crc16(bits), 16);
  bits = bits.padEnd(gesamtBits(), '0');
  let code = '';
  for (let i = 0; i < bits.length; i += 5) code += ABC[parseInt(bits.slice(i, i + 5), 2)];
  return code.match(new RegExp(`.{1,${GRUPPE}}`, 'g')).join('-');
}

/** Liest einen Hammer-&-Siegel-Code. storyKarten: Karten aus der Geschichte, die man schon hat (für die Verteilung).
 *  Gibt { stand } (nur die Felder des Fortschritts) oder { fehler: 'form' | 'pruefsumme' | 'inhalt' }. */
export function liesKampagne(eingabe, { heute = new Date().toISOString().slice(0, 10), storyKarten = [] } = {}) {
  const code = String(eingabe).toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length * 5 !== gesamtBits() || [...code].some((c) => !ABC.includes(c))) return { fehler: 'form' };
  const bits = [...code].map((c) => zahlBits(ABC.indexOf(c), 5)).join('');
  const d = datenBits();
  const pruef = parseInt(bits.slice(d, d + 16), 2);
  if (crc16(bits.slice(0, d)) !== pruef || /1/.test(bits.slice(d + 16))) return { fehler: 'pruefsumme' };
  const w = {}; let pos = 0;
  for (const [name, b] of felder()) { w[name] = bits.slice(pos, pos + b); pos += b; }
  if (parseInt(w.version, 2) !== VERSION) return { fehler: 'inhalt' };
  const ausMaske = (m, alle) => alle.filter((_, i) => m[i] === '1');
  const sterne = {};
  reihenfolge.forEach((id, i) => { const n = parseInt(w.sterne.slice(i * 2, i * 2 + 2), 2); if (n) sterne[id] = n; });
  // Karten neu verteilen: je Seltenheit so viele Kopien wie vorher, zuerst verschiedene Karten, dann zweite Kopien.
  // Was man aus der Geschichte schon hat, zählt mit (keine Kopien über die Grenze).
  const rnd = zufall(pruef * 2654435761);
  const karten = [];
  for (const sel of SELTEN) {
    let n = parseInt(w[`karten-${sel}`], 2);
    if (n > kopienMax(sel)) return { fehler: 'inhalt' };
    const runden = [[], []];
    for (const k of pool(sel)) { const frei = maxKopien(k.id) - Math.min(maxKopien(k.id), anzahl(storyKarten, k.id)); for (let j = 0; j < frei; j++) runden[Math.min(j, 1)].push(k.id); }
    for (const liste of runden) {
      for (let i = liste.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [liste[i], liste[j]] = [liste[j], liste[i]]; }
      while (n > 0 && liste.length) { karten.push(liste.shift()); n -= 1; }
    }
  }
  const fuehrer = kampagne.anfuehrer[parseInt(w.anfuehrer, 2)];
  return { stand: {
    sterne, gesehen: reihenfolge.filter((id) => sterne[id]),
    kircheSiege: ausMaske(w.kirche, kampagne.kirchenSeite.gegner),
    durchgespielt: w.durch === '1' ? heute : null,
    abzeichen: ausMaske(w.abzeichen, kampagne.abzeichen.map((a) => a.id)),
    wachs: parseInt(w.lack, 2),
    anfuehrer: fuehrer?.id || 'a-luther',
    lexikon: [], lexikonGutschrift: parseInt(w.lexikon, 2),
    karten, intro: true
  } };
}
