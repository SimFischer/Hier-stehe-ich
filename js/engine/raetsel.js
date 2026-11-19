// Rätselblatt: führt die Schritte eines Rätsels nacheinander aus und zeigt die gestuften Hilfen.
import { h, setzeInhalt, knopf, fuelle } from './ui.js';
import { store, aendere } from './save.js';
import { raetselEnde, bonusEnde, gespraechEnde, gibKarte, szene, station, duellEnde } from './state.js';
import { szeneUrl } from './bilder.js';
import { game } from '../../data/game.js';
import { puzzles } from '../../data/puzzles.js';
import { bonus } from '../../data/bonus.js';
import { disputation } from '../../data/disputation.js';
import { cards } from '../../data/cards.js';
import { dialogs } from '../../data/dialogs.js';
import { t } from '../../data/ui.js';
import { marktplatz } from '../../data/systems/marktplatz.js';
import { druckwelle } from '../../data/systems/druckwelle.js';
import { verhoer } from '../../data/systems/verhoer.js';
import { view as zuordnen } from '../puzzles/zuordnen.js';
import { view as waage } from '../puzzles/waage.js';
import { view as standbild } from '../puzzles/standbild.js';
import { view as markt } from '../puzzles/marktplatz.js';
import { view as druck } from '../puzzles/druckwelle.js';
import { view as duell } from '../puzzles/duell.js';
import { view as kampagne } from '../puzzles/kampagne.js';
import { view as auswahl } from '../puzzles/auswahl.js';
import { view as uebersetzung } from '../puzzles/uebersetzung.js';
import { view as flugschrift } from '../puzzles/flugschrift.js';
import { view as falle } from '../puzzles/falle.js';
import { suchbild, blasen } from '../puzzles/gottesdienst.js';
import { wahl, text, gespraech } from '../puzzles/schritte.js';
import { silben, presse, fahrt, rose, reflexion } from '../puzzles/bonus.js';

const module = { zuordnen, waage, standbild, markt, druck, duell, kampagne, auswahl, uebersetzung, flugschrift, falle, suchbild, blasen, wahl, text, gespraech, silben, presse, fahrt, rose, reflexion };
export const systeme = { marktplatz, druckwelle, verhoer };

// Fortschritt innerhalb eines Rätsels: bleibt, solange die Seite offen ist.
const fortschritt = {};

/** Öffnet ein Rätsel. schritt und sammel sind nur für die Layoutprüfung: Sie springen direkt zu einem Schritt. */
export function oeffneRaetsel(id, { beiEnde, bild, schritt = null, sammel = null }) {
  const r = puzzles[id] || bonus[id] || disputation.raetsel[id];
  // Bonusspiele werden gemerkt (außer ohneMerker), Disputationen nur mit „merker“.
  const merken = bonus[id] ? !r.ohneMerker : Boolean(r.merker);
  const blatt = document.getElementById('blatt');
  const f = (fortschritt[id] ||= { i: 0, sammel: {}, hilfe: {} });
  if (schritt != null) { f.i = schritt; if (sammel) f.sammel = sammel; }

  const ctx = {
    t, systeme, figuren: game.figuren, alleKarten: cards, sammel: f.sammel,
    get state() { return store.state; },
    karte: (kid) => cards.find((k) => k.id === kid),
    station,
    merkeDeck: (deck) => aendere((s) => { s.deck = [...deck]; }),
    duellEnde: (gegner, sieg) => aendere((s) => duellEnde(s, gegner, sieg)),
    karten: () => cards.filter((k) => store.state.cards.includes(k.id) || (f.sammel.thesen || []).includes(k.id)),
    gibKarte: (kid) => aendere((s) => gibKarte(s, kid)),
    dialog: (did) => dialogs.find((d) => d.id === did),
    gespraechEnde: (dialog) => aendere((s) => gespraechEnde(s, dialog))
  };

  const hinten = (aus) => { for (const id of ['szene', 'band']) document.getElementById(id).inert = aus; };
  const schliessen = () => { blatt.hidden = true; setzeInhalt(blatt); hinten(false); };

  const zeige = () => {
    const schritt = r.schritte[f.i];
    const koerper = h('div', { class: `blatt-koerper art-${schritt.art}` });
    const hilfeBox = h('div', { class: 'hilfe-box', role: 'status', hidden: true });
    const stufe = f.hilfe[f.i] || 0;
    const zeigeHilfe = (n) => { hilfeBox.hidden = false; setzeInhalt(hilfeBox, h('strong', {}, fuelle(t.hilfeStufe, { n, von: schritt.hilfen.length })), ' ', schritt.hilfen[n - 1]); };
    const hilfeKnopf = schritt.hilfen ? knopf(t.hilfe, () => {
      const n = Math.min(schritt.hilfen.length, (f.hilfe[f.i] || 0) + 1);
      if (n > (f.hilfe[f.i] || 0)) aendere((s) => { s.hilfen += 1; });
      f.hilfe[f.i] = n; zeigeHilfe(n);
    }, 'still klein') : null;
    const ort = szene(schritt.szene) || bild;
    blatt.style.setProperty('--ort', `url("${szeneUrl(ort?.bild)}")`);
    setzeInhalt(blatt, 
      h('header', { class: 'blatt-kopf' },
        h('div', {}, h('span', { class: 'kicker' }, `${r.titel} · ${fuelle(t.schritt, { n: f.i + 1, von: r.schritte.length })}`), h('h2', { tabindex: '-1' }, schritt.titel || r.titel)),
        h('div', { class: 'reihe' }, hilfeKnopf, h('button', { type: 'button', class: 'schliess', 'aria-label': t.raetselVerlassen, onclick: schliessen }, '✕'))),
      koerper, hilfeBox);
    if (stufe) zeigeHilfe(stufe);
    module[schritt.art](koerper, schritt, ctx, (ergebnis = {}) => {
      // Stufen der Spielsysteme werden zusammengeführt, alles andere überschrieben.
      if (ergebnis.stufe) ergebnis = { ...ergebnis, stufe: { ...(f.sammel.stufe || {}), ...ergebnis.stufe } };
      Object.assign(f.sammel, ergebnis);
      if (f.i < r.schritte.length - 1) { f.i += 1; zeige(); return; }
      const sammel = f.sammel;
      delete fortschritt[id];
      const { stationen } = aendere((s) => (puzzles[id] ? raetselEnde(s, id, sammel) : (merken && bonusEnde(s, id), { stationen: [] })));
      schliessen();
      beiEnde(stationen);
    });
    blatt.querySelector('h2').focus();
  };

  blatt.hidden = false;
  hinten(true);
  zeige();
}
