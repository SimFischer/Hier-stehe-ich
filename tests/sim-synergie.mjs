// Einmalige Auswertung (kein Test): Gewinnt man mit Synergie-Decks oder nur mit Kontern?
import { spieleDuell } from './duell-bot.js';
import { zufall } from './helfer.js';
import { deckGegen, maxKopien, K } from '../js/puzzles/duell-regeln.js';
import { lutherKarten } from '../data/kartei.js';
import { kampagne } from '../data/kampagne.js';
import { disputation } from '../data/disputation.js';

const R = disputation.regeln;
const besitz = lutherKarten.flatMap((k) => Array(maxKopien(k.id)).fill(k.id));
const quote = (g, deck, n = 400) => { const rnd = zufall(1517); let s = 0; for (let i = 0; i < n; i++) if (spieleDuell(g, deck, 'klug', rnd).sieger === 'luther') s += 1; return s / n; };
const bauen = (passt, wert) => [...besitz].filter(passt).sort((a, b) => wert(b) - wert(a)).slice(0, R.deckMax);
const st = (id) => K(id).staerke;
const decks = {
  konter: (g) => deckGegen(besitz, g, R).deck,
  'druck+thesen': () => bauen((id) => ['these', 'druck'].includes(K(id).typ), (id) => (id === 'k13' ? 99 : 0) + (K(id).bund ? 3 : 0) + st(id)),
  bibel: () => bauen((id) => K(id).typ === 'bibel' || id === 'r1' || id === 'r19', (id) => (K(id).staerkt ? 5 : 0) + st(id)),
  'nur stark': () => bauen(() => true, st)
};
const zeilen = [];
for (const [id, g] of Object.entries(kampagne.gegner)) {
  const z = { gegner: g.name };
  for (const [name, f] of Object.entries(decks)) z[name] = quote(g, f(g)).toFixed(2);
  zeilen.push(z);
}
console.table(zeilen);
console.log('druck+thesen:', decks['druck+thesen']().map((id) => K(id).titel).join(', '));
console.log('bibel:', decks.bibel().map((id) => K(id).titel).join(', '));
