// „Hammer & Siegel“: alles, was zum Weiterspielen motiviert. Einführung beim ersten Start (Bildtafeln),
// Fortschrittsleiste in der Übersicht (Weg zum Gipfel, Siegellack, Sammlung, nächster Anführer) und die Sammlung.
// Inhalte der Einführung: data/kampagne.js (einfuehrung). Regeln: js/puzzles/kampagne.js.
import { h, setzeInhalt, knopf, kartenChip, zeigeKartenDetail, fuelle } from '../engine/ui.js';
import { bildHtml, portraetHtml, kartenBild } from '../engine/bilder.js';
import { kampagne } from '../../data/kampagne.js';
import { lutherKarten } from '../../data/kartei.js';
import { K, maxKopien, anzahl } from './duell-regeln.js';

const reihenfolge = kampagne.kapitel.flatMap((k) => k.gegner);
const SELTEN = ['legendaer', 'episch', 'selten', 'gewoehnlich'];
const RUECKEN = { gewoehnlich: 'ruecken-luther', selten: 'ruecken-selten', episch: 'ruecken-episch', legendaer: 'ruecken-legendaer' };
const pool = () => lutherKarten.filter((k) => k.seltenheit);
const sterneSumme = (stand) => Object.values(stand.sterne).reduce((n, x) => n + x, 0);

/** Sammlung: wie viele Karten (mit Kopien) man hat und wie viele es gibt. */
export function sammlungStand(besitz) {
  let n = 0, von = 0;
  for (const k of pool()) { const m = maxKopien(k.id); von += m; n += Math.min(m, anzahl(besitz, k.id)); }
  return { n, von };
}

/** Siegellack als Tropfen: gefüllte und leere Siegel. */
export function wachsTropfen(n, von) {
  return h('span', { class: 'ke-tropfen', 'aria-hidden': 'true' },
    Array.from({ length: von }, (_, i) => h('span', { class: `ke-tropfen-siegel${i < n ? ' voll' : ''}`, html: bildHtml('siegel-ganz') })));
}

/** Kleine Porträtreihe: der Weg zum Gipfel. */
function gipfelWeg(stand, figuren, { klein = false } = {}) {
  const aktuell = reihenfolge.find((id) => !stand.sterne[id]);
  return h('ol', { class: `ke-weg${klein ? ' klein' : ''}${stand.durchgespielt ? ' erreicht' : ''}` }, reihenfolge.map((id, i) => {
    const g = kampagne.gegner[id];
    const besiegt = Boolean(stand.sterne[id]);
    const gipfel = i >= reihenfolge.length - 2;
    return h('li', { class: `ke-weg-punkt${besiegt ? ' besiegt' : ''}${id === aktuell ? ' aktuell' : ''}${gipfel ? ' gipfel' : ''}`, title: g.name },
      h('span', { class: 'ke-weg-bild', 'aria-hidden': 'true', html: portraetHtml(g, figuren[g.figur] || {}) }),
      gipfel ? h('span', { class: 'ke-krone', 'aria-hidden': 'true' }, '♛') : null,
      besiegt ? h('span', { class: 'ke-haken', 'aria-hidden': 'true' }, '✓') : null);
  }));
}

