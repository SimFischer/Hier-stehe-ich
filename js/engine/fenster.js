// Fenster über dem Spiel: Karte, Argumentebeutel, Notizbuch, Menü, Stationsabschluss, Startseite.
import { h, setzeInhalt, knopf, rich, fenster, kartenChip, zeigeKartenDetail, fuelle, melde } from './ui.js';
import { store, aendere, ersetze } from './save.js';
import { neuerStand, station, szene, stationOffen, hotspotFlag, platten, loeseStation, springeZu } from './state.js';
import { oeffneRaetsel } from './raetsel.js';
import { bonus } from '../../data/bonus.js';
import { disputation } from '../../data/disputation.js';
import { kirchenGesehen } from '../puzzles/duell-regeln.js';
import { ladeStand } from '../puzzles/kampagne.js';
import { kampagne } from '../../data/kampagne.js';
import { kirchenKarten } from '../../data/kartei.js';
import { kodiere, lies } from './code.js';
import { zeigeSzene } from './szenen.js';
import { bildHtml, bildUrl } from './bilder.js';
import { game } from '../../data/game.js';
import { scenes } from '../../data/scenes.js';
import { cards } from '../../data/cards.js';
import { glossary } from '../../data/glossary.js';
import { t } from '../../data/ui.js';

export function zeigeKarte() {
  const s = store.state;
  if (!s.done.includes('p')) { melde(t.karteNochNicht); return; }
  const bonusListe = Object.values(bonus).map((b) => {
    const offen = s.done.includes(b.nach);
    const fertig = s.bonus.includes(b.id);
    return h('button', { type: 'button', class: `ort bonus${fertig ? ' fertig' : offen ? ' offen' : ' zu'}`, disabled: !offen,
      onclick: () => { dlg.close(); oeffneRaetsel(b.id, { bild: szene(s.szene), beiEnde: () => melde(fuelle(t.bonusFertig, { titel: b.titel })) }); } },
      h('span', { class: 'nr' }, fertig ? '✓' : '+'), h('strong', {}, b.titel), h('span', {}, b.kurz),
      h('em', {}, fertig ? t.ortFertig : offen ? fuelle(t.bonusOffen, { n: b.minuten }) : fuelle(t.bonusZu, { ort: station(b.nach).name })));
  });
  const duellListe = disputation.liste.map((id) => disputation.raetsel[id]).map((d) => {
    const offen = s.done.includes(d.nach);
    const gegner = d.schritte[0].gegner;
    const sieger = disputation.gegner[gegner]?.siegAls || gegner;
    // Erledigt: Sieg gegen den Gegner, Stufe 3 in Worms, die Übung im Kloster oder alle zwölf Gegner der Kampagne
    const gewonnen = s.siege.includes(sieger) || (gegner === 'worms' && s.stufen.verhoer === 3) || (gegner === 'uebung' && s.done.includes('s2'))
      || (d.id === 'kampagne' && Object.keys(ladeStand().sterne).length === kampagne.kapitel.flatMap((k) => k.gegner).length);
    return h('button', { type: 'button', class: `ort bonus disputation${gewonnen ? ' fertig' : offen ? ' offen' : ' zu'}`, disabled: !offen,
      onclick: () => { dlg.close(); if (d.szene) zeigeSzene(d.szene); else oeffneRaetsel(d.id, { bild: szene(s.szene), beiEnde: () => zeigeSzene(s.szene, { ruhig: true }) }); } },
      h('span', { class: 'nr' }, gewonnen ? '★' : '⚔'), h('strong', {}, d.titel), h('span', {}, d.kurz),
      h('em', {}, gewonnen ? t.duellSiegKurz : offen ? fuelle(t.bonusOffen, { n: d.minuten }) : fuelle(t.bonusZu, { ort: station(d.nach).name })));
  });
  const dlg = fenster(t.karte, h('div', {}, h('div', { class: 'weg' }, game.stationen.map((st) => {
    const fertig = s.done.includes(st.id);
    const offen = stationOffen(s, st);
    return h('button', { type: 'button', class: `ort${fertig ? ' fertig' : offen ? ' offen' : ' zu'}`, disabled: !offen,
      onclick: () => { dlg.close(); zeigeSzene(st.szene); } },
      h('span', { class: 'nr' }, st.nr === 0 ? '★' : st.id === 'f' ? '✎' : String(st.nr)),
      h('strong', {}, st.name), h('span', {}, `${st.ort}, ${st.zeit}`),
      h('em', {}, fertig ? t.ortFertig : offen ? t.ortOffen : t.ortZu));
  })), h('h3', { class: 'zwischen' }, t.duellTitel), h('p', { class: 'klein' }, t.duellListeText), h('div', { class: 'weg' }, duellListe),
    h('h3', { class: 'zwischen' }, t.bonusTitel), h('p', { class: 'klein' }, t.bonusText), h('div', { class: 'weg' }, bonusListe)), { breit: true });
}

