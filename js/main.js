// Start: baut das Grundgerüst der Seite und verbindet Engine und Daten.
import { h, setzeInhalt } from './engine/ui.js';
import { store, start, beiAenderung, aendere } from './engine/save.js';
import { platten } from './engine/state.js';
import { setzeStationHoerer } from './engine/szenen.js';
import { zeigeKarte, zeigeBeutel, zeigeNotizbuch, zeigeBonus, zeigeDisputation, zeigeMenue, zeigeAbschluss, zeigeStart, zeigeLehrkraft } from './engine/fenster.js';
import { bildHtml, hatBild, bildUrl } from './engine/bilder.js';
import { game } from '../data/game.js';
import { t } from '../data/ui.js';
import { ladeStand } from './puzzles/kampagne.js';
import { setzePracht } from './engine/pracht.js';

const ico = (pfad) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${pfad}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
// Symbol der Leiste: Holzschnitt leiste-<name> (docs/ASSET-PROMPTS-7.md), bis dahin ein Strichsymbol.
const symbol = (name, pfad) => (hatBild(`leiste-${name}`) ? bildHtml(`leiste-${name}`, 'l-bild') : ico(pfad));
const HAMMER = 'M13 3l7 7-3 3-7-7zM11.5 8.5L3.5 16.5l3 3 8-8';
const leistenKnopf = (id, text, pfad, onclick) => h('button', { type: 'button', id, class: 'leisten-knopf', onclick }, h('span', { class: 'l-symbol', html: symbol(id, pfad) }), h('span', {}, text));

function zeichnePlatten() {
  const p = platten(store.state);
  const el = document.getElementById('platten');
  el.setAttribute('aria-label', `${t.platten}: ${p.filter((x) => x.da).length} / ${p.length}`);
  setzeInhalt(el, ...p.map((x) => h('span', { class: `platte${x.da ? ' da' : ''}${hatBild(x.bild) ? ' mit-bild' : ''}`, title: x.da ? x.platte : '', html: bildHtml(x.da ? x.bild : 'platte-leer') }, x.da && !hatBild(x.bild) ? String(x.nr) : '')));
  const beutel = document.querySelector('#beutel .zahl');
  beutel.textContent = String(store.state.cards.length);
  // Nach dem Finale wird der Reiter „Disputation“ zum goldenen Reiter „Hammer & Siegel“: das eigentliche Spiel beginnt.
  const hs = store.state.done.includes('f');
  const disp = document.getElementById('disputation');
  disp.classList.toggle('hs-frei', hs);
  disp.querySelector('span:nth-child(2)').textContent = hs ? t.hsReiter : t.disputationReiter;
  if (disp.dataset.hs !== String(hs)) { disp.dataset.hs = String(hs); disp.querySelector('.l-symbol').innerHTML = hs ? symbol('hammer-siegel', HAMMER) : symbol('disputation', 'M3 8l6-3 4 10-6 3zM13 5h7v14h-7zM15.5 9h2M15.5 12h2'); }
}


// Lehrkraftmodus: Titel fünf Sekunden halten oder Umschalt + Enter. Ein kurzer Tipp öffnet das Menü.
const HALTEN_MS = 5000;
function titelKnopf() {
  let uhr = null; let gehalten = false;
  const los = () => { gehalten = false; uhr = setTimeout(() => { gehalten = true; zeigeLehrkraft(); }, HALTEN_MS); };
  const stopp = () => clearTimeout(uhr);
  return h('button', { type: 'button', id: 'titel', 'aria-label': `${game.titel}, ${t.menue}`,
    onpointerdown: los, onpointerup: stopp, onpointerleave: stopp, onpointercancel: stopp, oncontextmenu: (e) => e.preventDefault(),
    onclick: () => { if (!gehalten) zeigeMenue(); gehalten = false; } }, h('strong', {}, game.titel), h('span', { id: 'ort' }));
}

function aufbau() {
  document.title = game.titel;
  if (hatBild('leiste-zier')) document.documentElement.style.setProperty('--zier', `url("${bildUrl('leiste-zier')}")`);
  setzeInhalt(document.getElementById('app'), 
    h('header', { class: `leiste${hatBild('leiste-zier') ? ' mit-zier' : ''}` },
      h('nav', { 'aria-label': t.navigation },
        leistenKnopf('karte', t.karte, 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14', zeigeKarte),
        h('button', { type: 'button', id: 'beutel', class: 'leisten-knopf', onclick: zeigeBeutel },
          h('span', { class: 'l-symbol', html: symbol('beutel', 'M5 10h14l-1.2 10H6.2zM9 10V8a3 3 0 0 1 6 0v2') }), h('span', {}, t.beutel), h('span', { class: 'zahl' }, '0')),
        leistenKnopf('notizbuch', t.notizbuch, 'M4 5c3-1 5.5-.8 8 1 2.5-1.8 5-2 8-1v14c-3-1-5.5-.8-8 1-2.5-1.8-5-2-8-1zM12 6v14', zeigeNotizbuch),
        leistenKnopf('bonus', t.bonusReiter, 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5l-5.3 2.9 1.2-6-4.5-4.1 6-.7z', zeigeBonus),
        leistenKnopf('disputation', t.disputationReiter, 'M3 8l6-3 4 10-6 3zM13 5h7v14h-7zM15.5 9h2M15.5 12h2', zeigeDisputation)),
      titelKnopf(),
      h('div', { id: 'platten', role: 'img' })),
    h('p', { id: 'ziel', role: 'status', 'aria-live': 'polite' }),
    h('main', { id: 'buehne' },
      h('div', { id: 'szene' }, h('div', { id: 'bild', 'aria-hidden': 'true' }), h('div', { id: 'hotspots' })),
      h('section', { id: 'band', 'aria-live': 'polite' }),
      h('section', { id: 'blatt', hidden: true })),
    h('section', { id: 'start', hidden: true }));
}

start();
// Prachtausgaben aus „Hammer & Siegel“ gelten überall, wo Karten gezeigt werden
setzePracht(ladeStand().pracht);
aufbau();
beiAenderung(zeichnePlatten);
zeichnePlatten();
setzeStationHoerer(zeigeAbschluss);
// Knopf im Zielstreifen (szenen.js) öffnet „Hammer & Siegel“
document.addEventListener('hammer-siegel', () => zeigeDisputation());
document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); zeigeLehrkraft(); } });
zeigeStart();