/** Fortschrittsleiste oben in der Übersicht: immer ein nächstes Ziel vor Augen. */
export function zielLeiste({ t, stand, besitz, figuren, wachsJeBrief, onSammlung, onLexikon, onAbzeichen, onWerkstatt }) {
  const lex = lexikonStand(stand);
  const besiegt = reihenfolge.filter((id) => stand.sterne[id]).length;
  const wachs = stand.wachs || 0;
  const s = sammlungStand(besitz);
  const sterne = sterneSumme(stand);
  const naechster = kampagne.anfuehrer.find((a) => a.ab > sterne);
  return h('div', { class: 'ke-ziele' },
    h('div', { class: 'ke-gipfel' },
      h('p', {}, fuelle(t.kampGipfel, { n: besiegt, von: reihenfolge.length })),
      gipfelWeg(stand, figuren)),
    h('div', { class: 'ke-reihe' },
      h('div', { class: 'ke-ziel lack' },
        h('strong', {}, t.kampLackTitel),
        wachsTropfen(Math.min(wachs, wachsJeBrief), wachsJeBrief),
        h('span', {}, fuelle(t.kampLackStand, { n: wachs })),
        h('small', {}, t.kampLackErklaerung),
        knopf(t.kampWerkOeffnen, onWerkstatt, 'still klein')),
      h('div', { class: 'ke-ziel sammlung' },
        h('strong', {}, t.kampSammlungTitel),
        h('span', { class: 'ke-balken', 'aria-hidden': 'true' }, h('span', { style: `width:${(s.n / s.von) * 100}%` })),
        h('span', {}, fuelle(t.kampSammlungStand, { n: s.n, von: s.von })),
        knopf(t.kampSammlungAnsehen, onSammlung, 'still klein')),
      h('div', { class: 'ke-ziel lexikon' },
        h('strong', {}, t.kampLexikonTitel),
        h('span', { class: 'ke-balken', 'aria-hidden': 'true' }, h('span', { style: `width:${(lex.n / lex.von) * 100}%` })),
        h('span', {}, fuelle(t.kampLexikonStand, { n: lex.n, von: lex.von })),
        h('small', {}, t.kampLexikonLohn),
        knopf(t.kampLexikonOeffnen, onLexikon, 'still klein')),
      h('div', { class: 'ke-ziel fuehrer' },
        h('strong', {}, t.kampFuehrerTitel),
        naechster ? [
          h('span', { class: 'ke-fuehrer-bild', 'aria-hidden': 'true', html: bildHtml(kartenBild(K(naechster.id)).name) }),
          h('span', { class: 'ke-balken', 'aria-hidden': 'true' }, h('span', { style: `width:${Math.min(100, (sterne / naechster.ab) * 100)}%` })),
          h('span', {}, fuelle(t.kampFuehrerNoch, { n: naechster.ab - sterne, name: K(naechster.id).titel }))
        ] : h('span', {}, t.kampFuehrerAlle))),
    abzeichenStreifen({ t, stand, onOeffnen: onAbzeichen }));
}

/** Sammlung: alle Karten nach Seltenheit; fehlende verdeckt mit der Rückseite ihrer Seltenheit. */
export function zeigeSammlung({ t, besitz }) {
  const buehne = h('div', { class: 'ke-buehne', role: 'dialog', 'aria-modal': 'true', 'aria-label': t.kampSammlungTitel });
  const s = sammlungStand(besitz);
  const zu = () => buehne.remove();
  setzeInhalt(buehne, h('div', { class: 'ke-sammlung' },
    h('div', { class: 'ke-sammlung-kopf' },
      h('div', {}, h('h2', {}, t.kampSammlungTitel), h('p', {}, fuelle(t.kampSammlungStand, { n: s.n, von: s.von }), ' · ', t.kampSammlungText)),
      knopf(t.schliessen, zu, 'haupt')),
    SELTEN.map((sel) => {
      const karten = pool().filter((k) => k.seltenheit === sel);
      return h('section', { class: `ke-sammlung-gruppe rar-${sel}` },
        h('h3', {}, t.seltenheit[sel]),
        h('div', { class: 'ke-sammlung-karten' }, karten.map((k) => {
          const hat = Math.min(anzahl(besitz, k.id), maxKopien(k.id));
          return hat ? h('span', { class: 'ke-sammel-karte' }, kartenChip(k, { klein: true, onclick: () => zeigeKartenDetail(k) }),
            h('span', { class: `ke-anzahl${hat === maxKopien(k.id) ? ' voll' : ''}` }, `${hat}/${maxKopien(k.id)}`))
            : h('span', { class: 'ke-sammel-karte fehlt', 'aria-label': t.seltenheit[sel] }, h('span', { class: 'ke-fehlt-bild', html: bildHtml(RUECKEN[sel]) }), h('span', { class: 'ke-fehlt-zeichen' }, '?'));
        })));
    })));
  document.body.append(buehne);
  buehne.querySelector('.knopf')?.focus();
}

