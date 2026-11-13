// Fenster über dem Spiel: Karte, Argumentebeutel, Notizbuch, Menü, Stationsabschluss, Startseite.
import { h, setzeInhalt, knopf, rich, fenster, kartenChip, fuelle, melde } from './ui.js';
import { store, aendere, ersetze } from './save.js';
import { neuerStand, station, stationOffen, hotspotFlag, platten } from './state.js';
import { kodiere, lies } from './code.js';
import { zeigeSzene } from './szenen.js';
import { game } from '../../data/game.js';
import { scenes } from '../../data/scenes.js';
import { cards } from '../../data/cards.js';
import { glossary } from '../../data/glossary.js';
import { t } from '../../data/ui.js';

export function zeigeKarte() {
  const s = store.state;
  if (!s.done.includes('p')) { melde(t.karteNochNicht); return; }
  const dlg = fenster(t.karte, h('div', { class: 'weg' }, game.stationen.map((st) => {
    const fertig = s.done.includes(st.id);
    const offen = stationOffen(s, st);
    return h('button', { type: 'button', class: `ort${fertig ? ' fertig' : offen ? ' offen' : ' zu'}`, disabled: !offen,
      onclick: () => { dlg.close(); zeigeSzene(st.szene); } },
      h('span', { class: 'nr' }, st.nr === 0 ? '★' : st.id === 'f' ? '✎' : String(st.nr)),
      h('strong', {}, st.name), h('span', {}, `${st.ort}, ${st.zeit}`),
      h('em', {}, fertig ? t.ortFertig : offen ? t.ortOffen : t.ortZu));
  })), { breit: true });
}

export function zeigeBeutel() {
  const meine = cards.filter((k) => store.state.cards.includes(k.id));
  fenster(t.beutel, meine.length
    ? h('div', { class: 'hand beutel' }, meine.map((k) => kartenChip(k)))
    : h('p', {}, t.beutelLeer), { breit: true });
}

export function zeigeNotizbuch() {
  const s = store.state;
  const notizen = scenes.flatMap((sz) => (sz.hotspots || []).filter((hs) => hs.merken && s.flags.includes(hotspotFlag(sz.id, hs.id)))
    .map((hs) => h('li', {}, h('strong', {}, `${sz.name} · ${hs.label}: `), rich(hs.text))));
  fenster(t.notizbuch, h('div', { class: 'notizbuch' },
    h('h3', {}, t.notizen), notizen.length ? h('ul', {}, notizen) : h('p', {}, t.notizenLeer),
    h('p', { class: 'klein' }, t.nacherzaehltHinweis),
    h('h3', {}, t.glossar), h('dl', {}, glossary.flatMap((g) => [h('dt', {}, g.wort), h('dd', {}, g.text)]))), { breit: true });
}

function codeEingabe(beiErfolg) {
  const feld = h('input', { type: 'text', inputmode: 'text', autocapitalize: 'characters', autocomplete: 'off', spellcheck: 'false', maxlength: '9', placeholder: 'XXXX-XXXX', 'aria-label': t.codeEingeben });
  const meldung = h('p', { class: 'rueck offen', role: 'alert' });
  const pruefe = () => {
    const r = lies(feld.value);
    if (r.fehler) { meldung.textContent = t[`code_${r.fehler}`]; return; }
    r.stand.zuZweit = store.state.zuZweit;
    ersetze(r.stand); beiErfolg();
  };
  feld.addEventListener('keydown', (e) => { if (e.key === 'Enter') pruefe(); });
  return h('div', { class: 'code-eingabe' }, h('div', { class: 'reihe' }, feld, knopf(t.codeLaden, pruefe)), meldung);
}

export function zeigeMenue() {
  const s = store.state;
  let sicher = false;
  const inhalt = h('div', { class: 'menue' });
  const zeichne = () => setzeInhalt(inhalt, 
    h('h3', {}, t.codeTitel), h('p', {}, t.codeText), h('p', { class: 'code' }, kodiere(s)),
    h('h3', {}, t.codeEingeben), codeEingabe(() => { dlg.close(); zeigeSzene(game.start); melde(t.codeGeladen); }),
    h('h3', {}, t.einstellungen),
    h('label', { class: 'schalter' }, h('input', { type: 'checkbox', checked: s.zuZweit, onchange: (e) => aendere((st) => { st.zuZweit = e.target.checked; }) }), t.zuZweit),
    h('p', { class: 'klein' }, fuelle(t.hilfenGezaehlt, { n: s.hilfen })),
    h('div', { class: 'reihe' }, knopf(sicher ? t.neuSicher : t.neu, () => {
      if (!sicher) { sicher = true; zeichne(); return; }
      const neu = neuerStand(); neu.zuZweit = s.zuZweit; ersetze(neu); dlg.close(); zeigeStart();
    }, sicher ? 'warn' : 'still')),
    h('p', { class: 'klein' }, t.datenschutz));
  const dlg = fenster(game.titel, inhalt);
  zeichne();
}

export function zeigeAbschluss(ids) {
  const st = station(ids[ids.length - 1]);
  const neu = cards.filter((k) => (st.karten || []).includes(k.id));
  const ende = st.id === 'f';
  const dlg = fenster(ende ? t.endeTitel : st.platte ? fuelle(t.platteTitel, { n: platten(store.state).filter((p) => p.da).length, von: platten(store.state).length }) : st.name,
    h('div', { class: 'abschluss' },
      st.platte ? h('div', { class: 'platte gross da', 'aria-hidden': 'true' }, st.platte) : null,
      h('p', {}, rich(st.abschluss)),
      neu.length ? h('div', {}, h('h3', {}, t.neueKarten), h('div', { class: 'hand' }, neu.map((k) => kartenChip(k)))) : null,
      ende ? h('p', {}, t.endeText) : null,
      h('p', { class: 'klein' }, `${t.codeKurz} `, h('span', { class: 'code klein' }, kodiere(store.state))),
      h('div', { class: 'reihe' }, ende ? knopf(t.schliessen, () => dlg.close(), 'haupt')
        : knopf(st.id === 's7' ? t.zurDruckerei : t.zurKarte, () => { dlg.close(); if (st.id === 's7') zeigeSzene(game.start); else zeigeKarte(); }, 'haupt'))));
}

export function zeigeStart() {
  const el = document.getElementById('start');
  const los = (zuZweit) => { aendere((s) => { s.zuZweit = zuZweit; if (!s.szene) s.szene = game.start; }); el.hidden = true; zeigeSzene(store.state.szene); };
  const laeuft = Boolean(store.state.szene);
  setzeInhalt(el, h('div', { class: 'start-karte' },
    h('p', { class: 'kicker' }, t.startKicker), h('h1', {}, game.titel), h('p', { class: 'unter' }, game.untertitel),
    laeuft ? h('div', { class: 'reihe mitte' }, knopf(t.weiterspielen, () => los(store.state.zuZweit), 'haupt gross')) : null,
    h('div', { class: 'reihe mitte' },
      knopf(laeuft ? t.neuAllein : t.startAllein, () => { ersetze(neuerStand()); los(false); }, laeuft ? 'still' : 'haupt gross'),
      knopf(laeuft ? t.neuZuZweit : t.startZuZweit, () => { ersetze(neuerStand()); los(true); }, laeuft ? 'still' : 'gross')),
    h('details', {}, h('summary', {}, t.codeEingeben), codeEingabe(() => { el.hidden = true; zeigeSzene(game.start); melde(t.codeGeladen); })),
    h('p', { class: 'klein' }, t.datenschutz)));
  el.hidden = false;
}
