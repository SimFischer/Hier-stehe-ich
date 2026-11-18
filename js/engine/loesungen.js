// Leitet die Lösungen aus den Spieldaten ab: für das Lehrkräftekompendium und die Tests.
// Es gibt keine zweite Lösungsliste. Was hier steht, kommt aus data/.
import { aufbau } from '../puzzles/zuordnen.js';
import { karte as kartei, lutherKarten } from '../../data/kartei.js';

const PFEIL = ' → ';

/** Lösung eines Schritts als Liste kurzer Zeilen. Leere Liste: Der Schritt hat keine Lösung (Text, Gespräch, freie Wahl). */
export function loesung(schritt, { cards, systeme, figuren, disputation }) {
  const karte = (id) => cards.find((k) => k.id === id)?.titel || id;
  const system = schritt.system ? systeme[schritt.system] : null;
  switch (schritt.art) {
    case 'zuordnen': {
      const a = aufbau(schritt, cards);
      return a.items.map((i) => `${i.text}${PFEIL}${a.ziele.find((z) => z.id === i.ziel).label}`);
    }
    case 'wahl': return schritt.frei ? [] : [schritt.optionen.find((o) => o.richtig).text];
    case 'waage': return [schritt.ende];
    case 'standbild': return schritt.strophen.map((st) => `${st.nr}: ${Object.entries(schritt.regler)
      .map(([k, r]) => `${r.label} ${st.passt[k].map((w) => r.werte.find((x) => x.id === w).label).join(' / ')}`).join('; ')}`);
    case 'markt': return system.figuren.map((f) => `${figuren[f.id].name}${PFEIL}${f.antworten.filter((a) => a.passt).map((a) => a.text).join(' / ')}`);
    case 'duell': {
      const kirche = (id) => kartei(id);
      return [...new Set(disputation.gegner[schritt.gegner].deck)].map(kirche).sort((a, b) => b.staerke - a.staerke)
        .map((k) => `${k.titel} (${k.staerke})${PFEIL}${lutherKarten.filter((c) => !c.anfuehrer && (c.entkraeftet || []).includes(k.id) && (c.station || c.duell)).map((c) => c.titel).join(' / ') || '–'}`);
    }
    case 'uebersetzung': return schritt.verse.map((v) => v.optionen.find((o) => o.richtig).text);
    case 'silben': return schritt.fragen.map((f) => `${f.frage}${PFEIL}${f.silben.join('')}`);
    case 'presse': return [schritt.schritte.join(PFEIL)];
    case 'rose': return [schritt.schichten.map((x) => x.label).join(PFEIL)];
    case 'druck': case 'fahrt': return [schritt.hilfen[2]];
    case 'auswahl': return schritt.hilfen ? [schritt.hilfen[2]] : [];
    default: return [];
  }
}

/** Alle Lösungen eines Rätsels: je Schritt Titel und Zeilen. Schritte ohne Lösung fallen weg. */
export function loesungen(raetsel, daten) {
  return raetsel.schritte.map((s, i) => ({ nr: i + 1, titel: s.titel || s.frage || raetsel.titel, zeilen: loesung(s, daten) })).filter((x) => x.zeilen.length);
}