/** Einführung: Bildtafeln, die Hammer & Siegel als eigenes Spiel vorstellen. fertig() nach der letzten Tafel. */
export function zeigeEinfuehrung({ t, stand, besitz, figuren, wachsJeBrief, fertig }) {
  const tafeln = kampagne.einfuehrung;
  let nr = 0;
  const buehne = h('div', { class: 'ke-buehne intro', role: 'dialog', 'aria-modal': 'true', 'aria-label': t.kampSoGehts });
  document.body.append(buehne);
  const bild = (art) => {
    if (art === 'weg') return h('div', { class: 'ke-bild weg' }, gipfelWeg(stand, figuren),
      h('div', { class: 'ke-gipfel-paar' }, ['k-karl', 'k-leo'].map((id) => h('span', { class: 'ke-gipfel-bild', html: portraetHtml(kampagne.gegner[id], figuren[kampagne.gegner[id].figur] || {}) }))));
    if (art === 'karten') {
      const eigene = [...new Set(besitz)].map(K).filter((k) => k?.seltenheit).sort((a, b) => b.staerke - a.staerke).slice(0, 5);
      return h('div', { class: 'ke-bild karten' }, eigene.map((k, i) => h('span', { class: 'ke-faecher', style: `--i:${i - (eigene.length - 1) / 2}` }, kartenChip(k, {}))));
    }
    if (art === 'briefe') return h('div', { class: 'ke-bild briefe' },
      h('span', { class: 'ke-brief', html: bildHtml('siegelbrief-zu') }),
      h('span', { class: 'ke-pfeil', 'aria-hidden': 'true' }, '➜'),
      h('span', { class: 'ke-ruecken-reihe' }, ['gewoehnlich', 'selten', 'episch', 'legendaer'].map((sel) =>
        h('span', { class: `ke-ruecken rar-${sel}` }, h('span', { html: bildHtml(RUECKEN[sel]) }), h('small', {}, t.seltenheit[sel])))));
    if (art === 'lack') return h('div', { class: 'ke-bild lack' },
      wachsTropfen(wachsJeBrief, wachsJeBrief), h('span', { class: 'ke-gleich', 'aria-hidden': 'true' }, '='), h('span', { class: 'ke-brief klein', html: bildHtml('siegelbrief-zu') }));
    if (art === 'anfuehrer') return h('div', { class: 'ke-bild anfuehrer' }, kampagne.anfuehrer.map((a) =>
      h('span', { class: 'ke-fuehrer' }, h('span', { class: 'ke-fuehrer-bild', html: bildHtml(kartenBild(K(a.id)).name) }), h('strong', {}, K(a.id).titel), h('small', {}, a.ab ? `${a.ab} ★` : t.kampGewaehlt))));
    if (art === 'wieder') {
      const g = kampagne.gegner[reihenfolge[0]];
      return h('div', { class: 'ke-bild wieder' },
        h('span', { class: 'ke-gipfel-bild', html: portraetHtml(g, figuren[g.figur] || {}) }),
        h('span', { class: 'ke-kreis', 'aria-hidden': 'true' }, '↻'),
        h('span', { class: 'ke-brief klein', html: bildHtml('siegelbrief-zu') }),
        h('strong', { class: 'ke-plus' }, '+1'));
    }
    return null;
  };
  const zeichne = () => {
    const tafel = tafeln[nr];
    const letzte = nr === tafeln.length - 1;
    setzeInhalt(buehne, h('div', { class: 'ke-tafel' },
      h('p', { class: 'kicker' }, t.dispSpielImSpiel, ' · ', fuelle(t.kampIntroTafel, { n: nr + 1, von: tafeln.length })),
      h('h2', {}, tafel.titel),
      bild(tafel.art),
      h('p', { class: 'ke-text' }, tafel.text),
      h('div', { class: 'ke-punkte', 'aria-hidden': 'true' }, tafeln.map((_, i) => h('span', { class: i === nr ? 'an' : '' }))),
      h('div', { class: 'reihe mitte' },
        nr > 0 ? knopf(t.kampIntroZurueck, () => { nr -= 1; zeichne(); }, 'still') : null,
        knopf(letzte ? t.kampIntroLos : t.kampIntroWeiter, () => { if (letzte) { buehne.remove(); fertig(); } else { nr += 1; zeichne(); } }, 'haupt gross'))));
    buehne.querySelector('.knopf.haupt')?.focus();
  };
  zeichne();
}

// ---------- Konter-Lexikon ----------
// Alle Paare „Luthers Karte entkräftet Kirchenkarte“. Eingetragen wird ein Paar, sobald es in einer Partie wirkt (js/puzzles/kampagne.js, rules.entdecke).
const lexikonPaare = () => lutherKarten.flatMap((k) => (k.entkraeftet || []).map((c) => [k.id, c]));
export function lexikonStand(stand) {
  const alle = lexikonPaare().map(([l, c]) => `${l}>${c}`);
  return { n: (stand.lexikon || []).filter((p) => alle.includes(p)).length, von: alle.length };
}