export function zeigeBeutel() {
  const s = store.state;
  const hat = (k) => s.cards.includes(k.id);
  const n = cards.filter(hat).length;
  const ruecken = (kirche) => bildUrl(kirche ? 'ruecken-kirche' : 'ruecken-luther');
  const leer = (k, kirche = false) => h('div', { class: `karte sammel leer${kirche ? ' kirche' : ''}${ruecken(kirche) ? ' mit-ruecken' : ''}`, 'aria-label': kirche ? t.albumKircheFehlt : t.albumFehlt,
    style: ruecken(kirche) ? `--ruecken: url("${ruecken(kirche)}")` : null },
    h('span', { class: 'k-frage', 'aria-hidden': 'true' }, '?'),
    h('span', { class: 'k-typ' }, kirche ? t.albumKircheFehlt : k.duell ? fuelle(t.albumDuell, { name: disputation.gegner[k.duell].name }) : fuelle(t.albumWo, { nr: station(k.station).nr })));
  const gesehen = kirchenGesehen(s.flags);
  // Kampagne: gewonnene Karten und Kirchenkarten der Gegner, gegen die man schon gespielt hat
  const kamp = ladeStand();
  for (const id of kamp.gesehen) kampagne.gegner[id]?.deck.forEach((k) => gesehen.add(k));
  const kampOffen = s.done.includes('f') || kamp.karten.length > 0;
  fenster(t.beutel, h('div', { class: 'album' },
    h('h3', {}, t.albumLuther),
    h('p', { class: 'rar-legende' }, Object.entries(t.seltenheit).map(([k, v]) => h('span', { class: k }, v))),
    h('p', { class: 'kicker' }, fuelle(t.albumStand, { n, von: cards.length })),
    n ? null : h('p', {}, t.beutelLeer),
    h('div', { class: 'hand album-karten' }, cards.map((k) => (hat(k) ? kartenChip(k, { onclick: () => zeigeKartenDetail(k) }) : leer(k)))),
    kampOffen ? [h('h3', { class: 'zwischen' }, t.albumKampagne),
      h('p', { class: 'kicker' }, fuelle(t.albumKampagneText, { n: kamp.karten.length, von: kampagne.karten.length })),
      h('div', { class: 'hand album-karten' }, kampagne.karten.map((k) => (kamp.karten.includes(k.id) ? kartenChip(k, { onclick: () => zeigeKartenDetail(k) })
        : h('div', { class: 'karte sammel leer', 'aria-label': t.albumKampagneFehlt }, h('span', { class: 'k-frage', 'aria-hidden': 'true' }, '?'), h('span', { class: 'k-typ' }, t.albumKampagneFehlt)))))] : null,
    h('h3', { class: 'zwischen' }, t.albumKirche),
    h('p', { class: 'kicker' }, fuelle(t.albumKircheText, { n: gesehen.size, von: kirchenKarten.length })),
    h('div', { class: 'hand album-karten' }, kirchenKarten.map((k) => (gesehen.has(k.id) ? kartenChip(k, { onclick: () => zeigeKartenDetail(k) }) : leer(k, true))))), { breit: true });
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
    h('p', { class: 'klein' }, t.datenschutz), h('p', { class: 'klein' }, t.kartenQuelle));
  const dlg = fenster(game.titel, inhalt);
  zeichne();
}

