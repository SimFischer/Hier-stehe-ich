// Lehrkräftekompendium: baut die Seite aus denselben Daten wie das Spiel.
import { h, setzeInhalt, fuelle } from './engine/ui.js';
import { loesungen } from './engine/loesungen.js';
import { game } from '../data/game.js';
import { puzzles } from '../data/puzzles.js';
import { bonus } from '../data/bonus.js';
import { cards } from '../data/cards.js';
import { teacher as tk } from '../data/teacher.js';
import { marktplatz } from '../data/systems/marktplatz.js';
import { druckwelle } from '../data/systems/druckwelle.js';
import { verhoer } from '../data/systems/verhoer.js';
import { disputation } from '../data/disputation.js';

const daten = { cards, systeme: { marktplatz, druckwelle, verhoer }, figuren: game.figuren, disputation };
const abschnitt = (id, titel, ...inhalt) => h('section', { id }, h('h2', {}, titel), inhalt);
const liste = (punkte, art = 'ul') => h(art, {}, punkte.map((p) => h('li', {}, p)));
const zeile = (name, wert) => (wert ? [h('dt', {}, name), h('dd', {}, wert)] : []);

function leitfaden() {
  return game.stationen.map((st) => {
    const r = puzzles[st.raetsel];
    const info = tk.stationen[st.id];
    return h('article', { class: 'station' },
      h('h3', {}, st.nr === 0 ? st.name : `${st.nr}. ${st.name}`),
      h('p', { class: 'ort' }, `${st.ort}, ${st.zeit} · ${fuelle(tk.spalten.minuten, { n: st.minuten })}`),
      h('dl', {},
        zeile(tk.spalten.ziel, r ? liste(r.lernziel.map((n) => tk.lernziele[n - 1])) : null),
        zeile(tk.spalten.raetsel, r ? r.schritte.filter((s) => s.titel).map((s) => s.titel).join(' · ') : null),
        zeile(tk.spalten.karten, (st.karten || []).map((k) => cards.find((c) => c.id === k).titel).join(' · ')),
        zeile(tk.spalten.material, info.material),
        zeile(tk.spalten.hinweis, info.hinweis)));
  });
}

function loesungsBlock(raetsel, titel) {
  const teile = loesungen(raetsel, daten);
  if (!teile.length) return null;
  return h('article', { class: 'station' }, h('h3', {}, titel),
    teile.map((x) => h('div', {}, h('h4', {}, x.titel), liste(x.zeilen))));
}

function faq() {
  const eintraege = tk.faq.map((e) => h('details', { class: 'frage' }, h('summary', {}, e.f), h('p', {}, e.a)));
  const leer = h('p', { hidden: true }, tk.keineTreffer);
  const suche = h('input', { type: 'search', placeholder: tk.suche, 'aria-label': tk.suche, oninput: () => {
    const q = suche.value.trim().toLowerCase();
    let treffer = 0;
    eintraege.forEach((el, i) => { const passt = !q || `${tk.faq[i].f} ${tk.faq[i].a}`.toLowerCase().includes(q); el.hidden = !passt; if (passt) treffer += 1; });
    leer.hidden = treffer > 0;
  } });
  return [h('p', { class: 'nicht-drucken' }, suche), eintraege, leer];
}

function aufbau() {
  document.title = `${tk.titel} · ${game.titel}`;
  const summe = game.stationen.reduce((n, st) => n + st.minuten, 0);
  const loesungsTeil = h('details', { id: 'loesungen-inhalt' }, h('summary', {}, tk.loesungenOeffnen),
    h('p', { class: 'klein' }, tk.loesungenDruck),
    game.stationen.filter((st) => st.raetsel).map((st) => loesungsBlock(puzzles[st.raetsel], `${st.nr}. ${st.name}`)),
    Object.values(bonus).map((b) => loesungsBlock(b, b.titel)),
    ['leipzig', 'frei'].map((id) => loesungsBlock(disputation.raetsel[id], disputation.raetsel[id].titel)));

  setzeInhalt(document.getElementById('kompendium'),
    h('header', {},
      h('p', { class: 'kicker' }, tk.untertitel), h('h1', {}, tk.titel),
      h('p', { class: 'nicht-drucken reihe' }, h('a', { href: 'index.html', class: 'knopf' }, tk.zurueck),
        h('button', { type: 'button', class: 'knopf haupt', onclick: () => window.print() }, tk.drucken)),
      h('nav', { class: 'nicht-drucken', 'aria-label': tk.titel }, Object.entries(tk.nav).map(([id, name]) => h('a', { href: `#${id}` }, name)))),
    abschnitt('schnellstart', tk.schnellstart.titel, liste(tk.schnellstart.punkte, 'ol')),
    abschnitt('ablauf', tk.ablauf.titel, tk.ablauf.varianten.map((v) => h('article', { class: 'station' }, h('h3', {}, v.name), liste(v.schritte, 'ol'), v.hinweis ? h('p', {}, v.hinweis) : null))),
    abschnitt('leitfaden', tk.leitfadenTitel, h('p', {}, fuelle(tk.summe, { n: summe })), leitfaden()),
    abschnitt('bonus', tk.bonusTitel, h('p', {}, tk.bonusText),
      h('table', {}, h('tbody', {}, Object.values(bonus).map((b) => h('tr', {},
        h('th', { scope: 'row' }, b.titel), h('td', {}, b.kurz), h('td', {}, fuelle(tk.spalten.minuten, { n: b.minuten })),
        h('td', {}, `${tk.spalten.nach} ${game.stationen.find((st) => st.id === b.nach).name}`)))))),
    abschnitt('disputation', tk.disputation.titel, tk.disputation.absaetze.map((a) => h('p', {}, a)),
      h('table', {}, h('tbody', {}, disputation.liste.map((id) => disputation.raetsel[id]).map((d) => h('tr', {},
        h('th', { scope: 'row' }, d.titel), h('td', {}, d.kurz), h('td', {}, fuelle(tk.spalten.minuten, { n: d.minuten })),
        h('td', {}, `${tk.spalten.nach} ${game.stationen.find((st) => st.id === d.nach).name}`)))))),
    abschnitt('loesungen', tk.loesungenTitel, h('p', {}, tk.loesungenText), loesungsTeil),
    abschnitt('faq', tk.faqTitel, faq()),
    abschnitt('fach', tk.fachTitel, h('dl', {}, tk.fach.flatMap((e) => [h('dt', {}, e.t), h('dd', {}, e.a)]))));

  // Beim Drucken sind alle Fragen offen und sichtbar. Die Lösungen nur, wenn sie vorher geöffnet wurden.
  let vorher = [];
  window.addEventListener('beforeprint', () => {
    const fragen = [...document.querySelectorAll('details.frage')];
    vorher = fragen.map((d) => ({ d, offen: d.open, versteckt: d.hidden }));
    fragen.forEach((d) => { d.open = true; d.hidden = false; });
  });
  window.addEventListener('afterprint', () => vorher.forEach(({ d, offen, versteckt }) => { d.open = offen; d.hidden = versteckt; }));
}

aufbau();