/** Lexikon: jede Kirchenkarte mit ihren Kontern. Entdeckte Konter zeigen beide Texte nebeneinander, die anderen ein Fragezeichen. */
export function zeigeLexikon({ t, stand }) {
  const entdeckt = new Set(stand.lexikon || []);
  // Kirchenkarten, die man kennt: aus den Decks der Gegner, gegen die man schon gespielt hat, und aus entdeckten Paaren
  const gesehen = new Set();
  for (const id of stand.gesehen || []) { const g = kampagne.gegner[id]; [...(g?.deck || []), g?.anfuehrer].filter(Boolean).forEach((c) => gesehen.add(c)); }
  for (const p of entdeckt) gesehen.add(p.split('>')[1]);
  const nachKirche = new Map();
  for (const [l, c] of lexikonPaare()) { if (!nachKirche.has(c)) nachKirche.set(c, []); nachKirche.get(c).push(l); }
  // Reihenfolge: wie die Gegner kommen, danach die übrigen
  const reihe = [...new Set([...reihenfolge.flatMap((id) => [...kampagne.gegner[id].deck, kampagne.gegner[id].anfuehrer]).filter((c) => nachKirche.has(c)), ...nachKirche.keys()])];
  const s = lexikonStand(stand);
  const buehne = h('div', { class: 'ke-buehne', role: 'dialog', 'aria-modal': 'true', 'aria-label': t.kampLexikonTitel });
  const zu = () => buehne.remove();
  setzeInhalt(buehne, h('div', { class: 'ke-sammlung ke-lexikon' },
    h('div', { class: 'ke-sammlung-kopf' },
      h('div', {}, h('h2', {}, t.kampLexikonTitel), h('p', {}, fuelle(t.kampLexikonStand, { n: s.n, von: s.von }), ' · ', t.kampLexikonLohn)),
      knopf(t.schliessen, zu, 'haupt')),
    h('p', { class: 'ke-lex-erklaerung' }, t.kampLexikonText),
    h('div', { class: 'ke-lex-liste' }, reihe.map((c) => {
      const kirche = K(c); const konter = nachKirche.get(c);
      const kennt = gesehen.has(c);
      const offen = konter.filter((l) => !entdeckt.has(`${l}>${c}`)).length;
      return h('div', { class: `ke-lex-eintrag${offen === 0 ? ' voll' : ''}` },
        h('div', { class: 'ke-lex-kirche' },
          kennt ? h('span', { class: 'ke-lex-karte' }, kartenChip(kirche, { klein: true, onclick: () => zeigeKartenDetail(kirche) }))
            : h('span', { class: 'ke-lex-karte ke-sammel-karte fehlt' }, h('span', { class: 'ke-fehlt-bild', html: bildHtml('ruecken-kirche') }), h('span', { class: 'ke-fehlt-zeichen' }, '?')),
          h('p', {}, kennt ? [h('strong', {}, `${t.kampLexikonKirche}: `), kirche.text] : t.kampLexikonUnbekannt)),
        h('div', { class: 'ke-lex-konter' }, konter.map((l) => {
          const ja = entdeckt.has(`${l}>${c}`);
          return ja ? h('div', { class: 'ke-lex-paar' }, h('span', { class: 'ke-lex-karte' }, kartenChip(K(l), { klein: true, onclick: () => zeigeKartenDetail(K(l)) })),
            h('p', {}, h('strong', {}, `${t.kampLexikonDagegen}: `), K(l).text))
            : h('div', { class: 'ke-lex-paar offen' }, h('span', { class: 'ke-lex-frage' }, '?'));
        }),
        offen ? h('small', {}, fuelle(t.kampLexikonOffen, { n: offen })) : null));
    }))));
  document.body.append(buehne);
  buehne.querySelector('.knopf')?.focus();
}

// ---------- Siegel-Abzeichen ----------
/** Ein Abzeichen als Wachssiegel mit dem Zeichen seiner Kartenart; noch offene Abzeichen blass. */
export const siegelAbzeichen = (a, erreicht) => h('span', { class: `ke-abz-siegel${erreicht ? ' an' : ''}`, 'aria-hidden': 'true', html: bildHtml(`symbol-${a.symbol}`, 'ke-abz-zeichen') });

