// Regeln des Kartenspiels „Disputation“ und die Züge der Kirche. Rein und in Node testbar.
// Jeder Zug gibt einen neuen Stand zurück. Zufall kommt aus einem Startwert im Stand: Gleicher Startwert, gleiches Spiel.
import { cards } from '../../data/cards.js';
import { disputation } from '../../data/disputation.js';

const ALLE = new Map([...cards, ...disputation.kirche].map((k) => [k.id, k]));
export const K = (id) => ALLE.get(id);
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
    if (k.bund && ok.typ === k.typ) v += 1;
  }
  if (!k.standhaft) for (const o of z.seiten[anders(seite)].reihe) {
    const ok = K(o.id);
    if (ok.schwaecht && !entkraeftet(z, anders(seite), o) && trifft(ok.schwaecht.gruppe, k)) v -= ok.schwaecht.minus;
  }
  return Math.max(1, v);
}
export const summe = (z, seite) => z.seiten[seite].reihe.reduce((n, inst) => n + wert(z, seite, inst), 0);

function neueSeite(n, ids) {
  const deck = ids.map((id) => ({ uid: (n.uid += 1), id }));
  mische(n, deck);
  return { deck, hand: [], reihe: [], ablage: [], gepasst: false, siege: 0 };
}

/** Lege eine Karte probeweise: nur Reihe und Bann, ohne Nachziehen und Zugwechsel. */
function lege(n, seite, uid) {
  const s = n.seiten[seite];
  const i = s.hand.findIndex((x) => x.uid === uid);
  const [inst] = s.hand.splice(i, 1);
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
/** Wer keine Karten mehr hat, passt von selbst. */
function pruefeLeer(n) { if (n.phase === 'spiel' && !n.seiten[n.am].hand.length && !n.seiten[n.am].gepasst) passeIntern(n, n.am); }

export const rules = {
  start(gegner, deckLuther, seed = 1, regeln = disputation.regeln) {
    const n = { phase: 'tausch', runde: 1, am: 'luther', seed: seed >>> 0, uid: 0, tausch: regeln.tausch, regeln, gegner: gegner.id, log: [], runden: [], sieger: null };
    n.seiten = { luther: neueSeite(n, deckLuther), kirche: neueSeite(n, gegner.deck) };
    ziehe(n, 'luther', regeln.handStart); ziehe(n, 'kirche', regeln.handStart);
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
  kann: (z, seite) => z.phase === 'spiel' && z.am === seite && !z.seiten[seite].gepasst,
  spiele(z, seite, uid) {
    if (!rules.kann(z, seite) || !z.seiten[seite].hand.some((x) => x.uid === uid)) return z;
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
    if (!k.hand.length) return { art: 'passe' };
    const vorne = summe(z, 'kirche') - summe(z, 'luther');
    const optionen = k.hand.map((x) => ({ uid: x.uid, basis: K(x.id).staerke, nach: rules.vorsprungNach(z, 'kirche', x.uid) }));
    const fuehrend = optionen.filter((o) => o.nach > 0).sort((a, b) => a.basis - b.basis || b.nach - a.nach);
    const mussGewinnen = l.siege > k.siege || (l.siege === 1 && k.siege === 1);
    if (l.gepasst) {
      if (vorne > 0) return { art: 'passe' };
      return fuehrend.length ? { art: 'spiele', uid: fuehrend[0].uid } : { art: 'passe' };
    }
    // Die Kirche spart Karten, wenn sie klar vorne liegt und Luther mehr Karten hat.
    if (!mussGewinnen && vorne >= 4 && k.reihe.length >= 2 && k.hand.length <= l.hand.length) return { art: 'passe' };
    if (fuehrend.length) return { art: 'spiele', uid: fuehrend[0].uid };
    // Uneinholbar: Runde 1 verloren geben, um Karten zu sparen.
    if (!mussGewinnen && k.siege === 0 && vorne < -8 && k.hand.length <= l.hand.length + 1) return { art: 'passe' };
    const beste = optionen.reduce((a, b) => (b.nach > a.nach ? b : a));
    return { art: 'spiele', uid: beste.uid };
  },
  fuehreAus: (z, zug, seite = 'kirche') => (zug.art === 'passe' ? rules.passe(z, seite) : rules.spiele(z, seite, zug.uid)),
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
      const konter = cards.filter((c) => (c.entkraeftet || []).includes(id));
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
  for (const g of Object.values(disputation.gegner)) if (flags.includes(`duell:${g.id}`)) g.deck.forEach((id) => ids.add(id));
  return ids;
}
