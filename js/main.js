// Start: baut das Grundgerüst der Seite und verbindet Engine und Daten.
import { h, setzeInhalt } from './engine/ui.js';
import { store, start, beiAenderung, aendere } from './engine/save.js';
import { platten } from './engine/state.js';
import { setzeStationHoerer, liesBand } from './engine/szenen.js';
import { kannSprechen, still } from './engine/speech.js';
import { zeigeKarte, zeigeBeutel, zeigeNotizbuch, zeigeMenue, zeigeAbschluss, zeigeStart, zeigeLehrkraft } from './engine/fenster.js';
import { bildHtml, hatBild } from './engine/bilder.js';
import { game } from '../data/game.js';
import { t } from '../data/ui.js';

const ico = (pfad) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${pfad}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const leistenKnopf = (id, text, pfad, onclick) => h('button', { type: 'button', id, class: 'leisten-knopf', onclick }, h('span', { html: ico(pfad) }), h('span', {}, text));

function zeichnePlatten() {
  const p = platten(store.state);
  const el = document.getElementById('platten');
  el.setAttribute('aria-label', `${t.platten}: ${p.filter((x) => x.da).length} / ${p.length}`);
  setzeInhalt(el, ...p.map((x) => h('span', { class: `platte${x.da ? ' da' : ''}${hatBild(x.bild) ? ' mit-bild' : ''}`, title: x.da ? x.platte : '', html: bildHtml(x.da ? x.bild : 'platte-leer') }, x.da && !hatBild(x.bild) ? String(x.nr) : '')));
  const beutel = document.querySelector('#beutel .zahl');
  beutel.textContent = String(store.state.cards.length);
  document.getElementById('vorlesen')?.setAttribute('aria-pressed', String(store.state.vorlesen));
}

/** Vorlesen ein- und ausschalten. Beim Einschalten wird der aktuelle Text sofort gelesen. */
function schalteVorlesen() {
  const an = aendere((s) => { s.vorlesen = !s.vorlesen; return s.vorlesen; });
  if (an) liesBand(); else still();
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
  setzeInhalt(document.getElementById('app'), 
    h('header', { class: 'leiste' },
      h('nav', { 'aria-label': t.navigation },
        leistenKnopf('karte', t.karte, 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14', zeigeKarte),
        h('button', { type: 'button', id: 'beutel', class: 'leisten-knopf', onclick: zeigeBeutel },
          h('span', { html: ico('M5 10h14l-1.2 10H6.2zM9 10V8a3 3 0 0 1 6 0v2') }), h('span', {}, t.beutel), h('span', { class: 'zahl' }, '0')),
        leistenKnopf('notizbuch', t.notizbuch, 'M4 5c3-1 5.5-.8 8 1 2.5-1.8 5-2 8-1v14c-3-1-5.5-.8-8 1-2.5-1.8-5-2-8-1zM12 6v14', zeigeNotizbuch),
        kannSprechen() ? h('button', { type: 'button', id: 'vorlesen', class: 'leisten-knopf', 'aria-pressed': 'false', 'aria-label': t.vorlesen, title: t.vorlesen, onclick: schalteVorlesen },
          h('span', { html: ico('M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11') }), h('span', {}, t.vorlesen)) : null),
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
aufbau();
beiAenderung(zeichnePlatten);
zeichnePlatten();
setzeStationHoerer(zeigeAbschluss);
document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); zeigeLehrkraft(); } });
zeigeStart();
