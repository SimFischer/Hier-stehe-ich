// Hammer-&-Siegel-Code: nimmt den Fortschritt in der Kampagne auf ein anderes Gerät mit (zum Beispiel ein anderes Schul-iPad).
// 45 Zeichen in 9 Fünfergruppen, kein Server nötig. Enthalten: Sterne, Siege als Kirche, durchgespielt, Abzeichen, Konter-Lexikon,
// Siegellack (ungeöffnete Briefe zählen als Siegellack), gewählter Anführer und alle gesammelten Karten.
// Nicht enthalten: Prachtausgaben, gespeicherte Decks, Niederlagen (sie verfallen beim Umzug).
import { kampagne } from '../../data/kampagne.js';
import { lutherKarten } from '../../data/kartei.js';
import { maxKopien, anzahl } from './duell-regeln.js';

const ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const VERSION = 1;
const GRUPPE = 5;
const reihenfolge = kampagne.kapitel.flatMap((k) => k.gegner);
const paare = () => lutherKarten.flatMap((k) => (k.entkraeftet || []).map((c) => `${k.id}>${c}`));
const pool = () => lutherKarten.filter((k) => k.seltenheit);
const MAX_LACK = 127;

// Karten als eine Zahl in gemischter Basis: je Karte 0 bis maxKopien
const kartenStellen = () => pool().map((k) => BigInt(maxKopien(k.id) + 1));
const kartenBits = () => kartenStellen().reduce((n, b) => n * b, 1n).toString(2).length;

/** Feste Felder: [Name, Bitbreite] */
const felder = () => [['version', 2], ['sterne', reihenfolge.length * 2], ['kirche', kampagne.kirchenSeite.gegner.length], ['durch', 1],
  ['abzeichen', kampagne.abzeichen.length], ['lexikon', paare().length], ['lack', 7], ['anfuehrer', 2], ['karten', kartenBits()]];

function crc16(bits) {
  let crc = 0xffff;
  for (let i = 0; i < bits.length; i++) {
    const b = bits[i] === '1' ? 1 : 0;
    const oben = (crc >> 15) & 1;
    crc = (crc << 1) & 0xffff;
    if (oben ^ b) crc ^= 0x1021;
  }
  return crc;
}
const zahlBits = (n, breite) => n.toString(2).padStart(breite, '0');
const gesamtBits = () => { const daten = felder().reduce((n, [, b]) => n + b, 0) + 16; return Math.ceil(daten / (5 * GRUPPE)) * 5 * GRUPPE; };

/** Kodiert den Kampagnen-Fortschritt. */
export function kodiereKampagne(s) {
  const lack = Math.min(MAX_LACK, (s.wachs || 0) + (s.briefe || []).reduce((n, b) => n + (b.art === 'gross' ? 10 : 5), 0));
  let kartenZahl = 0n;
  const stellen = kartenStellen();
  pool().forEach((k, i) => { kartenZahl = kartenZahl * stellen[i] + BigInt(Math.min(maxKopien(k.id), anzahl(s.karten || [], k.id))); });
  const maske = (liste, alle) => alle.map((x) => (liste.includes(x) ? '1' : '0')).join('');
  const werte = {
    version: zahlBits(VERSION, 2),
    sterne: reihenfolge.map((id) => zahlBits(Math.min(3, s.sterne?.[id] || 0), 2)).join(''),
    kirche: maske(s.kircheSiege || [], kampagne.kirchenSeite.gegner),
    durch: s.durchgespielt ? '1' : '0',
    abzeichen: maske(s.abzeichen || [], kampagne.abzeichen.map((a) => a.id)),
    lexikon: maske(s.lexikon || [], paare()),
    lack: zahlBits(lack, 7),
    anfuehrer: zahlBits(Math.max(0, kampagne.anfuehrer.findIndex((a) => a.id === s.anfuehrer)), 2),
    karten: zahlBits(kartenZahl, kartenBits())
  };
  let bits = felder().map(([name]) => werte[name]).join('');
  bits += zahlBits(crc16(bits), 16);
  bits = bits.padEnd(gesamtBits(), '0');
  let code = '';
  for (let i = 0; i < bits.length; i += 5) code += ABC[parseInt(bits.slice(i, i + 5), 2)];
  return code.match(new RegExp(`.{1,${GRUPPE}}`, 'g')).join('-');
}

/** Liest einen Hammer-&-Siegel-Code. Gibt { stand } (nur die Felder des Fortschritts) oder { fehler: 'form' | 'pruefsumme' | 'inhalt' }. */
export function liesKampagne(eingabe, heute = new Date().toISOString().slice(0, 10)) {
  const code = String(eingabe).toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length * 5 !== gesamtBits() || [...code].some((c) => !ABC.includes(c))) return { fehler: 'form' };
  const bits = [...code].map((c) => zahlBits(ABC.indexOf(c), 5)).join('');
  const datenLaenge = felder().reduce((n, [, b]) => n + b, 0);
  if (crc16(bits.slice(0, datenLaenge)) !== parseInt(bits.slice(datenLaenge, datenLaenge + 16), 2)) return { fehler: 'pruefsumme' };
  // Die Füllbits am Ende sind immer 0, sonst hat sich im letzten Zeichen ein Tippfehler eingeschlichen
  if (/1/.test(bits.slice(datenLaenge + 16))) return { fehler: 'pruefsumme' };
  const w = {}; let pos = 0;
  for (const [name, breite] of felder()) { w[name] = bits.slice(pos, pos + breite); pos += breite; }
  if (parseInt(w.version, 2) !== VERSION) return { fehler: 'inhalt' };
  const ausMaske = (m, alle) => alle.filter((_, i) => m[i] === '1');
  const sterne = {};
  reihenfolge.forEach((id, i) => { const n = parseInt(w.sterne.slice(i * 2, i * 2 + 2), 2); if (n) sterne[id] = n; });
  // Karten aus der Zahl in gemischter Basis zurückrechnen (von hinten)
  let zahl = BigInt(`0b${w.karten}`);
  const stellen = kartenStellen(); const karten = []; const liste = pool();
  for (let i = liste.length - 1; i >= 0; i--) { const n = Number(zahl % stellen[i]); zahl /= stellen[i]; for (let j = 0; j < n; j++) karten.unshift(liste[i].id); }
  if (zahl !== 0n) return { fehler: 'inhalt' };
  const fuehrer = kampagne.anfuehrer[parseInt(w.anfuehrer, 2)];
  return { stand: {
    sterne, gesehen: reihenfolge.filter((id) => sterne[id]),
    kircheSiege: ausMaske(w.kirche, kampagne.kirchenSeite.gegner),
    durchgespielt: w.durch === '1' ? heute : null,
    abzeichen: ausMaske(w.abzeichen, kampagne.abzeichen.map((a) => a.id)),
    lexikon: ausMaske(w.lexikon, paare()),
    wachs: parseInt(w.lack, 2),
    anfuehrer: fuehrer?.id || 'a-luther',
    karten, intro: true
  } };
}
