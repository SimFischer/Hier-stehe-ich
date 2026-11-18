// Spieler-Bots für die Disputation: für Balance-Tests und den Durchspieltest.
import { rules, K, summe, entkraeftet } from '../js/puzzles/duell-regeln.js';

/** Ein Zug Luthers. typ: 'klug' (kontert und spart) oder 'zufall'. */
export function lutherZug(z, typ, rnd) {
  const l = z.seiten.luther; const k = z.seiten.kirche;
  if (typ === 'zufall') return rnd() < 0.15 || !l.hand.length ? (l.anfuehrer && !l.hand.length && rnd() < 0.5 ? { art: 'spiele', uid: l.anfuehrer.uid } : { art: 'passe' }) : { art: 'spiele', uid: l.hand[Math.floor(rnd() * l.hand.length)].uid };
  // Nur noch der Anführer übrig: spielen, wenn er die Führung bringt, sonst passen
  if (!l.hand.length) return l.anfuehrer && rules.vorsprungNach(z, 'luther', l.anfuehrer.uid) > 0 ? { art: 'spiele', uid: l.anfuehrer.uid } : { art: 'passe' };
  const vorne = summe(z, 'luther') - summe(z, 'kirche');
  const opt = l.hand.map((x) => ({ uid: x.uid, k: K(x.id), nach: rules.vorsprungNach(z, 'luther', x.uid) }));
  const konter = opt.filter((o) => (o.k.entkraeftet || []).some((id) => k.reihe.some((c) => c.id === id && !entkraeftet(z, 'kirche', c))));
  const mussGewinnen = k.siege > l.siege || (k.siege === 1 && l.siege === 1);
  if (k.gepasst) {
    if (vorne > 0) return { art: 'passe' };
    if (l.anfuehrer && rules.vorsprungNach(z, 'luther', l.anfuehrer.uid) > 0 && !opt.some((o) => o.nach > 0)) return { art: 'spiele', uid: l.anfuehrer.uid };
    const reicht = opt.filter((o) => o.nach > 0).sort((a, b) => a.k.staerke - b.k.staerke);
    return reicht.length ? { art: 'spiele', uid: (konter.find((o) => o.nach > 0) || reicht[0]).uid } : { art: 'passe' };
  }
  if (konter.length) return { art: 'spiele', uid: konter.reduce((a, b) => (b.nach > a.nach ? b : a)).uid };
  // Anführer (Kampagne): für eine Runde, die zählt
  if (l.anfuehrer && (mussGewinnen || z.runde >= 2)) { const nach = rules.vorsprungNach(z, 'luther', l.anfuehrer.uid); if (nach > 0 && (k.gepasst || mussGewinnen)) return { art: 'spiele', uid: l.anfuehrer.uid }; }
  if (!mussGewinnen && l.siege === 0 && vorne < -12 && l.reihe.length >= 1) return { art: 'passe' };
  if (!mussGewinnen && vorne >= 3 && l.reihe.length >= 2 && l.hand.length <= k.hand.length) return { art: 'passe' };
  // Konterkarten aufheben, solange es andere gibt.
  const frei = opt.filter((o) => !(o.k.entkraeftet || []).length);
  const pool = frei.length ? frei : opt;
  return { art: 'spiele', uid: pool.reduce((a, b) => (b.nach > a.nach ? b : a)).uid };
}

/** Spielt eine ganze Disputation. Gibt den Endstand zurück. */
export function spieleDuell(gegner, deck, typ, rnd, anfuehrer = gegner.lutherAnfuehrer || null) {
  let z = rules.start(gegner, deck, Math.floor(rnd() * 2 ** 31), undefined, { anfuehrer });
  // Kluge Spieler tauschen Karten, die gegen dieses Deck nichts entkräften.
  if (typ === 'klug') for (let i = 0; i < (z.regeln.tausch || 0); i++) {
    const nutzlos = z.seiten.luther.hand.filter((x) => !(K(x.id).entkraeftet || []).some((id) => gegner.deck.includes(id)) && !K(x.id).zieht)
      .sort((a, b) => K(a.id).staerke - K(b.id).staerke)[0];
    if (nutzlos) z = rules.tausche(z, nutzlos.uid);
  }
  z = rules.beginne(z);
  for (let i = 0; i < 300 && z.phase === 'spiel'; i++) {
    z = z.am === 'kirche' ? rules.fuehreAus(z, rules.kiZug(z), 'kirche') : rules.fuehreAus(z, lutherZug(z, typ, rnd), 'luther');
    if (z.phase === 'tausch') z = rules.beginne(z);
  }
  return z;
}

/** Ein kluges Deck: zuerst Karten, die etwas aus dem Gegnerdeck entkräften, dann die stärksten. */
export function deckFuer(besitz, gegner, max = 12) {
  const punkte = (id) => (K(id).entkraeftet || []).filter((x) => gegner.deck.includes(x)).length * 10 + K(id).staerke + (K(id).standhaft ? 1 : 0);
  return [...besitz].sort((a, b) => punkte(b) - punkte(a)).slice(0, max);
}
