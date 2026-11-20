// Löser für die Fahrt durch den Wald: Gibt es einen Weg vom Start zur Burg, bei dem kein Spitzel den Wagen sieht?
// Die Wege werden in kleine Schritte zerlegt (so weit, wie der Wagen in einem Takt fährt). In jedem Takt darf der Wagen
// warten oder einen Schritt weiterfahren. Gezählt wird ab einem Startpunkt und einer Startzeit (Rastplätze, Wartezeit).
import { fahrtRules } from '../js/puzzles/bonus.js';

export function loese(s, { dt = 0.05, bis = 180, von = s.start, ab = 0, ziele = null } = {}) {
  const schritt = s.tempo * dt;
  const punkte = []; const nachbarn = [];
  const finde = (x, y) => { const i = punkte.findIndex((p) => Math.hypot(p.x - x, p.y - y) < schritt * 0.5); if (i >= 0) return i; punkte.push({ x, y }); nachbarn.push(new Set()); return punkte.length - 1; };
  for (const [[ax, ay], [bx, by]] of s.wege) {
    const l = Math.hypot(bx - ax, by - ay); const n = Math.max(1, Math.round(l / schritt));
    let vor = finde(ax, ay);
    for (let i = 1; i <= n; i++) { const k = finde(ax + ((bx - ax) * i) / n, ay + ((by - ay) * i) / n); nachbarn[vor].add(k); nachbarn[k].add(vor); vor = k; }
  }
  const start = punkte.reduce((b, p, i) => (Math.hypot(p.x - von.x, p.y - von.y) < Math.hypot(punkte[b].x - von.x, punkte[b].y - von.y) ? i : b), 0);
  const amZiel = (p) => (ziele ? ziele.some((z) => Math.hypot(p.x - z.x, p.y - z.y) < 46) : fahrtRules.amZiel(p, s.ziel));
  const sicher = (i, t) => !s.wachen.some((w) => fahrtRules.gesehen(punkte[i], fahrtRules.wachePos(w, t), s.sicht));
  let jetzt = new Map(sicher(start, ab) ? [[start, -1]] : []);
  const ebenen = [jetzt];
  // Weg zurückverfolgen: Liste der Punkte (ein Eintrag je Takt)
  const weg = (letzter) => { const w = [letzter]; for (let e = ebenen.length - 1; e > 0; e--) w.unshift(ebenen[e].get(w[0])); return w.map((i) => punkte[i]); };
  for (let n = 1; ab + n * dt <= bis && jetzt.size; n++) {
    const t = ab + n * dt; const neu = new Map();
    for (const i of jetzt.keys()) for (const k of [i, ...nachbarn[i]]) if (!neu.has(k) && sicher(k, t)) {
      neu.set(k, i);
      if (amZiel(punkte[k])) { ebenen.push(neu); return { geschafft: true, zeit: t, weg: () => weg(k) }; }
    }
    jetzt = neu; ebenen.push(neu);
  }
  return { geschafft: false };
}
