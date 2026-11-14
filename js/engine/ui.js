// Kleine Helfer für den Bildschirm. Keine Spielinhalte.
import { glossary } from '../../data/glossary.js';
import { t } from '../../data/ui.js';

/** Baut ein Element: h('button', { class: 'x', onclick: fn }, 'Text', kind) */
export function h(tag, attrs = {}, ...kinder) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'class') el.className = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kind of kinder.flat(Infinity)) if (kind != null && kind !== false) el.append(kind);
  return el;
}

export const fuelle = (text, werte = {}) => text.replace(/\{(\w+)\}/g, (_, k) => (k in werte ? werte[k] : ''));
export const knopf = (text, onclick, klasse = '', attrs = {}) => h('button', { type: 'button', class: `knopf ${klasse}`.trim(), onclick, ...attrs }, text);

const formen = new Map();
for (const g of glossary) for (const f of g.formen) formen.set(f, g);

/** Text mit antippbaren Fachbegriffen. Jeder Begriff wird pro Text nur einmal markiert. */
export function rich(text) {
  const frag = document.createDocumentFragment();
  const gesehen = new Set();
  for (const teil of String(text).split(/([A-Za-zÄÖÜäöüß]+)/)) {
    const g = formen.get(teil);
    if (g && !gesehen.has(g.id)) {
      gesehen.add(g.id);
      frag.append(h('button', { type: 'button', class: 'begriff', onclick: (e) => { e.stopPropagation(); melde(`${g.wort}: ${g.text}`, 9000); } }, teil));
    } else frag.append(teil);
  }
  return frag;
}

let toastZeit;
/** Kurze Meldung unten am Bildschirm. Antippen schließt sie. */
export function melde(text, dauer = 4500) {
  let el = document.getElementById('meldung');
  if (!el) { el = h('div', { id: 'meldung', role: 'status', 'aria-live': 'polite', onclick: () => el.classList.remove('an') }); document.body.append(el); }
  el.textContent = text;
  el.classList.add('an');
  clearTimeout(toastZeit);
  toastZeit = setTimeout(() => el.classList.remove('an'), dauer);
}

/** Fenster über dem Spiel (Karte, Beutel, Notizbuch, Menü). */
export function fenster(titel, inhalt, { breit = false } = {}) {
  document.querySelector('dialog.fenster')?.remove();
  const dlg = h('dialog', { class: `fenster${breit ? ' breit' : ''}`, 'aria-label': titel },
    h('header', {}, h('h2', {}, titel), h('button', { type: 'button', class: 'schliess', 'aria-label': t.schliessen, onclick: () => dlg.close() }, '✕')),
    h('div', { class: 'fenster-inhalt' }, inhalt));
  dlg.addEventListener('close', () => dlg.remove());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  document.body.append(dlg);
  dlg.showModal();
  return dlg;
}

/** Kleine Karte aus dem Argumentebeutel. */
export function kartenChip(karte, { gewaehlt = false, onclick = null, klein = false, aus = false } = {}) {
  return h(onclick ? 'button' : 'div', { type: onclick ? 'button' : null, class: `karte art-${karte.art}${gewaehlt ? ' gewaehlt' : ''}${klein ? ' klein' : ''}`,
    'aria-pressed': onclick ? String(gewaehlt) : null, disabled: aus, onclick },
    h('strong', {}, karte.titel), klein ? null : h('span', {}, karte.text));
}

/** Ersetzt den Inhalt eines Elements. Leere Einträge (null, false) werden übersprungen. */
export function setzeInhalt(el, ...kinder) { el.replaceChildren(...kinder.flat(Infinity).filter((k) => k != null && k !== false)); }
