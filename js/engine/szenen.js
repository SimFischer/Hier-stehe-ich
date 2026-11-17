// Szenenansicht: Hintergrund, Hotspots, Textband mit Gesprächen und Kurzfilm.
import { h, setzeInhalt, knopf, rich, melde, fuelle } from './ui.js';
import { store, aendere } from './save.js';
import { szene, erfuellt, hotspotSichtbar, hotspotAktiv, hotspotFlag, ansehen, gespraechEnde, setze, zielText } from './state.js';
import { szeneHtml, szeneUrl, figurHtml, bildHtml } from './bilder.js';
import { oeffneRaetsel } from './raetsel.js';
import { zeilenFuer } from '../puzzles/schritte.js';
import { game } from '../../data/game.js';
import { dialogs } from '../../data/dialogs.js';
import { cards } from '../../data/cards.js';
import { t } from '../../data/ui.js';

let beiStation = () => {};
export const setzeStationHoerer = (fn) => { beiStation = fn; };
let bandInhalt = null; // { art: 'text' | 'dialog' | 'film', ... }

const el = (id) => document.getElementById(id);
const kartenMeldung = (ids) => ids.filter(Boolean).forEach((id) => melde(fuelle(t.neueKarte, { titel: cards.find((k) => k.id === id).titel })));

function band(...kinder) {
  setzeInhalt(el('band'), ...kinder);
  // Einmal im Spiel: Hinweis auf die antippbaren Wörter.
  if (el('band').querySelector('.begriff') && !store.state.flags.includes('tipp:begriff')) {
    el('band').querySelector('p').after(h('p', { class: 'tipp' }, t.tippBegriff));
    aendere((s) => setze(s, 'tipp:begriff'));
  }
}
function zeigeText(text, wer, bild) {
  bandInhalt = { art: 'text' };
  band(bild ? h('span', { class: 'band-bild', 'aria-hidden': 'true', html: bildHtml(bild) }) : null, wer ? h('strong', { class: 'sprecher' }, wer) : null, h('p', {}, rich(text)));
  zeichneHotspots();
}

function spieleZeilen(zeilen, beiEnde, { filmBild = null } = {}) {
  let i = 0;
  bandInhalt = { art: 'dialog' };
  const zeige = () => {
    const z = zeilen[i];
    const f = game.figuren[z.wer] || {};
    el('szene').classList.toggle('blitz', Boolean(z.blitz));
    for (const b of el('hotspots').querySelectorAll('.hotspot')) b.classList.toggle('spricht', b.dataset.figur === z.wer);
    if (filmBild) el('bild').innerHTML = szeneHtml(z.bild ? { ...filmBild, datei: z.bild } : filmBild);
    band(f.name ? h('strong', { class: `sprecher wer-${z.wer}` }, f.name, f.echt ? h('em', {}, ` ${t.nacherzaehltKurz}`) : null) : null,
      h('p', {}, rich(z.text)),
      h('div', { class: 'reihe fuss' }, h('span', { class: 'klein' }, `${i + 1} / ${zeilen.length}`),
        knopf(t.weiter, () => { if (i < zeilen.length - 1) { i += 1; zeige(); } else { el('szene').classList.remove('blitz'); bandInhalt = null; beiEnde(); } }, 'haupt')));
    el('band').querySelector('button.haupt').focus({ preventScroll: true });
  };
  zeichneHotspots();
  zeige();
}

function benutze(sz, hs) {
  const s = store.state;
  if (!hotspotAktiv(s, hs)) { zeigeText(hs.gesperrt || t.gesperrt); return; }
  if (hs.art === 'ansehen') {
    const r = aendere((st) => ansehen(st, sz.id, hs));
    zeigeText(hs.text, null, hs.zeigt);
    kartenMeldung([r.karte]);
    if (r.stationen.length) beiStation(r.stationen);
  } else if (hs.art === 'gespraech') {
    const dialog = dialogs.find((d) => d.id === hs.ziel);
    spieleZeilen(zeilenFuer(s, dialog), () => {
      const r = aendere((st) => gespraechEnde(st, dialog));
      kartenMeldung(r.karten);
      zeigeSzene(sz.id, { ruhig: true });
      if (r.stationen.length) beiStation(r.stationen);
    });
  } else if (hs.art === 'raetsel') {
    oeffneRaetsel(hs.ziel, { bild: sz, beiEnde: (stationen) => { zeigeSzene(sz.id, { ruhig: !stationen.length }); if (stationen.length) beiStation(stationen); } });
  }
}

function zeichneHotspots() {
  const s = store.state;
  const sz = szene(s.szene);
  const gesperrt = bandInhalt?.art === 'dialog';
  setzeInhalt(el('hotspots'), ...(sz.hotspots || []).filter((hs) => hotspotSichtbar(s, hs)).map((hs) => {
    const erledigt = hs.art === 'ansehen' && s.flags.includes(hotspotFlag(sz.id, hs.id));
    return h('button', { type: 'button', class: `hotspot art-${hs.art}${hs.figur ? ' mit-figur' : hs.objekt ? ' mit-objekt' : ''}${erledigt ? ' erledigt' : ''}${hotspotAktiv(s, hs) ? '' : ' zu'}`,
      style: `left:${hs.x}%;top:${hs.y}%`, disabled: gesperrt, 'data-figur': hs.figur || null, onclick: () => benutze(sz, hs) },
      h('span', { class: 'schild' }, hs.label),
      hs.figur ? h('span', { class: 'figur', html: figurHtml(game.figuren[hs.figur]) })
        : hs.objekt ? h('span', { class: 'objekt', style: `--breite:${hs.objekt.breite}`, 'aria-hidden': 'true', html: bildHtml(hs.objekt.bild) })
          : h('span', { class: 'marke', 'aria-hidden': 'true' }));
  }));
  el('ziel').textContent = zielText(s, sz);
}

/** Zeigt eine Szene. ruhig: Der Einstiegstext wird nicht erneut eingeblendet. */
export function zeigeSzene(id, { ruhig = false } = {}) {
  const sz = szene(id);
  const filmFlag = `film:${id}`;
  if (sz.film && store.state.flags.includes(filmFlag)) return zeigeSzene(sz.weiter);
  if (store.state.szene !== id) aendere((s) => { s.szene = id; });
  el('bild').innerHTML = szeneHtml(sz.bild);
  document.getElementById('buehne').style.setProperty('--hinter', `url("${szeneUrl(sz.bild)}")`);
  setzeInhalt(el('ort'), h('strong', {}, sz.name), h('span', {}, sz.zeit));
  el('szene').classList.toggle('gewitter', Boolean(sz.gewitter));
  if (sz.film) {
    el('ziel').textContent = '';
    spieleZeilen(sz.film, () => { aendere((s) => setze(s, filmFlag)); zeigeSzene(sz.weiter); }, { filmBild: sz.bild });
    return;
  }
  if (!ruhig || !bandInhalt) {
    const einstieg = (sz.einstieg || []).find((e) => erfuellt(store.state, e.wenn));
    zeigeText(einstieg ? einstieg.text : '');
  } else zeichneHotspots();
}
