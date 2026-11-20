// Regeln des Kartenspiels „Disputation“ und die Züge der Kirche. Rein und in Node testbar.
// Jeder Zug gibt einen neuen Stand zurück. Zufall kommt aus einem Startwert im Stand: Gleicher Startwert, gleiches Spiel.
import { disputation } from '../../data/disputation.js';
import { karte, lutherKarten } from '../../data/kartei.js';

export const K = karte;
export const anders = (seite) => (seite === 'luther' ? 'kirche' : 'luther');

function zufall(n) {
  let t = (n.seed = (n.seed + 0x6d2b79f5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function mische(n, liste) {
  for (let i = liste.length - 1; i > 0; i--) { const j = Math.floor(zufall(n) * (i + 1)); [liste[i], liste[j]] = [liste[j], liste[i]]; }
}
function ziehe(n, seite, anzahl) {
  const s = n.seiten[seite];
  let gezogen = 0;
  for (let i = 0; i < anzahl && s.deck.length && s.hand.length < n.regeln.handMax; i++) { s.hand.push(s.deck.shift()); gezogen += 1; }
  return gezogen;
}

const gruppe = (k) => k.gruppe || k.typ;
const trifft = (liste, k) => liste.includes('alle') || liste.includes(gruppe(k));

/** Liegt in Luthers Reihe eine Karte, die diese Kirchenkarte entkräftet? */
export function entkraeftet(z, seite, inst) {
  if (seite !== 'kirche') return null;
  const wer = z.seiten.luther.reihe.find((l) => (K(l.id).entkraeftet || []).includes(inst.id));
  return wer ? wer.id : null;
}

/** Stärke einer Karte in der Reihe, mit allen Fähigkeiten, die gerade wirken. */
export function wert(z, seite, inst) {
  if (entkraeftet(z, seite, inst)) return 1;
  const k = K(inst.id);
  let v = k.staerke;
  for (const o of z.seiten[seite].reihe) {
    if (o.uid === inst.uid || entkraeftet(z, seite, o)) continue;
    const ok = K(o.id);
    if (ok.staerkt && trifft(ok.staerkt.gruppe, k)) v += ok.staerkt.plus;
    if (k.bund && !ok.anfuehrer && gruppe(ok) === gruppe(k)) v += 1;
  }
  if (!k.standhaft) for (const o of z.seiten[anders(seite)].reihe) {
    const ok = K(o.id);
    if (ok.schwaecht && !entkraeftet(z, anders(seite), o) && trifft(ok.schwaecht.gruppe, k)) v -= ok.schwaecht.minus;
  }
  return Math.max(1, v);
}
export const summe = (z, seite) => z.seiten[seite].reihe.reduce((n, inst) => n + wert(z, seite, inst), 0);

function neueSeite(n, ids, anfuehrer, mischen = true) {
  const deck = ids.map((id) => ({ uid: (n.uid += 1), id }));
  if (mischen) mische(n, deck);
  return { deck, hand: [], reihe: [], ablage: [], gepasst: false, siege: 0, anfuehrer: anfuehrer ? { uid: (n.uid += 1), id: anfuehrer } : null };
}

/** Lege eine Karte probeweise: nur Reihe und Bann, ohne Nachziehen und Zugwechsel. */
function lege(n, seite, uid) {
  const s = n.seiten[seite];
  let inst;
  // Der Anführer liegt neben dem Deck und wird einmal gespielt.
  if (s.anfuehrer?.uid === uid) { inst = s.anfuehrer; s.anfuehrer = null; }
  else { const i = s.hand.findIndex((x) => x.uid === uid); [inst] = s.hand.splice(i, 1); }
  s.reihe.push(inst);
  const ereignis = { seite, id: inst.id, uid, art: 'spiel', runde: n.runde };
  if (K(inst.id).bann) {
    const g = n.seiten[anders(seite)];
    const ziele = g.reihe.filter((x) => !K(x.id).standhaft);
    if (ziele.length) {
      const ziel = ziele.reduce((a, b) => (wert(n, anders(seite), b) > wert(n, anders(seite), a) ? b : a));
      g.reihe = g.reihe.filter((x) => x.uid !== ziel.uid); g.ablage.push(ziel);
      ereignis.bann = ziel.id;
    } else ereignis.bannLeer = true;
  }
  return ereignis;
}

function rundeEnde(n) {
  const l = summe(n, 'luther'); const k = summe(n, 'kirche');
  const sieger = l > k ? 'luther' : 'kirche';
  n.seiten[sieger].siege += 1;
  n.runden.push({ runde: n.runde, luther: l, kirche: k, sieger, gleich: l === k });
  if (n.seiten[sieger].siege >= n.regeln.siegeNoetig) { n.phase = 'ende'; n.sieger = sieger; return; }
  for (const s of Object.values(n.seiten)) { s.ablage.push(...s.reihe); s.reihe = []; s.gepasst = false; }
  n.runde += 1;
  ziehe(n, 'luther', n.regeln.nachziehen); ziehe(n, 'kirche', n.regeln.nachziehen);
  n.am = anders(sieger);
  pruefeLeer(n);
}

function passeIntern(n, seite) {
  n.seiten[seite].gepasst = true;
  n.log.push({ seite, art: 'passe' });
  if (n.seiten[anders(seite)].gepasst) { rundeEnde(n); return; }
  n.am = anders(seite);
  pruefeLeer(n);
}
/** Wer keine Karten mehr hat (auch keinen Anführer), passt von selbst. */
function pruefeLeer(n) { const s = n.seiten[n.am]; if (n.phase === 'spiel' && !s.hand.length && !s.anfuehrer && !s.gepasst) passeIntern(n, n.am); }

export const rules = {
  /** Neue Disputation. anfuehrer: Luthers Anführer (Kampagne). Die Übung läuft ohne Mischen und nach Skript. */
  start(gegner, deckLuther, seed = 1, grund = disputation.regeln, { anfuehrer = null } = {}) {
    const regeln = { ...grund, ...(gegner.regeln || {}) };
    const fest = Boolean(gegner.skript);
    const n = { phase: 'tausch', runde: 1, am: 'luther', seed: seed >>> 0, uid: 0, tausch: regeln.tausch, regeln, gegner: gegner.id, log: [], runden: [], sieger: null, skript: gegner.skript || null, skriptPos: 0 };
    n.seiten = { luther: neueSeite(n, fest ? gegner.deckLuther : deckLuther, anfuehrer, !fest), kirche: neueSeite(n, gegner.deck, gegner.anfuehrer, !fest) };
    // handKirche: Späte Gegner der Kampagne beginnen mit mehr Karten als Luther.
    ziehe(n, 'luther', regeln.handStart); ziehe(n, 'kirche', regeln.handKirche || regeln.handStart);
    return n;
  },
  /** Vor dem Spiel: eine Handkarte zurück ins Deck, dafür eine neue ziehen. */
  tausche(z, uid) {
    if (z.phase !== 'tausch' || z.tausch < 1 || !z.seiten.luther.deck.length) return z;
    const n = structuredClone(z);
    const s = n.seiten.luther;
    const i = s.hand.findIndex((x) => x.uid === uid);
    if (i < 0) return z;
    const [alt] = s.hand.splice(i, 1);
    s.hand.splice(i, 0, s.deck.shift());
    s.deck.splice(Math.floor(zufall(n) * (s.deck.length + 1)), 0, alt);
    n.tausch -= 1;
    return n;
  },
  beginne(z) { if (z.phase !== 'tausch') return z; const n = structuredClone(z); n.phase = 'spiel'; n.am = 'luther'; return n; },
  /** Luther spielt seinen Anführer (Kampagne). */
  anfuehrerFrei: (z, seite) => Boolean(z.seiten[seite].anfuehrer),
  kann: (z, seite) => z.phase === 'spiel' && z.am === seite && !z.seiten[seite].gepasst,
  spiele(z, seite, uid) {
    if (!rules.kann(z, seite) || !(z.seiten[seite].hand.some((x) => x.uid === uid) || z.seiten[seite].anfuehrer?.uid === uid)) return z;
    const n = structuredClone(z);
    const vorher = seite === 'luther' ? n.seiten.kirche.reihe.filter((c) => !entkraeftet(n, 'kirche', c)).map((c) => c.uid) : [];
    const ereignis = lege(n, seite, uid);
    const k = K(ereignis.id);
    // Treffer: Entkräftet die Karte eine Kirchenkarte, die schon liegt, zieht Luther eine Karte nach.
    const getroffen = n.seiten.kirche.reihe.filter((c) => vorher.includes(c.uid) && entkraeftet(n, 'kirche', c));
    if (getroffen.length) { ereignis.treffer = getroffen.map((c) => c.id); }
    const nach = (k.zieht || 0) + (getroffen.length ? n.regeln.trefferZieht : 0);
    if (nach) ereignis.gezogen = ziehe(n, seite, nach);
    n.log.push(ereignis);
    if (!n.seiten[anders(seite)].gepasst) n.am = anders(seite);
    pruefeLeer(n);
    return n;
  },
  passe(z, seite) {
    if (!rules.kann(z, seite)) return z;
    const n = structuredClone(z);
    passeIntern(n, seite);
    return n;
  },
  /** Vorsprung der Seite, wenn sie diese Karte jetzt legt. */
  vorsprungNach(z, seite, uid) {
    const n = structuredClone(z);
    lege(n, seite, uid);
    return summe(n, seite) - summe(n, anders(seite));
  },
  /** Der Zug der Kirche. Sie kennt Luthers Hand nicht, nur was auf dem Tisch liegt. */
  kiZug(z) {
    const k = z.seiten.kirche; const l = z.seiten.luther;
    if (z.skript) {
      const naechster = z.skript[z.skriptPos];
      const inst = k.hand.find((x) => x.id === naechster);
      return inst ? { art: 'spiele', uid: inst.uid } : { art: 'passe' };
    }
    const fuehrer = k.anfuehrer ? { uid: k.anfuehrer.uid, basis: K(k.anfuehrer.id).staerke, nach: rules.vorsprungNach(z, 'kirche', k.anfuehrer.uid) } : null;
    if (!k.hand.length) return fuehrer && fuehrer.nach > 0 ? { art: 'spiele', uid: fuehrer.uid } : { art: 'passe' };
    const vorne = summe(z, 'kirche') - summe(z, 'luther');
    const optionen = k.hand.map((x) => ({ uid: x.uid, basis: K(x.id).staerke, nach: rules.vorsprungNach(z, 'kirche', x.uid) }));
    const fuehrend = optionen.filter((o) => o.nach > 0).sort((a, b) => a.basis - b.basis || b.nach - a.nach);
    const mussGewinnen = l.siege > k.siege || (l.siege === 1 && k.siege === 1);
    // Den Anführer spart die Kirche für eine Runde, die sie gewinnen muss, oder für Runde 2 und 3.
    const fuehrerJetzt = fuehrer && fuehrer.nach > 0 && (mussGewinnen || z.runde >= 2);
    if (l.gepasst) {
      if (vorne > 0) return { art: 'passe' };
      if (fuehrend.length) return { art: 'spiele', uid: fuehrend[0].uid };
      return fuehrerJetzt ? { art: 'spiele', uid: fuehrer.uid } : { art: 'passe' };
    }
    if (mussGewinnen && fuehrer && !fuehrend.length && fuehrer.nach > vorne) return { art: 'spiele', uid: fuehrer.uid };
    // Die Kirche spart Karten, wenn sie klar vorne liegt und Luther mehr Karten hat.
    if (!mussGewinnen && vorne >= 4 && k.reihe.length >= 2 && k.hand.length <= l.hand.length) return { art: 'passe' };
    if (fuehrend.length) return { art: 'spiele', uid: fuehrend[0].uid };
    // Uneinholbar: Runde 1 verloren geben, um Karten zu sparen.
    if (!mussGewinnen && k.siege === 0 && vorne < -8 && k.hand.length <= l.hand.length + 1) return { art: 'passe' };
    const beste = optionen.reduce((a, b) => (b.nach > a.nach ? b : a));
    return { art: 'spiele', uid: beste.uid };
  },
  fuehreAus(z, zug, seite = 'kirche') {
    const n = zug.art === 'passe' ? rules.passe(z, seite) : rules.spiele(z, seite, zug.uid);
    if (n !== z && seite === 'kirche' && n.skript) n.skriptPos += 1;
    return n;
  },
  /** Ergebnisstufe für Worms: Sieg 3, eine gewonnene Runde 2, sonst 1. */
  stufe: (z) => (z.sieger === 'luther' ? 3 : z.seiten.luther.siege >= 1 ? 2 : 1),
  /** Welche Karten hätten geholfen? Starke Kirchenkarten aus diesem Spiel, die nicht entkräftet wurden. */
  verpasst(z, besitz, deck) {
    const gespielt = z.log.filter((e) => e.art === 'spiel');
    const luther = gespielt.filter((e) => e.seite === 'luther');
    const trifft = (e, id) => (K(e.id).entkraeftet || []).includes(id);
    // Kirchenkarten, die in ihrer Runde nicht entkräftet wurden.
    const offen = gespielt.filter((e) => e.seite === 'kirche' && !luther.some((l) => l.runde === e.runde && trifft(l, e.id)));
    const hand = new Set(z.seiten.luther.hand.map((x) => x.id));
    const ort = (id) => (luther.some((l) => l.id === id) ? 'runde' : hand.has(id) ? 'hand' : deck.includes(id) ? 'deck' : besitz.includes(id) ? 'besitz' : 'fehlt');
    const rang = { runde: 0, hand: 1, deck: 2, besitz: 3, fehlt: 4 };
    return [...new Set(offen.map((e) => e.id))].map((id) => {
      const konter = lutherKarten.filter((c) => (c.entkraeftet || []).includes(id));
      if (!konter.length) return null;
      const beste = konter.map((c) => ({ karte: c.id, ort: ort(c.id) })).sort((a, b) => rang[a.ort] - rang[b.ort])[0];
      return { kirche: id, ...beste };
    }).filter(Boolean).sort((a, b) => K(b.kirche).staerke - K(a.kirche).staerke).slice(0, 3);
  }
};

/** Vorschlag für ein Deck: alle Karten, wenn sie passen, sonst die mit den meisten Fähigkeiten und der höchsten Stärke. */
export function deckVorschlag(besitz, regeln = disputation.regeln) {
  const punkte = (id) => { const k = K(id); return k.staerke + 3 * (k.entkraeftet || []).length + (k.standhaft ? 2 : 0) + (k.staerkt ? 2 : 0); };
  return [...besitz].sort((a, b) => punkte(b) - punkte(a)).slice(0, regeln.deckMax);
}

/** Kirchenkarten, die man schon kennt: aus allen Disputationen, die gespielt wurden. */
export function kirchenGesehen(flags) {
  const ids = new Set();
  for (const g of Object.values(disputation.gegner)) if (flags.includes(`duell:${g.id}`)) [...g.deck, g.anfuehrer].filter(Boolean).forEach((id) => ids.add(id));
  return ids;
}

/** Kopien je Karte im Deck (nur „Hammer & Siegel“): gewöhnliche und seltene bis zu 2, epische, legendäre und Anführer 1. */
export const maxKopien = (id) => (['episch', 'legendaer'].includes(K(id)?.seltenheit) || K(id)?.anfuehrer ? 1 : 2);
/** Wie oft steht eine Karte in einer Liste (Besitz oder Deck)? */
export const anzahl = (liste, id) => liste.reduce((n, x) => n + (x === id ? 1 : 0), 0);

/**
 * Bestes Deck gegen einen Gegner, nur aus Karten, die man hat (besitz, Kopien mehrfach).
 * 1. Konter: Für jede Karte des Gegners (wie oft sie im Deck liegt, höchstens zweimal) ein Konter, starke Kirchenkarten zuerst.
 *    Eine Karte, die mehrere Gegnerkarten entkräftet, zählt mehr.
 * 2. Auffüllen mit den stärksten Karten (Stärken für andere Karten zählen mit).
 * Gibt das Deck zurück, welche Kirchenkarte womit gekontert wird und wofür kein Konter in der Sammlung ist.
 */
export function deckGegen(besitz, gegner, regeln = disputation.regeln) {
  const max = regeln.deckMax;
  const gegnerKarten = [...(gegner.deck || []), gegner.anfuehrer].filter(Boolean);
  const bedarf = new Map();
  for (const c of gegnerKarten) bedarf.set(c, Math.min(2, (bedarf.get(c) || 0) + 1));
  const frei = [...besitz];
  const deck = [];
  const abgedeckt = [];
  const nimm = (id) => { frei.splice(frei.indexOf(id), 1); deck.push(id); };
  const wertKonter = (id) => {
    let w = 0;
    for (const c of K(id).entkraeftet || []) if ((bedarf.get(c) || 0) > 0) w += K(c).staerke + 4;
    return w;
  };
  // 1. Konter, solange einer noch etwas abdeckt
  while (deck.length < max) {
    const kandidaten = [...new Set(frei)].map((id) => ({ id, w: wertKonter(id) })).filter((x) => x.w > 0);
    if (!kandidaten.length) break;
    kandidaten.sort((a, b) => b.w - a.w || K(b.id).staerke - K(a.id).staerke);
    const id = kandidaten[0].id;
    for (const c of K(id).entkraeftet || []) if ((bedarf.get(c) || 0) > 0) { bedarf.set(c, bedarf.get(c) - 1); abgedeckt.push({ kirche: c, karte: id }); }
    nimm(id);
  }
  // 2. Auffüllen: stark, mit Bonus für Karten, die andere stärken oder nachziehen lassen
  const wert = (id) => { const k = K(id); return k.staerke + (k.staerkt ? 2 : 0) + (k.zieht ? 1 : 0) + (k.standhaft ? 1 : 0); };
  while (deck.length < max && frei.length) {
    const id = [...frei].sort((a, b) => wert(b) - wert(a))[0];
    nimm(id);
  }
  const fehlt = [...new Set(gegnerKarten)].filter((c) => !abgedeckt.some((a) => a.kirche === c)
    && !besitz.some((id) => (K(id).entkraeftet || []).includes(c)) && lutherKarten.some((k) => (k.entkraeftet || []).includes(c)));
  return { deck, abgedeckt, fehlt };
}

// Startdeck: so viele der stärksten Gegnerkarten bleiben ohne Konter, so groß ist das Deck. Per Simulation gewählt:
// Mit 10 Karten und 3 offenen gewinnt ein kluger Spieler im Schnitt etwa zwei von drei Partien, mit dem besten Deck fast immer.
export const START_OFFEN = 3;
export const START_GROESSE = 10;
/**
 * Startdeck gegen einen Gegner (zum Selberverbessern): Konter nur für etwa die Hälfte seiner Karten, und zwar für die schwächeren.
 * Gegen die starken Karten muss man selbst Antworten finden. Aufgefüllt mit allgemein guten Karten (stärken andere, Bund, ziehen),
 * die gegen diesen Gegner nichts entkräften. Genau so viele Karten wie nötig (deckMin).
 * Gibt zusätzlich „offen“ zurück: Karten des Gegners ohne Konter im Deck, für die man in der Sammlung einen hätte.
 */
export function startDeckGegen(besitz, gegner, regeln = disputation.regeln, { offenLassen = START_OFFEN, groesse: g0 = START_GROESSE } = {}) {
  const groesse = Math.min(g0, regeln.deckMax, besitz.length);
  const kirche = [...new Set([...(gegner.deck || []), gegner.anfuehrer].filter(Boolean))];
  const kontertIn = (id) => (K(id).entkraeftet || []).filter((c) => kirche.includes(c));
  const moeglich = kirche.filter((c) => besitz.some((id) => kontertIn(id).includes(c)));
  // Die schwächeren Karten bekommen Konter; die stärksten bleiben offen (offenLassen, bei wenigen Karten höchstens die Hälfte)
  const offenZahl = Math.min(offenLassen, Math.floor(moeglich.length / 2));
  const ziele = [...moeglich].sort((a, b) => K(a).staerke - K(b).staerke).slice(0, moeglich.length - offenZahl);
  const frei = [...besitz]; const deck = [];
  const nimm = (id) => { frei.splice(frei.indexOf(id), 1); deck.push(id); };
  const gedeckt = () => new Set(deck.flatMap(kontertIn));
  for (const c of ziele) {
    if (gedeckt().has(c) || deck.length >= groesse) continue;
    // Ein Konter, der möglichst nur dieses Ziel trifft (sonst verrät das Startdeck mehr als die Hälfte)
    // Nur Konter, die keine der offenen (starken) Karten mittreffen; gibt es keinen, bleibt auch diese Karte offen.
    const kand = [...new Set(frei)].filter((id) => kontertIn(id).includes(c) && kontertIn(id).every((x) => ziele.includes(x)))
      .sort((a, b) => K(b).staerke - K(a).staerke);
    if (kand.length) nimm(kand[0]);
  }
  // Auffüllen mit allgemein guten Karten, die gegen diesen Gegner nichts entkräften; nur wenn nötig auch mit anderen
  const allgemein = (id) => { const k = K(id); return k.staerke + (k.staerkt ? 3 : 0) + (k.bund ? 2 : 0) + (k.zieht ? 1 : 0) + (k.standhaft ? 1 : 0); };
  for (const nurOhne of [true, false]) {
    while (deck.length < groesse) {
      const id = [...new Set(frei)].filter((x) => !nurOhne || !kontertIn(x).length).sort((a, b) => allgemein(b) - allgemein(a))[0];
      if (!id) break;
      nimm(id);
    }
  }
  const abgedeckt = kirche.filter((c) => gedeckt().has(c)).map((c) => ({ kirche: c, karte: deck.find((id) => kontertIn(id).includes(c)) }));
  const offen = moeglich.filter((c) => !gedeckt().has(c));
  const fehlt = kirche.filter((c) => !moeglich.includes(c) && lutherKarten.some((k) => (k.entkraeftet || []).includes(c)));
  return { deck, abgedeckt, offen, fehlt, start: true };
}