/** Lehrkraftmodus: Übersicht auf dem Gerät, Stationen anspringen oder als gelöst markieren. */
export function zeigeLehrkraft() {
  const inhalt = h('div', { class: 'lehrkraft' });
  const stufenName = { s4: 'markt', s5: 'druck', s6: 'verhoer' };
  const zeichne = () => {
    const s = store.state;
    setzeInhalt(inhalt,
      h('p', {}, t.lkText),
      h('p', {}, h('a', { href: 'lehrkraefte.html', target: '_blank', rel: 'noopener', class: 'knopf' }, t.lkKompendium)),
      h('p', { class: 'klein' }, fuelle(t.lkStand, { n: s.done.length, von: game.stationen.length, hilfen: s.hilfen, bonus: s.bonus.length })),
      h('table', {}, h('tbody', {}, game.stationen.map((st) => {
        const fertig = s.done.includes(st.id);
        const stufe = stufenName[st.id] ? s.stufen[stufenName[st.id]] : 0;
        return h('tr', {},
          h('th', { scope: 'row' }, st.nr === 0 ? st.name : `${st.nr}. ${st.name}`),
          h('td', {}, fertig ? (stufe ? fuelle(t.lkStufe, { n: stufe }) : t.ortFertig) : stationOffen(s, st) ? t.ortOffen : t.ortZu),
          h('td', {}, knopf(t.lkSpringen, () => { aendere((x) => springeZu(x, st.id)); dlg.close(); zeigeSzene(st.szene); }, 'still klein')),
          h('td', {}, knopf(t.lkLoesen, () => { aendere((x) => loeseStation(x, st.id)); zeichne(); }, 'still klein', { disabled: fertig })));
      }))),
      h('p', { class: 'klein' }, t.lkHinweis));
  };
  const dlg = fenster(t.lkTitel, inhalt, { breit: true });
  // Nach dem Schließen zeigt die Szene den neuen Stand.
  dlg.addEventListener('close', () => { if (store.state.szene && document.getElementById('blatt').hidden) zeigeSzene(store.state.szene); });
  zeichne();
}

export function zeigeAbschluss(ids) {
  const st = station(ids[ids.length - 1]);
  const neu = cards.filter((k) => (st.karten || []).includes(k.id));
  const ende = st.id === 'f';
  const dlg = fenster(ende ? t.endeTitel : st.platte ? fuelle(t.platteTitel, { n: platten(store.state).filter((p) => p.da).length, von: platten(store.state).length }) : st.name,
    h('div', { class: 'abschluss' },
      st.platte ? h('div', { class: 'platte-gross', html: bildHtml(st.bild) }, h('strong', {}, st.platte)) : null,
      h('p', {}, rich(st.abschluss)),
      neu.length ? h('div', {}, h('h3', {}, t.neueKarten), h('div', { class: 'hand' }, neu.map((k) => kartenChip(k, { onclick: () => zeigeKartenDetail(k) })))) : null,
      ende ? h('p', {}, t.endeText) : null,
      h('div', { class: 'reihe' }, ende ? knopf(t.schliessen, () => dlg.close(), 'haupt')
        : knopf(st.id === 's7' ? t.zurDruckerei : t.zurKarte, () => { dlg.close(); if (st.id === 's7') zeigeSzene(game.start); else zeigeKarte(); }, 'haupt'))));
}

export function zeigeStart() {
  const el = document.getElementById('start');
  const los = (zuZweit) => { aendere((s) => { s.zuZweit = zuZweit; if (!s.szene) s.szene = game.start; }); el.hidden = true; zeigeSzene(store.state.szene); };
  const laeuft = Boolean(store.state.szene);
  const modus = (zuZweit) => h('button', { type: 'button', class: `modus${laeuft ? ' still' : ''}`, onclick: () => { ersetze(neuerStand()); los(zuZweit); } },
    h('span', { class: 'modus-bild', 'aria-hidden': 'true', html: (zuZweit ? game.startModus.zuZweit : game.startModus.allein).map((b) => bildHtml(b)).join('') }),
    h('strong', {}, laeuft ? (zuZweit ? t.neuZuZweit : t.neuAllein) : (zuZweit ? t.startZuZweit : t.startAllein)),
    h('span', {}, zuZweit ? t.modusZuZweit : t.modusAllein));
  setzeInhalt(el, h('div', { class: 'start-buehne' },
    h('div', { class: 'start-luther', 'aria-hidden': 'true', html: bildHtml(game.startFigur) }),
    h('div', { class: 'start-karte' },
      h('p', { class: 'kicker' }, t.startKicker),
      h('h1', {}, h('span', { class: 'initiale' }, game.titel.slice(0, 1)), game.titel.slice(1)),
      h('p', { class: 'unter' }, t.startFrage),
      h('p', { class: 'teaser' }, t.startTeaser),
      laeuft ? h('div', { class: 'reihe mitte' }, knopf(t.weiterspielen, () => los(store.state.zuZweit), 'haupt gross')) : null,
      h('div', { class: 'modi' }, modus(false), modus(true)),
      h('details', {}, h('summary', {}, t.codeEingeben), codeEingabe(() => { el.hidden = true; zeigeSzene(game.start); melde(t.codeGeladen); })),
      h('p', { class: 'klein' }, t.datenschutz))));
  const hinten = bildUrl(game.startBild);
  if (hinten) el.style.setProperty('--hinter', `url("${hinten}")`);
  el.hidden = false;
}