/** Streifen in der Zielleiste: alle Abzeichen als Siegel, dazu Stand und Knopf. */
export function abzeichenStreifen({ t, stand, onOeffnen }) {
  const hat = new Set(stand.abzeichen || []);
  return h('div', { class: 'ke-abz-streifen' },
    h('div', { class: 'ke-abz-text' },
      h('strong', {}, t.kampAbzTitel),
      h('span', {}, fuelle(t.kampAbzStand, { n: hat.size, von: kampagne.abzeichen.length })),
      h('small', {}, t.kampAbzLohn)),
    h('div', { class: 'ke-abz-reihe' }, kampagne.abzeichen.map((a) => siegelAbzeichen(a, hat.has(a.id)))),
    knopf(t.kampAbzOeffnen, onOeffnen, 'still klein'));
}

/** Übersicht aller Abzeichen mit Aufgabe; erreichte zuerst hervorgehoben. */
export function zeigeAbzeichen({ t, stand }) {
  const hat = new Set(stand.abzeichen || []);
  const buehne = h('div', { class: 'ke-buehne', role: 'dialog', 'aria-modal': 'true', 'aria-label': t.kampAbzTitel });
  const zu = () => buehne.remove();
  setzeInhalt(buehne, h('div', { class: 'ke-sammlung ke-abz' },
    h('div', { class: 'ke-sammlung-kopf' },
      h('div', {}, h('h2', {}, t.kampAbzTitel), h('p', {}, fuelle(t.kampAbzStand, { n: hat.size, von: kampagne.abzeichen.length }), ' · ', t.kampAbzLohn)),
      knopf(t.schliessen, zu, 'haupt')),
    h('p', { class: 'ke-lex-erklaerung' }, t.kampAbzText),
    h('div', { class: 'ke-abz-liste' }, kampagne.abzeichen.map((a) => h('div', { class: `ke-abz-eintrag${hat.has(a.id) ? ' an' : ''}` },
      siegelAbzeichen(a, hat.has(a.id)),
      h('div', {}, h('strong', {}, a.titel), h('p', {}, a.text), h('em', {}, hat.has(a.id) ? t.kampAbzErreicht : t.kampAbzOffen)))))));
  document.body.append(buehne);
  buehne.querySelector('.knopf')?.focus();
}

// ---------- Druckerwerkstatt: Siegellack ausgeben ----------
/** Werkstatt mit drei Bereichen: Siegelbrief, Wunschkarte drucken, Prachtausgaben.
 *  lage(): { stand, besitz } (aktuell), regeln: { druckbar, preis, kaufe }, kaufen(kauf): neuer Stand oder null, briefeOeffnen(): Briefe zeigen. */
