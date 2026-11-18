// Kleine Helfer für den Bildschirm. Keine Spielinhalte.
import { glossary } from '../../data/glossary.js';
import { t } from '../../data/ui.js';
import { bildHtml, kartenBild, symbolHtml } from './bilder.js';
import { alleKarten } from '../../data/kartei.js';

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
      frag.append(h('button', { type: 'button', class: 'begriff', onclick: (e) => { e.stopPropagation(); zeigeBegriff(g); } }, teil));
    } else frag.append(teil);
  }
  return frag;
}

/** Erklärkärtchen zu einem Fachbegriff. Schließt per Knopf oder beim nächsten Tippen daneben. */
export function zeigeBegriff(g) {
  document.getElementById('begriff')?.remove();
  const karte = h('aside', { id: 'begriff', role: 'dialog', 'aria-label': g.wort },
    h('div', { class: 'reihe' }, h('strong', {}, g.wort), h('button', { type: 'button', class: 'schliess', 'aria-label': t.schliessen, onclick: () => karte.remove() }, '✕')),
    h('p', {}, g.text));
  document.body.append(karte);
  karte.querySelector('button').focus();
  setTimeout(() => document.addEventListener('pointerdown', function weg(e) { if (!karte.contains(e.target)) { karte.remove(); document.removeEventListener('pointerdown', weg); } }), 0);
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

// Alle Karten (Geschichte, Kampagne, Kirche, Anführer), damit Fähigkeiten immer Kartennamen zeigen
const KARTEN = alleKarten;
const gruppen = (liste) => liste.map((g) => t.gruppen[g] || g).join(t.und);

/** Fähigkeiten einer Karte als kurze Sätze, aus den Daten erzeugt. */
export function faehigkeiten(k) {
  const aus = [];
  if (k.entkraeftet?.length) aus.push(fuelle(t.f_entkraeftet, { namen: k.entkraeftet.map((id) => `„${KARTEN.get(id)?.titel || id}“`).join(t.und) }));
  if (k.staerkt) aus.push(k.staerkt.gruppe.includes('alle') ? fuelle(t.f_alle, { n: k.staerkt.plus }) : fuelle(t.f_staerkt, { gruppen: gruppen(k.staerkt.gruppe), n: k.staerkt.plus }));
  if (k.schwaecht) aus.push(fuelle(t.f_schwaecht, { gruppen: gruppen(k.schwaecht.gruppe), n: k.schwaecht.minus }));
  if (k.bund) aus.push(fuelle(t.f_bund, { typ: t.gruppen[k.typ] || k.typ }));
  if (k.zieht) aus.push(fuelle(t.f_zieht, { n: k.zieht }));
  if (k.standhaft) aus.push(t.f_standhaft);
  if (k.bann) aus.push(t.f_bann);
  return aus;
}

/** Sammelkarte im Stil von Gwent: Das Bild füllt die Karte. Links ein Band mit Stärke und Kartenart, unten das Namensschild.
 *  Fähigkeiten und Kartentext stehen nicht auf der Karte, sondern in der Detailansicht (zeigeKartenDetail).
 *  klein: für Hand und Deckbau. text: kurzer Kartentext im Namensschild (Thesen-Auswahl). mini: nur Name und Stärke, für lange Listen. */
export function kartenChip(karte, { gewaehlt = false, onclick = null, klein = false, mini = false, aus = false, extra = '', text = false } = {}) {
  const typ = karte.typ || karte.art;
  const rar = karte.seltenheit ? ` rar-${karte.seltenheit}` : '';
  const staerke = karte.staerke ? h('span', { class: 'k-staerke', 'aria-hidden': 'true' }, String(karte.staerke)) : null;
  if (mini) return h(onclick ? 'button' : 'span', { type: onclick ? 'button' : null, class: `karte sammel mini typ-${typ}${rar}${gewaehlt ? ' gewaehlt' : ''}`, 'aria-pressed': onclick ? String(gewaehlt) : null, onclick },
    h('span', { class: 'k-kopf' }, h('strong', {}, karte.titel), staerke));
  const bild = kartenBild(karte);
  return h(onclick ? 'button' : 'div', { type: onclick ? 'button' : null,
    class: `karte sammel gwent typ-${typ}${rar}${bild.kunst ? ' mit-kunst' : ''}${gewaehlt ? ' gewaehlt' : ''}${klein ? ' klein' : ''}${text ? ' mit-text' : ''} ${extra}`.trim(),
    'aria-pressed': onclick ? String(gewaehlt) : null, disabled: aus, onclick,
    'aria-label': [karte.titel, karte.staerke ? fuelle(t.kartenStaerke, { n: karte.staerke }) : '', karte.seltenheit ? t.seltenheit[karte.seltenheit] : '', ...faehigkeiten(karte), karte.text].filter(Boolean).join('. ') },
    h('span', { class: 'k-bild', 'aria-hidden': 'true', html: bildHtml(bild.name) }),
    h('span', { class: 'k-band', 'aria-hidden': 'true' }, staerke, h('span', { class: 'k-zeichen', html: symbolHtml(typ) })),
    karte.nr ? h('span', { class: 'k-nr', 'aria-hidden': 'true' }, String(karte.nr)) : null,
    h('span', { class: 'k-schild', 'aria-hidden': 'true' }, h('strong', {}, karte.titel), text ? h('span', { class: 'k-kurz' }, karte.text) : null));
}

/** Große Karte mit allem, was auf ihr steht: Bild, Name, Art, Seltenheit, Fähigkeiten, Kartentext.
 *  zusatz: weitere Zeilen (zum Beispiel die aktuelle Stärke im Spiel). knoepfe: Knöpfe unter dem Text. */
export function kartenDetail(karte, { zusatz = [], knoepfe = [] } = {}) {
  const typ = karte.typ || karte.art;
  const faehig = faehigkeiten(karte);
  return h('div', { class: `karten-detail typ-${typ}` },
    kartenChip(karte, { extra: 'gross' }),
    h('div', { class: 'kd-text' },
      h('h3', {}, karte.titel),
      h('p', { class: 'kd-art' }, h('span', { 'aria-hidden': 'true', html: symbolHtml(typ) }), t.typen[typ] || typ,
        karte.seltenheit ? h('span', { class: `kd-rar rar-${karte.seltenheit}` }, t.seltenheit[karte.seltenheit]) : null,
        karte.staerke ? h('span', { class: 'kd-staerke' }, fuelle(t.kartenStaerke, { n: karte.staerke })) : null),
      faehig.length ? h('ul', { class: 'kd-faehig' }, faehig.map((f) => h('li', {}, f))) : null,
      h('p', { class: 'kd-zitat' }, karte.text),
      zusatz.filter(Boolean).map((z) => h('p', { class: 'kd-zusatz' }, z)),
      knoepfe.length ? h('div', { class: 'reihe' }, knoepfe) : null));
}

/** Detailansicht über allem, als eigenes Dialogfenster (liegt auch über anderen Fenstern wie dem Album).
 *  Antippen daneben, Escape oder „Zurück“ schließt sie. */
export function zeigeKartenDetail(karte, { zusatz = [], knoepfe = [] } = {}) {
  document.getElementById('karten-ansicht')?.remove();
  const zu = () => { if (dlg.open) dlg.close(); };
  const dlg = h('dialog', { id: 'karten-ansicht', 'aria-label': karte.titel, onclick: (e) => { if (e.target === dlg) zu(); } },
    kartenDetail(karte, { zusatz, knoepfe: [knopf(t.zurueck, zu, 'still'), ...knoepfe.map((k) => { k.addEventListener('click', zu); return k; })] }));
  dlg.addEventListener('close', () => dlg.remove());
  document.body.append(dlg);
  dlg.showModal();
  dlg.querySelector('.haupt, button')?.focus();
  return zu;
}

/** Ersetzt den Inhalt eines Elements. Leere Einträge (null, false) werden übersprungen. */
export function setzeInhalt(el, ...kinder) { el.replaceChildren(...kinder.flat(Infinity).filter((k) => k != null && k !== false)); }