export function zeigeWerkstatt({ t, lage, regeln, kaufen, briefeOeffnen }) {
  const buehne = h('div', { class: 'ke-buehne', role: 'dialog', 'aria-modal': 'true', 'aria-label': t.kampWerkTitel });
  const zu = () => buehne.remove();
  const preisKnopf = (text, kauf, stand, extra = {}) => {
    const preis = regeln.preis(kauf, stand);
    const geht = (stand.wachs || 0) >= preis && !extra.disabled;
    return h('button', { type: 'button', class: `ke-werk-kauf${geht ? '' : ' zu'}`, disabled: !geht,
      onclick: () => { if (!kaufen(kauf)) return; if (kauf.art === 'brief') { zu(); briefeOeffnen(); } else zeichne(); } },
      h('span', {}, text), h('span', { class: 'ke-werk-preis' }, h('span', { class: 'ke-werk-tropfen', 'aria-hidden': 'true', html: bildHtml('siegel-ganz') }), String(preis)));
  };
  function zeichne() {
    const { stand, besitz } = lage();
    const druckbar = regeln.druckbar(stand, besitz).sort((a, b) => regeln.preis({ art: 'karte', id: a }) - regeln.preis({ art: 'karte', id: b }) || K(a).titel.localeCompare(K(b).titel));
    const eigene = [...new Set(besitz)].filter((id) => K(id)?.seltenheit).sort((a, b) => ((stand.pracht || {})[b] || 0) - ((stand.pracht || {})[a] || 0) || K(a).titel.localeCompare(K(b).titel));
    const stufe = (id) => (stand.pracht || {})[id] || 0;
    setzeInhalt(buehne, h('div', { class: 'ke-sammlung ke-werk' },
      h('div', { class: 'ke-sammlung-kopf' },
        h('div', {}, h('h2', {}, t.kampWerkTitel),
          h('p', { class: 'ke-werk-stand' }, h('span', { class: 'ke-werk-tropfen gross', 'aria-hidden': 'true', html: bildHtml('siegel-ganz') }), fuelle(t.kampWerkStand, { n: stand.wachs || 0 }))),
        knopf(t.schliessen, zu, 'haupt')),
      h('p', { class: 'ke-lex-erklaerung' }, t.kampWerkText),
      // 1. Siegelbrief
      h('section', { class: 'ke-werk-teil' },
        h('h3', {}, t.kampWerkBriefTitel),
        h('div', { class: 'ke-werk-brief' }, h('span', { class: 'ke-brief klein', 'aria-hidden': 'true', html: bildHtml('siegelbrief-zu') }),
          h('p', {}, t.kampWerkBriefText), preisKnopf(t.kampWerkKaufen, { art: 'brief' }, stand))),
      // 2. Wunschkarte drucken
      h('section', { class: 'ke-werk-teil' },
        h('h3', {}, t.kampWerkKarteTitel), h('p', {}, t.kampWerkKarteText),
        druckbar.length ? h('div', { class: 'ke-werk-karten' }, druckbar.map((id) => h('div', { class: 'ke-werk-karte' },
          kartenChip(K(id), { klein: true, onclick: () => zeigeKartenDetail(K(id)) }),
          h('span', { class: 'ke-werk-hat' }, fuelle(t.kampWerkHast, { n: anzahl(besitz, id), von: maxKopien(id) })),
          preisKnopf(t.kampWerkDrucken, { art: 'karte', id }, stand))))
          : h('p', { class: 'ke-werk-leer' }, t.kampWerkKarteLeer)),
      // 3. Prachtausgaben
      h('section', { class: 'ke-werk-teil' },
        h('h3', {}, t.kampWerkPrachtTitel), h('p', {}, t.kampWerkPrachtText),
        h('div', { class: 'ke-werk-karten' }, eigene.map((id) => h('div', { class: 'ke-werk-karte' },
          kartenChip(K(id), { klein: true, onclick: () => zeigeKartenDetail(K(id)) }),
          h('span', { class: 'ke-werk-hat' }, t.kampWerkStufe[stufe(id)]),
          stufe(id) < 2 ? preisKnopf(stufe(id) ? t.kampWerkVergolden : t.kampWerkKolorieren, { art: 'pracht', id }, stand) : null))))));
  }
  zeichne();
  document.body.append(buehne);
  buehne.querySelector('.knopf')?.focus();
}

// ---------- Abschluss: Urkunde und historischer Ausklang ----------
/** Nach dem ersten Sieg gegen den Papst (und später über „Urkunde ansehen“). Nur zum Ansehen: nichts wird gespeichert oder gedruckt. */
export function zeigeFinale({ t, stand, besitz, figuren, weiter = () => {} }) {
  const f = kampagne.finale;
  const lex = lexikonStand(stand);
  const s = sammlungStand(besitz);
  const fuehrer = K(stand.anfuehrer || 'a-luther');
  const datum = stand.durchgespielt ? new Date(stand.durchgespielt).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const buehne = h('div', { class: 'ke-buehne ke-finale-buehne', role: 'dialog', 'aria-modal': 'true', 'aria-label': f.titel });
  const zu = () => { buehne.remove(); weiter(); };
  const zahl = (n, von, text) => h('li', {}, h('strong', {}, von ? `${n} / ${von}` : String(n)), h('span', {}, text));
  setzeInhalt(buehne, h('div', { class: 'ke-finale' },
    h('p', { class: 'kicker' }, t.kampFinaleKicker),
    h('h2', { class: 'ke-finale-titel' }, f.titel),
    h('p', { class: 'ke-finale-einleitung' }, f.einleitung),
    gipfelWeg(stand, figuren, { klein: true }),
    // Die Urkunde: Pergament mit Siegel, rollt sich auf
    h('div', { class: 'ke-urkunde' },
      h('p', { class: 'ke-urkunde-kopf' }, t.kampUrkunde),
      h('div', { class: 'ke-urkunde-fuehrer' },
        h('span', { class: 'ke-urkunde-bild', 'aria-hidden': 'true', html: bildHtml(kartenBild(fuehrer).name) }),
        h('p', {}, f.urkunde, ' ', fuelle(t.kampUrkundeFuehrer, { name: fuehrer.titel }))),
      h('ul', { class: 'ke-urkunde-zahlen' },
        zahl(sterneSumme(stand), reihenfolge.length * 3, t.kampUrkundeSterne),
        zahl(lex.n, lex.von, t.kampUrkundeKonter),
        zahl((stand.abzeichen || []).length, kampagne.abzeichen.length, t.kampUrkundeAbzeichen),
        zahl(s.n, s.von, t.kampUrkundeKarten)),
      h('p', { class: 'ke-urkunde-fuss' }, datum ? fuelle(t.kampUrkundeDatum, { datum }) : ''),
      h('span', { class: 'ke-urkunde-siegel', 'aria-hidden': 'true', html: bildHtml('siegel-ganz') })),
    // Historischer Ausklang
    h('section', { class: 'ke-ausklang' },
      h('h3', {}, f.ausklangTitel),
      f.ausklang.map((x) => h('p', {}, x))),
    h('div', { class: 'reihe mitte' }, knopf(t.weiter, zu, 'haupt gross'))));
  document.body.append(buehne);
  buehne.querySelector('.knopf')?.focus();
}

/** Kapitel geschafft: die drei besiegten Gegner mit Sternen, was historisch passiert ist, Ausblick und neue Beute. */
export function zeigeKapitelAbschluss({ t, kapitel, stand, figuren, weiter = () => {} }) {
  const kap = kampagne.kapitel[kapitel];
  const naechstes = kampagne.kapitel[kapitel + 1];
  const buehne = h('div', { class: 'ke-buehne ke-finale-buehne', role: 'dialog', 'aria-modal': 'true', 'aria-label': fuelle(t.kampKapitelGeschafft, { n: kapitel + 1 }) });
  const zu = () => { buehne.remove(); weiter(); };
  setzeInhalt(buehne, h('div', { class: 'ke-finale ke-kapitel-ende' },
    h('p', { class: 'kicker' }, fuelle(t.kampKapitelGeschafft, { n: kapitel + 1 })),
    h('h2', { class: 'ke-finale-titel' }, kap.titel),
    h('div', { class: 'ke-kapitel-sieger' }, kap.gegner.map((id, i) => {
      const g = kampagne.gegner[id]; const n = stand.sterne[id] || 0;
      return h('div', { class: 'ke-kapitel-gegner', style: `--i: ${i}` },
        h('span', { class: 'ke-kapitel-bild', 'aria-hidden': 'true', html: portraetHtml(g, figuren[g.figur] || {}) },
          h('span', { class: 'ke-haken', 'aria-hidden': 'true' }, '✓')),
        h('strong', {}, g.name),
        h('span', { class: 'k-sterne', 'aria-label': fuelle(t.kampSterneJetzt, { n }) }, Array.from({ length: 3 }, (_, j) => h('span', { class: j < n ? 'an' : '' }, '★'))));
    })),
    h('p', { class: 'ke-kapitel-geschichte' }, kap.geschafft),
    naechstes ? h('div', { class: 'ke-kapitel-weiter' },
      h('p', { class: 'kicker' }, fuelle(t.kampKapitelNaechstes, { n: kapitel + 2 })),
      h('strong', {}, naechstes.titel, h('em', {}, ` ${naechstes.zeit}`)),
      h('p', {}, kap.weiter),
      h('p', { class: `ke-kapitel-beute rar-${['selten', 'episch', 'legendaer', 'legendaer'][kapitel + 1]}` }, t.kampBeute[kapitel + 1])) : null,
    kapitel + 1 === kampagne.kirchenSeite.abKapitel ? h('p', { class: 'ke-kapitel-kirche' }, h('strong', {}, `${t.kircheNeuFrei} `), kampagne.kirchenSeite.titel) : null,
    h('div', { class: 'reihe mitte' }, knopf(naechstes ? fuelle(t.kampKapitelLos, { titel: naechstes.titel }) : t.weiter, zu, 'haupt gross'))));
  document.body.append(buehne);
  buehne.querySelector('.knopf')?.focus();
}
